import React, { useState } from 'react';
import { Button, Col, Divider, Input, Modal, Row, Space, Tag, Typography } from 'antd';
import { CheckCircleFilled, DeleteOutlined, UserAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { ChildProfile } from '../types/aac';
import { PROFILE_AVATAR_EMOJIS } from '../utils/aacTemplates';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text, Title } = Typography;

/**
 * @description ChildProfileModal 컴포넌트의 Props 인터페이스
 */
export interface ChildProfileModalProps {
  /** 모달 열림 여부 */
  readonly open: boolean;
  /** 등록된 전체 아동(이용자) 프로필 목록 */
  readonly profiles: readonly ChildProfile[];
  /** 현재 활성화된 아동 프로필 ID */
  readonly activeProfileId: string;
  /** 아동 프로필 선택 콜백 */
  readonly onSelectProfile: (profileId: string) => void;
  /** 새 아동 프로필 추가 콜백 */
  readonly onAddProfile: (name: string, avatarEmoji: string) => void;
  /** 아동 프로필 삭제 콜백 */
  readonly onDeleteProfile: (profileId: string) => void;
  /** 모달 닫기 콜백 */
  readonly onClose: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 앱 시작 시 또는 수업 교대 시 아동(이용자)을 선택·등록하여
 * 즐겨찾기 표현과 커스텀 카드, 녹음 음성을 아동별로 개인화하는 모달 컴포넌트
 * @param {ChildProfileModalProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 아동 프로필 선택 및 관리 모달 엘리먼트
 */
export function ChildProfileModal({
  open,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onDeleteProfile,
  onClose,
}: ChildProfileModalProps): React.ReactElement {
  const [newName, setNewName] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>(PROFILE_AVATAR_EMOJIS[0]);

  const handleCreateProfile = (): void => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddProfile(trimmed, selectedEmoji);
    setNewName('');
  };

  return (
    <Modal
      title="👧👦 수업할 이용자(아동) 선택 및 관리"
      open={open}
      onCancel={onClose}
      width={620}
      footer={[
        <Button key="close" type="primary" size="large" onClick={onClose} style={{ borderRadius: 14, fontWeight: 700 }}>
          현재 선택된 이용자로 시작하기
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 15, color: WARM_PASTEL_COLORS.TEXT_SECONDARY }}>
          이용자(아동)를 선택하면 <b>즐겨찾기 문장, 맞춤 제작 카드, 녹음된 아동 목소리</b>가 이용자별로 독립 관리됩니다.
        </Text>
      </div>

      {/* 등록된 아동 프로필 선택 그리드 */}
      <Row gutter={[12, 12]}>
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          return (
            <Col key={profile.id} xs={12} sm={8}>
              <div
                role="button"
                tabIndex={0}
                aria-label={`${profile.name} 이용자 선택`}
                onClick={() => onSelectProfile(profile.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProfile(profile.id);
                  }
                }}
                style={{
                  position: 'relative',
                  padding: '16px 12px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: isActive ? '#FFF8EC' : '#FFFFFF',
                  border: isActive
                    ? `3px solid ${WARM_PASTEL_COLORS.PRIMARY_BRAND}`
                    : `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
                  boxShadow: isActive ? '0 6px 18px rgba(255, 142, 110, 0.22)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {profiles.length > 1 && (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    aria-label={`${profile.name} 프로필 삭제`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProfile(profile.id);
                    }}
                    style={{ position: 'absolute', top: 6, right: 6 }}
                  />
                )}
                <div style={{ fontSize: 40, lineHeight: 1.2, marginBottom: 6 }}>{profile.avatarEmoji}</div>
                <Title level={5} style={{ margin: 0, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
                  {profile.name}
                </Title>
                <div style={{ marginTop: 6 }}>
                  {isActive ? (
                    <Tag color="volcano" icon={<CheckCircleFilled />} style={{ margin: 0, borderRadius: 10, fontWeight: 700 }}>
                      현재 이용 중
                    </Tag>
                  ) : (
                    <Tag icon={<UserSwitchOutlined />} style={{ margin: 0, borderRadius: 10 }}>
                      터치하여 전환
                    </Tag>
                  )}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      <Divider style={{ margin: '18px 0 14px' }}>새 아동(이용자) 추가하기</Divider>

      {/* 새 아동 등록 폼 */}
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space wrap size={[6, 6]}>
          {PROFILE_AVATAR_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              type={selectedEmoji === emoji ? 'primary' : 'default'}
              onClick={() => setSelectedEmoji(emoji)}
              style={{ fontSize: 20, height: 42, width: 46, padding: 0, borderRadius: 12 }}
            >
              {emoji}
            </Button>
          ))}
        </Space>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Input
            size="large"
            aria-label="새 이용자 이름 입력"
            placeholder="아동 이름 입력 (예: 민준이, 지우)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onPressEnter={handleCreateProfile}
            style={{ borderRadius: 14 }}
          />
          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            disabled={!newName.trim()}
            onClick={handleCreateProfile}
            style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14, fontWeight: 700 }}
          >
            새 이용자 등록
          </Button>
        </div>
      </Space>
    </Modal>
  );
}
