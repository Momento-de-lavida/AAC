import React, { useMemo, useState } from 'react';
import { AddCustomCardModal } from '../components/AddCustomCardModal';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { CombinedSentenceStage } from '../components/CombinedSentenceStage';
import { FavoriteChapterSection } from '../components/FavoriteChapterSection';
import { NounBoardSection } from '../components/NounBoardSection';
import { SentenceStripBar } from '../components/SentenceStripBar';
import { StepProgressBar, TherapyStepNumber } from '../components/StepProgressBar';
import { TtsSettingsModal } from '../components/TtsSettingsModal';
import { VerbBoardSection } from '../components/VerbBoardSection';
import { useStepTransition } from '../hooks/useStepTransition';
import { useTTS } from '../hooks/useTTS';
import { getVisibleCards, useAacStore } from '../store/useAacStore';
import { AacCard, FavoriteSentence } from '../types/aac';
import { NOUN_CATEGORIES } from '../utils/aacTemplates';
import { WARM_PASTEL_COLORS } from '../utils/constants';

/**
 * @description [HR-01, HR-03, HR-05] 자폐 아동 맞춤형 단계별 단독 페이지 전환 컨테이너:
 * - 1단계 페이지: 명사 보드 단독 제시
 * - 2단계 페이지: 동사 보드 단독 제시 (명사 보드 숨김)
 * - 3단계 페이지: [명사 + 동사] 낱말 카드 조합 단독 제시
 * - 4단계 페이지: 하나로 결합된 실제 동작 그림 및 아동 음성 녹음 단독 제시
 * @returns {React.ReactElement} 메인 홈 페이지 엘리먼트
 */
