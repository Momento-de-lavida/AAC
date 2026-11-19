import React from 'react';

/**
 * @description 캐릭터 얼굴 표정(Mood) 식별자 타입
 */
export type CharacterMood =
  | 'smile'
  | 'eating'
  | 'drinking'
  | 'excited'
  | 'refuse'
  | 'sick'
  | 'sleepy'
  | 'hungry'
  | 'yummy';

/**
 * @description 귀여운 아동 캐릭터 상반신·얼굴 공통 파츠 Props 인터페이스
 */
export interface CuteCharacterProps {
  /** 중심 X 좌표 (기본값 40) */
  readonly cx?: number;
  /** 얼굴 중심 Y 좌표 (기본값 34) */
  readonly cy?: number;
  /** 얼굴 반지름 크기 (기본값 18) */
  readonly r?: number;
  /** 상의 색상 (기본값 '#FF9F43') */
  readonly shirtColor?: string;
  /** 표정 종류 */
  readonly mood?: CharacterMood;
  /** 턱받이 표시 여부 (식음 동작용) */
  readonly showBib?: boolean;
  /** 이마 반창고 표시 여부 (아파요 동작용) */
  readonly showBandage?: boolean;
}

/**
 * @description [HR-01, HR-02, HR-05] 2페이지 모든 동사·형용사 관절 모션에 일관된 고디테일 캐릭터(앞머리, 하이라이트 눈동자, 볼터치, 의상, 표정 애니메이션)를 제공하는 순수 SVG 파츠 컴포넌트
 * @param {CuteCharacterProps} props 캐릭터 위치·크기·표정 프로퍼티
 * @returns {React.ReactElement} 캐릭터 SVG 그룹 엘리먼트
 */
