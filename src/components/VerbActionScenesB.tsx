import React from 'react';
import { CuteCharacter } from './scenes/CharacterParts';

/**
 * @description [HR-01, HR-03, HR-05] 상호작용·자기옹호·감정/상태(형용사) 13종의
 * 고디테일 캐릭터 벡터 SVG 관절 모션 컴포넌트 모음
 */

/** 6. '열어요' (opening): 상자의 양쪽 뚜껑이 활짝 열리며 안에서 반짝이는 별이 솟아오르는 관절 모션 */
export function OpeningScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="열어 주세요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#F1F9F1" stroke="#B2E2C8" strokeWidth="2.5" />
      <g style={{ animation: 'starPopOut 1.35s ease-in-out infinite', transformOrigin: '40px 34px' }}>
        <polygon points="40,14 44,24 55,25 47,32 49,42 40,36 31,42 33,32 25,25 36,24" fill="#FFC312" stroke="#3D352E" strokeWidth="1.8" />
      </g>
      <rect x="20" y="44" width="40" height="24" rx="4" fill="#F5A65B" stroke="#3D352E" strokeWidth="2.2" />
      <rect x="18" y="38" width="22" height="7" rx="2.5" fill="#FFBE76" stroke="#3D352E" strokeWidth="2" style={{ animation: 'boxLidOpenLeft 1.35s ease-in-out infinite', transformOrigin: '20px 44px' }} />
      <rect x="40" y="38" width="22" height="7" rx="2.5" fill="#FFBE76" stroke="#3D352E" strokeWidth="2" style={{ animation: 'boxLidOpenRight 1.35s ease-in-out infinite', transformOrigin: '60px 44px' }} />
    </svg>
  );
}

/** 7. '도와주세요' (helping): 아이의 작은 손과 어른의 큰 손이 서로 다가와 맞잡는 관절 모션 */
export function HelpingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="도와주세요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF5F5" stroke="#FECACA" strokeWidth="2.5" />
      <path d="M40 26 C36 20, 27 22, 27 30 C27 37, 40 44, 40 44 C40 44, 53 37, 53 30 C53 22, 44 20, 40 26 Z" fill="#FF6B6B" stroke="#3D352E" strokeWidth="1.8" />
      <g style={{ animation: 'handReachUp 1.15s ease-in-out infinite' }}>
        <path d="M14 64 L32 45 C36 42, 40 45, 37 50 L23 68 Z" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
      </g>
      <g style={{ animation: 'handReachDown 1.15s ease-in-out infinite' }}>
        <path d="M66 16 L46 37 C42 40, 38 37, 41 32 L57 12 Z" fill="#FFCC99" stroke="#3D352E" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** 8. '싫어요' (refusing): 캐릭터가 고개와 손을 좌우로 가로저으며 거절(X)하는 관절 모션 */
export function RefusingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="싫어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF0ED" stroke="#FECACA" strokeWidth="2.5" />
      <g style={{ animation: 'headAndHandShakeNo 0.85s ease-in-out infinite', transformOrigin: '40px 44px' }}>
        <CuteCharacter cx={34} cy={38} r={16.5} shirtColor="#FF7675" mood="refuse" />
        <rect x="50" y="42" width="13" height="18" rx="6" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
        <circle cx="58" cy="24" r="10.5" fill="#EB5757" stroke="#3D352E" strokeWidth="1.8" />
        <path d="M54 20 L62 28 M62 20 L54 28" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 9. '안녕하세요' (greeting): 밝게 웃는 캐릭터가 팔과 손바닥을 좌우로 흔들며 인사하는 관절 모션 */
export function GreetingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="안녕하세요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2.5" />
      <CuteCharacter cx={33} cy={38} r={16.5} shirtColor="#48DBFB" mood="smile" />
      <g style={{ animation: 'wavingArmHand 0.85s ease-in-out infinite', transformOrigin: '48px 54px' }}>
        <path d="M47 54 L58 30" stroke="#FFE0BD" strokeWidth="6.5" strokeLinecap="round" />
        <circle cx="59" cy="27" r="7.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** 10. '틀어주세요' (turningOn): 스피커에서 신나는 음표가 솟아오르고 아이가 기뻐하는 관절 모션 */
export function TurningOnScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="틀어주세요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#F3E8FF" stroke="#DDD6FE" strokeWidth="2.5" />
      <rect x="14" y="32" width="24" height="30" rx="5" fill="#8B5CF6" stroke="#3D352E" strokeWidth="2" />
      <circle cx="26" cy="49" r="6.5" fill="#DDD6FE" stroke="#3D352E" strokeWidth="1.5" />
      <g style={{ animation: 'takeOutUp 1.05s ease-in-out infinite' }}>
        <circle cx="52" cy="36" r="5" fill="#EC4899" />
        <path d="M56 36 V20 L66 23 V28 L56 25" fill="#EC4899" stroke="#3D352E" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/** 11. '만지지 마세요' (dontTouch): 손바닥을 앞으로 뻗어 정지 신호를 보내는 관절 모션 */
