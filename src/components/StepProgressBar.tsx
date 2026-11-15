import React from 'react';
import { Button, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { AacCard } from '../types/aac';
import { TOUCH_METRICS, WARM_PASTEL_COLORS } from '../utils/constants';

const { Text } = Typography;

/**
 * @description 단계별 단독 페이지 전환을 위한 학습 단계 번호 타입
 * - 1: 1단계 명사 고르기 단독 페이지
 * - 2: 2단계 동사 고르기 단독 페이지
 * - 3: 3단계 낱말 카드 조합(명사+동사) 단독 페이지
 * - 4: 4단계 하나로 합쳐진 실제 동작 그림 & 음성 녹음 단독 페이지
 */
export type TherapyStepNumber = 1 | 2 | 3 | 4;

/**
 * @description StepProgressBar 컴포넌트의 Props 인터페이스
 */
export interface StepProgressBarProps {
  /** 현재 화면에 활성화된 페이지 단계 번호 (1 ~ 4) */
  readonly currentStep: TherapyStepNumber;
  /** 1단계에서 선택된 명사 카드 (없으면 undefined) */
  readonly selectedNoun?: AacCard;
  /** 2단계에서 선택된 동사 카드 (없으면 undefined) */
  readonly selectedVerb?: AacCard;
  /** 특정 단계 페이지로 즉시 전환하는 콜백 */
  readonly onSelectStep: (step: TherapyStepNumber) => void;
}

interface StepItemMeta {
  readonly step: TherapyStepNumber;
  readonly title: string;
  readonly badgeText?: string;
  readonly enabled: boolean;
}

/**
 * @description [HR-01, HR-03, HR-05, HR-06] 단계별 단독 페이지 전환 네비게이션 바 컴포넌트
 * 설계 이유(Why):
 * - 한 화면에 명사·동사·결합 스테이지를 동시에 쌓아두면 자폐 아동의 시각적 주의가 분산됩니다.
 * - 현재 위치한 단계 페이지를 명확히 보여주고, 아동과 언어재활사가 원할 때 이전/다음 단계 페이지로
 *   즉시 전환(역이동 및 순차 이동)할 수 있도록 최소 터치 타겟(52px) 이상의 단계 스텝 버튼을 제공합니다.
 * @param {StepProgressBarProps} props 컴포넌트 프로퍼티
 * @returns {React.ReactElement} 단계별 페이지 전환 네비게이션 엘리먼트
 */
export function StepProgressBar({
  currentStep,
  selectedNoun,
  selectedVerb,
  onSelectStep,
}: StepProgressBarProps): React.ReactElement {
  const hasNoun = Boolean(selectedNoun);
  const hasBoth = Boolean(selectedNoun && selectedVerb);

  const steps: readonly StepItemMeta[] = [
    {
      step: 1,
      title: '1단계: 명사 페이지',
      badgeText: selectedNoun ? selectedNoun.label : '무엇을?',
      enabled: true,
    },
    {
      step: 2,
      title: '2단계: 동사 페이지',
      badgeText: selectedVerb ? selectedVerb.label : '어떻게?',
      enabled: hasNoun,
    },
    {
      step: 3,
      title: '3단계: 카드 조합 페이지',
      badgeText: hasBoth ? `${selectedNoun?.label}+${selectedVerb?.label}` : undefined,
      enabled: hasBoth,
    },
    {
      step: 4,
      title: '4단계: 통합 동작 페이지',
      badgeText: hasBoth ? '실제 동작 그림' : undefined,
      enabled: hasBoth,
    },
  ];

  const canGoPrev = currentStep > 1;
  const canGoNext =
    (currentStep === 1 && hasNoun) ||
    (currentStep === 2 && hasBoth) ||
    (currentStep === 3 && hasBoth);

  const handlePrevStep = (): void => {
    if (currentStep > 1) {
      onSelectStep((currentStep - 1) as TherapyStepNumber);
    }
  };

  const handleNextStep = (): void => {
    if (currentStep < 4 && canGoNext) {
      onSelectStep((currentStep + 1) as TherapyStepNumber);
    }
  };

  return (
    <nav
      aria-label="단계별 페이지 전환 네비게이션"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        padding: '10px 16px',
        marginBottom: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: TOUCH_METRICS.CARD_BORDER_RADIUS,
        border: `2px solid ${WARM_PASTEL_COLORS.NOUN_CARD_BORDER}`,
        boxShadow: '0 4px 12px rgba(61, 53, 46, 0.05)',
      }}
    >
      {/* 좌측: 1~4단계 페이지 직접 전환 스텝 버튼 목록 */}
      <Space wrap size="small">
        {steps.map((item, idx) => {
          const isCurrent = currentStep === item.step;
          const isCompleted = currentStep > item.step && item.enabled;

          return (
            <React.Fragment key={item.step}>
              {idx > 0 && (
                <Text strong style={{ color: WARM_PASTEL_COLORS.TEXT_SECONDARY, fontSize: 15 }}>
                  ➔
                </Text>
              )}
              <Button
                type={isCurrent ? 'primary' : 'default'}
                disabled={!item.enabled}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => onSelectStep(item.step)}
                style={{
                  minHeight: TOUCH_METRICS.MIN_TARGET_SIZE,
                  borderRadius: 16,
                  fontWeight: isCurrent ? 800 : 600,
                  borderColor: isCompleted ? WARM_PASTEL_COLORS.VERB_ACCENT : undefined,
                }}
              >
                {isCompleted && (
                  <CheckCircleFilled
                    style={{ color: WARM_PASTEL_COLORS.VERB_ACCENT, marginRight: 4 }}
                  />
                )}
                <span>{item.title}</span>
                {item.badgeText && (
                  <Tag
                    color={isCurrent ? 'gold' : isCompleted ? 'green' : 'default'}
                    style={{ marginLeft: 6, marginRight: 0, borderRadius: 10, fontWeight: 700 }}
                  >
                    {item.badgeText}
                  </Tag>
                )}
              </Button>
            </React.Fragment>
          );
        })}
      </Space>

      {/* 우측: 직관적인 이전 페이지 / 다음 페이지 전환 버튼 */}
      <Space size="small">
        <Button
          icon={<ArrowLeftOutlined />}
          disabled={!canGoPrev}
          onClick={handlePrevStep}
          style={{
            minHeight: TOUCH_METRICS.MIN_TARGET_SIZE,
            borderRadius: 14,
            fontWeight: 700,
          }}
        >
          이전 단계 페이지
        </Button>
        <Button
          type="primary"
          disabled={!canGoNext}
          onClick={handleNextStep}
          style={{
            minHeight: TOUCH_METRICS.MIN_TARGET_SIZE,
            borderRadius: 14,
            fontWeight: 700,
            backgroundColor: canGoNext ? WARM_PASTEL_COLORS.VERB_ACCENT : undefined,
          }}
        >
          다음 단계 페이지 <ArrowRightOutlined />
        </Button>
      </Space>
    </nav>
  );
}
