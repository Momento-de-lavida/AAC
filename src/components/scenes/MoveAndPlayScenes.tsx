import React from 'react';
import { CuteCharacter } from './CharacterParts';
import { ActionSceneSubProps } from './DailyActionScenes';

/**
 * @description [HR-01, HR-03, HR-05] 의자 앉기·일어나기, 매트 눕기, (안으로) 들어가기, 계단 오르내리기,
 * 자동차·그네에서 내리기, 손으로 사람·그네 밀기, 공 굴리기·던지기, 손·물건 잡기/놓기, 손 치우기, 노래 부르기·듣기 관절 모션
 * @param {ActionSceneSubProps} props 선택된 명사 및 동사 카드
 * @returns {React.ReactElement | null} 해당 동작의 일체형 SVG 그룹 엘리먼트
 */
export function MoveAndPlayScenes({ verbCard }: ActionSceneSubProps): React.ReactElement | null {
  const vId = verbCard.id;

  if (vId === 'verb-sit' || vId === 'verb-stand') {
    const isStanding = vId === 'verb-stand';
    return (
      <g>
        <path d="M28 42 V92 M28 70 H58 V92" stroke="#A0522D" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g style={{ animation: isStanding ? 'takeOutUp 1.25s ease-in-out infinite' : 'putInDown 1.25s ease-in-out infinite' }}>
          <CuteCharacter cx={54} cy={38} r={14} shirtColor={isStanding ? '#54A0FF' : '#10B981'} mood="smile" />
          <path d={isStanding ? 'M49 66 L49 90 M59 66 L61 90' : 'M48 64 L68 64 L68 88'} stroke="#3D352E" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-lie-down') {
    return (
      <g>
        <rect x="18" y="72" width="84" height="16" rx="8" fill="#74B9FF" stroke="#3D352E" strokeWidth="2.5" />
        <ellipse cx="34" cy="67" rx="13" ry="6.5" fill="#FFF8EC" stroke="#3D352E" strokeWidth="2" />
        <g style={{ animation: 'handsGiveAndTake 1.4s ease-in-out infinite' }}>
          <CuteCharacter cx={38} cy={52} r={13.5} shirtColor="#FF9F43" mood="sleepy" />
          <rect x="48" y="56" width="32" height="15" rx="7" fill="#FF9F43" stroke="#3D352E" strokeWidth="2.2" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-enter') {
    return (
      <g>
        <polygon points="74,20 34,90 108,90" fill="#FF9F43" stroke="#3D352E" strokeWidth="2.5" />
        <polygon points="74,42 54,90 92,90" fill="#2C3E50" stroke="#3D352E" strokeWidth="2" />
        <path d="M18 32 H48 M41 25 L49 32 L41 39" stroke="#2E9E6B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g style={{ animation: 'walkForward 1.25s ease-in-out infinite' }}>
          <CuteCharacter cx={40} cy={54} r={13} shirtColor="#10B981" mood="smile" />
          <path d="M36 80 L33 92 M44 80 L47 92" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-go-up' || vId === 'verb-go-down') {
    const isUp = vId === 'verb-go-up';
    return (
      <g>
        <path d={isUp ? 'M20 92 H44 V72 H68 V52 H96 V92 Z' : 'M20 52 H48 V72 H72 V92 H96 V96 H20 Z'} fill="#DFE6E9" stroke="#3D352E" strokeWidth="2.5" />
        <g style={{ animation: isUp ? 'takeOutUp 1.25s ease-in-out infinite' : 'putInDown 1.25s ease-in-out infinite' }}>
          <CuteCharacter cx={56} cy={34} r={13} shirtColor={isUp ? '#54A0FF' : '#FF9F43'} mood="excited" />
          <path d="M52 60 L48 72 M60 60 L64 70" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-get-off') {
    return (
      <g>
        <path d="M12 54 L20 38 H50 L56 54 H60 V76 H12 Z" fill="#54A0FF" stroke="#3D352E" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="24" y="42" width="22" height="30" rx="3" fill="#2C3E50" />
        <circle cx="24" cy="78" r="7" fill="#3D352E" /><circle cx="48" cy="78" r="7" fill="#3D352E" />
        <line x1="82" y1="14" x2="82" y2="36" stroke="#576574" strokeWidth="2.2" />
        <line x1="98" y1="14" x2="98" y2="36" stroke="#576574" strokeWidth="2.2" />
        <rect x="78" y="35" width="24" height="5" rx="2.5" fill="#FF9F43" stroke="#3D352E" strokeWidth="1.8" />
        <g style={{ animation: 'putInDown 1.2s ease-in-out infinite' }}>
          <CuteCharacter cx={68} cy={48} r={13} shirtColor="#FF6B6B" mood="smile" />
          <path d="M64 74 L60 90 M72 74 L77 90" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d="M92 50 V74 M85 67 L92 74 L99 67" stroke="#2E9E6B" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    );
  }
  if (vId === 'verb-push') {
    return (
      <g>
        <CuteCharacter cx={28} cy={48} r={13} shirtColor="#10B981" mood="smile" />
        <g style={{ animation: 'handReachDown 1.1s ease-in-out infinite' }}>
          <path d="M38 56 H56 M38 64 H56" stroke="#FFE0BD" strokeWidth="6" strokeLinecap="round" />
          <circle cx="57" cy="56" r="4.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
          <circle cx="57" cy="64" r="4.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
        </g>
        <line x1="56" y1="14" x2="98" y2="14" stroke="#EE5253" strokeWidth="5" strokeLinecap="round" />
        <g style={{ animation: 'walkForward 1.1s ease-in-out infinite' }}>
          <line x1="78" y1="16" x2="78" y2="68" stroke="#3D352E" strokeWidth="2.8" />
          <CuteCharacter cx={78} cy={44} r={12} shirtColor="#54A0FF" mood="excited" />
          <rect x="64" y="66" width="28" height="6" rx="3" fill="#FF9F43" stroke="#3D352E" strokeWidth="2" />
          <path d="M92 34 H106 M101 29 L106 34 L101 39" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-roll' || vId === 'verb-throw') {
    const isRoll = vId === 'verb-roll';
    return (
      <g>
        {isRoll && <line x1="18" y1="88" x2="102" y2="88" stroke="#2E9E6B" strokeWidth="4" strokeLinecap="round" />}
        <CuteCharacter cx={32} cy={isRoll ? 52 : 46} r={14} shirtColor={isRoll ? '#10B981' : '#54A0FF'} mood="excited" />
        <g style={{ animation: isRoll ? 'walkForward 1.1s linear infinite' : 'spoonToMouth 1.1s ease-in-out infinite' }}>
          <circle cx="76" cy={isRoll ? 74 : 38} r="13" fill={isRoll ? '#FF9F43' : '#FF6B6B'} stroke="#3D352E" strokeWidth="2.2" />
          <path d={isRoll ? 'M64 74 H88 M76 62 V86' : 'M64 38 H88 M76 26 V50'} stroke="#FFFFFF" strokeWidth="2" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-hold-hand') {
    return (
      <g>
        <circle cx="60" cy="64" r="14" fill="#54A0FF" stroke="#3D352E" strokeWidth="2.3" />
        <g style={{ animation: 'handReachDown 1.05s ease-in-out infinite' }}>
          <path d="M16 58 H44 C50 58, 52 64, 46 68 L48 74 H16 Z" fill="#FFCC99" stroke="#3D352E" strokeWidth="2.3" strokeLinejoin="round" />
          <circle cx="48" cy="55" r="4" fill="#FFCC99" stroke="#3D352E" strokeWidth="1.8" />
          <circle cx="51" cy="62" r="4" fill="#FFCC99" stroke="#3D352E" strokeWidth="1.8" />
          <circle cx="49" cy="69" r="4" fill="#FFCC99" stroke="#3D352E" strokeWidth="1.8" />
        </g>
        <g style={{ animation: 'handReachUp 1.05s ease-in-out infinite' }}>
          <path d="M104 58 H76 C70 58, 68 64, 74 68 L72 74 H104 Z" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.3" strokeLinejoin="round" />
          <circle cx="72" cy="55" r="4" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
          <circle cx="69" cy="62" r="4" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
          <circle cx="71" cy="69" r="4" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
        </g>
        <path d="M60 28 C56 22, 47 24, 47 32 C47 39, 60 46, 60 46 C60 46, 73 39, 73 32 C73 24, 64 22, 60 28 Z" fill="#FF6B6B" stroke="#3D352E" strokeWidth="2" />
      </g>
    );
  }
  if (vId === 'verb-let-go') {
    return (
      <g>
        <circle cx="60" cy="74" r="12" fill="#FF9F43" stroke="#3D352E" strokeWidth="2.2" />
        <g style={{ animation: 'tearLeft 1.1s ease-in-out infinite' }}>
          <circle cx="34" cy="58" r="11" fill="#FFCC99" stroke="#3D352E" strokeWidth="2.2" />
          <path d="M30 48 V38 M35 47 V36 M40 49 V39 M44 53 L50 45" stroke="#FFCC99" strokeWidth="4.5" strokeLinecap="round" />
        </g>
        <g style={{ animation: 'tearRight 1.1s ease-in-out infinite' }}>
          <circle cx="86" cy="58" r="11" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.2" />
          <path d="M90 48 V38 M85 47 V36 M80 49 V39 M76 53 L70 45" stroke="#FFE0BD" strokeWidth="4.5" strokeLinecap="round" />
        </g>
        <path d="M48 28 H32 M38 23 L32 28 L38 33 M72 28 H88 M82 23 L88 28 L82 33" stroke="#E05A47" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    );
  }
  if (vId === 'verb-move-away') {
    return (
      <g>
        <CuteCharacter cx={34} cy={52} r={16} shirtColor="#54A0FF" mood="refuse" />
        <g style={{ animation: 'walkForward 1.1s ease-in-out infinite' }}>
          <rect x="52" y="44" width="13" height="22" rx="6" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.2" />
          <rect x="72" y="48" width="26" height="18" rx="8" fill="#FFCC99" stroke="#3D352E" strokeWidth="2.2" />
          <path d="M56 28 H94 M87 22 L94 28 L87 34" stroke="#E67E22" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
    );
  }
  if (vId === 'verb-sing' || vId === 'verb-listen') {
    const isSing = vId === 'verb-sing';
    return (
      <g>
        <CuteCharacter cx={54} cy={60} r={22} shirtColor={isSing ? '#FF8E6E' : '#54A0FF'} mood={isSing ? 'eating' : 'excited'} />
        {!isSing && (
          <g>
            <path d="M28 58 A26 26 0 0 1 80 58" stroke="#2E86DE" strokeWidth="6.5" fill="none" />
            <rect x="22" y="50" width="10" height="20" rx="5" fill="#FF6B6B" stroke="#3D352E" strokeWidth="2.2" />
            <rect x="76" y="50" width="10" height="20" rx="5" fill="#FF6B6B" stroke="#3D352E" strokeWidth="2.2" />
            <g style={{ animation: 'childJumpJoy 0.9s ease-in-out infinite' }}>
              <circle cx="18" cy="34" r="4.5" fill="#8B5CF6" />
              <path d="M22 34 V20 L30 22 V27 L22 25" fill="#8B5CF6" />
              <circle cx="92" cy="34" r="4.5" fill="#EC4899" />
              <path d="M96 34 V20 L104 22 V27 L96 25" fill="#EC4899" />
            </g>
          </g>
        )}
        {isSing && (
          <g transform="rotate(-22 76 72)">
            <rect x="72" y="68" width="8" height="20" rx="3" fill="#576574" stroke="#3D352E" strokeWidth="2" />
            <circle cx="76" cy="63" r="7.5" fill="#B2BEC3" stroke="#3D352E" strokeWidth="2" />
          </g>
        )}
      </g>
    );
  }
  return null;
}