export function DontTouchScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="만지지 마세요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="2.5" />
      <g style={{ animation: 'headAndHandShakeNo 0.85s ease-in-out infinite', transformOrigin: '40px 44px' }}>
        <CuteCharacter cx={33} cy={38} r={16} shirtColor="#EF4444" mood="refuse" />
        <rect x="48" y="34" width="16" height="22" rx="7" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.2" />
        <circle cx="56" cy="45" r="13" fill="none" stroke="#EF4444" strokeWidth="3.2" />
        <line x1="47" y1="36" x2="65" y2="54" stroke="#EF4444" strokeWidth="3.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 12. '좋아요' (liking): 환하게 웃는 캐릭터와 하트·엄지척이 떠오르는 관절 모션 */
export function LikingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="좋아요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2.5" />
      <CuteCharacter cx={33} cy={39} r={16.5} shirtColor="#F59E0B" mood="excited" />
      <g style={{ animation: 'childJumpJoy 0.9s ease-in-out infinite' }}>
        <path d="M58 26 C55 21, 48 22, 48 28 C48 33, 58 39, 58 39 C58 39, 68 33, 68 28 C68 22, 61 21, 58 26 Z" fill="#FF6B6B" stroke="#3D352E" strokeWidth="1.8" />
        <circle cx="58" cy="54" r="8" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
        <rect x="55" y="42" width="6" height="9" rx="3" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** 13. '맛있어요' (delicious): 두 손으로 볼을 감싸고 행복해하는 관절 모션 */
export function DeliciousScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="맛있어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2.5" />
      <g style={{ animation: 'childJumpJoy 1s ease-in-out infinite' }}>
        <CuteCharacter cx={40} cy={39} r={17.5} shirtColor="#FF9F43" mood="yummy" />
        <circle cx="22" cy="44" r="5.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
        <circle cx="58" cy="44" r="5.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** 14. '재밌어요' (fun) & 15. '기분 좋아요' (happy) */
export function FunScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="재밌어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2.5" />
      <g style={{ animation: 'childJumpJoy 0.8s ease-in-out infinite' }}>
        <CuteCharacter cx={40} cy={38} r={16.5} shirtColor="#10B981" mood="excited" />
        <path d="M23 44 L14 26 M57 44 L66 26" stroke="#FFE0BD" strokeWidth="5.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function HappyScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="기분 좋아요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF0F6" stroke="#FBCFE8" strokeWidth="2.5" />
      <g style={{ animation: 'childJumpJoy 0.9s ease-in-out infinite' }}>
        <CuteCharacter cx={36} cy={39} r={17} shirtColor="#EC4899" mood="excited" />
        <path d="M60 24 C57 19, 50 20, 50 26 C50 31, 60 37, 60 37 C60 37, 70 31, 70 26 C70 20, 63 19, 60 24 Z" fill="#FF6B6B" stroke="#3D352E" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

/** 16. '배고파요' (hungry), 17. '아파요' (sick), 18. '졸려요' (sleepy) */
export function HungryScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="배고파요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2.5" />
      <CuteCharacter cx={34} cy={38} r={16.5} shirtColor="#F59E0B" mood="hungry" />
      <g style={{ animation: 'handsGiveAndTake 1.05s ease-in-out infinite' }}>
        <circle cx="59" cy="26" r="11" fill="#FFFFFF" stroke="#3D352E" strokeWidth="1.8" strokeDasharray="3 2" />
        <path d="M52 28 H66 L64 33 H54 Z" fill="#54A0FF" stroke="#3D352E" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

export function SickScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="아파요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF5F5" stroke="#FFA8A8" strokeWidth="2.5" />
      <g style={{ animation: 'headAndHandShakeNo 0.8s ease-in-out infinite' }}>
        <CuteCharacter cx={38} cy={39} r={17.5} shirtColor="#A29BFE" mood="sick" showBandage={true} />
        <path d="M62 16 L65 22 L71 20 L67 26 L70 31 L64 29 L61 35 L60 28 L55 25 L60 22 Z" fill="#FF5252" stroke="#3D352E" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

export function SleepyScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="졸려요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2.5" />
      <CuteCharacter cx={35} cy={40} r={17} shirtColor="#6366F1" mood="sleepy" />
      <g style={{ animation: 'takeOutUp 1.4s ease-in-out infinite' }}>
        <text x="58" y="26" fontSize="14" fontWeight="900" fill="#4F46E5" textAnchor="middle">Zzz</text>
      </g>
    </svg>
  );
}
