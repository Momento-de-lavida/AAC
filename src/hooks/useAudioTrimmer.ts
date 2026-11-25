import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cutAudioMiddleSection, DecodedAudioData, decodeAudioForTrim,
  keepAudioSection, playAudioSegment, trimAudioToWavDataUrl,
} from '../services/audioTrimService';

/**
 * @description 오디오 자르기 편집 모드 ('keep': 선택한 구간만 남기기, 'cut': 선택한 중간 잡음 삭제하기)
 */
export type AudioTrimMode = 'keep' | 'cut';

/**
 * @description useAudioTrimmer 커스텀 훅의 반환 인터페이스
 */
export interface UseAudioTrimmerReturn {
  readonly isTrimOpen: boolean;
  readonly isDecoding: boolean;
  readonly isPreviewing: boolean;
  readonly trimError: string | null;
  readonly trimMode: AudioTrimMode;
  readonly canUndo: boolean;
  readonly durationSec: number;
  readonly peaks: readonly number[];
  readonly range: readonly [number, number];
  readonly openTrimModal: (dataUrl: string | null) => Promise<void>;
  readonly closeTrimModal: () => void;
  readonly setTrimMode: (mode: AudioTrimMode) => void;
  readonly setRange: (nextRange: readonly [number, number]) => void;
  readonly togglePreview: () => void;
  readonly applyEditCut: () => void;
  readonly undoEdit: () => void;
  readonly saveFinalAndGetDataUrl: () => string | null;
}

const MIN_SPAN_SEC = 0.2;

/**
 * @description [HR-01, HR-03, HR-05] 녹음된 아동 음성의 앞뒤 자르기·중간 잡음 삭제(연속 편집 및 되돌리기 지원)를 제어하는 커스텀 훅
 * @returns {UseAudioTrimmerReturn} 오디오 편집 모달 상태 및 제어 함수 객체
 */
export function useAudioTrimmer(): UseAudioTrimmerReturn {
  const [isTrimOpen, setIsTrimOpen] = useState<boolean>(false);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [trimError, setTrimError] = useState<string | null>(null);
  const [trimMode, setTrimModeState] = useState<AudioTrimMode>('keep');
  const [decoded, setDecoded] = useState<DecodedAudioData | null>(null);
  const [history, setHistory] = useState<DecodedAudioData[]>([]);
  const [range, setRangeState] = useState<readonly [number, number]>([0, 1]);
  const stopPreviewRef = useRef<(() => void) | null>(null);

  const stopPreview = useCallback((): void => {
    if (stopPreviewRef.current) { stopPreviewRef.current(); stopPreviewRef.current = null; }
    setIsPreviewing(false);
  }, []);

  useEffect(() => () => stopPreview(), [stopPreview]);

  const resetRangeForAudio = (data: DecodedAudioData, mode: AudioTrimMode): void => {
    const dur = Number(data.durationSec.toFixed(2));
    if (mode === 'cut' && dur > 0.6) {
      setRangeState([Number((dur * 0.3).toFixed(2)), Number((dur * 0.7).toFixed(2))]);
    } else {
      setRangeState([0, dur]);
    }
  };

  const openTrimModal = useCallback(async (dataUrl: string | null): Promise<void> => {
    stopPreview();
    setIsTrimOpen(true);
    setTrimError(null);
    setDecoded(null);
    setHistory([]);
    setTrimModeState('keep');
    if (!dataUrl) { setTrimError('편집할 녹음 데이터를 찾을 수 없습니다.'); return; }
    setIsDecoding(true);
    const res = await decodeAudioForTrim(dataUrl);
    setIsDecoding(false);
    if (!res.ok) { setTrimError(res.error.message); return; }
    setDecoded(res.data);
    setRangeState([0, Number(res.data.durationSec.toFixed(2))]);
  }, [stopPreview]);

  const closeTrimModal = useCallback((): void => {
    stopPreview();
    setIsTrimOpen(false);
    setDecoded(null);
    setHistory([]);
    setTrimError(null);
  }, [stopPreview]);

  const setTrimMode = useCallback((mode: AudioTrimMode): void => {
    stopPreview();
    setTrimModeState(mode);
    setTrimError(null);
    if (decoded) resetRangeForAudio(decoded, mode);
  }, [decoded, stopPreview]);

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
    if (isPreviewing) { stopPreview(); return; }
    if (!decoded) return;
    setTrimError(null);
    // 'keep' 모드에서는 선택한 초록색 구간만, 'cut' 모드에서는 현재 편집본 전체를 미리듣기
    const start = trimMode === 'keep' ? range[0] : 0;
    const end = trimMode === 'keep' ? range[1] : decoded.durationSec;
    const res = playAudioSegment(decoded.buffer, start, end, () => {
      stopPreviewRef.current = null;
      setIsPreviewing(false);
    });
    if (!res.ok) { setTrimError(res.error.message); return; }
    stopPreviewRef.current = res.data;
    setIsPreviewing(true);
  }, [decoded, isPreviewing, range, stopPreview, trimMode]);

  const applyEditCut = useCallback((): void => {
    stopPreview();
    if (!decoded) return;
    setTrimError(null);
    const res = trimMode === 'keep'
      ? keepAudioSection(decoded.buffer, range[0], range[1])
      : cutAudioMiddleSection(decoded.buffer, range[0], range[1]);
    if (!res.ok) { setTrimError(res.error.message); return; }
    setHistory((prev) => [...prev, decoded]);
    setDecoded(res.data);
    resetRangeForAudio(res.data, trimMode);
  }, [decoded, range, stopPreview, trimMode]);

  const undoEdit = useCallback((): void => {
    stopPreview();
    setTrimError(null);
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];
      setDecoded(previous);
      resetRangeForAudio(previous, trimMode);
      return prev.slice(0, -1);
    });
  }, [stopPreview, trimMode]);

  const saveFinalAndGetDataUrl = useCallback((): string | null => {
    stopPreview();
    if (!decoded) return null;
    const res = trimMode === 'keep' && history.length === 0
      ? trimAudioToWavDataUrl(decoded.buffer, range[0], range[1])
      : trimAudioToWavDataUrl(decoded.buffer, 0, decoded.durationSec);
    if (!res.ok) { setTrimError(res.error.message); return null; }
    setIsTrimOpen(false);
    setDecoded(null);
    setHistory([]);
    return res.data;
  }, [decoded, history.length, range, stopPreview, trimMode]);

  return {
    isTrimOpen, isDecoding, isPreviewing, trimError, trimMode,
    canUndo: history.length > 0,
    durationSec: decoded?.durationSec ?? 0,
    peaks: decoded?.peaks ?? [],
    range,
    openTrimModal, closeTrimModal, setTrimMode, setRange, togglePreview, applyEditCut, undoEdit, saveFinalAndGetDataUrl,
  };
}
