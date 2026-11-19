import React from 'react';
import { AacCard, VerbMotionType } from '../types/aac';
import { DailyActionScenes } from './scenes/DailyActionScenes';
import { MoveAndPlayScenes } from './scenes/MoveAndPlayScenes';
import {
  BeggingScene,
  DrinkingScene,
  EatingScene,
  MoreScene,
  PlayingScene,
} from './VerbActionScenesA';
import {
  DeliciousScene,
  DontTouchScene,
  FunScene,
  GreetingScene,
  HappyScene,
  HelpingScene,
  HungryScene,
  LikingScene,
  OpeningScene,
  RefusingScene,
  SickScene,
  SleepyScene,
  TurningOnScene,
} from './VerbActionScenesB';
import {
  GoingScene,
  PuttingInScene,
  RidingScene,
  TakingOutScene,
  TearingScene,
  WashingScene,
  WatchingScene,
  WearingScene,
} from './VerbActionScenesC';
import '../assets/verbMotions.css';

/**
 * @description AnimatedVerbGraphic 컴포넌트의 Props 인터페이스
 */
export interface AnimatedVerbGraphicProps {
  /** 동사 고유 카드 ID (41종 동사 1:1 비중복 직관 일러스트 매칭용) */
  readonly cardId?: string;
  /** 카드 대표 이모지 심볼 (폴백용) */
  readonly emoji: string;
  /** 카드 한글 라벨 (대체 텍스트용) */
  readonly label: string;
  /** 동사 모션 타입 (미지정 시 기본 begging 적용) */
  readonly motionType?: VerbMotionType;
  /** 치료사가 등록한 커스텀 GIF/이미지 URL (선택) */
  readonly customImageUrl?: string;
  /** 그래픽 크기 (px, 기본값 68) */
  readonly size?: number;
  /** 현재 이 동사가 선택(활성화)되었는지 여부 */
  readonly isActive?: boolean;
}

/**
 * @description [HR-01, HR-03, HR-05] 모든 동사(41종+)가 중복 없이 각자의 직관적인 행동 일러스트를 보여주며,
 * 선택된 동사(isActive === true)만 애니메이션을 동작시키는 컴포넌트
 * @param {AnimatedVerbGraphicProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 리얼 동사 동작 그래픽 엘리먼트
 */
export function AnimatedVerbGraphic({
  cardId,
  emoji,
  label,
  motionType = 'begging',
  customImageUrl,
  size = 68,
  isActive = true,
}: AnimatedVerbGraphicProps): React.ReactElement {
  if (customImageUrl) {
    return (
      <div
        aria-label={`${label} 동작 애니메이션`}
        style={{
          width: size, height: size, display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', opacity: isActive ? 1 : 0.85,
        }}
      >
        <img src={customImageUrl} alt={`${label} 움직이는 GIF`} style={{ width: '100%', height: '100%', borderRadius: 16, objectFit: 'cover' }} />
      </div>
    );
  }

  // 1. 동사 고유 ID(cardId) 기반 1:1 전용 직관 장면 우선 확인 (동사 간 이미지 중복 원천 차단)
  if (cardId) {
    const dummyVerbCard: AacCard = { id: cardId, label, speechText: label, partOfSpeech: 'verb', emoji, motionType };
    const dedicated = DailyActionScenes({ verbCard: dummyVerbCard }) ?? MoveAndPlayScenes({ verbCard: dummyVerbCard });
    if (dedicated) {
      return (
        <div
          aria-label={`${label} 동작 애니메이션`}
          data-active={isActive ? 'true' : 'false'}
          className={isActive ? 'verb-graphic-active' : 'verb-graphic-paused'}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s ease', transform: isActive ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          <svg width={size} height={size} viewBox="0 0 120 120" aria-label={`${label} 실제 동작`}>
            <circle cx="60" cy="60" r="54" fill="#F4FBF7" />
            {dedicated}
          </svg>
        </div>
      );
    }
  }

  /** motionType에 따른 17종의 리얼 동작 장면(Multi-part Action Scene) 매핑 */
  const renderScene = (): React.ReactElement => {
    switch (motionType) {
      case 'begging':
        return <BeggingScene size={size} />;
      case 'more':
        return <MoreScene size={size} />;
      case 'eating':
        return <EatingScene size={size} />;
      case 'drinking':
        return <DrinkingScene size={size} />;
      case 'playing':
        return <PlayingScene size={size} />;
      case 'opening':
        return <OpeningScene size={size} />;
      case 'helping':
        return <HelpingScene size={size} />;
      case 'refusing':
        return <RefusingScene size={size} />;
      case 'greeting':
        return <GreetingScene size={size} />;
      case 'riding':
        return <RidingScene size={size} />;
      case 'takingOut':
        return <TakingOutScene size={size} />;
      case 'tearing':
        return <TearingScene size={size} />;
      case 'going':
        return <GoingScene size={size} />;
      case 'puttingIn':
        return <PuttingInScene size={size} />;
      case 'wearing':
        return <WearingScene size={size} />;
      case 'washing':
        return <WashingScene size={size} />;
      case 'watching':
        return <WatchingScene size={size} />;
      case 'turningOn':
        return <TurningOnScene size={size} />;
      case 'dontTouch':
        return <DontTouchScene size={size} />;
      case 'liking':
        return <LikingScene size={size} />;
      case 'delicious':
        return <DeliciousScene size={size} />;
      case 'fun':
        return <FunScene size={size} />;
      case 'happy':
        return <HappyScene size={size} />;
      case 'hungry':
        return <HungryScene size={size} />;
      case 'sick':
        return <SickScene size={size} />;
      case 'sleepy':
        return <SleepyScene size={size} />;
      default:
        return <BeggingScene size={size} />;
    }
  };

  return (
    <div
      aria-label={`${label} 동작 애니메이션`}
      data-active={isActive ? 'true' : 'false'}
      className={isActive ? 'verb-graphic-active' : 'verb-graphic-paused'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease',
        transform: isActive ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      {renderScene()}
    </div>
  );
}
