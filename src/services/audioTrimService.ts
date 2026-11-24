import { AppError, err, ok, Result } from '../types/common';

/**
 * @description 파형 시각화 및 구간 편집을 위해 디코딩된 오디오 데이터 인터페이스
 */
export interface DecodedAudioData {
  readonly buffer: AudioBuffer;
  readonly durationSec: number;
  readonly peaks: readonly number[];
}

const TARGET_WAV_SAMPLE_RATE = 16000;
const DEFAULT_WAVEFORM_BARS = 48;
const MIN_TRIM_DURATION_SEC = 0.15;

/** 브라우저 호환 AudioContext 생성자를 안전하게 반환하는 내부 헬퍼 */
function getAudioContextConstructor(): (new () => AudioContext) | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & { webkitAudioContext?: new () => AudioContext };
  return window.AudioContext ?? win.webkitAudioContext ?? null;
}

/** Data URL 문자열을 ArrayBuffer로 디코딩하는 내부 헬퍼 */
function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const commaIdx = dataUrl.indexOf(',');
  const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/**
 * @description [HR-05] 오디오 채널 데이터에서 UI 파형 막대 그래프용 정규화 진폭 배열(0.08~1.0)을 추출하는 순수 함수
 * @param {Float32Array} channelData 모노 오디오 PCM 샘플 배열
 * @param {number} barCount 생성할 파형 막대 개수 (기본값 48)
 * @returns {number[]} 정규화된 파형 높이 비율 배열
 */
export function extractWaveformPeaks(channelData: Float32Array, barCount = DEFAULT_WAVEFORM_BARS): number[] {
  if (channelData.length === 0 || barCount <= 0) return [];
  const step = Math.max(1, Math.floor(channelData.length / barCount));
  const rawPeaks: number[] = [];
  let globalMax = 0;

  for (let b = 0; b < barCount; b += 1) {
    const start = b * step;
    const end = Math.min(channelData.length, start + step);
    let maxVal = 0;
    for (let i = start; i < end; i += 1) {
      const absVal = Math.abs(channelData[i]);
      if (absVal > maxVal) maxVal = absVal;
    }
    rawPeaks.push(maxVal);
    if (maxVal > globalMax) globalMax = maxVal;
  }

  const normalizer = globalMax > 0.001 ? globalMax : 1;
  return rawPeaks.map((v) => Math.max(0.08, Math.min(1, v / normalizer)));
}

/**
 * @description [HR-05] 모노 Float32 PCM 샘플을 16-bit PCM WAV Base64 Data URL로 인코딩하는 순수 함수
 * @param {Float32Array} samples -1.0 ~ 1.0 범위의 모노 오디오 샘플 배열
 * @param {number} sampleRate 오디오 샘플레이트 (Hz)
 * @returns {string} `data:audio/wav;base64,...` 형식의 Data URL
 */
