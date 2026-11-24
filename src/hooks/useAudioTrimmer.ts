import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DecodedAudioData, decodeAudioForTrim, playAudioSegment, trimAudioToWavDataUrl,
} from '../services/audioTrimService';

/**
 * @description useAudioTrimmer 커스텀 훅의 반환 인터페이스
 */
export interface UseAudioTrimmerReturn {
  readonly isTrimOpen: boolean;
  readonly isDecoding: boolean;
  readonly isPreviewing: boolean;
  readonly trimError: string | null;
  readonly durationSec: number;
  readonly peaks: readonly number[];
  readonly range: readonly [number, number];
  readonly openTrimModal: (dataUrl: string | null) => Promise<void>;
  readonly closeTrimModal: () => void;
  readonly setRange: (nextRange: readonly [number, number]) => void;
  readonly togglePreview: () => void;
  readonly applyTrimAndGetDataUrl: () => string | null;
}

const MIN_SPAN_SEC = 0.2;

/**
 * @description [HR-01, HR-03, HR-05] 녹음된 아동 음성의 파형 디코딩, 앞뒤 구간 선택, 미리듣기 및 자르기 저장을 제어하는 커스텀 훅
 * @returns {UseAudioTrimmerReturn} 오디오 자르기 모달 상태 및 제어 함수 객체
 */
export function useAudioTrimmer(): UseAudioTrimmerReturn {
  const [isTrimOpen, setIsTrimOpen] = useState<boolean>(false);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [trimError, setTrimError] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<DecodedAudioData | null>(null);
  const [range, setRangeState] = useState<readonly [number, number]>([0, 1]);

  const stopPreviewRef = useRef<(() => void) | null>(null);

  const stopPreview = useCallback((): void => {
    if (stopPreviewRef.current) {
      stopPreviewRef.current();
      stopPreviewRef.current = null;
    }
    setIsPreviewing(false);
  }, []);

  useEffect(() => () => stopPreview(), [stopPreview]);

  const openTrimModal = useCallback(async (dataUrl: string | null): Promise<void> => {
    stopPreview();
    setIsTrimOpen(true);
    setTrimError(null);
    setDecoded(null);
    if (!dataUrl) {
      setTrimError('편집할 녹음 데이터를 찾을 수 없습니다.');
      return;
    }
    setIsDecoding(true);
    const res = await decodeAudioForTrim(dataUrl);
    setIsDecoding(false);
    if (!res.ok) {
      setTrimError(res.error.message);
      return;
    }
    setDecoded(res.data);
    setRangeState([0, Number(res.data.durationSec.toFixed(2))]);
  }, [stopPreview]);

  const closeTrimModal = useCallback((): void => {
    stopPreview();
    setIsTrimOpen(false);
    setDecoded(null);
    setTrimError(null);
  }, [stopPreview]);

  const setRange = useCallback((nextRange: readonly [number, number]): void => {
    stopPreview();
    const [start, end] = nextRange;
    if (end - start < MIN_SPAN_SEC) {
      const maxDur = decoded?.durationSec ?? end;
      const adjustedEnd = Math.min(maxDur, start + MIN_SPAN_SEC);
      const adjustedStart = Math.max(0, adjustedEnd - MIN_SPAN_SEC);
      setRangeState([Number(adjustedStart.toFixed(2)), Number(adjustedEnd.toFixed(2))]);
      return;
    }
    setRangeState([Number(start.toFixed(2)), Number(end.toFixed(2))]);
  }, [decoded, stopPreview]);

  const togglePreview = useCallback((): void => {
    if (isPreviewing) {
      stopPreview();
      return;
    }
    if (!decoded) return;
    setTrimError(null);
    const res = playAudioSegment(decoded.buffer, range[0], range[1], () => {
      stopPreviewRef.current = null;
      setIsPreviewing(false);
    });
    if (!res.ok) {
      setTrimError(res.error.message);
      return;
    }
    stopPreviewRef.current = res.data;
    setIsPreviewing(true);
  }, [decoded, isPreviewing, range, stopPreview]);

  const applyTrimAndGetDataUrl = useCallback((): string | null => {
    stopPreview();
    if (!decoded) return null;
    const res = trimAudioToWavDataUrl(decoded.buffer, range[0], range[1]);
    if (!res.ok) {
      setTrimError(res.error.message);
      return null;
    }
    setIsTrimOpen(false);
    setDecoded(null);
    return res.data;
  }, [decoded, range, stopPreview]);

  return {
    isTrimOpen, isDecoding, isPreviewing, trimError,
    durationSec: decoded?.durationSec ?? 0,
    peaks: decoded?.peaks ?? [],
    range,
    openTrimModal, closeTrimModal, setRange, togglePreview, applyTrimAndGetDataUrl,
  };
}
