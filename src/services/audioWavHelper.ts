/**
 * @description [HR-01, HR-05] 오디오 파형 추출, PCM 구간 자르기/중간 삭제 및 WAV 인코딩 순수 유틸리티 모듈
 */

export const TARGET_WAV_SAMPLE_RATE = 16000;
export const DEFAULT_WAVEFORM_BARS = 48;
export const MIN_TRIM_DURATION_SEC = 0.15;

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
 * @description [HR-05] 모노 PCM 샘플 배열에서 [startIdx, endIdx) 구간만 남기고 잘라내는 순수 함수
 * @param {Float32Array} source 원본 모노 샘플 배열
 * @param {number} startIdx 남길 시작 인덱스
 * @param {number} endIdx 남길 끝 인덱스
 * @returns {Float32Array} 잘라낸 모노 샘플 배열
 */
export function sliceMonoSamples(source: Float32Array, startIdx: number, endIdx: number): Float32Array {
  const safeStart = Math.max(0, Math.min(startIdx, source.length));
  const safeEnd = Math.max(safeStart + 1, Math.min(endIdx, source.length));
  return source.slice(safeStart, safeEnd);
}

/**
 * @description [HR-05] 모노 PCM 샘플 배열에서 [cutStartIdx, cutEndIdx) 중간 잡음 구간을 삭제하고 앞뒤를 부드럽게 이어 붙이는 순수 함수
 * @param {Float32Array} source 원본 모노 샘플 배열
 * @param {number} cutStartIdx 삭제할 중간 구간 시작 인덱스
 * @param {number} cutEndIdx 삭제할 중간 구간 끝 인덱스
 * @returns {Float32Array} 중간 구간이 제거되고 앞뒤가 이어진 모노 샘플 배열
 */
export function cutMiddleMonoSamples(source: Float32Array, cutStartIdx: number, cutEndIdx: number): Float32Array {
  const safeCutStart = Math.max(0, Math.min(cutStartIdx, source.length));
  const safeCutEnd = Math.max(safeCutStart, Math.min(cutEndIdx, source.length));
  const head = source.slice(0, safeCutStart);
  const tail = source.slice(safeCutEnd);

  if (head.length === 0) return tail;
  if (tail.length === 0) return head;

  // 경계 클릭음 방지를 위한 짧은(최대 64샘플) 크로스페이드 처리
  const fadeLen = Math.min(64, head.length, tail.length);
  const merged = new Float32Array(head.length + tail.length);
  merged.set(head, 0);
  merged.set(tail, head.length);

  for (let i = 0; i < fadeLen; i += 1) {
    const ratio = i / fadeLen;
    const headEdgeIdx = head.length - fadeLen + i;
    const tailEdgeIdx = head.length + i;
    merged[headEdgeIdx] = head[head.length - fadeLen + i] * (1 - ratio * 0.5);
    merged[tailEdgeIdx] = tail[i] * (0.5 + ratio * 0.5);
  }
  return merged;
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
