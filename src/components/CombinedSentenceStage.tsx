import React, { useEffect, useRef } from 'react';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, SoundFilled, StarFilled } from '@ant-design/icons';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';
import { AnimatedVerbGraphic } from './AnimatedVerbGraphic';
import { CombinedActionScene } from './CombinedActionScene';
import { VoiceRecordBar } from './VoiceRecordBar';
import '../assets/verbMotions.css';

const { Title, Text } = Typography;

/**
 * @description 문장 완성 후 제시 단계 구분 타입
 * - 'combo': 3단계 페이지로 [명사 카드] + [동사 카드] 조합과 "빵 먹어요" 표현을 제시하는 단계
 * - 'merged': 4단계 페이지로 실제로 빵을 먹는 '하나의 결합된 동작 그림'을 제시하며 아동 녹음 음성(또는 TTS)을 제시하는 단계
 */
export type CombinedStagePhase = 'combo' | 'merged';

/**
 * @description CombinedSentenceStage 컴포넌트의 Props 인터페이스
 */
export interface CombinedSentenceStageProps {
  /** 현재 활성화된 아동(이용자) 프로필 ID */
  readonly activeProfileId?: string;
  /** 선택된 명사 카드 (예: 빵) */
  readonly nounCard: AacCard;
  /** 선택된 동사 카드 (예: 먹어요) */
  readonly verbCard: AacCard;
  /** 완성된 문장 텍스트 (예: '빵 먹어요') */
  readonly sentenceText: string;
  /** 현재 제시 단계 ('combo': 3단계 두 카드 조합 페이지 -> 'merged': 4단계 하나의 통합 동작 그림 페이지) */
  readonly stagePhase: CombinedStagePhase;
  /** 이미 즐겨찾기에 저장된 문장인지 여부 */
  readonly isFavoriteSaved: boolean;
  /** 단계 전환 콜백 (withTts가 true일 때만 기본 TTS 발화) */
  readonly onChangePhase: (phase: CombinedStagePhase, withTts?: boolean) => void;
  /** 1차 조합 제시 -> 2차 통합 동작 제시 시퀀스 전체 다시 실행 콜백 */
  readonly onReplaySequence: () => void;
  /** TTS 발화 및 자동 전환 타이머 즉시 정지 콜백 */
  readonly onStopTts: () => void;
  /** 즐겨찾기 저장 콜백 */
  readonly onSaveFavorite: () => void;
  /** 2단계(동사 다시 고르기) 페이지로 돌아가는 콜백 */
  readonly onBackToVerbStep?: () => void;
  /** 1단계 다른 문장 만들기(처음으로) 콜백 */
  readonly onReset: () => void;
}

/**
 * @description [HR-01, HR-03, HR-05] 명사+동사 선택 완료 시 단독 페이지로 전환되는 3·4단계 학습 스테이지:
 * 1) 3단계('combo'): [빵 그림 + 먹는 그림] 카드 조합과 "빵 먹어요" 단독 페이지 제시 후,
 * 2) 4단계('merged'): 실제로 빵을 먹는 '하나의 움직이는 동작 그림(CombinedActionScene)' 단독 페이지로 전환하여
 *    녹음된 아동 음성(없으면 기본 TTS)으로 "빵 먹어요"를 들려줍니다.
 * @param {CombinedSentenceStageProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 결합 동작 학습 스테이지 엘리먼트
 */
