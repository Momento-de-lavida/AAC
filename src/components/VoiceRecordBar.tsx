import React, { useRef } from 'react';
import { Alert, Button, Space, Tag, Typography } from 'antd';
import {
  AudioFilled, AudioMutedOutlined, CaretRightOutlined,
  DeleteOutlined, FolderOpenOutlined, PauseCircleOutlined, SoundFilled,
} from '@ant-design/icons';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text } = Typography;

/**
 * @description VoiceRecordBar 컴포넌트의 Props 인터페이스
 */
export interface VoiceRecordBarProps {
  readonly sentenceText: string;
  readonly hasRecordedVoice: boolean;
  readonly isRecording: boolean;
  readonly isRecordingPaused?: boolean;
  readonly isPlayingRecordedVoice: boolean;
  readonly recordError: string | null;
  readonly onStartRecording: () => void;
  readonly onPauseRecording?: () => void;
  readonly onResumeRecording?: () => void;
  readonly onStopRecording: () => void;
  readonly onSelectAudioFile: (file: File | undefined) => void;
  readonly onPlayRecordedWithScene: () => void;
  readonly onDeleteRecording: () => void;
}

const BTN_HEIGHT = TOUCH_METRICS.MIN_TARGET_SIZE - 6;

/**
 * @description [HR-01, HR-03, HR-05] 아동 음성을 녹음(치료사 모델링 구간 일시정지·재개 포함)하여 통합 동작 그림에 적용하는 컨트롤 바
 * @param {VoiceRecordBarProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 아동 음성 녹음 및 재생 컨트롤 바 엘리먼트
 */
export function VoiceRecordBar({
  sentenceText, hasRecordedVoice, isRecording, isRecordingPaused = false, isPlayingRecordedVoice,
  recordError, onStartRecording, onPauseRecording, onResumeRecording, onStopRecording,
  onSelectAudioFile, onPlayRecordedWithScene, onDeleteRecording,
}: VoiceRecordBarProps): React.ReactElement {
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      aria-label="아동 음성 녹음 컨트롤 바"
      style={{
        marginTop: 12, padding: '10px 16px', borderRadius: 18,
        backgroundColor: hasRecordedVoice ? '#ECFDF5' : '#FFFDF8',
        border: `2px dashed ${hasRecordedVoice ? WARM_PASTEL_COLORS.VERB_ACCENT : WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}
    >
      <Space wrap align="center" size="small">
        <Text strong style={{ fontSize: 15, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
          🎤 통합 동작 그림 아동 목소리:
        </Text>

        {!isRecording ? (
          <>
            <Button
              type={hasRecordedVoice ? 'default' : 'primary'}
              icon={<AudioFilled style={{ color: hasRecordedVoice ? '#EF4444' : undefined }} />}
              onClick={onStartRecording}
              style={{
                minHeight: BTN_HEIGHT, borderRadius: 14, fontWeight: 700,
                backgroundColor: hasRecordedVoice ? '#FFFFFF' : '#10B981', borderColor: '#10B981',
              }}
            >
              {hasRecordedVoice ? '아동 음성 다시 녹음하기' : '아동 음성 녹음하기'}
            </Button>
            <Button icon={<FolderOpenOutlined />} onClick={() => audioFileInputRef.current?.click()} style={{ minHeight: BTN_HEIGHT, borderRadius: 14 }}>
              녹음 파일·기기 녹음기
            </Button>
          </>
        ) : (
          <>
            {!isRecordingPaused ? (
              <Button
                icon={<PauseCircleOutlined />}
                onClick={onPauseRecording}
                style={{
                  minHeight: BTN_HEIGHT, borderRadius: 14, fontWeight: 700,
                  backgroundColor: '#FEF3C7', borderColor: '#F59E0B', color: '#B45309',
                }}
              >
                ⏸️ 일시정지 (선생님 시범 말하기)
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CaretRightOutlined />}
                onClick={onResumeRecording}
                style={{ minHeight: BTN_HEIGHT, borderRadius: 14, fontWeight: 700, backgroundColor: '#10B981', borderColor: '#10B981' }}
              >
                ▶️ 이어서 녹음 (아이 따라 말하기)
              </Button>
            )}
            <Button
              danger
              type="primary"
              icon={<AudioMutedOutlined />}
              onClick={onStopRecording}
              style={{
                minHeight: BTN_HEIGHT, borderRadius: 14, fontWeight: 700,
                animation: isRecordingPaused ? undefined : 'gentlePulse 0.8s infinite',
              }}
            >
              ⏹️ 녹음 완료 (“{sentenceText}” 저장)
            </Button>
          </>
        )}

        <input
          ref={audioFileInputRef}
          type="file"
          accept="audio/*"
          capture
          aria-label="아동 음성 파일 또는 기기 녹음기 입력"
          onChange={(e) => { onSelectAudioFile(e.target.files?.[0]); e.target.value = ''; }}
          style={{ display: 'none' }}
        />

        {hasRecordedVoice && !isRecording && (
          <>
            <Button
              type="primary"
              icon={<SoundFilled />}
              onClick={onPlayRecordedWithScene}
              style={{ minHeight: BTN_HEIGHT, borderRadius: 14, fontWeight: 700, backgroundColor: WARM_PASTEL_COLORS.VERB_ACCENT }}
            >
              {isPlayingRecordedVoice ? '🔊 아동 목소리 재생 중...' : '👧 아동 목소리로 통합 동작 보기'}
            </Button>
            <Button danger size="small" icon={<DeleteOutlined />} aria-label="녹음된 아동 음성 삭제" onClick={onDeleteRecording} style={{ borderRadius: 12 }}>
              녹음 지우기
            </Button>
          </>
        )}
      </Space>

      {isRecording ? (
        <Tag color={isRecordingPaused ? 'gold' : 'red'} style={{ borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {isRecordingPaused
            ? '⏸️ 녹음 일시정지됨 — 선생님이 시범을 들려주신 뒤 아이가 말할 때 [▶️ 이어서 녹음]을 눌러주세요!'
            : '🔴 아이 목소리 녹음 중 — 선생님이 한 단어씩 시범을 보여줄 때는 [⏸️ 일시정지]를 눌러주세요!'}
        </Tag>
      ) : hasRecordedVoice ? (
        <Tag color="green" style={{ borderRadius: 12, fontSize: 13, fontWeight: 600 }}>
          ✓ [② 하나로 합쳐진 실제 동작 그림]에서 녹음된 아동의 실제 목소리가 재생됩니다!
        </Tag>
      ) : (
        <Text type="secondary" style={{ fontSize: 13 }}>
          한 단어씩 모방발화를 유도할 때는 선생님 시범 전에 [⏸️ 일시정지], 아이 발화 차례에 [▶️ 이어서 녹음]을 눌러주세요!
        </Text>
      )}

      {recordError && <Alert type="warning" showIcon message={recordError} style={{ borderRadius: 12, width: '100%' }} />}
    </div>
  );
}
