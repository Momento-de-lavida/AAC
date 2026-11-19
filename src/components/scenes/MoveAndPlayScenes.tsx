import React from 'react';
import { CuteCharacter } from './CharacterParts';
import { ActionSceneSubProps } from './DailyActionScenes';

/**
 * @description [HR-01, HR-03, HR-05] 의자 앉기·일어나기, 매트 눕기, 텐트 들어가기, 계단 오르내리기,
 * 탈것 내리기, 그네 밀기, 공 굴리기·던지기, 손 잡기·놓기·치우기, 노래 부르기·듣기 등 신체·이동·놀이 동작의
 * 고디테일 캐릭터 벡터 SVG 관절 모션 컴포넌트
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
        <polygon points="70,22 28,88 106,88" fill="#FF9F43" stroke="#3D352E" strokeWidth="2.5" />
        <polygon points="70,44 50,88 88,88" fill="#2C3E50" stroke="#3D352E" strokeWidth="2" />
        <g style={{ animation: 'walkForward 1.3s ease-in-out infinite' }}>
          <CuteCharacter cx={42} cy={52} r={13} shirtColor="#10B981" mood="smile" />
          <path d="M38 78 L35 90 M46 78 L49 90" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
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
        <rect x="18" y="26" width="44" height="62" rx="6" fill="#D0EBFF" stroke="#3D352E" strokeWidth="2.5" />
        <rect x="26" y="34" width="28" height="52" fill="#2C3E50" />
        <g style={{ animation: 'walkForward 1.25s ease-in-out infinite' }}>
          <CuteCharacter cx={70} cy={46} r={13.5} shirtColor="#FF6B6B" mood="smile" />
          <path d="M66 74 L62 90 M74 74 L78 90" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  if (vId === 'verb-push') {
    return (
      <g>
        <line x1="40" y1="16" x2="88" y2="16" stroke="#EE5253" strokeWidth="5.5" strokeLinecap="round" />
        <g style={{ animation: 'walkForward 1.2s ease-in-out infinite' }}>
          <line x1="68" y1="18" x2="68" y2="68" stroke="#3D352E" strokeWidth="3" />
          <CuteCharacter cx={68} cy={44} r={12.5} shirtColor="#54A0FF" mood="excited" />
          <rect x="54" y="66" width="28" height="7" rx="3.5" fill="#FF9F43" stroke="#3D352E" strokeWidth="2" />
        </g>
        <g style={{ animation: 'handReachDown 1.2s ease-in-out infinite' }}>
          <path d="M22 52 H44 M22 62 H44" stroke="#FFE0BD" strokeWidth="7.5" strokeLinecap="round" />
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
        <g style={{ animation: 'handReachDown 1.1s ease-in-out infinite' }}>
          <rect x="20" y="52" width="36" height="18" rx="9" fill="#FFCC99" stroke="#3D352E" strokeWidth="2.2" />
        </g>
        <g style={{ animation: 'handReachUp 1.1s ease-in-out infinite' }}>
          <rect x="64" y="52" width="36" height="18" rx="9" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.2" />
        </g>
        <path d="M60 32 C56 26, 47 28, 47 36 C47 43, 60 50, 60 50 C60 50, 73 43, 73 36 C73 28, 64 26, 60 32 Z" fill="#FF6B6B" stroke="#3D352E" strokeWidth="2" />
      </g>
    );
  }

  if (vId === 'verb-let-go') {
    return (
      <g>
        <g style={{ animation: 'tearLeft 1.15s ease-in-out infinite' }}>
          <rect x="18" y="52" width="30" height="18" rx="9" fill="#FFCC99" stroke="#3D352E" strokeWidth="2.2" />
        </g>
        <g style={{ animation: 'tearRight 1.15s ease-in-out infinite' }}>
          <rect x="72" y="52" width="30" height="18" rx="9" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.2" />
        </g>
        <path d="M52 40 L38 40 M68 40 L82 40" stroke="#3D352E" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    );
  }

  if (vId === 'verb-move-away') {
    return (
      <g>
        <rect x="20" y="76" width="80" height="10" rx="4" fill="#DFE6E9" stroke="#3D352E" strokeWidth="2" />
        <g style={{ animation: 'walkForward 1.15s ease-in-out infinite' }}>
          <ellipse cx="42" cy="60" rx="16" ry="10" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.2" />
          <rect x="64" y="48" width="22" height="24" rx="5" fill="#74B9FF" stroke="#3D352E" strokeWidth="2.2" />
        </g>
        <path d="M36 34 H82 M76 28 L82 34 L76 40" stroke="#E67E22" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  if (vId === 'verb-sing' || vId === 'verb-listen') {
    const isSing = vId === 'verb-sing';
    return (
      <g>
        <CuteCharacter cx={54} cy={58} r={22} shirtColor={isSing ? '#FF8E6E' : '#54A0FF'} mood={isSing ? 'eating' : 'smile'} />
        {!isSing && <path d="M30 56 A25 25 0 0 1 78 56" stroke="#2E86DE" strokeWidth="6" fill="none" />}
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