export function CuteCharacter({
  cx = 40,
  cy = 34,
  r = 18,
  shirtColor = '#FF9F43',
  mood = 'smile',
  showBib = false,
  showBandage = false,
}: CuteCharacterProps): React.ReactElement {
  const earOffset = r * 0.98;
  const earR = r * 0.27;
  const eyeOffsetX = r * 0.42;
  const eyeY = cy - r * 0.08;
  const cheekOffsetX = r * 0.68;
  const cheekY = cy + r * 0.16;
  const bodyTopY = cy + r * 0.85;
  const bodyBottomY = cy + r * 2.15;
  const bodyHalfW = r * 1.15;

  return (
    <g>
      {/* 상의 몸통 및 둥근 칼라 */}
      <path
        d={`M${cx - bodyHalfW} ${bodyBottomY} C${cx - bodyHalfW} ${bodyTopY}, ${cx + bodyHalfW} ${bodyTopY}, ${cx + bodyHalfW} ${bodyBottomY} Z`}
        fill={shirtColor}
        stroke="#3D352E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {showBib ? (
        <path
          d={`M${cx - r * 0.58} ${bodyTopY + 1} C${cx - r * 0.58} ${bodyTopY + r * 0.55}, ${cx + r * 0.58} ${bodyTopY + r * 0.55}, ${cx + r * 0.58} ${bodyTopY + 1} Z`}
          fill="#FFFFFF"
          stroke="#3D352E"
          strokeWidth="1.8"
        />
      ) : (
        <path
          d={`M${cx - r * 0.42} ${bodyTopY + 1} Q${cx} ${bodyTopY + r * 0.32} ${cx + r * 0.42} ${bodyTopY + 1}`}
          fill="#FFFFFF"
          stroke="#3D352E"
          strokeWidth="1.6"
        />
      )}

      {/* 양쪽 귀 */}
      <circle cx={cx - earOffset} cy={cy + 2} r={earR} fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />
      <circle cx={cx + earOffset} cy={cy + 2} r={earR} fill="#FFE0BD" stroke="#3D352E" strokeWidth="2" />

      {/* 얼굴 윤곽 */}
      <circle cx={cx} cy={cy} r={r} fill="#FFE0BD" stroke="#3D352E" strokeWidth="2.3" />

      {/* 귀여운 갈색 앞머리 */}
      <path
        d={`M${cx - r} ${cy - r * 0.12} C${cx - r * 1.04} ${cy - r * 0.92}, ${cx - r * 0.48} ${cy - r * 1.15}, ${cx} ${cy - r * 1.15} C${cx + r * 0.48} ${cy - r * 1.15}, ${cx + r * 1.04} ${cy - r * 0.92}, ${cx + r} ${cy - r * 0.12} C${cx + r * 0.78} ${cy - r * 0.48}, ${cx + r * 0.52} ${cy - r * 0.5}, ${cx + r * 0.36} ${cy - r * 0.32} C${cx + r * 0.18} ${cy - r * 0.58}, ${cx - r * 0.18} ${cy - r * 0.58}, ${cx - r * 0.36} ${cy - r * 0.32} C${cx - r * 0.52} ${cy - r * 0.5}, ${cx - r * 0.78} ${cy - r * 0.48}, ${cx - r} ${cy - r * 0.12} Z`}
        fill="#4A3728"
        stroke="#3D352E"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* 이마 반창고 (아파요 전용) */}
      {showBandage && (
        <g transform={`rotate(-12 ${cx + r * 0.38} ${cy - r * 0.52})`}>
          <rect x={cx + r * 0.02} y={cy - r * 0.68} width={r * 0.76} height={r * 0.34} rx="3" fill="#F8C291" stroke="#3D352E" strokeWidth="1.6" />
          <rect x={cx + r * 0.26} y={cy - r * 0.68} width={r * 0.26} height={r * 0.34} fill="#FAD390" stroke="#3D352E" strokeWidth="1.2" />
        </g>
      )}

      {/* 눈동자 및 눈썹 표현 */}
      {mood === 'sleepy' || mood === 'sick' ? (
        <g>
          <path d={`M${cx - eyeOffsetX - 3.5} ${eyeY} Q${cx - eyeOffsetX} ${eyeY + (mood === 'sleepy' ? 3.5 : -3)} ${cx - eyeOffsetX + 3.5} ${eyeY}`} stroke="#3D352E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d={`M${cx + eyeOffsetX - 3.5} ${eyeY} Q${cx + eyeOffsetX} ${eyeY + (mood === 'sleepy' ? 3.5 : -3)} ${cx + eyeOffsetX + 3.5} ${eyeY}`} stroke="#3D352E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {mood === 'sick' && (
            <>
              <circle cx={cx - eyeOffsetX - 3} cy={eyeY + 4} r="2.2" fill="#48DBFB" />
              <circle cx={cx + eyeOffsetX + 3} cy={eyeY + 4} r="2.2" fill="#48DBFB" />
            </>
          )}
        </g>
      ) : (
        <g>
          <circle cx={cx - eyeOffsetX} cy={eyeY} r={r * 0.15} fill="#2C221E" />
          <circle cx={cx - eyeOffsetX - 0.9} cy={eyeY - 0.9} r={r * 0.055} fill="#FFFFFF" />
          <circle cx={cx + eyeOffsetX} cy={eyeY} r={r * 0.15} fill="#2C221E" />
          <circle cx={cx + eyeOffsetX - 0.9} cy={eyeY - 0.9} r={r * 0.055} fill="#FFFFFF" />
        </g>
      )}

      {/* 발그레한 볼터치 */}
      <ellipse cx={cx - cheekOffsetX} cy={cheekY} rx={r * 0.2} ry={r * 0.12} fill="#FF7675" opacity="0.65" />
      <ellipse cx={cx + cheekOffsetX} cy={cheekY} rx={r * 0.2} ry={r * 0.12} fill="#FF7675" opacity="0.65" />

      {/* 표정별 입 모양 및 오물거림 모션 */}
      {mood === 'eating' ? (
        <ellipse
          cx={cx}
          cy={cy + r * 0.38}
          rx={r * 0.3}
          ry={r * 0.26}
          fill="#D63031"
          stroke="#3D352E"
          strokeWidth="2"
          style={{ animation: 'mouthOpenClose 1.15s ease-in-out infinite', transformOrigin: `${cx}px ${cy + r * 0.38}px` }}
        />
      ) : mood === 'drinking' ? (
        <circle cx={cx + 2} cy={cy + r * 0.36} r={r * 0.18} fill="#D63031" stroke="#3D352E" strokeWidth="1.8" />
      ) : mood === 'refuse' || mood === 'sick' ? (
        <path d={`M${cx - r * 0.26} ${cy + r * 0.44} Q${cx} ${cy + r * 0.24} ${cx + r * 0.26} ${cy + r * 0.44}`} stroke="#3D352E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      ) : mood === 'hungry' ? (
        <g>
          <ellipse cx={cx} cy={cy + r * 0.38} rx={r * 0.24} ry={r * 0.18} fill="#D63031" stroke="#3D352E" strokeWidth="1.8" />
          <path d={`M${cx + r * 0.16} ${cy + r * 0.42} Q${cx + r * 0.22} ${cy + r * 0.65} ${cx + r * 0.12} ${cy + r * 0.65}`} stroke="#48DBFB" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <path
          d={`M${cx - r * 0.28} ${cy + r * 0.32} Q${cx} ${cy + r * 0.58} ${cx + r * 0.28} ${cy + r * 0.32}`}
          stroke="#D63031"
          strokeWidth="2.3"
          strokeLinecap="round"
          fill={mood === 'excited' || mood === 'yummy' ? '#D63031' : 'none'}
        />
      )}
    </g>
  );
}
