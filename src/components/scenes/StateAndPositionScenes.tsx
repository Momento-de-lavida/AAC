import React from 'react';
import { CuteCharacter } from './CharacterParts';
import { ActionSceneSubProps } from './DailyActionScenes';

/**
 * @description [HR-01, HR-03, HR-05] 신규 추가된 출입·위치·정리 동사 4종((밖으로) 나가요, 정리해요, (위에) 올려요, (위에서) 내려요)과
 * 감각·온도·난이도 형용사 7종(시원해요, 따뜻해요, 추워요, 차가워요, 뜨거워요, 힘들어요, 어려워요)의 고디테일 캐릭터 벡터 SVG 관절 모션 컴포넌트
 * @param {ActionSceneSubProps} props 선택된 명사 및 동사·형용사 카드
 * @returns {React.ReactElement | null} 해당 동작·상태의 일체형 SVG 그룹 엘리먼트
 */
export function StateAndPositionScenes({ verbCard }: ActionSceneSubProps): React.ReactElement | null {
  const vId = verbCard.id;

  // 1. (밖으로) 나가요 (verb-exit): 열린 문 안에서 바깥(햇살 비치는 외부)으로 걸어 나가는 관절 모션
  if (vId === 'verb-exit') {
    return (
      <g>
        <rect x="16" y="22" width="40" height="68" rx="4" fill="#2C3E50" stroke="#3D352E" strokeWidth="3" />
        <rect x="18" y="24" width="16" height="64" fill="#FF9F43" stroke="#3D352E" strokeWidth="2" />
        <circle cx="94" cy="26" r="10" fill="#FFD43B" stroke="#3D352E" strokeWidth="2" />
        <path d="M52 30 H80 M73 24 L80 30 L73 36" stroke="#E05A47" strokeWidth="3.8" strokeLinecap="round" fill="none" />
        <g style={{ animation: 'walkForward 1.25s ease-in-out infinite' }}>
          <CuteCharacter cx={68} cy={52} r={13.5} shirtColor="#54A0FF" mood="excited" />
          <path d="M64 78 L60 92 M72 78 L77 92" stroke="#3D352E" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  // 2. 정리해요 (verb-clean-up): 흩어진 블록과 장난감을 두 손으로 집어 정리 상자 안에 차곡차곡 넣는 관절 모션
  if (vId === 'verb-clean-up') {
    return (
      <g>
        <CuteCharacter cx={34} cy={44} r={14.5} shirtColor="#10B981" mood="smile" />
        <rect x="54" y="62" width="46" height="28" rx="4" fill="#FF9F43" stroke="#3D352E" strokeWidth="2.5" />
        <rect x="62" y="54" width="12" height="10" rx="2" fill="#54A0FF" stroke="#3D352E" strokeWidth="2" />
        <g style={{ animation: 'putInDown 1.15s ease-in-out infinite' }}>
          <rect x="74" y="34" width="14" height="14" rx="3" fill="#FF6B6B" stroke="#3D352E" strokeWidth="2" />
          <circle cx="68" cy="40" r="5.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
          <path d="M82 18 V30 M77 25 L82 30 L87 25" stroke="#2E9E6B" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }

  // 3. (위에) 올려요 (verb-put-up) & 4. (위에서) 내려요 (verb-put-down): 선반 위/아래로 물건을 올리거나 내리는 관절 모션
  if (vId === 'verb-put-up' || vId === 'verb-put-down') {
    const isUp = vId === 'verb-put-up';
    return (
      <g>
        <CuteCharacter cx={32} cy={52} r={14.5} shirtColor={isUp ? '#54A0FF' : '#FF9F43'} mood="smile" />
        {/* 오른쪽 높은 선반/책상 */}
        <rect x="54" y="48" width="48" height="7" rx="3" fill="#A0522D" stroke="#3D352E" strokeWidth="2.2" />
        <line x1="60" y1="55" x2="60" y2="90" stroke="#A0522D" strokeWidth="4" strokeLinecap="round" />
        <line x1="96" y1="55" x2="96" y2="90" stroke="#A0522D" strokeWidth="4" strokeLinecap="round" />
        <g style={{ animation: isUp ? 'takeOutUp 1.2s ease-in-out infinite' : 'putInDown 1.2s ease-in-out infinite' }}>
          <rect x="66" y={isUp ? 28 : 64} width="22" height="18" rx="4" fill="#FFD43B" stroke="#3D352E" strokeWidth="2.2" />
          <circle cx="62" cy={isUp ? 38 : 72} r="5.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="1.8" />
        </g>
        <path
          d={isUp ? 'M98 42 V20 M92 26 L98 20 L104 26' : 'M98 60 V84 M92 78 L98 84 L104 78'}
          stroke={isUp ? '#2E86DE' : '#E67E22'}
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  // 5. 시원해요 (verb-cool): 시원한 바람결과 시원한 물컵 옆에서 상쾌하게 미소 짓는 모션
  if (vId === 'verb-cool') {
    return (
      <g>
        <CuteCharacter cx={48} cy={54} r={20} shirtColor="#48DBFB" mood="excited" />
        <rect x="78" y="58" width="18" height="24" rx="3" fill="#EBF8FF" stroke="#3D352E" strokeWidth="2" />
        <rect x="80" y="65" width="14" height="15" fill="#54A0FF" />
        <g style={{ animation: 'walkForward 1.15s ease-in-out infinite' }}>
          <path d="M16 30 Q30 24 44 30 M14 42 Q26 36 38 42" stroke="#00CEC9" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </g>
      </g>
    );
  }

  // 6. 따뜻해요 (verb-warm): 포근한 햇살 아래 두 손으로 볼을 감싸며 따뜻해하는 모션
  if (vId === 'verb-warm') {
    return (
      <g>
        <circle cx="88" cy="28" r="13" fill="#FFD43B" stroke="#FF9F43" strokeWidth="3" strokeDasharray="4 2" />
        <g style={{ animation: 'childJumpJoy 1.1s ease-in-out infinite' }}>
          <CuteCharacter cx={48} cy={56} r={20} shirtColor="#FF9F43" mood="yummy" />
          <circle cx="28" cy="60" r="6" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
          <circle cx="68" cy="60" r="6" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // 7. 추워요 (verb-cold-weather): 눈송이가 내리는 가운데 두 팔로 몸을 감싸고 오들오들 떠는 모션
  if (vId === 'verb-cold-weather') {
    return (
      <g>
        <g style={{ animation: 'headAndHandShakeNo 0.45s ease-in-out infinite' }}>
          <CuteCharacter cx={54} cy={56} r={20} shirtColor="#74B9FF" mood="sick" />
          <path d="M36 74 L68 68 M72 74 L40 68" stroke="#3D352E" strokeWidth="4.5" strokeLinecap="round" />
        </g>
        <circle cx="24" cy="28" r="4" fill="#74B9FF" />
        <circle cx="88" cy="26" r="4.5" fill="#74B9FF" />
        <circle cx="92" cy="48" r="3.5" fill="#74B9FF" />
      </g>
    );
  }

  // 8. 차가워요 (verb-cold-touch): 파란 얼음 조각에 손이 닿아 깜짝 놀라며 손을 움츠리는 모션
  if (vId === 'verb-cold-touch') {
    return (
      <g>
        <CuteCharacter cx={40} cy={54} r={19} shirtColor="#54A0FF" mood="refuse" />
        <rect x="74" y="54" width="24" height="24" rx="5" fill="#A3CBFF" stroke="#0984E3" strokeWidth="2.5" />
        <line x1="78" y1="60" x2="88" y2="58" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <g style={{ animation: 'tearLeft 0.8s ease-in-out infinite' }}>
          <circle cx="66" cy="58" r="7" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
          <path d="M72 42 L78 34 M84 44 L92 38" stroke="#0984E3" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      </g>
    );
  }

  // 9. 뜨거워요 (verb-hot): 뜨거운 김이 모락모락 나는 그릇 앞에서 입으로 호호 불며 손을 흔드는 모션
  if (vId === 'verb-hot') {
    return (
      <g>
        <CuteCharacter cx={38} cy={54} r={19} shirtColor="#FF6B6B" mood="drinking" />
        <path d="M68 68 H98 L93 86 H73 Z" fill="#E05A47" stroke="#3D352E" strokeWidth="2.2" />
        <g style={{ animation: 'takeOutUp 0.9s ease-in-out infinite' }}>
          <path d="M78 62 Q74 52 80 44 M88 62 Q84 52 90 44" stroke="#FF5252" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="56" r="6.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // 10. 힘들어요 (verb-tired): 이마에 땀방울을 흘리며 지쳐서 숨을 몰아쉬는 모션
  if (vId === 'verb-tired') {
    return (
      <g style={{ animation: 'handsGiveAndTake 1.2s ease-in-out infinite' }}>
        <CuteCharacter cx={54} cy={58} r={21} shirtColor="#95A5A6" mood="sick" />
        <path d="M80 42 C76 52, 86 56, 80 42 Z" fill="#48DBFB" stroke="#2E86DE" strokeWidth="2" />
        <path d="M88 54 C84 64, 94 68, 88 54 Z" fill="#48DBFB" stroke="#2E86DE" strokeWidth="2" />
      </g>
    );
  }

  // 11. 어려워요 (verb-difficult): 복잡한 퍼즐 앞에서 물음표가 뜨며 머리를 긁적이는 모션
  if (vId === 'verb-difficult') {
    return (
      <g>
        <CuteCharacter cx={48} cy={58} r={20} shirtColor="#A29BFE" mood="refuse" />
        <g style={{ animation: 'childJumpJoy 0.95s ease-in-out infinite' }}>
          <circle cx="28" cy="44" r="6.5" fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
          <text x="82" y="42" fontSize="28" fontWeight="900" fill="#E05A47" textAnchor="middle">?</text>
          <text x="94" y="62" fontSize="22" fontWeight="900" fill="#F39C12" textAnchor="middle">?</text>
        </g>
      </g>
    );
  }

  // 12. 점프해요 (verb-jump) & 13. 뛰어요(점프) (verb-jump-play): 바닥 스프링 반동과 함께 위로 폴짝 점프하는 관절 모션
  if (vId === 'verb-jump' || vId === 'verb-jump-play') {
    const isPlayJump = vId === 'verb-jump-play';
    return (
      <g>
        <ellipse cx="60" cy="96" rx="26" ry="5" fill="#BDE0FE" />
        <g style={{ animation: 'childJumpJoy 0.75s ease-in-out infinite' }}>
          <CuteCharacter cx={60} cy={36} r={14.5} shirtColor={isPlayJump ? '#FF8E6E' : '#10B981'} mood="excited" />
          <path d={isPlayJump ? 'M42 46 L26 28 M78 46 L94 28' : 'M44 48 L34 34 M76 48 L86 34'} stroke="#FFE0BD" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M54 66 L46 80 L54 84 M66 66 L74 80 L66 84" stroke="#3D352E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <path d="M24 72 V48 M18 54 L24 48 L30 54 M96 72 V48 M90 54 L96 48 L102 54" stroke="#FF9F43" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  // 14. 달려요 (verb-run): 팔과 다리를 역동적으로 앞뒤로 흔들며 바람을 가르며 빠르게 달리는 관절 모션
  if (vId === 'verb-run') {
    return (
      <g>
        <path d="M14 44 H32 M10 58 H28 M16 72 H34" stroke="#74B9FF" strokeWidth="3.2" strokeLinecap="round" />
        <g style={{ animation: 'walkForward 0.75s linear infinite' }}>
          <CuteCharacter cx={62} cy={38} r={14.5} shirtColor="#FF6B6B" mood="excited" />
          <path d="M48 52 L36 60 M76 52 L88 42" stroke="#FFE0BD" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M56 66 L42 84 M68 66 L84 78 L78 90" stroke="#3D352E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
    );
  }

  return null;
}
