import React from 'react';
import { AacCard } from '../types/aac';
import { DailyActionScenes } from './scenes/DailyActionScenes';
import { MoveAndPlayScenes } from './scenes/MoveAndPlayScenes';
import '../assets/verbMotions.css';

/**
 * @description CombinedActionScene 컴포넌트의 Props 인터페이스
 */
export interface CombinedActionSceneProps {
  /** 아동이 선택한 명사 카드 */
  readonly nounCard: AacCard;
  /** 아동이 선택한 동사 카드 */
  readonly verbCard: AacCard;
  /** 통합 동작 그림 크기 (px, 기본값 190) */
  readonly size?: number;
}

/**
 * @description [HR-01, HR-03, HR-05] 선택한 '명사'와 '동사'가 단순 이모지 겹침 없이
 * 하나의 실제 행동 장면으로 결합되어 실행되는 일체형 동작 애니메이션 컴포넌트
 * @param {CombinedActionSceneProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 명사+동사 결합 단일 동작 일러스트 엘리먼트
 */
export function CombinedActionScene({ nounCard, verbCard, size = 190 }: CombinedActionSceneProps): React.ReactElement {
  const motion = verbCard.motionType ?? 'begging';
  const combinedLabel = `${nounCard.label} ${verbCard.label} 통합 동작 그림`;

  const renderNoun = (x: number, y: number, fontSize = 30): React.ReactElement => {
    if (nounCard.customImageUrl) {
      return <image href={nounCard.customImageUrl} x={x - fontSize / 2} y={y - fontSize / 2} width={fontSize} height={fontSize} />;
    }
    return <text x={x} y={y} fontSize={fontSize} textAnchor="middle" dominantBaseline="central">{nounCard.emoji}</text>;
  };

  // 1. 일상·도구·신체·이동 전용 일체형 장면(과자봉지 뜯기, 빨대 꽂기, 주스 붓기, 문 열기·닫기, 의자 앉기·일어나기 등) 우선 렌더링
  const dailyScene = DailyActionScenes({ nounCard, verbCard });
  const movePlayScene = !dailyScene ? MoveAndPlayScenes({ nounCard, verbCard }) : null;
  const dedicatedScene = dailyScene ?? movePlayScene;

  return (
    <div
      aria-label={combinedLabel}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: 8, borderRadius: '50%', backgroundColor: '#FFFFFF',
        boxShadow: '0 10px 28px rgba(247, 136, 47, 0.22)',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="#FFF8EC" stroke="#FFD8A8" strokeWidth="3" />

        {dedicatedScene ? (
          dedicatedScene
        ) : motion === 'eating' ? (
          <g>
            <circle cx="48" cy="62" r="26" fill="#FFE0BD" />
            <circle cx="39" cy="53" r="3" fill="#3D352E" />
            <circle cx="56" cy="53" r="3" fill="#3D352E" />
            <ellipse cx="48" cy="71" rx="9.5" ry="8" fill="#E05A47" style={{ animation: 'mouthOpenClose 1.15s ease-in-out infinite', transformOrigin: '48px 71px' }} />
            <g style={{ animation: 'spoonToMouth 1.15s ease-in-out infinite', transformOrigin: '72px 76px' }}>
              <path d="M68 76 L96 90" stroke="#A0AAB2" strokeWidth="6" strokeLinecap="round" />
              <circle cx="86" cy="84" r="8" fill="#FFCC99" />
              {renderNoun(62, 68, 30)}
            </g>
          </g>
        ) : motion === 'drinking' ? (
          <g>
            <circle cx="46" cy="62" r="26" fill="#FFE0BD" />
            <circle cx="38" cy="53" r="3" fill="#3D352E" />
            <circle cx="54" cy="53" r="3" fill="#3D352E" />
            <circle cx="52" cy="70" r="6" fill="#E05A47" />
            <g style={{ animation: 'cupTiltToMouth 1.25s ease-in-out infinite', transformOrigin: '66px 70px' }}>
              <circle cx="84" cy="74" r="8" fill="#FFCC99" />
              {renderNoun(70, 64, 32)}
            </g>
          </g>
        ) : motion === 'begging' ? (
          <g>
            <circle cx="60" cy="34" r="17" fill="#FFE0BD" />
            <circle cx="54" cy="31" r="2.5" fill="#3D352E" />
            <circle cx="66" cy="31" r="2.5" fill="#3D352E" />
            <path d="M54 38 Q60 44 66 38" stroke="#E05A47" strokeWidth="2.5" fill="none" />
            <g style={{ animation: 'itemDropToHands 1.15s ease-in-out infinite', transformOrigin: '60px 64px' }}>{renderNoun(60, 62, 34)}</g>
            <g style={{ animation: 'handsGiveAndTake 1.15s ease-in-out infinite' }}>
              <path d="M28 84 C32 72, 46 72, 57 82 L57 92 C44 92, 32 89, 28 84 Z" fill="#FFCC99" />
              <path d="M92 84 C88 72, 74 72, 63 82 L63 92 C76 92, 88 89, 92 84 Z" fill="#FFCC99" />
            </g>
          </g>
        ) : motion === 'more' ? (
          <g>
            <ellipse cx="60" cy="86" rx="38" ry="10" fill="#FFFFFF" stroke="#B2E2C8" strokeWidth="3" />
            {renderNoun(44, 74, 28)}
            <g style={{ animation: 'addMoreItem 1.3s ease-in-out infinite' }}>
              {renderNoun(76, 72, 28)}
              <circle cx="36" cy="36" r="13" fill="#2E9E6B" />
              <path d="M36 29 V43 M29 36 H43" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        ) : motion === 'riding' && (nounCard.id === 'noun-swing' || nounCard.id === 'noun-trampoline') ? (
          <g>{renderNoun(60, 60, 86)}</g>
        ) : motion === 'riding' ? (
          <g style={{ animation: 'rideMove 0.95s ease-in-out infinite' }}>
            <circle cx="56" cy="38" r="15" fill="#FFE0BD" />
            <circle cx="61" cy="35" r="2.2" fill="#3D352E" />
            <path d="M55 42 Q60 46 65 42" stroke="#E05A47" strokeWidth="2.2" fill="none" />
            <rect x="34" y="54" width="52" height="24" rx="10" fill="#D0EBFF" stroke="#54A0FF" strokeWidth="2.5" />
            {renderNoun(60, 68, 38)}
          </g>
        ) : motion === 'going' ? (
          <g>
            {renderNoun(86, 58, 36)}
            <g style={{ animation: 'walkForward 1.3s linear infinite' }}>
              <circle cx="38" cy="44" r="14" fill="#FFE0BD" />
              <circle cx="43" cy="42" r="2" fill="#3D352E" />
              <path d="M30 58 L46 58 L44 78 L32 78 Z" fill="#2E9E6B" />
              <path d="M34 78 L28 92 M42 78 L48 92" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        ) : motion === 'dontTouch' || motion === 'refusing' ? (
          <g>
            {renderNoun(60, 62, 38)}
            <g style={{ animation: 'headAndHandShakeNo 0.9s ease-in-out infinite', transformOrigin: '60px 62px' }}>
              <circle cx="60" cy="60" r="34" fill="none" stroke="#EF4444" strokeWidth="5" />
              <line x1="36" y1="36" x2="84" y2="84" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
              <text x="86" y="42" fontSize="26">✋</text>
            </g>
          </g>
        ) : motion === 'takingOut' ? (
          <g>
            <rect x="30" y="64" width="60" height="32" rx="4" fill="#F5A65B" stroke="#C87A28" strokeWidth="2" />
            <g style={{ animation: 'takeOutUp 1.3s ease-in-out infinite' }}>
              <path d="M60 18 L52 28 H57 V38 H63 V28 H68 Z" fill="#2E9E6B" />
              {renderNoun(60, 52, 32)}
            </g>
            <rect x="30" y="74" width="60" height="22" rx="3" fill="#FFBE76" stroke="#C87A28" strokeWidth="2" />
          </g>
        ) : motion === 'puttingIn' ? (
          <g>
            <rect x="30" y="66" width="60" height="30" rx="4" fill="#74B9FF" stroke="#0984E3" strokeWidth="2" />
            <g style={{ animation: 'putInDown 1.3s ease-in-out infinite' }}>
              <path d="M60 36 L52 26 H57 V16 H63 V26 H68 Z" fill="#0984E3" />
              {renderNoun(60, 54, 32)}
            </g>
            <rect x="30" y="76" width="60" height="20" rx="3" fill="#A3CBFF" stroke="#0984E3" strokeWidth="2" />
          </g>
        ) : motion === 'turningOn' ? (
          <g>
            <rect x="24" y="50" width="32" height="38" rx="7" fill="#8B5CF6" />
            <circle cx="40" cy="70" r="9" fill="#DDD6FE" />
            {renderNoun(78, 70, 32)}
            <g style={{ animation: 'takeOutUp 1.1s ease-in-out infinite' }}>
              <text x="56" y="42" fontSize="22">🎵</text>
              <text x="82" y="46" fontSize="20">🎶</text>
            </g>
          </g>
        ) : motion === 'watching' ? (
          <g>
            <circle cx="36" cy="62" r="18" fill="#FFE0BD" />
            <circle cx="42" cy="58" r="3" fill="#3D352E" />
            <path d="M50 58 L70 52 M50 64 L70 70" stroke="#FF9F43" strokeWidth="2.5" strokeDasharray="4 3" />
            {renderNoun(84, 62, 34)}
          </g>
        ) : motion === 'helping' ? (
          <g>
            {renderNoun(60, 38, 28)}
            <g style={{ animation: 'handReachDown 1.1s ease-in-out infinite' }}>
              <rect x="24" y="62" width="34" height="16" rx="8" fill="#FFCC99" stroke="#D49B6A" strokeWidth="2" />
            </g>
            <g style={{ animation: 'handReachUp 1.1s ease-in-out infinite' }}>
              <rect x="62" y="62" width="34" height="16" rx="8" fill="#FFE0BD" stroke="#D49B6A" strokeWidth="2" />
            </g>
          </g>
        ) : (
          <g>
            <circle cx="46" cy="64" r="20" fill="#FFE0BD" />
            <circle cx="40" cy="58" r="2.5" fill="#3D352E" />
            <circle cx="52" cy="58" r="2.5" fill="#3D352E" />
            <path d="M40 68 Q46 74 52 68" stroke="#E05A47" strokeWidth="2.5" fill="none" />
            <g style={{ animation: 'childJumpJoy 0.95s ease-in-out infinite' }}>
              {renderNoun(80, 66, 32)}
              <text x="76" y="38" fontSize="22">
                {motion === 'liking' ? '👍❤️' : motion === 'delicious' ? '😋✨' : motion === 'greeting' ? '👋' : '😆🎉'}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