export function CombinedSentenceStage({
  activeProfileId, nounCard, verbCard, sentenceText, stagePhase, isFavoriteSaved,
  onChangePhase, onReplaySequence, onStopTts, onSaveFavorite, onBackToVerbStep, onReset,
}: CombinedSentenceStageProps): React.ReactElement {
  const isMerged = stagePhase === 'merged';
  const prevPhaseRef = useRef<CombinedStagePhase>(stagePhase);

  const {
    isRecording, isRecordingPaused, isPlayingRecordedVoice, recordError, hasRecordedVoice,
    startRecording, pauseRecording, resumeRecording, stopRecordingAndSave, handleAudioFile,
    playRecordedVoice, deleteRecordedVoice, stopVoiceAll,
  } = useVoiceRecorder(activeProfileId);

  const hasChildVoice = hasRecordedVoice(sentenceText);

  /** 1단계(combo)에서 2단계(merged)로 자동 전환될 때 녹음된 아동 음성이 있으면 TTS를 멈추고 아동 음성을 재생 */
  useEffect(() => {
    const transitionedToMerged = prevPhaseRef.current !== 'merged' && stagePhase === 'merged';
    prevPhaseRef.current = stagePhase;

    if (transitionedToMerged && hasChildVoice && !isRecording) {
      onStopTts();
      playRecordedVoice(sentenceText);
    }
  }, [stagePhase, hasChildVoice, isRecording, sentenceText, onStopTts, playRecordedVoice]);

  /** 녹음 완료 또는 수동 버튼으로 2단계 통합 동작 그림과 아동 음성을 실행하는 핸들러 */
  const switchToMergedWithoutTts = (): void => {
    prevPhaseRef.current = 'merged';
    onStopTts();
    onChangePhase('merged', false);
  };

  return (
    <Card
      aria-label="명사 동사 결합 학습 스테이지"
      style={{
        backgroundColor: isMerged ? '#FFFDF7' : '#FFF8EC',
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        border: `4px solid ${WARM_PASTEL_COLORS.PRIMARY_BRAND}`,
        boxShadow: '0 12px 32px rgba(255, 142, 110, 0.22)',
        marginBottom: 18,
        textAlign: 'center',
      }}
    >
      {/* 상단: 1차(카드 조합 제시) -> 2차(하나의 통합 동작 그림 제시) 진행 표시줄 */}
      <Space wrap style={{ marginBottom: 12 }} size="middle">
        <Button type={!isMerged ? 'primary' : 'default'} onClick={() => { stopVoiceAll(); onChangePhase('combo', true); }} style={{ borderRadius: 16, fontWeight: 700 }}>
          ① 낱말 카드 조합 ({nounCard.label} + {verbCard.label})
        </Button>
        <Text strong style={{ fontSize: 18, color: WARM_PASTEL_COLORS.PRIMARY_BRAND }}>➔</Text>
        <Button
          type={isMerged ? 'primary' : 'default'}
          onClick={() => {
            if (hasChildVoice) {
              switchToMergedWithoutTts();
              playRecordedVoice(sentenceText);
            } else {
              onChangePhase('merged', true);
            }
          }}
          style={{ borderRadius: 16, fontWeight: 700 }}
        >
          ② 하나로 합쳐진 실제 동작 그림 ({sentenceText})
        </Button>
      </Space>

      {/* 중앙 시각 제시 영역 */}
      <div style={{ minHeight: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 14px' }}>
        {!isMerged ? (
          <div aria-label="두 카드 조합 제시 화면" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ padding: '14px 24px', borderRadius: 22, backgroundColor: '#FFFFFF', border: `3px solid ${WARM_PASTEL_COLORS.NOUN_ACCENT}` }}>
              {nounCard.customImageUrl ? (
                <img src={nounCard.customImageUrl} alt={nounCard.label} className="noun-active-motion" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 16 }} />
              ) : (
                <span className="noun-active-motion" style={{ fontSize: 64 }}>{nounCard.emoji}</span>
              )}
              <div><Text strong style={{ fontSize: 22 }}>{nounCard.label}</Text></div>
            </div>
            <Title level={2} style={{ margin: 0, color: WARM_PASTEL_COLORS.PRIMARY_BRAND }}>+</Title>
            <div style={{ padding: '14px 24px', borderRadius: 22, backgroundColor: '#FFFFFF', border: `3px solid ${WARM_PASTEL_COLORS.VERB_ACCENT}` }}>
              <AnimatedVerbGraphic emoji={verbCard.emoji} label={verbCard.label} motionType={verbCard.motionType} customImageUrl={verbCard.customImageUrl} size={76} isActive={true} />
              <div><Text strong style={{ fontSize: 22 }}>{verbCard.label}</Text></div>
            </div>
          </div>
        ) : (
          <div aria-label="하나로 결합된 실제 동작 화면">
            <CombinedActionScene nounCard={nounCard} verbCard={verbCard} size={196} />
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Tag color={isMerged ? 'volcano' : 'orange'} style={{ padding: '8px 26px', fontSize: 28, fontWeight: 800, borderRadius: 20 }}>
            “{sentenceText}”
          </Tag>
        </div>
      </div>

      {/* 아동 음성 녹음(일시정지·재개 포함) 및 통합 동작 그림 재생 컨트롤 바 */}
      <VoiceRecordBar
        sentenceText={sentenceText}
        hasRecordedVoice={hasChildVoice}
        isRecording={isRecording}
        isRecordingPaused={isRecordingPaused}
        isPlayingRecordedVoice={isPlayingRecordedVoice}
        recordError={recordError}
        onStartRecording={() => { onStopTts(); void startRecording(sentenceText, switchToMergedWithoutTts); }}
        onPauseRecording={() => { onStopTts(); pauseRecording(); }}
        onResumeRecording={() => { onStopTts(); resumeRecording(sentenceText, switchToMergedWithoutTts); }}
        onStopRecording={() => { onStopTts(); void stopRecordingAndSave(sentenceText, switchToMergedWithoutTts); }}
        onSelectAudioFile={(file) => { onStopTts(); void handleAudioFile(sentenceText, file, switchToMergedWithoutTts); }}
        onPlayRecordedWithScene={() => { switchToMergedWithoutTts(); playRecordedVoice(sentenceText); }}
        onDeleteRecording={() => deleteRecordedVoice(sentenceText)}
      />

      {/* 하단 제어 버튼 (이전 단계 복귀 및 전체 초기화 포함) */}
      <Space wrap size="middle" style={{ marginTop: 12 }}>
        <Button type="primary" size="large" icon={<SoundFilled />} onClick={() => { stopVoiceAll(); onReplaySequence(); }} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE, borderRadius: 16, fontWeight: 700, fontSize: 17 }}>
          조합 ➔ 통합 동작 연속으로 다시 보기·듣기
        </Button>
        <Button size="large" icon={<StarFilled style={{ color: isFavoriteSaved ? '#F59E0B' : undefined }} />} disabled={isFavoriteSaved} onClick={onSaveFavorite} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE, borderRadius: 16, fontWeight: 600 }}>
          {isFavoriteSaved ? '즐겨찾기 저장됨' : '즐겨찾기에 저장'}
        </Button>
        {onBackToVerbStep && (
          <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => { stopVoiceAll(); onBackToVerbStep(); }} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE, borderRadius: 16, fontWeight: 600 }}>
            동사 다시 고르기
          </Button>
        )}
        <Button size="large" icon={<ReloadOutlined />} onClick={() => { stopVoiceAll(); onReset(); }} style={{ minHeight: TOUCH_METRICS.MIN_TARGET_SIZE, borderRadius: 16 }}>
          다른 문장 만들기
        </Button>
      </Space>
    </Card>
  );
}
