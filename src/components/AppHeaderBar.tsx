import React from 'react';
import { Button, Space, Typography } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  SmileOutlined,
  StarFilled,
} from '@ant-design/icons';
import { ChildProfile } from '../types/aac';
import { APP_META, WARM_PASTEL_COLORS } from '../utils/constants';
import { TherapyStepNumber } from './StepProgressBar';

const { Title, Text } = Typography;

/**
 * @description AppHeaderBar 컴포넌트의 Props 인터페이스
 */
export interface AppHeaderBarProps {
  /** 현재 선택된 아동(이용자) 프로필 */
  readonly activeProfile?: ChildProfile;
  /** 현재 명사가 선택되어 2단계(동사 선택) 이상이 활성화되었는지 여부 */
  readonly hasSelectedNoun?: boolean;
  /** 현재 활성화된 단계 페이지 번호 (호환성 유지용 선택적 주입) */
  readonly currentStep?: TherapyStepNumber;
  /** 현재 즐겨찾기 챕터가 열려 있는지 여부 */
  readonly isFavoritesOpen: boolean;
  /** 현재 아동의 저장된 즐겨찾기 표현 개수 */
  readonly favoritesCount: number;
  /** 이용자(아동) 선택·관리 모달 열기 콜백 */
  readonly onOpenProfileModal?: () => void;
  /** 즐겨찾기 챕터 토글 콜백 */
  readonly onToggleFavorites: () => void;
  /** 새 카드 만들기 모달 열기 콜백 */
  readonly onOpenAddModal?: () => void;
  /** 치료사 설정 모달 열기 콜백 */
  readonly onOpenSettingsModal: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 아동의 시각적 주의 분산을 막기 위해 상단 버튼을 최소화한 헤더 컴포넌트
 * - 치료사 전용 관리 기능(이용자 변경, 새 카드 만들기, 음성 설정)은 모두 우측 [⚙️ 설정] 버튼 하나로 통합 수납합니다.
 * @param {AppHeaderBarProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 단순화된 상단 헤더 바 엘리먼트
 */
export function AppHeaderBar({
  activeProfile,
  isFavoritesOpen,
  favoritesCount,
  onToggleFavorites,
  onOpenSettingsModal,
}: AppHeaderBarProps): React.ReactElement {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SmileOutlined style={{ fontSize: 24, color: WARM_PASTEL_COLORS.PRIMARY_BRAND }} />
        <Title level={4} style={{ margin: 0, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
          {APP_META.TITLE}
        </Title>
        {activeProfile && (
          <Text strong style={{ fontSize: 15, color: WARM_PASTEL_COLORS.TEXT_SECONDARY, marginLeft: 4 }}>
            ({activeProfile.avatarEmoji} {activeProfile.name})
          </Text>
        )}
      </div>

      <Space size="small">
        <Button
          type={isFavoritesOpen ? 'primary' : 'default'}
          icon={isFavoritesOpen ? <AppstoreOutlined /> : <StarFilled style={{ color: '#F59E0B' }} />}
          onClick={onToggleFavorites}
          style={{ borderRadius: 14, fontWeight: 700 }}
        >
          {isFavoritesOpen ? '보드로 돌아가기' : `즐겨찾기 (${favoritesCount})`}
        </Button>
        <Button
          icon={<SettingOutlined />}
          aria-label="치료사 설정"
          onClick={onOpenSettingsModal}
          style={{ borderRadius: 14, fontWeight: 600 }}
        >
          설정
        </Button>
      </Space>
    </header>
  );
}

