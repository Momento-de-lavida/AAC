import React from 'react';
import { Alert, Button, Modal, Slider, Space, Spin, Typography } from 'antd';
import { CaretRightOutlined, PauseOutlined, ScissorOutlined } from '@ant-design/icons';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text } = Typography;

/**
 * @description AudioTrimModal 컴포넌트의 Props 인터페이스
 */
export interface AudioTrimModalProps {
  readonly open: boolean;
  readonly sentenceText: string;
  readonly isDecoding: boolean;
  readonly isPreviewing: boolean;
  readonly trimError: string | null;
  readonly durationSec: number;
  readonly peaks: readonly number[];
  readonly range: readonly [number, number];
  readonly onChangeRange: (nextRange: readonly [number, number]) => void;
  readonly onTogglePreview: () => void;
  readonly onSaveTrimmed: () => void;
  readonly onClose: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 녹음된 아동 음성에서 앞뒤 잡음·침묵을 파형으로 확인하며 잘라내는 순수 프레젠테이셔널 모달
 * @param {AudioTrimModalProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 오디오 구간 자르기 모달 엘리먼트
 */
export function AudioTrimModal({
  open, sentenceText, isDecoding, isPreviewing, trimError,
  durationSec, peaks, range, onChangeRange, onTogglePreview, onSaveTrimmed, onClose,
}: AudioTrimModalProps): React.ReactElement {
  const [startSec, endSec] = range;
  const selectedDuration = Math.max(0, endSec - startSec).toFixed(2);

  return (
    <Modal
      title={`✂️ “${sentenceText}” 녹음 구간 자르기`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      destroyOnClose
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          양쪽 동그라미 핸들을 움직여 <strong>목표 발화(초록색 구간)</strong>만 남기고 앞뒤 잡음을 잘라내세요.
        </Text>

        {isDecoding ? (
          <div style={{ padding: '36px 0', textAlign: 'center' }}>
            <Spin tip="소리 파형을 불러오는 중..." />
          </div>
        ) : (
          <>
            {/* 소리 크기 파형(Waveform) 시각화 영역 */}
            <div
              aria-label="녹음 오디오 파형"
              style={{
                height: 112,
                padding: '12px 10px',
                borderRadius: 16,
                backgroundColor: '#FFFDF8',
                border: `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {peaks.map((peak, idx) => {
                const ratio = peaks.length > 0 ? (idx + 0.5) / peaks.length : 0;
                const barTime = ratio * durationSec;
                const inSelection = barTime >= startSec && barTime <= endSec;
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${Math.round(peak * 100)}%`,
                      minHeight: 6,
                      borderRadius: 4,
                      backgroundColor: inSelection ? WARM_PASTEL_COLORS.VERB_ACCENT : '#D9D4CE',
                      opacity: inSelection ? 1 : 0.45,
                      transition: 'background-color 0.15s ease',
                    }}
                  />
                );
              })}
            </div>

            {durationSec > 0 && (
              <div>
                <Slider
                  range
                  min={0}
                  max={Number(durationSec.toFixed(2))}
                  step={0.05}
                  value={[startSec, endSec]}
                  onChange={(val) => {
                    if (Array.isArray(val) && val.length === 2) {
                      onChangeRange([val[0], val[1]]);
                    }
                  }}
                  tooltip={{ formatter: (v) => `${v?.toFixed(2) ?? '0.00'}초` }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
                  <span>시작: {startSec.toFixed(2)}초</span>
                  <span style={{ color: WARM_PASTEL_COLORS.VERB_ACCENT }}>남길 길이: {selectedDuration}초</span>
                  <span>끝: {endSec.toFixed(2)}초 (전체 {durationSec.toFixed(2)}초)</span>
                </div>
              </div>
            )}
          </>
        )}

        {trimError && <Alert type="warning" showIcon message={trimError} style={{ borderRadius: 12 }} />}

        <Space wrap style={{ justifyContent: 'flex-end', width: '100%', marginTop: 4 }}>
          <Button
            size="large"
            icon={isPreviewing ? <PauseOutlined /> : <CaretRightOutlined />}
            disabled={isDecoding || durationSec <= 0}
            onClick={onTogglePreview}
            style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14, fontWeight: 700 }}
          >
            {isPreviewing ? '미리듣기 정지' : '선택 구간 미리듣기'}
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<ScissorOutlined />}
            disabled={isDecoding || durationSec <= 0}
            onClick={onSaveTrimmed}
            style={{
              minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4,
              borderRadius: 14,
              fontWeight: 700,
              backgroundColor: WARM_PASTEL_COLORS.VERB_ACCENT,
              borderColor: WARM_PASTEL_COLORS.VERB_ACCENT,
            }}
          >
            이 구간만 남기고 저장
          </Button>
          <Button size="large" onClick={onClose} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14 }}>
            취소
          </Button>
        </Space>
      </div>
    </Modal>
  );
}
