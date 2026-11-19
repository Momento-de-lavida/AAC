import React from 'react';
import { CuteCharacter } from './scenes/CharacterParts';

/**
 * @description [HR-01, HR-03, HR-05] 일상 요구·섭취·놀이 핵심 동사 5종(주세요, 더 주세요, 먹어요, 마셔요, 하고 싶어요)의
 * 고디테일 캐릭터 벡터 SVG 관절 모션 컴포넌트 모음
 */

/** 1. '주세요' (begging): 귀여운 아동 캐릭터가 두 손을 공손히 모아 내밀고 선물 상자가 손안으로 내려오는 관절 모션 */
export function BeggingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="주세요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#F2FBF7" stroke="#95E1D3" strokeWidth="2.5" />
      <CuteCharacter cx={40} cy={29} r={15.5} shirtColor="#48DBFB" mood="smile" />
      {/* 위에서 두 손으로 내려오는 리본 선물 상자 */}
      <g style={{ animation: 'itemDropToHands 1.2s ease-in-out infinite', transformOrigin: '40px 48px' }}>
        <rect x="30" y="42" width="20" height="15" rx="3" fill="#FF6B6B" stroke="#3D352E" strokeWidth="1.8" />
        <rect x="28" y="39" width="24" height="5" rx="2" fill="#FF8787" stroke="#3D352E" strokeWidth="1.8" />
        <rect x="38" y="39" width="4" height="18" fill="#FECA57" stroke="#3D352E" strokeWidth="1.2" />
      </g>
      {/* 공손히 모아 위아래로 움직이는 두 손바닥 */}
      <g style={{ animation: 'handsGiveAndTake 1.2s ease-in-out infinite' }}>
        <path d="M18 63 C21 53, 32 53, 39 60 L39 68 C29 68, 21 66, 18 63 Z" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" strokeLinejoin="round" />
        <path d="M62 63 C59 53, 48 53, 41 60 L41 68 C51 68, 59 66, 62 63 Z" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** 2. '더 주세요' (more): 접시 위의 간식에 손이 새 간식을 하나 더(+1) 내려놓는 관절 모션 */
export function MoreScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="더 주세요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#F2FBF7" stroke="#95E1D3" strokeWidth="2.5" />
      <CuteCharacter cx={34} cy={29} r={14.5} shirtColor="#10B981" mood="excited" />
      {/* 접시와 첫 번째 쿠키 */}
      <ellipse cx="40" cy="64" rx="26" ry="7" fill="#FFFFFF" stroke="#3D352E" strokeWidth="2" />
      <circle cx="29" cy="59" r="7.5" fill="#F5A65B" stroke="#3D352E" strokeWidth="1.8" />
      <circle cx="27" cy="57" r="1.3" fill="#4A3728" />
      <circle cx="31" cy="60" r="1.3" fill="#4A3728" />
      {/* 손이 두 번째 쿠키를 추가로 놓는 모션 */}
      <g style={{ animation: 'addMoreItem 1.3s ease-in-out infinite' }}>
        <circle cx="49" cy="58" r="7.5" fill="#F5A65B" stroke="#3D352E" strokeWidth="1.8" />
        <circle cx="47" cy="56" r="1.3" fill="#4A3728" />
        <circle cx="51" cy="59" r="1.3" fill="#4A3728" />
        <circle cx="56" cy="46" r="6" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
        <circle cx="61" cy="23" r="10" fill="#2E9E6B" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M61 18 V28 M56 23 H66" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 3. '먹어요' (eating): 턱받이를 한 아이가 입을 아~ 벌리고 음식이 담긴 숟가락이 입안으로 들어가는 관절 모션 */
export function EatingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="먹어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFFDF7" stroke="#FFD8A8" strokeWidth="2.5" />
      <CuteCharacter cx={36} cy={35} r={18} shirtColor="#FF9F43" mood="eating" showBib={true} />
      {/* 식탁 위 밥그릇 */}
      <path d="M16 64 H38 L35 73 H19 Z" fill="#54A0FF" stroke="#3D352E" strokeWidth="1.8" strokeLinejoin="round" />
      {/* 입으로 쏙 들어가는 숟가락과 손 */}
      <g style={{ animation: 'spoonToMouth 1.15s ease-in-out infinite', transformOrigin: '48px 50px' }}>
        <path d="M44 45 L66 57" stroke="#B2BEC3" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="42" cy="44" rx="6.5" ry="4" fill="#DFE6E9" stroke="#3D352E" strokeWidth="1.8" transform="rotate(-12 42 44)" />
        <path d="M37 43 C38 37, 46 37, 47 43 Z" fill="#FFFFFF" stroke="#3D352E" strokeWidth="1.5" />
        <circle cx="42" cy="40" r="1.8" fill="#FF6B6B" />
        <circle cx="59" cy="53" r="5.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** 4. '마셔요' (drinking): 아이 입 쪽으로 빨대 컵이 기울어지며 꿀꺽 마시는 관절 모션 */
export function DrinkingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="마셔요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#EBF8FF" stroke="#90CDF4" strokeWidth="2.5" />
      <CuteCharacter cx={33} cy={36} r={17.5} shirtColor="#54A0FF" mood="drinking" />
      {/* 기울어지는 물컵과 빨대, 컵을 쥔 손 */}
      <g style={{ animation: 'cupTiltToMouth 1.25s ease-in-out infinite', transformOrigin: '46px 46px' }}>
        <path d="M46 43 L37 42" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
        <rect x="45" y="38" width="16" height="21" rx="3" fill="#FFFFFF" stroke="#3D352E" strokeWidth="2" />
        <rect x="47" y="45" width="12" height="12" rx="1.5" fill="#48DBFB" />
        <circle cx="61" cy="49" r="5.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** 5. '하고 싶어요' (playing): 아이가 양팔을 번쩍 들고 점프하며 놀이 공이 함께 통통 튀는 관절 모션 */
export function PlayingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="하고 싶어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF8EC" stroke="#FFD8A8" strokeWidth="2.5" />
      <g style={{ animation: 'childJumpJoy 0.9s ease-in-out infinite' }}>
        <CuteCharacter cx={33} cy={35} r={15.5} shirtColor="#FF8E6E" mood="excited" />
        <path d="M19 46 L11 32 M47 46 L55 32" stroke="#FFE0BD" strokeWidth="5" strokeLinecap="round" />
        <circle cx="11" cy="32" r="4" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.6" />
        <circle cx="55" cy="32" r="4" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.6" />
      </g>
      <g style={{ animation: 'ballBounceJoy 0.9s ease-in-out infinite', transformOrigin: '60px 56px' }}>
        <circle cx="60" cy="52" r="10" fill="#54A0FF" stroke="#3D352E" strokeWidth="2" />
        <path d="M51 52 Q60 45 69 52" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}
