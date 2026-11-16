import React from 'react';
import { AacCard } from '../../types/aac';

/**
 * @description DailyActionScenes 컴포넌트의 Props 인터페이스
 */
export interface ActionSceneSubProps {
  readonly nounCard: AacCard;
  readonly verbCard: AacCard;
}

/**
 * @description [HR-01, HR-03, HR-05] 과자봉지 뜯기, 빨대 꽂기, 주스 붓기, 가위 자르기, 문 열기·닫기,
 * 머리 빗기, 옷 입기·벗기, 휴지 닦기, 쓰레기통 버리기 등 일상·도구 동작을 겹침 없이 하나의 일체형 그림으로 렌더링하는 컴포넌트
 * @param {ActionSceneSubProps} props 선택된 명사 및 동사 카드
 * @returns {React.ReactElement | null} 해당 동작의 일체형 SVG 그룹 엘리먼트
 */
export function DailyActionScenes({ nounCard, verbCard }: ActionSceneSubProps): React.ReactElement | null {
  const vId = verbCard.id;

  // 1. 과자봉지 뜯어요 (verb-tear): 실제 과자봉지 윗부분을 양손이 잡고 양옆으로 쫙 찢어 안에서 과자가 나오는 일체형 장면
  if (vId === 'verb-tear' || verbCard.motionType === 'tearing' && vId !== 'verb-cut') {
    return (
      <g>
        {/* 과자봉지 아랫몸통 */}
        <path d="M32 54 L88 54 L84 96 Q60 100 36 96 Z" fill="#FF9F43" stroke="#E67E22" strokeWidth="2.5" />
        <rect x="40" y="66" width="40" height="18" rx="6" fill="#FFF8EC" />
        <text x="60" y="79" fontSize="11" fontWeight="800" fill="#D35400" textAnchor="middle">SNACK</text>
        {/* 봉지 안에서 올라오는 과자 알맹이들 */}
        <g style={{ animation: 'takeOutUp 1.25s ease-in-out infinite' }}>
          <circle cx="52" cy="48" r="9" fill="#D9822B" stroke="#8C4A08" strokeWidth="1.5" />
          <circle cx="50" cy="46" r="1.5" fill="#5C3004" />
          <circle cx="55" cy="50" r="1.5" fill="#5C3004" />
          <circle cx="68" cy="46" r="9" fill="#E6953E" stroke="#8C4A08" strokeWidth="1.5" />
          <circle cx="67" cy="44" r="1.5" fill="#5C3004" />
          <circle cx="71" cy="48" r="1.5" fill="#5C3004" />
        </g>
        {/* 좌측으로 찢어지는 과자봉지 상단 왼쪽 끝과 왼손 */}
        <g style={{ animation: 'tearLeft 1.25s ease-in-out infinite', transformOrigin: '48px 54px' }}>
          <path d="M32 34 L38 28 L44 34 L50 28 L58 34 L54 54 L32 54 Z" fill="#FFBE76" stroke="#E67E22" strokeWidth="2" />
          <circle cx="28" cy="44" r="8" fill="#FFCC99" stroke="#D49B6A" strokeWidth="1.5" />
        </g>
        {/* 우측으로 찢어지는 과자봉지 상단 오른쪽 끝과 오른손 */}
        <g style={{ animation: 'tearRight 1.25s ease-in-out infinite', transformOrigin: '72px 54px' }}>
          <path d="M62 34 L70 28 L76 34 L82 28 L88 34 L88 54 L66 54 Z" fill="#FFBE76" stroke="#E67E22" strokeWidth="2" />
          <circle cx="92" cy="44" r="8" fill="#FFCC99" stroke="#D49B6A" strokeWidth="1.5" />
        </g>
      </g>
    );
  }

  // 2. 빨대 꽂아요 (verb-insert-straw): 주스팩 상단 구멍에 빨대가 위에서 아래로 쏙 꽂히는 일체형 장면
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

  // 3. 주스 부어요 (verb-pour): 주스병이 기울어지며 컵 안으로 주황색 주스가 콸콸 쏟아져 차오르는 장면
  if (vId === 'verb-pour') {
    return (
      <g>
        {/* 아래 투명한 컵과 차오르는 주스 */}
        <path d="M52 64 L56 96 L84 96 L88 64 Z" fill="#EBF8FF" stroke="#54A0FF" strokeWidth="2.5" />
        <path d="M55 76 L57 94 L83 94 L85 76 Z" fill="#FF9F43" style={{ animation: 'mouthOpenClose 1.3s ease-in-out infinite', transformOrigin: '70px 94px' }} />
        {/* 쏟아지는 주스 물줄기 */}
        <path d="M58 44 Q66 56 68 82" stroke="#FF9F43" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="8 4" />
        {/* 기울어지는 주스팩 */}
        <g style={{ animation: 'cupTiltToMouth 1.3s ease-in-out infinite', transformOrigin: '42px 38px' }}>
          <rect x="22" y="24" width="34" height="24" rx="4" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="2" />
          <circle cx="32" cy="22" r="7" fill="#FFCC99" />
        </g>
      </g>
    );
  }

  // 4. 가위로 잘라요 (verb-cut): 색종이가 가위 날의 싹둑싹둑 움직임에 맞춰 반으로 잘리는 장면
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

  // 5. 문 열어요 / 문 닫아요 (verb-open, verb-close): 실제 방문이 문틀에서 열리거나 닫히는 장면
  if (vId === 'verb-open' || vId === 'verb-close') {
    const isClosing = vId === 'verb-close';
    return (
      <g>
        <rect x="32" y="22" width="56" height="76" rx="4" fill="#2C3E50" stroke="#8C4A08" strokeWidth="4" />
        <g style={{ animation: isClosing ? 'boxLidOpenRight 1.3s ease-in-out infinite' : 'boxLidOpenLeft 1.3s ease-in-out infinite', transformOrigin: '34px 60px' }}>
          <rect x="34" y="24" width="48" height="72" rx="2" fill="#E6953E" stroke="#8C4A08" strokeWidth="2.5" />
          <circle cx="72" cy="60" r="4" fill="#FECA57" stroke="#8C4A08" strokeWidth="1.5" />
        </g>
        <path d={isClosing ? 'M88 52 L70 52' : 'M68 52 L88 52'} stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }

  // 6. 머리를 빗어요 (verb-comb): 아이 머리카락을 빗으로 단정하게 빗어 내리는 장면
  if (vId === 'verb-comb') {
    return (
      <g>
        <circle cx="54" cy="64" r="24" fill="#FFE0BD" />
        <path d="M30 58 Q54 26 78 58 Q68 42 54 42 Q40 42 30 58 Z" fill="#3D352E" />
        <circle cx="46" cy="62" r="2.8" fill="#3D352E" />
        <circle cx="62" cy="62" r="2.8" fill="#3D352E" />
        <path d="M48 72 Q54 77 60 72" stroke="#E05A47" strokeWidth="2.5" fill="none" />
        <g style={{ animation: 'putInDown 1.1s ease-in-out infinite' }}>
          <rect x="66" y="28" width="26" height="9" rx="4" fill="#54A0FF" />
          <path d="M70 37 V45 M75 37 V45 M80 37 V45 M85 37 V45 M90 37 V45" stroke="#2E86DE" strokeWidth="2.2" />
        </g>
      </g>
    );
  }

  // 7. 옷 입어요 / 옷 벗어요 (verb-wear, verb-take-off): 아이 몸에 티셔츠가 입혀지거나 위로 벗겨지는 장면
  if (vId === 'verb-wear' || vId === 'verb-take-off') {
    const isTakeOff = vId === 'verb-take-off';
    return (
      <g>
        <circle cx="60" cy="34" r="15" fill="#FFE0BD" />
        <circle cx="55" cy="32" r="2" fill="#3D352E" />
        <circle cx="65" cy="32" r="2" fill="#3D352E" />
        <path d="M55 38 Q60 42 65 38" stroke="#E05A47" strokeWidth="2" fill="none" />
        <rect x="46" y="50" width="28" height="36" rx="8" fill="#FFE0BD" />
        <g style={{ animation: isTakeOff ? 'takeOutUp 1.3s ease-in-out infinite' : 'putInDown 1.3s ease-in-out infinite' }}>
          <path d="M32 54 L46 48 L74 48 L88 54 L82 66 L74 62 L74 88 L46 88 L46 62 L38 66 Z" fill="#54A0FF" stroke="#2E86DE" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // 8. 휴지로 닦아요 (verb-wipe): 얼룩을 하얀 휴지를 쥔 손이 좌우로 문질러 깨끗이 닦는 장면
  if (vId === 'verb-wipe' || vId === 'verb-wash' && nounCard.id === 'noun-tissue') {
    return (
      <g>
        <rect x="22" y="56" width="76" height="34" rx="8" fill="#DFF9FB" stroke="#7ED6DF" strokeWidth="2.5" />
        <circle cx="48" cy="72" r="6" fill="#F0932B" opacity="0.45" />
        <g style={{ animation: 'washScrub 0.85s ease-in-out infinite' }}>
          <rect x="44" y="48" width="32" height="24" rx="6" fill="#FFFFFF" stroke="#B2BEC3" strokeWidth="2" />
          <circle cx="68" cy="46" r="9" fill="#FFCC99" stroke="#D49B6A" strokeWidth="1.5" />
        </g>
        <text x="30" y="48" fontSize="18">✨</text>
      </g>
    );
  }

  // 9. 쓰레기통에 버려요 (verb-throw-away): 손에서 떨어진 쓰레기가 열린 쓰레기통 안으로 쏙 들어가는 장면
  if (vId === 'verb-throw-away') {
    return (
      <g>
        <path d="M38 56 L44 96 L76 96 L82 56 Z" fill="#95A5A6" stroke="#576574" strokeWidth="2.5" />
        <line x1="52" y1="64" x2="54" y2="88" stroke="#576574" strokeWidth="2.5" />
        <line x1="60" y1="64" x2="60" y2="88" stroke="#576574" strokeWidth="2.5" />
        <line x1="68" y1="64" x2="66" y2="88" stroke="#576574" strokeWidth="2.5" />
        <circle cx="38" cy="26" r="8" fill="#FFCC99" />
        <g style={{ animation: 'putInDown 1.15s ease-in-out infinite' }}>
          <circle cx="58" cy="40" r="9" fill="#FFFFFF" stroke="#B2BEC3" strokeWidth="2" />
        </g>
      </g>
    );
  }

  return null;
}
