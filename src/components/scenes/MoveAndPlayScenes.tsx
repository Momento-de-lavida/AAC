import React from 'react';
import { ActionSceneSubProps } from './DailyActionScenes';

/**
 * @description [HR-01, HR-03, HR-05] 의자 앉기·일어나기, 매트 눕기, 텐트 들어가기, 계단 오르내리기,
 * 탈것 내리기, 그네 밀기, 공 굴리기·던지기, 손 잡기·놓기·치우기, 노래 부르기·듣기 등 신체·이동·놀이 동작을
 * 단순 이모지 겹침 없이 하나의 일체형 그림으로 렌더링하는 컴포넌트
 * @param {ActionSceneSubProps} props 선택된 명사 및 동사 카드
 * @returns {React.ReactElement | null} 해당 동작의 일체형 SVG 그룹 엘리먼트
 */
export function MoveAndPlayScenes({ verbCard }: ActionSceneSubProps): React.ReactElement | null {
  const vId = verbCard.id;

  // 1. 의자 앉아요 / 의자에서 일어나요 (verb-sit, verb-stand): 실제 의자에 아이가 앉거나 일어서는 장면
  if (vId === 'verb-sit' || vId === 'verb-stand') {
    const isStanding = vId === 'verb-stand';
    return (
      <g>
        {/* 갈색 나무 의자 */}
        <path d="M34 44 V92 M34 70 H64 V92" stroke="#A0522D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* 앉거나 일어서는 아이 */}
        <g style={{ animation: isStanding ? 'takeOutUp 1.25s ease-in-out infinite' : 'putInDown 1.25s ease-in-out infinite' }}>
          <circle cx="56" cy="36" r="12" fill="#FFE0BD" />
          <circle cx="59" cy="34" r="2" fill="#3D352E" />
          <path d="M48 48 L64 48 L62 68 L50 68 Z" fill="#10B981" />
          <path d={isStanding ? 'M54 68 L54 88 M60 68 L62 88' : 'M52 66 L70 66 L70 86'} stroke="#3D352E" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }

  // 2. 매트에 누워요 (verb-lie-down): 폭신한 매트와 베개 위에 아이가 편안하게 가로로 누워 쉬는 장면
  if (vId === 'verb-lie-down') {
    return (
      <g>
        <rect x="18" y="72" width="84" height="16" rx="8" fill="#74B9FF" stroke="#0984E3" strokeWidth="2.5" />
        <ellipse cx="34" cy="68" rx="12" ry="6" fill="#FFF8EC" stroke="#FFD8A8" strokeWidth="2" />
        <g style={{ animation: 'handsGiveAndTake 1.4s ease-in-out infinite' }}>
          <circle cx="36" cy="60" r="11" fill="#FFE0BD" />
          <path d="M33 58 Q36 61 39 58" stroke="#3D352E" strokeWidth="2" fill="none" />
          <rect x="47" y="56" width="32" height="14" rx="7" fill="#FF9F43" />
          <path d="M79 62 L94 64" stroke="#3D352E" strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  // 3. 텐트에 들어가요 (verb-enter): 삼각형 텐트 입구 안으로 아이가 쏙 걸어 들어가는 장면
  if (vId === 'verb-enter') {
    return (
      <g>
        <polygon points="66,22 26,88 102,88" fill="#FF9F43" stroke="#D35400" strokeWidth="2.5" />
        <polygon points="66,44 48,88 84,88" fill="#2C3E50" />
        <g style={{ animation: 'walkForward 1.3s ease-in-out infinite' }}>
          <circle cx="48" cy="54" r="10" fill="#FFE0BD" />
          <rect x="42" y="64" width="12" height="16" rx="4" fill="#10B981" />
          <path d="M45 80 L42 90 M51 80 L54 90" stroke="#3D352E" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  // 4. 계단 올라가요 / 계단 내려가요 (verb-go-up, verb-go-down): 실제 계단을 오르내리는 장면
  if (vId === 'verb-go-up' || vId === 'verb-go-down') {
    const isUp = vId === 'verb-go-up';
    return (
      <g>
        <path d="M20 92 H44 V72 H68 V52 H96 V92 Z" fill="#DFE6E9" stroke="#636E72" strokeWidth="2.5" />
        <g style={{ animation: isUp ? 'takeOutUp 1.25s ease-in-out infinite' : 'putInDown 1.25s ease-in-out infinite' }}>
          <circle cx="56" cy="36" r="10" fill="#FFE0BD" />
          <rect x="50" y="46" width="12" height="16" rx="4" fill="#54A0FF" />
          <path d="M53 62 L49 72 M59 62 L63 70" stroke="#3D352E" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <text x="30" y="40" fontSize="22">{isUp ? '⬆️' : '⬇️'}</text>
      </g>
    );
  }

  // 5. 자동차 내려요 / 엘리베이터 내려요 (verb-get-off): 문이 열린 탈것에서 밖으로 내려오는 장면
  if (vId === 'verb-get-off') {
    return (
      <g>
        <rect x="20" y="30" width="44" height="58" rx="6" fill="#D0EBFF" stroke="#2E86DE" strokeWidth="2.5" />
        <rect x="28" y="38" width="28" height="48" fill="#2C3E50" />
        <g style={{ animation: 'walkForward 1.25s ease-in-out infinite' }}>
          <circle cx="68" cy="48" r="11" fill="#FFE0BD" />
          <rect x="61" y="59" width="14" height="18" rx="4" fill="#FF6B6B" />
          <path d="M65 77 L61 90 M71 77 L76 90" stroke="#3D352E" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  // 6. 그네 밀어요 (verb-push): 뒤에서 양손으로 그네를 앞으로 밀어 흔들리게 하는 장면
  if (vId === 'verb-push') {
    return (
      <g>
        <line x1="40" y1="16" x2="88" y2="16" stroke="#EE5253" strokeWidth="5" strokeLinecap="round" />
        <g style={{ animation: 'walkForward 1.2s ease-in-out infinite' }}>
          <line x1="68" y1="18" x2="68" y2="68" stroke="#576574" strokeWidth="3" />
          <circle cx="68" cy="48" r="10" fill="#FFE0BD" />
          <rect x="56" y="66" width="24" height="6" rx="3" fill="#FF9F43" />
        </g>
        <g style={{ animation: 'handReachDown 1.2s ease-in-out infinite' }}>
          <path d="M24 54 H46 M24 64 H46" stroke="#FFCC99" strokeWidth="7" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  // 7. 공 굴려요 / 공 던져요 (verb-roll, verb-throw): 공이 바닥을 굴러가거나 손에서 날아가는 장면
  if (vId === 'verb-roll' || vId === 'verb-throw') {
    const isRoll = vId === 'verb-roll';
    return (
      <g>
        <line x1="18" y1="88" x2="102" y2="88" stroke="#B2E2C8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="52" r="11" fill="#FFE0BD" />
        <rect x="25" y="63" width="14" height="22" rx="5" fill="#10B981" />
        <g style={{ animation: isRoll ? 'walkForward 1.1s linear infinite' : 'spoonToMouth 1.1s ease-in-out infinite' }}>
          <circle cx="74" cy={isRoll ? 74 : 46} r="14" fill="#FF9F43" stroke="#D35400" strokeWidth="2.5" />
          <path d={isRoll ? 'M62 74 H86 M74 62 V86' : 'M62 46 H86 M74 34 V58'} stroke="#FFF8EC" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // 8. 손 잡아요 / 손 놓아요 / 손 치워요 (verb-hold-hand, verb-let-go, verb-move-away)
  if (vId === 'verb-hold-hand' || vId === 'verb-let-go' || vId === 'verb-move-away') {
    const isHold = vId === 'verb-hold-hand';
    return (
      <g>
        <g style={{ animation: isHold ? 'handReachDown 1.1s ease-in-out infinite' : 'tearLeft 1.1s ease-in-out infinite' }}>
          <rect x="20" y="50" width="32" height="18" rx="9" fill="#FFCC99" stroke="#D49B6A" strokeWidth="2" />
        </g>
        <g style={{ animation: isHold ? 'handReachUp 1.1s ease-in-out infinite' : 'tearRight 1.1s ease-in-out infinite' }}>
          <rect x="68" y="50" width="32" height="18" rx="9" fill="#FFE0BD" stroke="#D49B6A" strokeWidth="2" />
        </g>
        {isHold && <circle cx="60" cy="59" r="10" fill="#FF8E6E" opacity="0.7" />}
      </g>
    );
  }

  // 9. 노래 불러요 / 노래 들어요 (verb-sing, verb-listen): 마이크를 잡고 노래하거나 헤드폰으로 듣는 장면
  if (vId === 'verb-sing' || vId === 'verb-listen') {
    const isSing = vId === 'verb-sing';
    return (
      <g>
        <circle cx="56" cy="60" r="22" fill="#FFE0BD" />
        {!isSing && <path d="M32 58 A24 24 0 0 1 80 58" stroke="#54A0FF" strokeWidth="6" fill="none" />}
        {!isSing && <rect x="26" y="52" width="8" height="16" rx="4" fill="#2E86DE" />}
        {!isSing && <rect x="78" y="52" width="8" height="16" rx="4" fill="#2E86DE" />}
        <circle cx="48" cy="55" r="2.5" fill="#3D352E" />
        <circle cx="64" cy="55" r="2.5" fill="#3D352E" />
        <ellipse cx="56" cy="67" rx={isSing ? 7 : 4} ry={isSing ? 6 : 2} fill="#E05A47" />
        {isSing && <rect x="72" y="68" width="8" height="20" rx="3" fill="#576574" transform="rotate(-25 72 68)" />}
        {isSing && <circle cx="68" cy="64" r="7" fill="#B2BEC3" />}
        <g style={{ animation: 'takeOutUp 1.1s ease-in-out infinite' }}>
          <text x="78" y="40" fontSize="20">🎵</text>
        </g>
      </g>
    );
  }

  return null;
}
