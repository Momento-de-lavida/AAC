import { describe, expect, it } from 'vitest';
import { encodeMonoPcmToWavDataUrl, extractWaveformPeaks, trimAudioToWavDataUrl } from './audioTrimService';

describe('Phase 1: audioTrimService 오디오 파형 추출 및 구간 자르기 검증', () => {
  it('extractWaveformPeaks는 오디오 샘플에서 정규화된 파형 막대 배열을 반환해야 한다', () => {
    const samples = new Float32Array([0.1, -0.5, 0.2, 1.0, 0.0, 0.25, -0.25, 0.5]);
    const peaks = extractWaveformPeaks(samples, 4);

    expect(peaks).toHaveLength(4);
    expect(peaks[1]).toBe(1);
    expect(peaks.every((p) => p >= 0.08 && p <= 1)).toBe(true);
  });

  it('encodeMonoPcmToWavDataUrl은 유효한 WAV 헤더가 포함된 Base64 Data URL을 생성해야 한다', () => {
    const samples = new Float32Array([0, 0.5, -0.5, 0.25]);
    const dataUrl = encodeMonoPcmToWavDataUrl(samples, 16000);

    expect(dataUrl.startsWith('data:audio/wav;base64,')).toBe(true);
    const decodedBinary = atob(dataUrl.split(',')[1]);
    expect(decodedBinary.slice(0, 4)).toBe('RIFF');
    expect(decodedBinary.slice(8, 12)).toBe('WAVE');
    expect(decodedBinary.length).toBe(44 + samples.length * 2);
  });

  it('trimAudioToWavDataUrl은 선택한 시작~끝 구간의 샘플만 잘라 WAV로 반환해야 한다', () => {
    const sampleRate = 16000;
    const fullLength = sampleRate * 2; // 2초
    const channelData = new Float32Array(fullLength).fill(0.4);
    const mockBuffer = {
      sampleRate,
      length: fullLength,
      duration: 2.0,
      numberOfChannels: 1,
      getChannelData: () => channelData,
    } as unknown as AudioBuffer;

    const result = trimAudioToWavDataUrl(mockBuffer, 0.5, 1.5);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const decodedBinary = atob(result.data.split(',')[1]);
      // 1초 * 16000Hz * 2bytes = 32000 bytes + 44 header
      expect(decodedBinary.length).toBe(44 + 16000 * 2);
    }
  });
});
