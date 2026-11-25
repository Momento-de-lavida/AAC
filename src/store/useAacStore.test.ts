import { beforeEach, describe, expect, it } from 'vitest';
import { getVisibleCards, useAacStore } from './useAacStore';
import {
  DEFAULT_FAVORITE_SENTENCES,
  DEFAULT_NOUN_CARDS,
  DEFAULT_VERB_CARDS,
} from '../utils/aacTemplates';
import { AacCard } from '../types/aac';

describe('Phase 6: 단계별 선택, 명사 노출 개수 설정 및 즐겨찾기 표현 스토어 검증', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAacStore.setState({
      activeChapter: 'food',
      activeCategory: 'food',
      selectedCards: [],
      customCards: [],
      favoriteSentences: [...DEFAULT_FAVORITE_SENTENCES],
    });
  });

  it('명사 "빵" 선택 후 동사 "주세요"를 선택하면 "빵 주세요"가 완성되어야 한다', () => {
    const breadCard = DEFAULT_NOUN_CARDS.find((c) => c.id === 'noun-bread')!;
    const giveCard = DEFAULT_VERB_CARDS.find((c) => c.id === 'verb-give')!;

    const step1 = useAacStore.getState().selectCard(breadCard);
    expect(step1.wordSpeech).toBe('빵');
    expect(step1.completedSentenceSpeech).toBeNull();
    expect(useAacStore.getState().selectedCards).toHaveLength(1);

    const step2 = useAacStore.getState().selectCard(giveCard);
    expect(step2.wordSpeech).toBe('주세요');
    expect(step2.completedSentenceSpeech).toBe('빵 주세요');
    expect(useAacStore.getState().getSentenceText()).toBe('빵 주세요');
  });

  it('완성된 문장("우유 주세요")을 저장하면 즐겨찾기 목록에 추가되고 삭제할 수 있어야 한다', () => {
    const milkCard = DEFAULT_NOUN_CARDS.find((c) => c.id === 'noun-milk')!;
    const giveCard = DEFAULT_VERB_CARDS.find((c) => c.id === 'verb-give')!;

    useAacStore.getState().selectCard(milkCard);
    useAacStore.getState().selectCard(giveCard);

    const saved = useAacStore.getState().saveCurrentAsFavorite();
    expect(saved).toBe(true);
    expect(useAacStore.getState().favoriteSentences[0].sentenceText).toBe('우유 주세요');

    // 중복 저장 방지 확인
    const duplicateSaved = useAacStore.getState().saveCurrentAsFavorite();
    expect(duplicateSaved).toBe(false);

    // 즐겨찾기 삭제 확인
    const addedId = useAacStore.getState().favoriteSentences[0].id;
    useAacStore.getState().removeFavoriteSentence(addedId);
    expect(
      useAacStore.getState().favoriteSentences.some((f) => f.id === addedId)
    ).toBe(false);
  });

  it('세팅에서 명사 노출 개수(nounDisplayLimit)를 변경하면 스토어에 즉시 반영되어야 한다', () => {
    useAacStore.getState().updateTtsSettings({ nounDisplayLimit: 2 });
    expect(useAacStore.getState().ttsSettings.nounDisplayLimit).toBe(2);
  });

  it('치료사가 커스텀 카드를 추가하고 삭제하면 카테고리 목록에 즉시 반영되어야 한다', () => {
    const customSnack: AacCard = {
      id: 'custom-strawberry',
      label: '딸기',
      speechText: '딸기',
      partOfSpeech: 'noun',
      categoryId: 'food',
      emoji: '🍓',
      isCustom: true,
    };

    useAacStore.getState().addCustomCard(customSnack);
    const visibleAfterAdd = getVisibleCards('food', useAacStore.getState().customCards);
    expect(visibleAfterAdd.nouns.some((c) => c.id === 'custom-strawberry')).toBe(true);

    useAacStore.getState().deleteCustomCard('custom-strawberry');
    const visibleAfterDelete = getVisibleCards('food', useAacStore.getState().customCards);
    expect(visibleAfterDelete.nouns.some((c) => c.id === 'custom-strawberry')).toBe(false);
  });

  it('이용자(아동)별로 즐겨찾기 표현과 커스텀 카드가 독립적으로 분리 관리되어야 한다', () => {
    // 1. 첫 번째 아동(다온이) 선택 후 "우유 주세요" 즐겨찾기 추가
    useAacStore.getState().selectProfile('child-daon');
    const milkCard = DEFAULT_NOUN_CARDS.find((c) => c.id === 'noun-milk')!;
    const giveCard = DEFAULT_VERB_CARDS.find((c) => c.id === 'verb-give')!;
    useAacStore.getState().selectCard(milkCard);
    useAacStore.getState().selectCard(giveCard);
    useAacStore.getState().saveCurrentAsFavorite();

    expect(
      useAacStore.getState().favoriteSentences.some((f) => f.sentenceText === '우유 주세요')
    ).toBe(true);

    // 2. 두 번째 아동(하준이)으로 전환하면 다온이의 "우유 주세요" 즐겨찾기가 보이지 않아야 함
    useAacStore.getState().selectProfile('child-hajun');
    expect(useAacStore.getState().activeProfileId).toBe('child-hajun');
    expect(
      useAacStore.getState().favoriteSentences.some((f) => f.sentenceText === '우유 주세요')
    ).toBe(false);

    // 3. 다시 다온이로 전환하면 다온이의 "우유 주세요" 즐겨찾기가 그대로 유지되어야 함
    useAacStore.getState().selectProfile('child-daon');
    expect(
      useAacStore.getState().favoriteSentences.some((f) => f.sentenceText === '우유 주세요')
    ).toBe(true);
  });

  it('이용자(아동)별로 어휘카드를 빼거나(숨김) 순서를 바꿀 수 있으며 다른 이용자에게 영향을 주지 않아야 한다', () => {
    useAacStore.getState().selectProfile('child-daon');
    useAacStore.getState().resetBoardConfig();

    // 다온이 보드에서 '빵' 카드 빼기(숨김) 및 두 번째 카드('과자봉지')를 첫 번째로 이동
    useAacStore.getState().toggleCardVisibility('noun-bread');
    const foodNounsBefore = DEFAULT_NOUN_CARDS.filter((c) => c.categoryId === 'food');
    useAacStore.getState().moveCardOrder('noun', 'noun-snack-bag', 'up', foodNounsBefore);

    const daonVisible = getVisibleCards('food', [], useAacStore.getState().boardConfig);
    expect(daonVisible.nouns.some((c) => c.id === 'noun-bread')).toBe(false);
    expect(daonVisible.nouns[0].id).toBe('noun-snack-bag');

    // 하준이로 전환하면 '빵' 카드가 정상적으로 첫 번째에 보여야 함
    useAacStore.getState().selectProfile('child-hajun');
    const hajunVisible = getVisibleCards('food', [], useAacStore.getState().boardConfig);
    expect(hajunVisible.nouns[0].id).toBe('noun-bread');
  });
});
