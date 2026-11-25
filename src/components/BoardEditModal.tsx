import React, { useMemo, useState } from 'react';
import { Button, Modal, Popconfirm, Segmented, Select, Space, Switch, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, EyeInvisibleOutlined, ReloadOutlined } from '@ant-design/icons';
import { AacCard, ChildProfile, NounCategory, NounCategoryId, ProfileBoardConfig } from '../types/aac';
import { PartOfSpeech } from '../types/common';
import { sortCardsByOrder } from '../utils/boardConfigHelper';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text } = Typography;

/**
 * @description BoardEditModal 컴포넌트의 Props 인터페이스
 */
export interface BoardEditModalProps {
  /** 모달 열림 여부 */
  readonly open: boolean;
  /** 현재 선택된 아동 프로필 */
  readonly activeProfile?: ChildProfile;
  /** 1단계 명사 카테고리 목록 */
  readonly categories: readonly NounCategory[];
  /** 모달을 열 때 기본으로 선택될 카테고리 ID */
  readonly defaultCategoryId: NounCategoryId;
  /** 전체 명사 카드 목록 (기본 + 사용자 추가) */
  readonly allNounCards: readonly AacCard[];
  /** 전체 서술어 카드 목록 (기본 + 사용자 추가) */
  readonly allVerbCards: readonly AacCard[];
  /** 현재 아동의 보드 표시/순서 설정 */
  readonly boardConfig: ProfileBoardConfig;
  /** 특정 카드 숨김/표시 토글 콜백 */
  readonly onToggleCardVisibility: (cardId: string) => void;
  /** 카드 순서 위/아래 이동 콜백 */
  readonly onMoveCardOrder: (partOfSpeech: PartOfSpeech, cardId: string, direction: 'up' | 'down', scopeCards: readonly AacCard[]) => void;
  /** 현재 아동의 보드 설정 전체 초기화 콜백 */
  readonly onResetBoardConfig: () => void;
  /** 모달 닫기 콜백 */
  readonly onClose: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 아동별로 어휘카드 표시/숨김 및 배열 순서를 조정하는 치료사용 모달
 * @param {BoardEditModalProps} props - 모달 상태 및 보드 편집 제어 콜백
 * @returns {React.ReactElement} 어휘카드 순서·숨김 관리 모달 엘리먼트
 */
export function BoardEditModal({
  open,
  activeProfile,
  categories,
  defaultCategoryId,
  allNounCards,
  allVerbCards,
  boardConfig,
  onToggleCardVisibility,
  onMoveCardOrder,
  onResetBoardConfig,
  onClose,
}: BoardEditModalProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<PartOfSpeech>('noun');
  const [selectedCategoryId, setSelectedCategoryId] = useState<NounCategoryId>(defaultCategoryId);

  const hiddenSet = useMemo(() => new Set(boardConfig.hiddenCardIds), [boardConfig.hiddenCardIds]);

  const scopedCards = useMemo(() => {
    if (activeTab === 'noun') {
      const catId = categories.some((c) => c.id === selectedCategoryId)
        ? selectedCategoryId
        : (categories[0]?.id ?? defaultCategoryId);
      const filtered = allNounCards.filter((card) => (card.categoryId ?? 'food') === catId);
      return sortCardsByOrder(filtered, boardConfig.nounOrderIds);
    }
    return sortCardsByOrder(allVerbCards, boardConfig.verbOrderIds);
  }, [activeTab, categories, selectedCategoryId, defaultCategoryId, allNounCards, allVerbCards, boardConfig.nounOrderIds, boardConfig.verbOrderIds]);

  const visibleCount = scopedCards.filter((c) => !hiddenSet.has(c.id)).length;

  return (
    <Modal
      title={`어휘카드 순서·숨김 관리 (${activeProfile ? `${activeProfile.avatarEmoji} ${activeProfile.name}` : '이용자'})`}
      open={open}
      onCancel={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Popconfirm
            title="이 아동의 카드 순서와 숨김 설정을 기본값으로 되돌릴까요?"
            okText="초기화"
            cancelText="취소"
            onConfirm={onResetBoardConfig}
          >
            <Button icon={<ReloadOutlined />} danger>
              기본값으로 초기화
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={onClose} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 8 }}>
            완료
          </Button>
        </div>
      }
      width={600}
      centered
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <Segmented
            value={activeTab}
            onChange={(val) => setActiveTab(val as PartOfSpeech)}
            options={[
              { label: '1단계 명사', value: 'noun' },
              { label: '2단계 서술어', value: 'verb' },
            ]}
          />
          {activeTab === 'noun' && (
            <Select
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
              style={{ minWidth: 160 }}
              options={categories.map((cat) => ({
                value: cat.id,
                label: `${cat.iconEmoji} ${cat.label}`,
              }))}
            />
          )}
        </div>

        <Text type="secondary" style={{ fontSize: 13 }}>
          현재 화면에 표시 중인 카드: <strong>{visibleCount}</strong> / {scopedCards.length}개 (위·아래 화살표로 순서 변경)
        </Text>

        <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
          {scopedCards.map((card, index) => {
            const isHidden = hiddenSet.has(card.id);
            return (
              <div
                key={card.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 12,
                  border: `1px solid ${isHidden ? '#E5E7EB' : WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
                  background: isHidden ? '#F9FAFB' : '#FFFFFF',
                  opacity: isHidden ? 0.65 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                  {card.customImageUrl ? (
                    <img src={card.customImageUrl} alt={card.label} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  ) : (
                    <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{card.emoji}</span>
                  )}
                  <Text strong style={{ fontSize: 15 }} ellipsis>{card.label}</Text>
                  {isHidden && <Tag icon={<EyeInvisibleOutlined />} color="default">숨김</Tag>}
                </div>

                <Space size={6}>
                  <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} aria-label={`${card.label} 위로 이동`} onClick={() => onMoveCardOrder(activeTab, card.id, 'up', scopedCards)} />
                  <Button size="small" icon={<ArrowDownOutlined />} disabled={index === scopedCards.length - 1} aria-label={`${card.label} 아래로 이동`} onClick={() => onMoveCardOrder(activeTab, card.id, 'down', scopedCards)} />
                  <Switch checked={!isHidden} checkedChildren="표시" unCheckedChildren="숨김" onChange={() => onToggleCardVisibility(card.id)} />
                </Space>
              </div>
            );
          })}
        </div>
      </Space>
    </Modal>
  );
}