export function HomePage(): React.ReactElement {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTtsModalOpen, setIsTtsModalOpen] = useState<boolean>(false);

  const {
    activeChapter, activeCategory, selectedCards, customCards, favoriteSentences, ttsSettings,
    setActiveChapter, setActiveCategory, selectCard, removeSelectedCardAt, clearSelectedVerb,
    clearSentence, getSentenceText, saveCurrentAsFavorite, removeFavoriteSentence,
    applyFavoriteSentence, addCustomCard, deleteCustomCard, updateTtsSettings,
  } = useAacStore();

  const { isSpeaking, speakingText, koreanVoices, speak, speakWithSentence, stop } = useTTS(ttsSettings);
  const { nouns, verbs } = useMemo(() => getVisibleCards(activeCategory, customCards), [activeCategory, customCards]);
  const selectedCardIds = useMemo(() => new Set(selectedCards.map((c) => c.id)), [selectedCards]);
  const selectedNoun = useMemo(() => selectedCards.find((c) => c.partOfSpeech === 'noun'), [selectedCards]);
  const selectedVerb = useMemo(() => selectedCards.find((c) => c.partOfSpeech === 'verb'), [selectedCards]);
  const hasSelectedNoun = Boolean(selectedNoun);
  const hasCompletedSentence = Boolean(selectedNoun && selectedVerb);
  const sentenceText = getSentenceText();

  const { stagePhase, currentStep, setStagePhase, scheduleMergeTransition, stopAllSpeechAndTimers } =
    useStepTransition({ selectedNoun, selectedVerb, stopTts: stop });

  const isFavoriteSaved = useMemo(
    () => Boolean(sentenceText) && favoriteSentences.some((f) => f.sentenceText === sentenceText),
    [sentenceText, favoriteSentences]
  );

  /** 명사 또는 동사 카드 탭 시 다음 단계 페이지로 전환 및 발화 처리 */
  const handleSelectCard = (card: AacCard): void => {
    const { wordSpeech, completedSentenceSpeech } = selectCard(card);
    if (completedSentenceSpeech) {
      scheduleMergeTransition();
      speakWithSentence(wordSpeech, completedSentenceSpeech, () => setStagePhase('merged'));
    } else {
      setStagePhase('combo');
      speak(wordSpeech);
    }
  };

  /** 즐겨찾기 챕터에서 문장 탭 시 즉시 3단계 조합 페이지 -> 4단계 통합 동작 페이지 시퀀스 실행 */
  const handleSelectFavorite = (favorite: FavoriteSentence): void => {
    const text = applyFavoriteSentence(favorite);
    scheduleMergeTransition();
    speakWithSentence(text, text, () => setStagePhase('merged'));
  };

  /** 전체 비우기 및 1단계(명사 고르기 페이지)로 복귀 */
  const handleClearAll = (): void => { stopAllSpeechAndTimers(); setStagePhase('combo'); clearSentence(); };

  /** 선택된 명사는 유지하고 2단계(동사 고르기 페이지)로 복귀 */
  const handleBackToVerbStep = (): void => { stopAllSpeechAndTimers(); setStagePhase('combo'); clearSelectedVerb(); };

  /** 상단 스텝 네비게이션 바를 통한 단계별 페이지 직접 전환 */
  const handleSelectStep = (step: TherapyStepNumber): void => {
    if (step === 1) handleClearAll();
    else if (step === 2 && selectedNoun) handleBackToVerbStep();
    else if (step === 3 && hasCompletedSentence) { stopAllSpeechAndTimers(); setStagePhase('combo'); }
    else if (step === 4 && hasCompletedSentence) { stopAllSpeechAndTimers(); setStagePhase('merged'); }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: WARM_PASTEL_COLORS.BG_MAIN, padding: '14px 20px 24px' }}>
      <AppHeaderBar
        hasSelectedNoun={hasSelectedNoun}
        currentStep={currentStep}
        isFavoritesOpen={activeChapter === 'favorites'}
        favoritesCount={favoriteSentences.length}
        onToggleFavorites={() => {
          stopAllSpeechAndTimers();
          if (activeChapter === 'favorites') setActiveChapter(activeCategory);
          else { clearSentence(); setActiveChapter('favorites'); }
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsTtsModalOpen(true)}
      />

      {activeChapter !== 'favorites' && (
        <StepProgressBar
          currentStep={currentStep}
          selectedNoun={selectedNoun}
          selectedVerb={selectedVerb}
          onSelectStep={handleSelectStep}
        />
      )}

      <SentenceStripBar
        selectedCards={selectedCards}
        sentenceText={sentenceText}
        isFavoriteSaved={isFavoriteSaved}
        isSpeaking={isSpeaking}
        speakingText={speakingText}
        onSpeakSentence={() => speak(sentenceText)}
        onSaveFavorite={() => saveCurrentAsFavorite()}
        onRemoveCardAt={(idx) => { stopAllSpeechAndTimers(); removeSelectedCardAt(idx); }}
        onClearAll={handleClearAll}
      />

      {activeChapter === 'favorites' && !hasCompletedSentence ? (
        <FavoriteChapterSection
          favorites={favoriteSentences}
          activeSentenceText={sentenceText}
          onSelectFavorite={handleSelectFavorite}
          onRemoveFavorite={removeFavoriteSentence}
        />
      ) : selectedNoun && selectedVerb ? (
        <CombinedSentenceStage
          nounCard={selectedNoun}
          verbCard={selectedVerb}
          sentenceText={sentenceText}
          stagePhase={stagePhase}
          isFavoriteSaved={isFavoriteSaved}
          onChangePhase={(phase, withTts = true) => {
            stopAllSpeechAndTimers();
            setStagePhase(phase);
            if (withTts) speak(sentenceText);
          }}
          onReplaySequence={() => {
            scheduleMergeTransition();
            speakWithSentence(sentenceText, sentenceText, () => setStagePhase('merged'));
          }}
          onStopTts={stopAllSpeechAndTimers}
          onSaveFavorite={() => saveCurrentAsFavorite()}
          onBackToVerbStep={handleBackToVerbStep}
          onReset={handleClearAll}
        />
      ) : !hasSelectedNoun ? (
        <NounBoardSection
          categories={NOUN_CATEGORIES}
          activeCategory={activeCategory}
          nounCards={nouns}
          displayLimit={ttsSettings.nounDisplayLimit}
          selectedCardIds={selectedCardIds}
          isSpeaking={isSpeaking}
          onSelectCategory={setActiveCategory}
          onSelectCard={handleSelectCard}
          onDeleteCustomCard={deleteCustomCard}
        />
      ) : (
        <VerbBoardSection
          verbCards={verbs}
          selectedCardIds={selectedCardIds}
          isSpeaking={isSpeaking}
          onSelectCard={handleSelectCard}
          onBackToNounStep={handleClearAll}
          onDeleteCustomCard={deleteCustomCard}
        />
      )}

      <AddCustomCardModal open={isAddModalOpen} categories={NOUN_CATEGORIES} defaultCategoryId={activeCategory} onClose={() => setIsAddModalOpen(false)} onAddCard={addCustomCard} />
      <TtsSettingsModal open={isTtsModalOpen} settings={ttsSettings} koreanVoices={koreanVoices} onUpdateSettings={updateTtsSettings} onTestSpeak={speak} onClose={() => setIsTtsModalOpen(false)} />
    </main>
  );
}
