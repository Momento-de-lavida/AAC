import { useCallback, useEffect, useRef, useState } from 'react';
import {
  abortAudioRecordingSession, ActiveRecordingSession, pauseAudioRecordingSession, playAudioDataUrl,
  processAudioFile, resumeAudioRecordingSession, startAudioRecordingSession, stopAudioElement, stopAudioRecordingSession,
} from '../services/audioRecordService';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../services/storageService';
import { VOICE_RECORD_CONFIG } from '../utils/constants';

/**
 * @description useVoiceRecorder 커스텀 훅의 반환 인터페이스
 */
export interface UseVoiceRecorderReturn {
  readonly isRecording: boolean;
  readonly isRecordingPaused: boolean;
  readonly isPlayingRecordedVoice: boolean;
  readonly recordError: string | null;
  readonly hasRecordedVoice: (sentenceText: string) => boolean;
  readonly startRecording: (sentenceText: string, onSaved?: () => void) => Promise<void>;
  readonly pauseRecording: () => void;
  readonly resumeRecording: (sentenceText: string, onSaved?: () => void) => void;
  readonly stopRecordingAndSave: (sentenceText: string, onSaved?: () => void) => Promise<void>;
  readonly handleAudioFile: (sentenceText: string, file: File | undefined, onSaved?: () => void) => Promise<void>;
  readonly playRecordedVoice: (sentenceText: string) => boolean;
  readonly deleteRecordedVoice: (sentenceText: string) => void;
  readonly stopVoiceAll: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 문장별 아동 음성 녹음(일시정지·재개 포함)·저장 및 통합 동작 그림 재생을 제어하는 커스텀 훅
 * @returns {UseVoiceRecorderReturn} 아동 음성 녹음 상태 및 제어 함수 객체
 */
export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [recordedMap, setRecordedMap] = useState<Record<string, string>>(() => {
    const loaded = loadFromStorage<Record<string, string>>(STORAGE_KEYS.RECORDED_VOICES, {});
    return loaded.ok ? loaded.data : {};
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const [isPlayingRecordedVoice, setIsPlayingRecordedVoice] = useState<boolean>(false);
  const [recordError, setRecordError] = useState<string | null>(null);

  const recordedMapRef = useRef<Record<string, string>>(recordedMap);
  recordedMapRef.current = recordedMap;
  const sessionRef = useRef<ActiveRecordingSession | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMaxTimer = (): void => {
    if (maxTimerRef.current) { clearTimeout(maxTimerRef.current); maxTimerRef.current = null; }
  };

  /** 녹음 및 오디오 재생을 모두 안전하게 정지 */
  const stopVoiceAll = useCallback((): void => {
    clearMaxTimer();
    abortAudioRecordingSession(sessionRef.current);
    sessionRef.current = null;
    stopAudioElement(audioRef.current);
    audioRef.current = null;
    setIsRecording(false);
    setIsRecordingPaused(false);
    setIsPlayingRecordedVoice(false);
  }, []);

  useEffect(() => () => stopVoiceAll(), [stopVoiceAll]);

  const hasRecordedVoice = useCallback(
    (sentenceText: string): boolean => Boolean(sentenceText && recordedMap[sentenceText]),
    [recordedMap]
  );

  const playRecordedVoice = useCallback((sentenceText: string): boolean => {
    const dataUrl = recordedMapRef.current[sentenceText];
    if (!dataUrl) return false;
    stopAudioElement(audioRef.current);
    setIsPlayingRecordedVoice(true);
    const res = playAudioDataUrl(dataUrl, () => setIsPlayingRecordedVoice(false));
    if (!res.ok) {
      setIsPlayingRecordedVoice(false);
      setRecordError(res.error.message);
      return false;
    }
    audioRef.current = res.data;
    return true;
  }, []);

  const saveAndPlayDataUrl = useCallback(
    (sentenceText: string, dataUrl: string, onSaved?: () => void): void => {
      const next = { ...recordedMapRef.current, [sentenceText]: dataUrl };
      recordedMapRef.current = next;
      saveToStorage(STORAGE_KEYS.RECORDED_VOICES, next);
      setRecordedMap(next);
      onSaved?.();
      stopAudioElement(audioRef.current);
      setIsPlayingRecordedVoice(true);
      const playRes = playAudioDataUrl(dataUrl, () => setIsPlayingRecordedVoice(false));
      if (playRes.ok) audioRef.current = playRes.data;
    },
    []
  );

  const stopRecordingAndSave = useCallback(
    async (sentenceText: string, onSaved?: () => void): Promise<void> => {
      clearMaxTimer();
      const activeSession = sessionRef.current;
      sessionRef.current = null;
      setIsRecording(false);
      setIsRecordingPaused(false);
      if (!activeSession || !sentenceText) return;
      const res = await stopAudioRecordingSession(activeSession);
      if (!res.ok) { setRecordError(res.error.message); return; }
      saveAndPlayDataUrl(sentenceText, res.data, onSaved);
    },
    [saveAndPlayDataUrl]
  );

  const scheduleMaxTimer = useCallback(
    (sentenceText: string, onSaved?: () => void): void => {
      clearMaxTimer();
      maxTimerRef.current = setTimeout(() => {
        void stopRecordingAndSave(sentenceText, onSaved);
      }, VOICE_RECORD_CONFIG.MAX_DURATION_MS);
    },
    [stopRecordingAndSave]
  );

  const startRecording = useCallback(
    async (sentenceText: string, onSaved?: () => void): Promise<void> => {
      stopVoiceAll();
      setRecordError(null);
      const res = await startAudioRecordingSession();
      if (!res.ok) { setRecordError(res.error.message); return; }
      sessionRef.current = res.data;
      setIsRecording(true);
      setIsRecordingPaused(false);
      scheduleMaxTimer(sentenceText, onSaved);
    },
    [scheduleMaxTimer, stopVoiceAll]
  );

  /** 치료사 모델링 시 일시정지 (일시정지 중에는 자동 완료 타이머도 멈춤) */
  const pauseRecording = useCallback((): void => {
    clearMaxTimer();
    const res = pauseAudioRecordingSession(sessionRef.current);
    if (res.ok) setIsRecordingPaused(true);
    else setRecordError(res.error.message);
  }, []);

  /** 아동 모방발화 차례에 녹음 재개 */
  const resumeRecording = useCallback(
    (sentenceText: string, onSaved?: () => void): void => {
      const res = resumeAudioRecordingSession(sessionRef.current);
      if (res.ok) {
        setIsRecordingPaused(false);
        scheduleMaxTimer(sentenceText, onSaved);
      } else {
        setRecordError(res.error.message);
      }
    },
    [scheduleMaxTimer]
  );

  const handleAudioFile = useCallback(
    async (sentenceText: string, file: File | undefined, onSaved?: () => void): Promise<void> => {
      if (!file || !sentenceText) return;
      stopVoiceAll();
      setRecordError(null);
      const res = await processAudioFile(file);
      if (!res.ok) { setRecordError(res.error.message); return; }
      saveAndPlayDataUrl(sentenceText, res.data, onSaved);
    },
    [saveAndPlayDataUrl, stopVoiceAll]
  );

  const deleteRecordedVoice = useCallback((sentenceText: string): void => {
    stopAudioElement(audioRef.current);
    setIsPlayingRecordedVoice(false);
    const next = { ...recordedMapRef.current };
    delete next[sentenceText];
    recordedMapRef.current = next;
    saveToStorage(STORAGE_KEYS.RECORDED_VOICES, next);
    setRecordedMap(next);
  }, []);

  return {
    isRecording, isRecordingPaused, isPlayingRecordedVoice, recordError, hasRecordedVoice,
    startRecording, pauseRecording, resumeRecording, stopRecordingAndSave, handleAudioFile,
    playRecordedVoice, deleteRecordedVoice, stopVoiceAll,
  };
}
