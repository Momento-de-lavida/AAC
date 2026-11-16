import React from 'react';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { AacCard, NounCategory, NounCategoryId, NounDisplayLimit } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AacWordCard } from './AacWordCard';

const { Title, Text } = Typography;

/**
 * @description NounBoardSection 컴포넌트의 Props 인터페이스
 */
export interface NounBoardSectionProps {
  /** 명사 카테고리 목록 */
  readonly categories: readonly NounCategory[];
  /** 현재 활성화된 명사 카테고리 ID */
  readonly activeCategory: NounCategoryId;
  /** 현재 카테고리에 속한 전체 명사 카드 배열 */
  readonly nounCards: readonly AacCard[];
  /** 한 화면에 제시할 최대 명사 개수 설정값 (호환성 유지용 선택 프로퍼티) */
  readonly displayLimit?: NounDisplayLimit;
  /** 현재 문장 조합 바에 선택된 카드 ID 집합 */
  readonly selectedCardIds: ReadonlySet<string>;
  /** 현재 TTS가 발화 중인지 여부 */
  readonly isSpeaking?: boolean;
  /** 카테고리 탭 변경 콜백 */
  readonly onSelectCategory: (categoryId: NounCategoryId) => void;
  /** 명사 카드 탭 콜백 */
  readonly onSelectCard: (card: AacCard) => void;
  /** 커스텀 명사 카드 삭제 콜백 */
  readonly onDeleteCustomCard?: (cardId: string) => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 1단계 '명사(무엇을?)' 선택 전용 보드 컴포넌트
 * - 자폐 아동이 조작하기 어려운 좌우 페이지 넘기기 대신, 선택한 카테고리의 전체 단어를 한 화면에 제시합니다.
 * - 한 줄에 3개씩(Col span=8) 규칙적으로 그림을 배치하고 아래로 스크롤하여 직관적으로 탐색할 수 있게 합니다.
 * @param {NounBoardSectionProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 명사 보드 섹션 엘리먼트
 */
export function NounBoardSection({
  categories,
  activeCategory,
  nounCards,
  selectedCardIds,
  isSpeaking = false,
  onSelectCategory,
  onSelectCard,
  onDeleteCustomCard,
}: NounBoardSectionProps): React.ReactElement {
  const hasSelectedNoun = nounCards.some((c) => selectedCardIds.has(c.id));

  return (
    <section
      aria-label="명사 어휘 보드"
      style={{
        backgroundColor: WARM_PASTEL_COLORS.NOUN_SECTION_BG,
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        padding: 18,
        border: `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: WARM_PASTEL_COLORS.NOUN_ACCENT }}>
            1단계: 명사 먼저 고르기 (무엇을?)
          </Title>
          <Text style={{ fontSize: 14, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
            아래로 스크롤하며 원하는 그림 1개를 누르면 동사 선택 화면이 열려요!
          </Text>
        </div>

        <Tag color="orange" style={{ fontSize: 14, fontWeight: 700, padding: '4px 12px', borderRadius: 12 }}>
          전체 {nounCards.length}개 낱말 (한 줄에 3개씩 보기)
        </Tag>
      </div>

      {/* 5대 명사 카테고리 알약 탭 */}
      <Space wrap size={[8, 8]} style={{ marginBottom: 16, width: '100%' }}>
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <Button
              key={cat.id}
              type={isActive ? 'primary' : 'default'}
              size="large"
              onClick={() => onSelectCategory(cat.id)}
              style={{
                minHeight: 48,
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 16,
                backgroundColor: isActive ? cat.badgeColor : '#FFFFFF',
                borderColor: isActive ? cat.badgeColor : WARM_PASTEL_COLORS.NOUN_CARD_BORDER,
                color: isActive ? '#FFFFFF' : WARM_PASTEL_COLORS.TEXT_PRIMARY,
              }}
            >
              <span style={{ marginRight: 6, fontSize: 18 }}>{cat.iconEmoji}</span>
              {cat.label}
            </Button>
          );
        })}
      </Space>

      {/* 좌우 페이지 넘김 없이 한 줄에 3개씩(span=8) 배치하여 아래로 스크롤하는 명사 카드 그리드 */}
      <Row gutter={[16, 16]}>
        {nounCards.map((card) => {
          const isSelected = selectedCardIds.has(card.id);
          return (
            <Col key={card.id} xs={8} sm={8} md={8} lg={8}>
              <AacWordCard
                card={card}
                isSelected={isSelected}
                isDimmed={hasSelectedNoun && !isSelected}
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
