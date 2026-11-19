import React from 'react';
import { AacCard, VerbMotionType } from '../types/aac';
import { getDedicatedCombinedIllustration } from '../utils/combinedIllustrationMap';
import '../assets/verbMotions.css';

/**
 * @description CombinedActionScene 컴포넌트의 Props 인터페이스
 */
export interface CombinedActionSceneProps {
  /** 아동이 1페이지에서 선택한 명사 카드 (동화풍 일러스트 포함) */
  readonly nounCard: AacCard;
  /** 아동이 2페이지에서 선택한 동사·형용사 카드 */
  readonly verbCard: AacCard;
  /** 통합 동작 그림 크기 (px, 기본값 240) */
  readonly size?: number;
}

/** 모션 타입별 선택한 동화풍 명사 일러스트의 상호작용 위치 및 애니메이션 매핑 */
function getNounOverlayConfig(motion: VerbMotionType): {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly animation: string;
} {
  switch (motion) {
    case 'eating':
      return { x: 84, y: 78, r: 22, animation: 'spoonToMouth 1.15s ease-in-out infinite' };
    case 'drinking':
      return { x: 82, y: 78, r: 22, animation: 'cupTiltToMouth 1.2s ease-in-out infinite' };
    case 'begging':
    case 'more':
      return { x: 84, y: 76, r: 22, animation: 'itemDropToHands 1.2s ease-in-out infinite' };
    case 'takingOut':
      return { x: 86, y: 74, r: 21, animation: 'takeOutUp 1.25s ease-in-out infinite' };
    case 'puttingIn':
    case 'wearing':
      return { x: 86, y: 74, r: 21, animation: 'putInDown 1.25s ease-in-out infinite' };
    case 'tearing':
      return { x: 86, y: 80, r: 21, animation: 'tearRight 1.2s ease-in-out infinite' };
    case 'riding':
    case 'going':
      return { x: 88, y: 82, r: 22, animation: 'rideMove 1s ease-in-out infinite' };
    case 'washing':
      return { x: 86, y: 82, r: 21, animation: 'washScrub 0.9s ease-in-out infinite' };
    case 'refusing':
    case 'dontTouch':
    case 'sick':
      return { x: 88, y: 82, r: 20, animation: 'headAndHandShakeNo 0.85s ease-in-out infinite' };
    default:
      return { x: 88, y: 82, r: 21, animation: 'childJumpJoy 0.95s ease-in-out infinite' };
  }
}

/**
 * @description [HR-01, HR-03, HR-05] 3페이지 결합 완성 스테이지 전용 컴포넌트
 * "빵 먹어요", "주스 마셔요", "우유 마셔요", "과자 먹어요", "사과 먹어요", "밥 먹어요" 등 핵심 조합을
 * 스티커 합성 없이 100% 단일 일체형 동화풍 일러스트로 즉시 렌더링합니다.
 * @param {CombinedActionSceneProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 명사+동사 결합 동화풍 일러스트 엘리먼트
 */
export function CombinedActionScene({ nounCard, verbCard, size = 240 }: CombinedActionSceneProps): React.ReactElement {
  const motion: VerbMotionType = verbCard.motionType ?? 'begging';
  const combinedLabel = `${nounCard.label} ${verbCard.label} 통합 동작 그림`;
  const dedicatedCombinedImg = getDedicatedCombinedIllustration(nounCard.id, verbCard.id);
  const fairytaleActionImg = verbCard.customImageUrl ?? `/images/aac/combined/motion-${motion}.jpg`;
  const overlay = getNounOverlayConfig(motion);
  const clipId = `noun-clip-${nounCard.id}-${verbCard.id}`;

  return (
    <div
      aria-label={combinedLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 38,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 14px 34px rgba(247, 136, 47, 0.28)',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        <defs>
          <clipPath id="stageCardClip">
            <rect x="4" y="4" width="112" height="112" rx="26" />
          </clipPath>
          <clipPath id={clipId}>
            <circle cx="0" cy="0" r={overlay.r} />
          </clipPath>
        </defs>

        <rect x="3" y="3" width="114" height="114" rx="28" fill="#FFFDF7" stroke="#FF9F43" strokeWidth="3.5" />

        {dedicatedCombinedImg ? (
          <g clipPath="url(#stageCardClip)">
            <g style={{ animation: 'childJumpJoy 1.35s ease-in-out infinite' }}>
              <image href={dedicatedCombinedImg} x="4" y="4" width="112" height="112" preserveAspectRatio="xMidYMid slice" />
            </g>
          </g>
        ) : (
          <g clipPath="url(#stageCardClip)">
            <image href={fairytaleActionImg} x="4" y="4" width="112" height="112" preserveAspectRatio="xMidYMid slice" />
            <g style={{ animation: overlay.animation, transformOrigin: `${overlay.x}px ${overlay.y}px` }}>
              <g transform={`translate(${overlay.x}, ${overlay.y})`}>
                <circle cx="0" cy="0" r={overlay.r + 3} fill="#FFFFFF" stroke="#FF8E6E" strokeWidth="3" />
                {nounCard.customImageUrl ? (
                  <image
                    href={nounCard.customImageUrl}
                    x={-overlay.r}
                    y={-overlay.r}
                    width={overlay.r * 2}
                    height={overlay.r * 2}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${clipId})`}
                  />
                ) : (
                  <text x="0" y="0" fontSize={overlay.r * 1.2} textAnchor="middle" dominantBaseline="central">
                    {nounCard.emoji}
                  </text>
                )}
              </g>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
