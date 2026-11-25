import React from 'react';
import { Alert, Button, Modal, Radio, Slider, Space, Spin, Typography } from 'antd';
import {
  CaretRightOutlined, CheckOutlined, DeleteOutlined,
  PauseOutlined, ScissorOutlined, UndoOutlined,
} from '@ant-design/icons';
import { AudioTrimMode } from '../hooks/useAudioTrimmer';
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
  readonly trimMode: AudioTrimMode;
  readonly canUndo: boolean;
  readonly durationSec: number;
  readonly peaks: readonly number[];
  readonly range: readonly [number, number];
  readonly onChangeMode: (mode: AudioTrimMode) => void;
  readonly onChangeRange: (nextRange: readonly [number, number]) => void;
  readonly onTogglePreview: () => void;
  readonly onApplyCut: () => void;
  readonly onUndo: () => void;
  readonly onSaveTrimmed: () => void;
  readonly onClose: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 녹음된 아동 음성에서 앞뒤 자르기 및 중간 잡음 삭제(연속 편집·되돌리기 지원)를 수행하는 순수 프레젠테이셔널 모달
 * @param {AudioTrimModalProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 오디오 구간 편집 모달 엘리먼트
 */
export function AudioTrimModal({
  open, sentenceText, isDecoding, isPreviewing, trimError, trimMode, canUndo,
  durationSec, peaks, range, onChangeMode, onChangeRange, onTogglePreview,
  onApplyCut, onUndo, onSaveTrimmed, onClose,
}: AudioTrimModalProps): React.ReactElement {
  const [startSec, endSec] = range;
  const isCutMode = trimMode === 'cut';
  const selectedDuration = Math.max(0, endSec - startSec).toFixed(2);

  return (
    <Modal title={`✂️ “${sentenceText}” 녹음 편집 (앞뒤·중간 잡음 자르기)`} open={open} onCancel={onClose} footer={null} width={600} destroyOnClose>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Radio.Group value={trimMode} onChange={(e) => onChangeMode(e.target.value as AudioTrimMode)} buttonStyle="solid" style={{ width: '100%' }}>
          <Radio.Button value="keep" style={{ width: '50%', textAlign: 'center', fontWeight: 700 }}>
            ✂️ 남길 구간 고르기 (앞뒤 자르기)
          </Radio.Button>
          <Radio.Button value="cut" style={{ width: '50%', textAlign: 'center', fontWeight: 700 }}>
            🗑️ 버릴 중간 잡음 고르기
          </Radio.Button>
        </Radio.Group>

        <Text type="secondary" style={{ fontSize: 13 }}>
          {isCutMode
            ? '빨간색으로 선택한 중간 잡음 구간을 [선택 구간 잘라내기]로 지우고 앞뒤를 이어 붙일 수 있습니다.'
            : '초록색으로 선택한 목표 발화 구간만 남기고 앞뒤 침묵·잡음을 잘라냅니다.'}
        </Text>

        {isDecoding ? (
          <div style={{ padding: '36px 0', textAlign: 'center' }}><Spin tip="소리 파형을 불러오는 중..." /></div>
        ) : (
          <>
            <div
              aria-label="녹음 오디오 파형"
              style={{
                height: 112, padding: '12px 10px', borderRadius: 16, backgroundColor: '#FFFDF8',
                border: `2px solid ${isCutMode ? '#FCA5A5' : WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
                display: 'flex', alignItems: 'center', gap: 3,
              }}
            >
              {peaks.map((peak, idx) => {
                const barTime = (peaks.length > 0 ? (idx + 0.5) / peaks.length : 0) * durationSec;
                const inSelection = barTime >= startSec && barTime <= endSec;
                const barColor = isCutMode
                  ? (inSelection ? '#EF4444' : WARM_PASTEL_COLORS.VERB_ACCENT)
                  : (inSelection ? WARM_PASTEL_COLORS.VERB_ACCENT : '#D9D4CE');
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1, height: `${Math.round(peak * 100)}%`, minHeight: 6, borderRadius: 4,
                      backgroundColor: barColor, opacity: isCutMode || inSelection ? 1 : 0.4, transition: 'background-color 0.15s ease',
                    }}
                  />
                );
              })}
            </div>

            {durationSec > 0 && (
              <div>
                <Slider
                  range min={0} max={Number(durationSec.toFixed(2))} step={0.05} value={[startSec, endSec]}
                  onChange={(val) => { if (Array.isArray(val) && val.length === 2) onChangeRange([val[0], val[1]]); }}
                  tooltip={{ formatter: (v) => `${v?.toFixed(2) ?? '0.00'}초` }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: WARM_PASTEL_COLORS.TEXT_PRIMARY }}>
                  <span>시작: {startSec.toFixed(2)}초</span>
                  <span style={{ color: isCutMode ? '#EF4444' : WARM_PASTEL_COLORS.VERB_ACCENT }}>
                    {isCutMode ? `삭제할 잡음: ${selectedDuration}초` : `남길 길이: ${selectedDuration}초`}
                  </span>
                  <span>끝: {endSec.toFixed(2)}초 (전체 {durationSec.toFixed(2)}초)</span>
                </div>
              </div>
            )}
          </>
        )}

        {trimError && <Alert type="warning" showIcon message={trimError} style={{ borderRadius: 12 }} />}

        <Space wrap style={{ justifyContent: 'space-between', width: '100%', marginTop: 4 }}>
          <Space wrap>
            <Button size="large" icon={isPreviewing ? <PauseOutlined /> : <CaretRightOutlined />} disabled={isDecoding || durationSec <= 0} onClick={onTogglePreview} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14, fontWeight: 700 }}>
              {isPreviewing ? '정지' : isCutMode ? '현재 전체 미리듣기' : '선택 구간 미리듣기'}
            </Button>
            <Button danger={isCutMode} size="large" icon={isCutMode ? <DeleteOutlined /> : <ScissorOutlined />} disabled={isDecoding || durationSec <= 0} onClick={onApplyCut} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14, fontWeight: 700 }}>
              {isCutMode ? '중간 잡음 잘라내기' : '이 구간만 남기기'}
            </Button>
            <Button size="large" icon={<UndoOutlined />} disabled={!canUndo} onClick={onUndo} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14 }}>
              되돌리기
            </Button>
          </Space>

          <Space>
            <Button
              type="primary" size="large" icon={<CheckOutlined />} disabled={isDecoding || durationSec <= 0} onClick={onSaveTrimmed}
              style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14, fontWeight: 700, backgroundColor: WARM_PASTEL_COLORS.VERB_ACCENT, borderColor: WARM_PASTEL_COLORS.VERB_ACCENT }}
            >
              저장하기
            </Button>
            <Button size="large" onClick={onClose} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE - 4, borderRadius: 14 }}>취소</Button>
          </Space>
        </Space>
      </div>
    </Modal>
  );
}
