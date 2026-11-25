import { AppError, err, ok, Result } from '../types/common';
import {
  cutMiddleMonoSamples, DEFAULT_WAVEFORM_BARS, encodeMonoPcmToWavDataUrl,
  extractWaveformPeaks, MIN_TRIM_DURATION_SEC, sliceMonoSamples, TARGET_WAV_SAMPLE_RATE,
} from './audioWavHelper';

export { encodeMonoPcmToWavDataUrl, extractWaveformPeaks };

/**
 * @description 파형 시각화 및 구간 편집을 위해 디코딩된 오디오 데이터 인터페이스
 */
export interface DecodedAudioData {
  readonly buffer: AudioBuffer;
  readonly durationSec: number;
  readonly peaks: readonly number[];
}

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

/** 모노 Float32Array 샘플과 샘플레이트로 새 DecodedAudioData를 생성하는 내부 헬퍼 */
function createDecodedFromSamples(samples: Float32Array, sampleRate: number): Result<DecodedAudioData, AppError> {
  const Ctx = getAudioContextConstructor();
  if (!Ctx) return err('AUDIO_CONTEXT_UNAVAILABLE', '현재 브라우저에서 오디오 편집 기능을 지원하지 않습니다.');
  const ctx = new Ctx();
  try {
    const nextBuffer = ctx.createBuffer(1, samples.length, sampleRate);
    nextBuffer.getChannelData(0).set(samples);
    const peaks = extractWaveformPeaks(samples, DEFAULT_WAVEFORM_BARS);
    return ok({ buffer: nextBuffer, durationSec: nextBuffer.duration, peaks });
  } finally {
    void ctx.close().catch(() => undefined);
  }
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
 * @description [HR-04, HR-05] 선택한 [startSec, endSec] 구간만 남기고 앞뒤를 잘라낸 새 DecodedAudioData를 반환하는 함수
 * @param {AudioBuffer} buffer 원본 오디오 버퍼
 * @param {number} startSec 남길 시작 시간(초)
 * @param {number} endSec 남길 끝 시간(초)
 * @returns {Result<DecodedAudioData, AppError>} 잘린 새 오디오 데이터 또는 에러 Result
 */
export function keepAudioSection(buffer: AudioBuffer, startSec: number, endSec: number): Result<DecodedAudioData, AppError> {
  try {
    const startIdx = Math.floor(Math.max(0, startSec) * buffer.sampleRate);
    const endIdx = Math.ceil(Math.min(buffer.duration, endSec) * buffer.sampleRate);
    const sliced = sliceMonoSamples(buffer.getChannelData(0), startIdx, endIdx);
    if (sliced.length / buffer.sampleRate < MIN_TRIM_DURATION_SEC) {
      return err('AUDIO_TOO_SHORT', '최소 0.15초 이상의 구간을 남겨야 합니다.');
    }
    return createDecodedFromSamples(sliced, buffer.sampleRate);
  } catch (error: unknown) {
    return err('AUDIO_TRIM_FAILED', '선택한 구간만 남기는 중 오류가 발생했습니다.', error);
  }
}

/**
 * @description [HR-04, HR-05] 선택한 [cutStartSec, cutEndSec] 중간 잡음 구간을 삭제하고 앞뒤를 이어 붙인 새 DecodedAudioData를 반환하는 함수
 * @param {AudioBuffer} buffer 원본 오디오 버퍼
 * @param {number} cutStartSec 삭제할 중간 구간 시작 시간(초)
 * @param {number} cutEndSec 삭제할 중간 구간 끝 시간(초)
 * @returns {Result<DecodedAudioData, AppError>} 중간 잡음이 제거된 새 오디오 데이터 또는 에러 Result
 */
export function cutAudioMiddleSection(buffer: AudioBuffer, cutStartSec: number, cutEndSec: number): Result<DecodedAudioData, AppError> {
  try {
    const startIdx = Math.floor(Math.max(0, cutStartSec) * buffer.sampleRate);
    const endIdx = Math.ceil(Math.min(buffer.duration, cutEndSec) * buffer.sampleRate);
    const merged = cutMiddleMonoSamples(buffer.getChannelData(0), startIdx, endIdx);
    if (merged.length / buffer.sampleRate < MIN_TRIM_DURATION_SEC) {
      return err('AUDIO_TOO_SHORT', '남은 오디오 길이가 너무 짧습니다. 최소 0.15초 이상 남아야 합니다.');
    }
    return createDecodedFromSamples(merged, buffer.sampleRate);
  } catch (error: unknown) {
    return err('AUDIO_CUT_FAILED', '중간 잡음 구간을 삭제하는 중 오류가 발생했습니다.', error);
  }
}

/**
 * @description [HR-04, HR-05] AudioBuffer 전체(또는 지정 구간)를 16kHz 모노 WAV Data URL로 변환하는 함수
 * @param {AudioBuffer} buffer 변환할 오디오 버퍼
 * @param {number} startSec 시작 시간(초, 기본 0)
 * @param {number} endSec 끝 시간(초, 기본 전체 길이)
 * @returns {Result<string, AppError>} WAV Data URL 또는 에러 Result
 */
export function trimAudioToWavDataUrl(buffer: AudioBuffer, startSec = 0, endSec = buffer.duration): Result<string, AppError> {
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
    return err('AUDIO_TRIM_FAILED', '오디오를 WAV 파일로 변환하는 중 오류가 발생했습니다.', error);
  }
}

/**
 * @description [HR-04, HR-05] AudioBuffer의 지정 구간을 미리듣기 재생하고 정지 함수를 반환하는 함수
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
    return err('AUDIO_PREVIEW_FAILED', '미리듣기 재생에 실패했습니다.', error);
  }
}
