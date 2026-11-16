import React from 'react';
import { ActionSceneSubProps } from './DailyActionScenes';

/**
 * @description [HR-01, HR-03, HR-05] 의자 앉기·일어나기, 매트 눕기, 텐트 들어가기, 계단 오르내리기,
 * 탈것 내리기, 그네 밀기, 공 굴리기·던지기, 손 잡기·놓기·치우기, 노래 부르기·듣기 등 신체·이동·놀이 동작을
 * 중복 없이 직관적인 1:1 일체형 그림으로 렌더링하는 컴포넌트
 * @param {ActionSceneSubProps} props 선택된 명사 및 동사 카드
 * @returns {React.ReactElement | null} 해당 동작의 일체형 SVG 그룹 엘리먼트
 */
export function MoveAndPlayScenes({ verbCard }: ActionSceneSubProps): React.ReactElement | null {
  const vId = verbCard.id;

  // 1. 의자 앉아요 / 의자에서 일어나요 (verb-sit, verb-stand): 실제 의자에 무릎 굽혀 앉거나 위로 일어서는 장면
  if (vId === 'verb-sit' || vId === 'verb-stand') {
    const isStanding = vId === 'verb-stand';
    return (
      <g>
        <path d="M32 42 V92 M32 70 H62 V92" stroke="#A0522D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g style={{ animation: isStanding ? 'takeOutUp 1.25s ease-in-out infinite' : 'putInDown 1.25s ease-in-out infinite' }}>
          <circle cx="54" cy="36" r="11" fill="#FFE0BD" />
          <circle cx="57" cy="34" r="2" fill="#3D352E" />
          <path d="M46 47 L62 47 L60 67 L48 67 Z" fill={isStanding ? '#54A0FF' : '#10B981'} />
          <path d={isStanding ? 'M52 67 L52 88 M58 67 L60 88' : 'M50 65 L68 65 L68 85'} stroke="#3D352E" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
        <text x="84" y="42" fontSize="22">{isStanding ? '⬆️' : '⬇️'}</text>
      </g>
    );
  }

  // 2. 매트에 누워요 (verb-lie-down): 매트와 베개 위에 아이가 편안히 가로로 누워 있는 장면
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

  // 3. 텐트에 들어가요 (verb-enter): 삼각형 텐트의 열린 입구 안으로 아이가 들어가는 장면
  if (vId === 'verb-enter') {
    return (
      <g>
        <polygon points="68,22 28,88 104,88" fill="#FF9F43" stroke="#D35400" strokeWidth="2.5" />
        <polygon points="68,44 50,88 86,88" fill="#2C3E50" />
        <g style={{ animation: 'walkForward 1.3s ease-in-out infinite' }}>
          <circle cx="44" cy="54" r="10" fill="#FFE0BD" />
          <rect x="38" y="64" width="12" height="16" rx="4" fill="#10B981" />
          <path d="M41 80 L38 90 M47 80 L50 90" stroke="#3D352E" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  // 4. 계단 올라가요 / 계단 내려가요 (verb-go-up, verb-go-down): 계단 방향을 달리하여 오르내리는 장면
  if (vId === 'verb-go-up' || vId === 'verb-go-down') {
    const isUp = vId === 'verb-go-up';
    return (
      <g>
        <path
          d={isUp ? 'M20 92 H44 V72 H68 V52 H96 V92 Z' : 'M20 52 H48 V72 H72 V92 H96 V96 H20 Z'}
          fill="#DFE6E9"
          stroke="#636E72"
          strokeWidth="2.5"
        />
        <g style={{ animation: isUp ? 'takeOutUp 1.25s ease-in-out infinite' : 'putInDown 1.25s ease-in-out infinite' }}>
          <circle cx="56" cy="36" r="10" fill="#FFE0BD" />
          <rect x="50" y="46" width="12" height="16" rx="4" fill={isUp ? '#54A0FF' : '#FF9F43'} />
          <path d="M53 62 L49 72 M59 62 L63 70" stroke="#3D352E" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <text x={isUp ? 28 : 82} y="38" fontSize="22">{isUp ? '⬆️' : '⬇️'}</text>
      </g>
    );
  }

  // 5. 자동차 내려요 / 엘리베이터 내려요 (verb-get-off): 열린 문에서 밖으로 걸어 나오는 장면
  if (vId === 'verb-get-off') {
    return (
      <g>
        <rect x="20" y="28" width="44" height="60" rx="6" fill="#D0EBFF" stroke="#2E86DE" strokeWidth="2.5" />
        <rect x="28" y="36" width="28" height="50" fill="#2C3E50" />
        <g style={{ animation: 'walkForward 1.25s ease-in-out infinite' }}>
          <circle cx="68" cy="48" r="11" fill="#FFE0BD" />
          <rect x="61" y="59" width="14" height="18" rx="4" fill="#FF6B6B" />
          <path d="M65 77 L61 90 M71 77 L76 90" stroke="#3D352E" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <path d="M52 64 H88 M82 58 L88 64 L82 70" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
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

  // 7. 공 굴려요 / 공 던져요 (verb-roll, verb-throw): 바닥에 공을 굴리거나 공중으로 공을 던지는 장면 분리
  if (vId === 'verb-roll' || vId === 'verb-throw') {
    const isRoll = vId === 'verb-roll';
    return (
      <g>
        {isRoll && <line x1="18" y1="88" x2="102" y2="88" stroke="#2E9E6B" strokeWidth="4" strokeLinecap="round" />}
        <circle cx="30" cy={isRoll ? 58 : 48} r="11" fill="#FFE0BD" />
        <rect x="23" y={isRoll ? 69 : 59} width="14" height="20" rx="5" fill={isRoll ? '#10B981' : '#54A0FF'} />
        {!isRoll && <path d="M36 62 L52 42" stroke="#FFE0BD" strokeWidth="5" strokeLinecap="round" />}
        <g style={{ animation: isRoll ? 'walkForward 1.1s linear infinite' : 'spoonToMouth 1.1s ease-in-out infinite' }}>
          <circle cx="76" cy={isRoll ? 74 : 38} r="13" fill={isRoll ? '#FF9F43' : '#FF6B6B'} stroke="#C92A2A" strokeWidth="2" />
          <path d={isRoll ? 'M64 74 H88 M76 62 V86' : 'M64 38 H88 M76 26 V50'} stroke="#FFF8EC" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // 8. 손 잡아요 / 손 놓아요 / 손 치워요 (verb-hold-hand, verb-let-go, verb-move-away): 3가지 손 동작 완전 분리
  if (vId === 'verb-hold-hand') {
    return (
      <g>
        <g style={{ animation: 'handReachDown 1.1s ease-in-out infinite' }}>
          <rect x="22" y="52" width="34" height="18" rx="9" fill="#FFCC99" stroke="#D49B6A" strokeWidth="2" />
        </g>
        <g style={{ animation: 'handReachUp 1.1s ease-in-out infinite' }}>
          <rect x="64" y="52" width="34" height="18" rx="9" fill="#FFE0BD" stroke="#D49B6A" strokeWidth="2" />
        </g>
        <text x="60" y="42" fontSize="22" textAnchor="middle">❤️</text>
      </g>
    );
  }
  if (vId === 'verb-let-go') {
    return (
      <g>
        <g style={{ animation: 'tearLeft 1.15s ease-in-out infinite' }}>
          <rect x="18" y="52" width="30" height="18" rx="9" fill="#FFCC99" stroke="#D49B6A" strokeWidth="2" />
        </g>
        <g style={{ animation: 'tearRight 1.15s ease-in-out infinite' }}>
          <rect x="72" y="52" width="30" height="18" rx="9" fill="#FFE0BD" stroke="#D49B6A" strokeWidth="2" />
        </g>
        <path d="M52 42 L40 42 M68 42 L80 42" stroke="#636E72" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }
  if (vId === 'verb-move-away') {
    return (
      <g>
        <rect x="20" y="76" width="80" height="10" rx="4" fill="#DFE6E9" />
        <g style={{ animation: 'walkForward 1.15s ease-in-out infinite' }}>
          <ellipse cx="42" cy="60" rx="16" ry="10" fill="#FFCC99" stroke="#D49B6A" strokeWidth="2" />
          <rect x="64" y="48" width="22" height="24" rx="5" fill="#74B9FF" stroke="#0984E3" strokeWidth="2" />
        </g>
        <path d="M36 34 H82 M76 28 L82 34 L76 40" stroke="#E67E22" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  // 9. 노래 불러요 / 노래 들어요 (verb-sing, verb-listen): 마이크 노래하기 vs 헤드폰 듣기 완전 분리
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
          <text x="78" y="40" fontSize="20">{isSing ? '🎤' : '🎶'}</text>
        </g>
      </g>
    );
  }

  return null;
}