export function encodeMonoPcmToWavDataUrl(samples: Float32Array, sampleRate: number): string {
  const dataLength = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);
  const writeStr = (off: number, str: string): void => {
    for (let i = 0; i < str.length; i += 1) view.setUint8(off + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

/**
 * @description [HR-04, HR-05] 저장된 녹음 Data URL을 디코딩하여 파형 정보와 AudioBuffer를 반환하는 비동기 서비스 함수
 * @param {string} dataUrl 녹음된 오디오 Data URL
 * @returns {Promise<Result<DecodedAudioData, AppError>>} 디코딩된 오디오 데이터 또는 에러 Result
 */
export async function decodeAudioForTrim(dataUrl: string): Promise<Result<DecodedAudioData, AppError>> {
  try {
    const Ctx = getAudioContextConstructor();
    if (!Ctx) return err('AUDIO_CONTEXT_UNAVAILABLE', '현재 브라우저에서 오디오 편집 기능을 지원하지 않습니다.');
    const ctx = new Ctx();
    try {
      const decoded = await ctx.decodeAudioData(dataUrlToArrayBuffer(dataUrl));
      const peaks = extractWaveformPeaks(decoded.getChannelData(0), DEFAULT_WAVEFORM_BARS);
      return ok({ buffer: decoded, durationSec: decoded.duration, peaks });
    } finally {
      void ctx.close().catch(() => undefined);
    }
  } catch (error: unknown) {
    return err('AUDIO_DECODE_FAILED', '녹음된 오디오를 불러와 분석하는 데 실패했습니다.', error);
  }
}

/**
 * @description [HR-04, HR-05] AudioBuffer에서 지정된 [startSec, endSec] 구간만 잘라내 16kHz 모노 WAV Data URL로 변환하는 함수
 * @param {AudioBuffer} buffer 원본 디코딩 오디오 버퍼
 * @param {number} startSec 남길 구간 시작 시간(초)
 * @param {number} endSec 남길 구간 끝 시간(초)
 * @returns {Result<string, AppError>} 잘라낸 WAV Data URL 또는 에러 Result
 */
export function trimAudioToWavDataUrl(buffer: AudioBuffer, startSec: number, endSec: number): Result<string, AppError> {
  try {
    const safeStart = Math.max(0, Math.min(startSec, buffer.duration));
    const safeEnd = Math.max(safeStart + MIN_TRIM_DURATION_SEC, Math.min(endSec, buffer.duration));
    const duration = Math.max(MIN_TRIM_DURATION_SEC, safeEnd - safeStart);
    const srcStartIdx = Math.floor(safeStart * buffer.sampleRate);
    const srcEndIdx = Math.min(buffer.length, Math.ceil(safeEnd * buffer.sampleRate));
    const srcChannel = buffer.getChannelData(0);
    const targetLength = Math.max(1, Math.floor(duration * TARGET_WAV_SAMPLE_RATE));
    const resampled = new Float32Array(targetLength);
    const ratio = (srcEndIdx - srcStartIdx) / targetLength;

    for (let i = 0; i < targetLength; i += 1) {
      const srcIdx = Math.min(srcEndIdx - 1, srcStartIdx + Math.floor(i * ratio));
      resampled[i] = srcChannel[srcIdx] ?? 0;
    }
    return ok(encodeMonoPcmToWavDataUrl(resampled, TARGET_WAV_SAMPLE_RATE));
  } catch (error: unknown) {
    return err('AUDIO_TRIM_FAILED', '선택한 구간으로 오디오를 자르는 중 오류가 발생했습니다.', error);
  }
}

/**
 * @description [HR-04, HR-05] AudioBuffer의 선택 구간만 즉시 미리듣기 재생하고 정지 함수를 반환하는 함수
 * @param {AudioBuffer} buffer 디코딩된 오디오 버퍼
 * @param {number} startSec 재생 시작 시간(초)
 * @param {number} endSec 재생 종료 시간(초)
 * @param {() => void} onEnded 재생 종료 시 호출될 콜백
 * @returns {Result<() => void, AppError>} 재생 즉시 중단 함수 또는 에러 Result
 */
export function playAudioSegment(
  buffer: AudioBuffer,
  startSec: number,
  endSec: number,
  onEnded: () => void
): Result<() => void, AppError> {
  try {
    const Ctx = getAudioContextConstructor();
    if (!Ctx) return err('AUDIO_CONTEXT_UNAVAILABLE', '현재 브라우저에서 오디오 미리듣기를 지원하지 않습니다.');
    const ctx = new Ctx();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const safeStart = Math.max(0, Math.min(startSec, buffer.duration));
    const duration = Math.max(MIN_TRIM_DURATION_SEC, Math.min(endSec, buffer.duration) - safeStart);
    let stopped = false;

    const cleanup = (): void => {
      if (stopped) return;
      stopped = true;
      try { source.stop(); } catch { /* 이미 종료된 경우 무시 */ }
      void ctx.close().catch(() => undefined);
      onEnded();
    };

    source.onended = cleanup;
    source.start(0, safeStart, duration);
    return ok(cleanup);
  } catch (error: unknown) {
    return err('AUDIO_PREVIEW_FAILED', '선택 구간 미리듣기 재생에 실패했습니다.', error);
  }
}
