import React from 'react';
import { CuteCharacter } from './scenes/CharacterParts';

/**
 * @description [HR-01, HR-03, HR-05] 고빈도 이동·도구·착탈의·위생·시각 동사 8종(타요, 꺼내요, 뜯어요, 가요, 넣어요, 입어요, 씻어요, 봐요)의
 * 고디테일 캐릭터 벡터 SVG 관절 모션 컴포넌트 모음
 */

/** 10. '타요' (riding): 캐릭터가 바퀴 달린 탈것에 올라타 앞으로 달리는 관절 모션 */
export function RidingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="타요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#EBF8FF" stroke="#90CDF4" strokeWidth="2.5" />
      <g style={{ animation: 'rideMove 0.95s ease-in-out infinite' }}>
        <CuteCharacter cx={38} cy={27} r={13} shirtColor="#FF9F43" mood="excited" />
        <rect x="16" y="40" width="46" height="17" rx="7" fill="#54A0FF" stroke="#3D352E" strokeWidth="2.2" />
        <circle cx="27" cy="59" r="7" fill="#3D352E" />
        <circle cx="27" cy="59" r="3" fill="#FFFFFF" />
        <circle cx="51" cy="59" r="7" fill="#3D352E" />
        <circle cx="51" cy="59" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/** 11. '꺼내요' (takingOut): 상자 안에서 밖(위쪽)으로 물건을 손으로 들어 꺼내는 관절 모션 */
export function TakingOutScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="꺼내요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF8EC" stroke="#FFD8A8" strokeWidth="2.5" />
      <rect x="18" y="44" width="44" height="22" rx="3" fill="#F5A65B" stroke="#3D352E" strokeWidth="2" />
      <g style={{ animation: 'takeOutUp 1.3s ease-in-out infinite' }}>
        <path d="M40 12 L33 20 H38 V28 H42 V20 H47 Z" fill="#2E9E6B" stroke="#3D352E" strokeWidth="1.2" />
        <circle cx="40" cy="36" r="9" fill="#FF6B6B" stroke="#3D352E" strokeWidth="2" />
        <circle cx="49" cy="38" r="5.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
      </g>
      <rect x="18" y="50" width="44" height="16" rx="2.5" fill="#FFBE76" stroke="#3D352E" strokeWidth="2" />
    </svg>
  );
}

/** 12. '뜯어요' (tearing): 양손으로 과자 봉지 양끝을 잡고 좌우로 쫙 뜯는 관절 모션 */
export function TearingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="뜯어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF0F6" stroke="#FBCFE8" strokeWidth="2.5" />
      <circle cx="40" cy="42" r="9" fill="#F5A65B" stroke="#3D352E" strokeWidth="2" />
      <g style={{ animation: 'tearLeft 1.2s ease-in-out infinite', transformOrigin: '38px 52px' }}>
        <path d="M20 26 L39 30 L38 56 L20 56 Z" fill="#FF8E6E" stroke="#3D352E" strokeWidth="2" />
        <circle cx="18" cy="41" r="6" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
      </g>
      <g style={{ animation: 'tearRight 1.2s ease-in-out infinite', transformOrigin: '42px 52px' }}>
        <path d="M41 30 L60 26 L60 56 L42 56 Z" fill="#FF8E6E" stroke="#3D352E" strokeWidth="2" />
        <circle cx="62" cy="41" r="6" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** 13. '가요' (going): 목적지(집)를 향해 캐릭터가 앞으로 씩씩하게 걸어가는 관절 모션 */
export function GoingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="가요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#E8F8F0" stroke="#95E1D3" strokeWidth="2.5" />
      <polygon points="60,24 48,35 72,35" fill="#FF6B6B" stroke="#3D352E" strokeWidth="1.8" />
      <rect x="51" y="35" width="18" height="18" fill="#FFFFFF" stroke="#3D352E" strokeWidth="1.8" />
      <g style={{ animation: 'walkForward 1.25s linear infinite' }}>
        <CuteCharacter cx={26} cy={31} r={12} shirtColor="#2E9E6B" mood="smile" />
        <path d="M22 55 L18 65 M30 55 L34 65" stroke="#3D352E" strokeWidth="3.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 14. '넣어요' (puttingIn): 바구니/상자 안으로 물건을 위에서 아래로 집어넣는 관절 모션 */
export function PuttingInScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="넣어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#F0F4FF" stroke="#C7D2FE" strokeWidth="2.5" />
      <rect x="18" y="46" width="44" height="20" rx="3" fill="#74B9FF" stroke="#3D352E" strokeWidth="2" />
      <g style={{ animation: 'putInDown 1.3s ease-in-out infinite' }}>
        <path d="M40 28 L33 20 H38 V12 H42 V20 H47 Z" fill="#0984E3" stroke="#3D352E" strokeWidth="1.2" />
        <circle cx="40" cy="36" r="8.5" fill="#FFC312" stroke="#3D352E" strokeWidth="2" />
      </g>
      <rect x="18" y="52" width="44" height="14" rx="2.5" fill="#A3CBFF" stroke="#3D352E" strokeWidth="2" />
    </svg>
  );
}

/** 15. '입어요' (wearing): 캐릭터 몸쪽으로 옷이 내려오며 착용되는 관절 모션 */
export function WearingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="입어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFF4E6" stroke="#FFD8A8" strokeWidth="2.5" />
      <CuteCharacter cx={40} cy={27} r={13.5} shirtColor="#FFE0BD" mood="smile" />
      <g style={{ animation: 'putInDown 1.25s ease-in-out infinite' }}>
        <path d="M22 40 L31 35 L49 35 L58 40 L53 49 L49 46 L49 64 L31 64 L31 46 L27 49 Z" fill="#FF8E6E" stroke="#3D352E" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** 16. '씻어요' (washing): 수도꼭지 물줄기 아래 두 손을 비누거품으로 문질러 씻는 관절 모션 */
export function WashingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="씻어요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#EBF8FF" stroke="#90CDF4" strokeWidth="2.5" />
      <path d="M18 16 H42 Q48 16 48 22 V27" stroke="#7F8C8D" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M44 29 V45 M48 29 V47 M52 29 V45" stroke="#54A0FF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 2" />
      <g style={{ animation: 'washScrub 0.85s ease-in-out infinite' }}>
        <ellipse cx="34" cy="55" rx="14" ry="8" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
        <ellipse cx="48" cy="57" rx="14" ry="8" fill="#FFCC99" stroke="#3D352E" strokeWidth="2" />
        <rect x="35" y="48" width="12" height="8" rx="4" fill="#FF8E6E" stroke="#3D352E" strokeWidth="1.6" />
        <circle cx="30" cy="46" r="5" fill="#FFFFFF" stroke="#54A0FF" strokeWidth="1.8" />
        <circle cx="42" cy="43" r="6" fill="#FFFFFF" stroke="#54A0FF" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** 17. '봐요' (watching): 캐릭터가 눈앞의 그림책을 초롱초롱 바라보는 관절 모션 */
export function WatchingScene({ size }: { readonly size: number }): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="봐요 실제 동작">
      <rect x="3" y="3" width="74" height="74" rx="20" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2.5" />
      <CuteCharacter cx={28} cy={38} r={15.5} shirtColor="#FF9F43" mood="smile" />
      <path d="M42 36 L53 32 M42 41 L53 45" stroke="#FF9F43" strokeWidth="2.2" strokeDasharray="3 2" />
      <rect x="53" y="28" width="15" height="22" rx="2.5" fill="#54A0FF" stroke="#3D352E" strokeWidth="2" />
    </svg>
  );
}
