import { describe, expect, it } from 'vitest';
import { encodeMonoPcmToWavDataUrl, extractWaveformPeaks, trimAudioToWavDataUrl } from './audioTrimService';
import { cutMiddleMonoSamples, sliceMonoSamples } from './audioWavHelper';

describe('Phase 1: audioTrimService 오디오 파형 추출, 앞뒤/중간 자르기 검증', () => {
  it('extractWaveformPeaks는 오디오 샘플에서 정규화된 파형 막대 배열을 반환해야 한다', () => {
    const samples = new Float32Array([0.1, -0.5, 0.2, 1.0, 0.0, 0.25, -0.25, 0.5]);
    const peaks = extractWaveformPeaks(samples, 4);

    expect(peaks).toHaveLength(4);
    expect(peaks[1]).toBe(1);
    expect(peaks.every((p) => p >= 0.08 && p <= 1)).toBe(true);
  });

  it('cutMiddleMonoSamples는 중간 잡음 구간을 삭제하고 앞부분과 뒷부분을 정확히 이어 붙여야 한다', () => {
    // 앞(0.2) 100샘플 + 중간 잡음(0.9) 200샘플 + 뒤(0.4) 100샘플 = 총 400샘플
    const source = new Float32Array(400);
    source.fill(0.2, 0, 100);
    source.fill(0.9, 100, 300);
    source.fill(0.4, 300, 400);

    const cutResult = cutMiddleMonoSamples(source, 100, 300);
    expect(cutResult.length).toBe(200);
    expect(cutResult[0]).toBeCloseTo(0.2, 2);
    expect(cutResult[199]).toBeCloseTo(0.4, 2);

    const sliced = sliceMonoSamples(source, 100, 300);
    expect(sliced.length).toBe(200);
    expect(sliced[0]).toBeCloseTo(0.9, 2);
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
    const fullLength = sampleRate * 2;
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
      expect(decodedBinary.length).toBe(44 + 16000 * 2);
    }
  });
});
