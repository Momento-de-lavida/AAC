import { useCallback, useEffect, useRef, useState } from 'react';
import { CombinedStagePhase } from '../components/CombinedSentenceStage';
import { TherapyStepNumber } from '../components/StepProgressBar';
import { AacCard } from '../types/aac';

/**
 * @description useStepTransition 커스텀 훅의 입력 옵션 인터페이스
 */
export interface UseStepTransitionOptions {
  /** 현재 선택된 명사 카드 */
  readonly selectedNoun?: AacCard;
  /** 현재 선택된 동사 카드 */
  readonly selectedVerb?: AacCard;
  /** 진행 중인 TTS 발화 즉시 정지 함수 */
  readonly stopTts: () => void;
}

/**
 * @description useStepTransition 커스텀 훅의 반환 인터페이스
 */
export interface UseStepTransitionReturn {
  /** 3·4단계 스테이지 내부 위상 ('combo': 3단계 카드 조합, 'merged': 4단계 통합 동작 그림) */
  readonly stagePhase: CombinedStagePhase;
  /** 현재 활성화된 페이지 단계 번호 (1 ~ 4) */
  readonly currentStep: TherapyStepNumber;
  /** 스테이지 위상 직접 변경 함수 */
  readonly setStagePhase: (phase: CombinedStagePhase) => void;
  /** 3단계 제시 후 4단계로 자동 전환하는 타이머 예약 함수 */
  readonly scheduleMergeTransition: () => void;
  /** 진행 중인 단계 전환 타이머와 TTS 발화를 모두 즉시 중단하는 함수 */
  readonly stopAllSpeechAndTimers: () => void;
}

/**
 * @description [HR-01, HR-05] 자폐 아동 맞춤형 1~4단계 페이지 전환 상태 및 자동 전환 타이머를 제어하는 커스텀 훅
 * 설계 이유(Why):
 * - HomePage 컨테이너의 비대화를 막고(HR-01 200줄 제한 준수), 단계 계산 및 타이머 생명주기 관리를 격리합니다.
 * @param {UseStepTransitionOptions} options 선택된 명사·동사 및 TTS 정지 콜백
 * @returns {UseStepTransitionReturn} 현재 단계 번호, 위상 상태 및 타이머 제어 함수
 */
export function useStepTransition({
  selectedNoun,
  selectedVerb,
  stopTts,
}: UseStepTransitionOptions): UseStepTransitionReturn {
  const [stagePhase, setStagePhase] = useState<CombinedStagePhase>('combo');
  const mergeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep: TherapyStepNumber = !selectedNoun
    ? 1
    : !selectedVerb
      ? 2
      : stagePhase === 'combo'
        ? 3
        : 4;

  useEffect(() => {
    return () => {
      if (mergeTimerRef.current) {
        clearTimeout(mergeTimerRef.current);
      }
    };
  }, []);

  const scheduleMergeTransition = useCallback((): void => {
    if (mergeTimerRef.current) {
      clearTimeout(mergeTimerRef.current);
    }
    setStagePhase('combo');
    mergeTimerRef.current = setTimeout(() => {
      setStagePhase('merged');
    }, 5500);
  }, []);

  const stopAllSpeechAndTimers = useCallback((): void => {
    if (mergeTimerRef.current) {
      clearTimeout(mergeTimerRef.current);
      mergeTimerRef.current = null;
    }
    stopTts();
  }, [stopTts]);

  return {
    stagePhase,
    currentStep,
    setStagePhase,
    scheduleMergeTransition,
    stopAllSpeechAndTimers,
  };
}
