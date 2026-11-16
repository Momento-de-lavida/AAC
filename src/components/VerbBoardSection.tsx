import React from 'react';
import { Button, Col, Row, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AacWordCard } from './AacWordCard';

/**
 * @description VerbBoardSection 컴포넌트의 Props 인터페이스
 */
export interface VerbBoardSectionProps {
  /** 앞서 1단계에서 선택된 명사 카드 */
  readonly selectedNoun?: AacCard;
  /** 표시할 전체 고빈도 동사 카드 배열 */
  readonly verbCards: readonly AacCard[];
  /** 현재 문장 조합 바에 선택된 카드 ID 집합 */
  readonly selectedCardIds: ReadonlySet<string>;
  /** 현재 TTS가 발화 중인지 여부 */
  readonly isSpeaking?: boolean;
  /** 동사 카드 탭 콜백 */
  readonly onSelectCard: (card: AacCard) => void;
  /** 1단계(명사 다시 고르기)로 돌아가는 콜백 */
  readonly onBackToNounStep?: () => void;
  /** 커스텀 동사 카드 삭제 콜백 */
  readonly onDeleteCustomCard?: (cardId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 2단계 '고빈도 동사(어떻게?)' 선택 보드 섹션 컴포넌트
 * - 불필요한 상단 안내 문구와 배지를 제거하고, 선택한 명사 표시와 3열 동사 카드 그리드만 집중 제시합니다.
 * @param {VerbBoardSectionProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 동사 보드 섹션 엘리먼트
 */
export function VerbBoardSection({
  selectedNoun,
  verbCards,
  selectedCardIds,
  isSpeaking = false,
  onSelectCard,
  onBackToNounStep,
  onDeleteCustomCard,
}: VerbBoardSectionProps): React.ReactElement {
  const hasSelectedVerb = verbCards.some((c) => selectedCardIds.has(c.id));

  return (
    <section
      aria-label="동사 동작 보드"
      style={{
        backgroundColor: WARM_PASTEL_COLORS.VERB_SECTION_BG,
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        padding: 18,
        border: `3px solid ${WARM_PASTEL_COLORS.VERB_ACCENT}`,
        boxShadow: '0 8px 24px rgba(46, 158, 107, 0.12)',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {selectedNoun ? (
          <Tag
            color="orange"
            style={{ fontSize: 18, fontWeight: 800, padding: '6px 16px', borderRadius: 16 }}
          >
            {selectedNoun.emoji} {selectedNoun.label} + 어떤 동작을 할까요?
          </Tag>
        ) : (
          <span />
        )}

        {onBackToNounStep && (
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onBackToNounStep}
            style={{ borderRadius: 14, fontWeight: 600 }}
          >
            명사 다시 고르기
          </Button>
        )}
      </div>

      {/* 한 줄에 3개씩(span=8) 배치하여 아래로 스크롤하는 동사 카드 그리드 */}
      <Row gutter={[14, 14]}>
        {verbCards.map((card) => {
          const isSelected = selectedCardIds.has(card.id);
          return (
            <Col key={card.id} xs={8} sm={8} md={8} lg={8}>
              <AacWordCard
                card={card}
                isSelected={isSelected}
                isDimmed={hasSelectedVerb && !isSelected}
                isSpeaking={isSpeaking}
                onSelect={onSelectCard}
                onDeleteCustom={onDeleteCustomCard}
              />
            </Col>
          );
        })}
      </Row>
    </section>
  );
}
