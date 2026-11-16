import React from 'react';
import { Button, Divider, Form, Modal, Select, Slider, Space, Switch, Typography } from 'antd';
import { PlusCircleOutlined, SoundFilled, UserSwitchOutlined } from '@ant-design/icons';
import { ChildProfile, TtsSettings } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text } = Typography;

/**
 * @description TtsSettingsModal 컴포넌트의 Props 인터페이스
 */
export interface TtsSettingsModalProps {
  /** 모달 열림 여부 */
  readonly open: boolean;
  /** 현재 선택된 아동(이용자) 프로필 */
  readonly activeProfile?: ChildProfile;
  /** 현재 TTS 및 치료 환경 설정값 */
  readonly settings: TtsSettings;
  /** 기기에서 사용 가능한 한국어 음성 목록 */
  readonly koreanVoices: readonly SpeechSynthesisVoice[];
  /** 설정 업데이트 콜백 */
  readonly onUpdateSettings: (partial: Partial<TtsSettings>) => void;
  /** 설정된 목소리로 샘플 문장('빵 주세요') 테스트 발화 콜백 */
  readonly onTestSpeak: (sampleText: string) => void;
  /** 이용자(아동) 변경 및 관리 모달 열기 콜백 */
  readonly onOpenProfileModal?: () => void;
  /** 새 어휘·동작 카드 만들기 모달 열기 콜백 */
  readonly onOpenAddCardModal?: () => void;
  /** 모달 닫기 콜백 */
  readonly onClose: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 아동 화면의 집중도를 높이기 위해 치료사 전용 관리 기능
 * (이용자 변경·관리, 새 카드 만들기, 고품질 TTS 음성·속도 설정)을 하나로 통합 수납한 설정 모달 컴포넌트
 * @param {TtsSettingsModalProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 치료사 통합 설정 및 관리 모달 엘리먼트
 */
export function TtsSettingsModal({
  open,
  activeProfile,
  settings,
  koreanVoices,
  onUpdateSettings,
  onTestSpeak,
  onOpenProfileModal,
  onOpenAddCardModal,
  onClose,
}: TtsSettingsModalProps): React.ReactElement {
  return (
    <Modal
      title="⚙️ 치료사 전용 설정 및 관리"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="test" icon={<SoundFilled />} onClick={() => onTestSpeak('빵 주세요')}>
          “빵 주세요” 미리 들어보기
        </Button>,
        <Button key="close" type="primary" onClick={onClose}>
          완료
        </Button>,
      ]}
    >
      {/* 1. 아동 화면에서 숨겨진 치료사 전용 빠른 관리 메뉴 */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 16,
          backgroundColor: WARM_PASTEL_COLORS.BG_SENTENCE_BAR,
          border: `1px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
          marginBottom: 16,
        }}
      >
        <Text strong style={{ display: 'block', marginBottom: 10, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
          👩‍🏫 치료사 교구 및 이용자 관리
        </Text>
        <Space wrap size="small">
          {onOpenProfileModal && (
            <Button
              icon={<UserSwitchOutlined />}
              onClick={() => {
                onClose();
                onOpenProfileModal();
              }}
              style={{
                minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 8,
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              {activeProfile
                ? `${activeProfile.avatarEmoji} ${activeProfile.name} (이용자 변경·관리)`
                : '이용자(아동) 변경·관리'}
            </Button>
          )}
          {onOpenAddCardModal && (
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                onClose();
                onOpenAddCardModal();
              }}
              style={{
                minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 8,
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              새 카드 만들기 (사진·카메라)
            </Button>
          )}
        </Space>
      </div>

      <Divider style={{ margin: '12px 0' }}>음성(TTS) 상세 설정</Divider>

      <Form layout="vertical">
        <Form.Item label="1. 한국어 목소리 엔진 선택 (고품질 신경망/삼성/구글 음성 자동 추천)">
          <Select
            placeholder="자동 (가장 자연스러운 한국어 고품질 음성)"
            value={settings.preferredVoiceURI || ''}
            onChange={(val) => onUpdateSettings({ preferredVoiceURI: val || undefined })}
            options={[
              { value: '', label: '✨ 자동 선택 (기기 내 최고 품질 한국어 음성)' },
              ...koreanVoices.map((v) => ({
                value: v.voiceURI,
                label: `${v.name} (${v.lang})`,
              })),
            ]}
          />
        </Form.Item>

        <Form.Item label={`2. 말하기 속도 (${settings.rate.toFixed(2)}배속 — 언어치료 권장: 0.85 ~ 0.95)`}>
          <Slider
            min={0.6}
            max={1.2}
            step={0.05}
            value={settings.rate}
            onChange={(val) => onUpdateSettings({ rate: val })}
            marks={{ 0.6: '천천히(0.6x)', 0.92: '권장(0.92x)', 1.2: '빠르게(1.2x)' }}
          />
        </Form.Item>

        <Form.Item label={`3. 목소리 톤 / 음높이 (${settings.pitch.toFixed(2)})`}>
          <Slider
            min={0.8}
            max={1.3}
            step={0.05}
            value={settings.pitch}
            onChange={(val) => onUpdateSettings({ pitch: val })}
            marks={{ 0.8: '차분하게', 1.05: '따뜻하게(권장)', 1.3: '밝고 높게' }}
          />
        </Form.Item>

        <Form.Item label="4. 동사 탭 시 전체 문장 자동 이어읽기">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text type="secondary">
              ‘빵’ 선택 후 ‘주세요’를 누르면 “주세요” 발화 직후 “빵 주세요”를 이어 읽어줍니다.
            </Text>
            <Switch
              checked={settings.autoReadCompletedSentence}
              onChange={(checked) => onUpdateSettings({ autoReadCompletedSentence: checked })}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
