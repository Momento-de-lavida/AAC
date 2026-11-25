import React, { useMemo, useState } from 'react';
import { AddCustomCardModal } from '../components/AddCustomCardModal';
import { AppHeaderBar } from '../components/AppHeaderBar';
import { BoardEditModal } from '../components/BoardEditModal';
import { ChildProfileModal } from '../components/ChildProfileModal';
import { CombinedSentenceStage } from '../components/CombinedSentenceStage';
import { FavoriteChapterSection } from '../components/FavoriteChapterSection';
import { NounBoardSection } from '../components/NounBoardSection';
import { TtsSettingsModal } from '../components/TtsSettingsModal';
import { VerbBoardSection } from '../components/VerbBoardSection';
import { useStepTransition } from '../hooks/useStepTransition';
import { useTTS } from '../hooks/useTTS';
import { getVisibleCards, useAacStore } from '../store/useAacStore';
import { AacCard, FavoriteSentence } from '../types/aac';
import { DEFAULT_NOUN_CARDS, DEFAULT_VERB_CARDS, NOUN_CATEGORIES } from '../utils/aacTemplates';
import { WARM_PASTEL_COLORS } from '../utils/constants';

/**
 * @description [HR-01, HR-03, HR-05] 아동의 집중도를 높이기 위해 상단 불필요 바를 제거하고
 * 각 단계별로 오직 선택할 그림 화면만 단독 제시하는 메인 컨테이너
 * @returns {React.ReactElement} 메인 홈 페이지 엘리먼트
 */
export function HomePage(): React.ReactElement {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTtsModalOpen, setIsTtsModalOpen] = useState<boolean>(false);
  const [isBoardEditModalOpen, setIsBoardEditModalOpen] = useState<boolean>(false);

  const {
    profiles, activeProfileId, isProfileModalOpen, activeChapter, activeCategory,
    selectedCards, customCards, favoriteSentences, ttsSettings, boardConfig,
    setProfileModalOpen, selectProfile, addProfile, deleteProfile,
    setActiveChapter, setActiveCategory, selectCard, clearSelectedVerb,
    clearSentence, getSentenceText, saveCurrentAsFavorite, removeFavoriteSentence,
    applyFavoriteSentence, addCustomCard, deleteCustomCard, updateTtsSettings,
    toggleCardVisibility, moveCardOrder, resetBoardConfig,
  } = useAacStore();

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? profiles[0],
    [profiles, activeProfileId]
  );
  const { isSpeaking, koreanVoices, speak, speakWithSentence, stop } = useTTS(ttsSettings);
  const { nouns, verbs } = useMemo(
    () => getVisibleCards(activeCategory, customCards, boardConfig),
    [activeCategory, customCards, boardConfig]
  );
  const allNounCards = useMemo(
    () => [...DEFAULT_NOUN_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'noun')],
    [customCards]
  );
  const allVerbCards = useMemo(
    () => [...DEFAULT_VERB_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'verb')],
    [customCards]
  );
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

  const handleClearAll = (): void => { stopAllSpeechAndTimers(); setStagePhase('combo'); clearSentence(); };
  const handleBackToVerbStep = (): void => { stopAllSpeechAndTimers(); setStagePhase('combo'); clearSelectedVerb(); };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: WARM_PASTEL_COLORS.BG_MAIN, padding: '14px 20px 24px' }}>
      <AppHeaderBar
        activeProfile={activeProfile}
        hasSelectedNoun={hasSelectedNoun}
        currentStep={currentStep}
        isFavoritesOpen={activeChapter === 'favorites'}
        favoritesCount={favoriteSentences.length}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onToggleFavorites={() => {
          stopAllSpeechAndTimers();
          if (activeChapter === 'favorites') setActiveChapter(activeCategory);
          else { clearSentence(); setActiveChapter('favorites'); }
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsTtsModalOpen(true)}
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
          activeProfileId={activeProfileId}
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
          selectedNoun={selectedNoun}
          verbCards={verbs}
          selectedCardIds={selectedCardIds}
          isSpeaking={isSpeaking}
          onSelectCard={handleSelectCard}
          onBackToNounStep={handleClearAll}
          onDeleteCustomCard={deleteCustomCard}
        />
      )}

      <ChildProfileModal
        open={isProfileModalOpen}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={(id) => { stopAllSpeechAndTimers(); selectProfile(id); }}
        onAddProfile={(name, emoji) => { stopAllSpeechAndTimers(); addProfile(name, emoji); }}
        onDeleteProfile={deleteProfile}
        onClose={() => setProfileModalOpen(false)}
      />
      <AddCustomCardModal open={isAddModalOpen} categories={NOUN_CATEGORIES} defaultCategoryId={activeCategory} onClose={() => setIsAddModalOpen(false)} onAddCard={addCustomCard} />
      <TtsSettingsModal
        open={isTtsModalOpen} activeProfile={activeProfile} settings={ttsSettings} koreanVoices={koreanVoices}
        onUpdateSettings={updateTtsSettings} onTestSpeak={speak}
        onOpenProfileModal={() => setProfileModalOpen(true)} onOpenAddCardModal={() => setIsAddModalOpen(true)}
        onOpenBoardEditModal={() => setIsBoardEditModalOpen(true)}
        onClose={() => setIsTtsModalOpen(false)}
      />
      <BoardEditModal
        open={isBoardEditModalOpen} activeProfile={activeProfile} categories={NOUN_CATEGORIES}
        defaultCategoryId={activeCategory} allNounCards={allNounCards} allVerbCards={allVerbCards}
        boardConfig={boardConfig} onToggleCardVisibility={toggleCardVisibility}
        onMoveCardOrder={moveCardOrder} onResetBoardConfig={resetBoardConfig}
        onClose={() => setIsBoardEditModalOpen(false)}
      />
    </main>
  );
}
