import React from 'react';
import { AacCard } from '../../types/aac';

/**
 * @description DailyActionScenes 컴포넌트의 Props 인터페이스
 */
export interface ActionSceneSubProps {
  readonly nounCard?: AacCard;
  readonly verbCard: AacCard;
}

/**
 * @description [HR-01, HR-03, HR-05] 손 씻기(수도꼭지+물줄기+비누거품), 과자봉지 뜯기, 빨대 꽂기, 주스 붓기,
 * 가위 자르기, 문 열기·닫기, 머리 빗기, 옷 입기·벗기, 신발 신기, 휴지 닦기, 쓰레기통 버리기 SVG 컴포넌트
 * @param {ActionSceneSubProps} props 선택된 명사 및 동사 카드
 * @returns {React.ReactElement | null} 해당 동작의 일체형 SVG 그룹 엘리먼트
 */
export function DailyActionScenes({ verbCard }: ActionSceneSubProps): React.ReactElement | null {
  const vId = verbCard.id;

  if (vId === 'verb-wash') {
    return (
      <g>
        <path d="M26 22 H56 Q64 22 64 30 V36" stroke="#7F8C8D" strokeWidth="7" strokeLinecap="round" fill="none" />
        <rect x="40" y="14" width="12" height="5" rx="2" fill="#3498DB" />
        <path d="M60 38 V62 M64 38 V66 M68 38 V62" stroke="#54A0FF" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 3" />
        <g style={{ animation: 'washScrub 0.85s ease-in-out infinite' }}>
          <ellipse cx="48" cy="76" rx="18" ry="10" fill="#FFCC99" stroke="#D49B6A" strokeWidth="2" transform="rotate(-12 48 76)" />
          <ellipse cx="68" cy="78" rx="18" ry="10" fill="#FFE0BD" stroke="#D49B6A" strokeWidth="2" transform="rotate(12 68 78)" />
          <rect x="50" y="68" width="18" height="11" rx="5" fill="#FF8E6E" stroke="#E05A47" strokeWidth="1.5" />
          <circle cx="42" cy="66" r="6" fill="#FFFFFF" stroke="#74B9FF" strokeWidth="2" />
          <circle cx="56" cy="62" r="7.5" fill="#FFFFFF" stroke="#74B9FF" strokeWidth="2" />
          <circle cx="70" cy="65" r="6.5" fill="#FFFFFF" stroke="#74B9FF" strokeWidth="2" />
        </g>
      </g>
    );
  }

  if (vId === 'verb-tear') {
    return (
      <g>
        <path d="M32 54 L88 54 L84 96 Q60 100 36 96 Z" fill="#FF9F43" stroke="#E67E22" strokeWidth="2.5" />
        <rect x="40" y="66" width="40" height="18" rx="6" fill="#FFF8EC" />
        <text x="60" y="79" fontSize="11" fontWeight="800" fill="#D35400" textAnchor="middle">SNACK</text>
        <g style={{ animation: 'takeOutUp 1.25s ease-in-out infinite' }}>
          <circle cx="52" cy="48" r="9" fill="#D9822B" stroke="#8C4A08" strokeWidth="1.5" />
          <circle cx="68" cy="46" r="9" fill="#E6953E" stroke="#8C4A08" strokeWidth="1.5" />
        </g>
        <g style={{ animation: 'tearLeft 1.25s ease-in-out infinite', transformOrigin: '48px 54px' }}>
          <path d="M32 34 L38 28 L44 34 L50 28 L58 34 L54 54 L32 54 Z" fill="#FFBE76" stroke="#E67E22" strokeWidth="2" />
          <circle cx="28" cy="44" r="8" fill="#FFCC99" stroke="#D49B6A" strokeWidth="1.5" />
        </g>
        <g style={{ animation: 'tearRight 1.25s ease-in-out infinite', transformOrigin: '72px 54px' }}>
          <path d="M62 34 L70 28 L76 34 L82 28 L88 34 L88 54 L66 54 Z" fill="#FFBE76" stroke="#E67E22" strokeWidth="2" />
          <circle cx="92" cy="44" r="8" fill="#FFCC99" stroke="#D49B6A" strokeWidth="1.5" />
        </g>
      </g>
    );
  }

  if (vId === 'verb-insert-straw') {
    return (
      <g>
        <rect x="38" y="52" width="44" height="46" rx="6" fill="#FF9F43" stroke="#E67E22" strokeWidth="2.5" />
        <rect x="44" y="64" width="32" height="22" rx="4" fill="#FFF8EC" />
        <text x="60" y="79" fontSize="14" textAnchor="middle">🍊</text>
        <ellipse cx="60" cy="52" rx="6" ry="2.5" fill="#8C4A08" />
        <g style={{ animation: 'putInDown 1.2s ease-in-out infinite' }}>
          <path d="M60 52 L60 22 L74 16" stroke="#EE5253" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="68" cy="24" r="7" fill="#FFCC99" />
        </g>
      </g>
    );
  }

  if (vId === 'verb-pour') {
    return (
      <g>
        <path d="M52 64 L56 96 L84 96 L88 64 Z" fill="#EBF8FF" stroke="#54A0FF" strokeWidth="2.5" />
        <path d="M55 76 L57 94 L83 94 L85 76 Z" fill="#FF9F43" style={{ animation: 'mouthOpenClose 1.3s ease-in-out infinite', transformOrigin: '70px 94px' }} />
        <path d="M58 44 Q66 56 68 82" stroke="#FF9F43" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="8 4" />
        <g style={{ animation: 'cupTiltToMouth 1.3s ease-in-out infinite', transformOrigin: '42px 38px' }}>
          <rect x="22" y="24" width="34" height="24" rx="4" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="2" />
          <circle cx="32" cy="22" r="7" fill="#FFCC99" />
        </g>
      </g>
    );
  }

  // 5. 가위로 잘라요 (verb-cut): 색종이가 가위 날의 싹둑싹둑 움직임에 맞춰 반으로 잘리는 장면
  if (vId === 'verb-cut') {
    return (
      <g>
        <g style={{ animation: 'tearLeft 1.2s ease-in-out infinite', transformOrigin: '58px 50px' }}>
          <rect x="26" y="28" width="32" height="38" rx="3" fill="#74B9FF" stroke="#0984E3" strokeWidth="2" />
        </g>
        <g style={{ animation: 'tearRight 1.2s ease-in-out infinite', transformOrigin: '62px 50px' }}>
          <rect x="62" y="28" width="32" height="38" rx="3" fill="#74B9FF" stroke="#0984E3" strokeWidth="2" />
        </g>
        <line x1="60" y1="24" x2="60" y2="70" stroke="#636E72" strokeWidth="2" strokeDasharray="4 3" />
        <g style={{ animation: 'childJumpJoy 0.7s ease-in-out infinite' }}>
          <line x1="60" y1="54" x2="46" y2="86" stroke="#B2BEC3" strokeWidth="5" strokeLinecap="round" />
          <line x1="60" y1="54" x2="74" y2="86" stroke="#B2BEC3" strokeWidth="5" strokeLinecap="round" />
          <circle cx="44" cy="90" r="8" fill="none" stroke="#EE5253" strokeWidth="4" />
          <circle cx="76" cy="90" r="8" fill="none" stroke="#EE5253" strokeWidth="4" />
        </g>
      </g>
    );
  }

  // 6. 문 열어요 / 문 닫아요 (verb-open, verb-close): 방문이 활짝 열리거나 닫히는 장면
  if (vId === 'verb-open' || vId === 'verb-close') {
    const isClosing = vId === 'verb-close';
    return (
      <g>
        <rect x="30" y="20" width="56" height="76" rx="4" fill={isClosing ? '#34495E' : '#FFF9DB'} stroke="#8C4A08" strokeWidth="4" />
        <g style={{ animation: isClosing ? 'boxLidOpenRight 1.3s ease-in-out infinite' : 'boxLidOpenLeft 1.3s ease-in-out infinite', transformOrigin: '32px 58px' }}>
          <rect x="32" y="22" width="48" height="72" rx="2" fill={isClosing ? '#C0392B' : '#E6953E'} stroke="#8C4A08" strokeWidth="2.5" />
          <circle cx="70" cy="58" r="4.5" fill="#FECA57" stroke="#8C4A08" strokeWidth="1.5" />
        </g>
        <text x="86" y="42" fontSize="20">{isClosing ? '🔒' : '🔓'}</text>
      </g>
    );
  }

  // 7. 머리를 빗어요 (verb-comb): 아이 머리카락을 빗으로 빗어 내리는 장면
  if (vId === 'verb-comb') {
    return (
      <g>
        <circle cx="54" cy="64" r="24" fill="#FFE0BD" />
        <path d="M30 58 Q54 26 78 58 Q68 42 54 42 Q40 42 30 58 Z" fill="#3D352E" />
        <circle cx="46" cy="62" r="2.8" fill="#3D352E" />
        <circle cx="62" cy="62" r="2.8" fill="#3D352E" />
        <path d="M48 72 Q54 77 60 72" stroke="#E05A47" strokeWidth="2.5" fill="none" />
        <g style={{ animation: 'putInDown 1.1s ease-in-out infinite' }}>
          <rect x="64" y="28" width="28" height="9" rx="4" fill="#54A0FF" />
          <path d="M68 37 V45 M73 37 V45 M78 37 V45 M83 37 V45 M88 37 V45" stroke="#2E86DE" strokeWidth="2.2" />
        </g>
      </g>
    );
  }

  // 8. 옷 입어요 / 옷 벗어요 (verb-wear, verb-take-off)
  if (vId === 'verb-wear' || vId === 'verb-take-off') {
    const isTakeOff = vId === 'verb-take-off';
    return (
      <g>
        <circle cx="60" cy="34" r="14" fill="#FFE0BD" />
        <rect x="46" y="48" width="28" height="36" rx="8" fill="#FFE0BD" />
        <g style={{ animation: isTakeOff ? 'takeOutUp 1.3s ease-in-out infinite' : 'putInDown 1.3s ease-in-out infinite' }}>
          <path d="M32 54 L46 48 L74 48 L88 54 L82 66 L74 62 L74 88 L46 88 L46 62 L38 66 Z" fill={isTakeOff ? '#FF9F43' : '#54A0FF'} stroke="#2C3E50" strokeWidth="2" />
          <text x="60" y="72" fontSize="16" textAnchor="middle">{isTakeOff ? '⬆️' : '⬇️'}</text>
        </g>
      </g>
    );
  }

  // 9. 신발 신어요 (verb-shoes-on): 아이의 발이 운동화 속으로 들어가는 장면
  if (vId === 'verb-shoes-on') {
    return (
      <g>
        <path d="M32 72 H72 Q88 72 88 84 V90 H32 Z" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="2.5" />
        <rect x="32" y="88" width="56" height="6" rx="3" fill="#FFFFFF" stroke="#B2BEC3" strokeWidth="1.5" />
        <g style={{ animation: 'putInDown 1.2s ease-in-out infinite' }}>
          <rect x="42" y="26" width="16" height="30" rx="6" fill="#FFE0BD" />
          <path d="M40 52 H64 Q70 52 70 62 H40 Z" fill="#FFFFFF" stroke="#74B9FF" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // 10. 휴지로 닦아요 (verb-wipe) & 11. 쓰레기통에 버려요 (verb-throw-away)
  if (vId === 'verb-wipe') {
    return (
      <g>
        <rect x="20" y="58" width="80" height="32" rx="8" fill="#DFF9FB" stroke="#7ED6DF" strokeWidth="2.5" />
        <circle cx="46" cy="74" r="7" fill="#A0522D" opacity="0.5" />
        <g style={{ animation: 'washScrub 0.85s ease-in-out infinite' }}>
          <rect x="44" y="48" width="32" height="24" rx="6" fill="#FFFFFF" stroke="#B2BEC3" strokeWidth="2" />
          <circle cx="68" cy="46" r="9" fill="#FFCC99" stroke="#D49B6A" strokeWidth="1.5" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-throw-away') {
    return (
      <g>
        <path d="M38 56 L44 96 L76 96 L82 56 Z" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
        <line x1="52" y1="64" x2="54" y2="88" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="68" y1="64" x2="66" y2="88" stroke="#FFFFFF" strokeWidth="2.5" />
        <g style={{ animation: 'putInDown 1.15s ease-in-out infinite' }}>
          <circle cx="58" cy="40" r="9" fill="#FFFFFF" stroke="#B2BEC3" strokeWidth="2" />
        </g>
      </g>
    );
  }
  return null;
}
