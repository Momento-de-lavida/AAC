import { create } from 'zustand';
import { getProfileStorageKey, loadFromStorage, saveToStorage, STORAGE_KEYS } from '../services/storageService';
import {
  AacCard, ActiveChapterId, ChildProfile, FavoriteSentence,
  NounCategoryId, ProfileBoardConfig, TtsSettings,
} from '../types/aac';
import { PartOfSpeech } from '../types/common';
import {
  DEFAULT_CHILD_PROFILES, DEFAULT_FAVORITE_SENTENCES, DEFAULT_NOUN_CARDS, DEFAULT_VERB_CARDS,
} from '../utils/aacTemplates';
import {
  EMPTY_BOARD_CONFIG, filterAndSortCards, moveCardInOrderConfig, toggleHiddenCardInConfig,
} from '../utils/boardConfigHelper';
import { DEFAULT_TTS_CONFIG } from '../utils/constants';

export interface AacStoreState {
  readonly profiles: ChildProfile[];
  readonly activeProfileId: string;
  readonly isProfileModalOpen: boolean;
  readonly activeChapter: ActiveChapterId;
  readonly activeCategory: NounCategoryId;
  readonly selectedCards: AacCard[];
  readonly customCards: AacCard[];
  readonly favoriteSentences: FavoriteSentence[];
  readonly boardConfig: ProfileBoardConfig;
  readonly ttsSettings: TtsSettings;
  readonly setProfileModalOpen: (open: boolean) => void;
  readonly selectProfile: (profileId: string) => void;
  readonly addProfile: (name: string, avatarEmoji: string) => ChildProfile | null;
  readonly deleteProfile: (profileId: string) => void;
  readonly setActiveChapter: (chapter: ActiveChapterId) => void;
  readonly setActiveCategory: (category: NounCategoryId) => void;
  readonly selectCard: (card: AacCard) => { readonly wordSpeech: string; readonly completedSentenceSpeech: string | null };
  readonly removeSelectedCardAt: (index: number) => void;
  readonly clearSelectedVerb: () => void;
  readonly clearSentence: () => void;
  readonly getSentenceText: () => string;
  readonly saveCurrentAsFavorite: () => boolean;
  readonly removeFavoriteSentence: (favoriteId: string) => void;
  readonly applyFavoriteSentence: (favorite: FavoriteSentence) => string;
  readonly addCustomCard: (card: AacCard) => void;
  readonly deleteCustomCard: (cardId: string) => void;
  readonly toggleCardVisibility: (cardId: string) => void;
  readonly moveCardOrder: (partOfSpeech: PartOfSpeech, cardId: string, direction: 'up' | 'down', scopeCards: readonly AacCard[]) => void;
  readonly resetBoardConfig: () => void;
  readonly updateTtsSettings: (partial: Partial<TtsSettings>) => void;
}

const DEFAULT_SETTINGS: TtsSettings = {
  rate: DEFAULT_TTS_CONFIG.DEFAULT_RATE, pitch: DEFAULT_TTS_CONFIG.DEFAULT_PITCH,
  volume: DEFAULT_TTS_CONFIG.DEFAULT_VOLUME, autoReadCompletedSentence: true, nounDisplayLimit: 99,
};

function loadProfileScopedData(profileId: string): {
  customCards: AacCard[];
  favoriteSentences: FavoriteSentence[];
  boardConfig: ProfileBoardConfig;
} {
  const customRes = loadFromStorage<AacCard[]>(getProfileStorageKey(STORAGE_KEYS.CUSTOM_CARDS, profileId), []);
  const favRes = loadFromStorage<FavoriteSentence[]>(getProfileStorageKey(STORAGE_KEYS.FAVORITE_SENTENCES, profileId), [...DEFAULT_FAVORITE_SENTENCES]);
  const boardRes = loadFromStorage<ProfileBoardConfig>(getProfileStorageKey(STORAGE_KEYS.BOARD_CONFIG, profileId), EMPTY_BOARD_CONFIG);
  return {
    customCards: customRes.ok ? customRes.data : [],
    favoriteSentences: favRes.ok ? favRes.data : [...DEFAULT_FAVORITE_SENTENCES],
    boardConfig: boardRes.ok ? { ...EMPTY_BOARD_CONFIG, ...boardRes.data } : EMPTY_BOARD_CONFIG,
  };
}

/**
 * @description [HR-01, HR-05] 아동(이용자)별 프로필, 개인화 카드 순서·숨김 설정 및 즐겨찾기 분리를 관리하는 Zustand 스토어
 */
export const useAacStore = create<AacStoreState>((set, get) => {
  const savedProfilesRes = loadFromStorage<ChildProfile[]>(STORAGE_KEYS.CHILD_PROFILES, [...DEFAULT_CHILD_PROFILES]);
  const initialProfiles = savedProfilesRes.ok && savedProfilesRes.data.length > 0 ? savedProfilesRes.data : [...DEFAULT_CHILD_PROFILES];
  const savedActiveIdRes = loadFromStorage<string>(STORAGE_KEYS.ACTIVE_PROFILE_ID, initialProfiles[0].id);
  const initialProfileId = savedActiveIdRes.ok && initialProfiles.some((p) => p.id === savedActiveIdRes.data)
    ? savedActiveIdRes.data : initialProfiles[0].id;
  const savedSettingsRes = loadFromStorage<TtsSettings>(STORAGE_KEYS.TTS_SETTINGS, DEFAULT_SETTINGS);
  const initialScoped = loadProfileScopedData(initialProfileId);

  const persistBoardConfig = (next: ProfileBoardConfig): void => {
    saveToStorage(getProfileStorageKey(STORAGE_KEYS.BOARD_CONFIG, get().activeProfileId), next);
    set({ boardConfig: next });
  };

  return {
    profiles: initialProfiles, activeProfileId: initialProfileId, isProfileModalOpen: true,
    activeChapter: 'food', activeCategory: 'food', selectedCards: [],
    customCards: initialScoped.customCards, favoriteSentences: initialScoped.favoriteSentences,
    boardConfig: initialScoped.boardConfig,
    ttsSettings: savedSettingsRes.ok ? { ...DEFAULT_SETTINGS, ...savedSettingsRes.data } : DEFAULT_SETTINGS,

    setProfileModalOpen: (open: boolean): void => set({ isProfileModalOpen: open }),
    selectProfile: (profileId: string): void => {
      const target = get().profiles.find((p) => p.id === profileId);
      if (!target) return;
      saveToStorage(STORAGE_KEYS.ACTIVE_PROFILE_ID, target.id);
      set({ activeProfileId: target.id, isProfileModalOpen: false, selectedCards: [], ...loadProfileScopedData(target.id) });
    },
    addProfile: (name: string, avatarEmoji: string): ChildProfile | null => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const newProfile: ChildProfile = { id: `child-${Date.now()}`, name: trimmed, avatarEmoji: avatarEmoji || '🐣' };
      const updated = [...get().profiles, newProfile];
      const initialFavs = [...DEFAULT_FAVORITE_SENTENCES];
      saveToStorage(STORAGE_KEYS.CHILD_PROFILES, updated);
      saveToStorage(STORAGE_KEYS.ACTIVE_PROFILE_ID, newProfile.id);
      saveToStorage(getProfileStorageKey(STORAGE_KEYS.FAVORITE_SENTENCES, newProfile.id), initialFavs);
      set({ profiles: updated, activeProfileId: newProfile.id, isProfileModalOpen: false, selectedCards: [], customCards: [], favoriteSentences: initialFavs, boardConfig: EMPTY_BOARD_CONFIG });
      return newProfile;
    },
    deleteProfile: (profileId: string): void => {
      const currentProfiles = get().profiles;
      if (currentProfiles.length <= 1) return;
      const updated = currentProfiles.filter((p) => p.id !== profileId);
      saveToStorage(STORAGE_KEYS.CHILD_PROFILES, updated);
      if (get().activeProfileId === profileId) {
        const nextActive = updated[0];
        saveToStorage(STORAGE_KEYS.ACTIVE_PROFILE_ID, nextActive.id);
        set({ profiles: updated, activeProfileId: nextActive.id, selectedCards: [], ...loadProfileScopedData(nextActive.id) });
      } else {
        set({ profiles: updated });
      }
    },
    setActiveChapter: (chapter: ActiveChapterId): void => {
      if (chapter === 'favorites') set({ activeChapter: 'favorites' });
      else set({ activeChapter: chapter, activeCategory: chapter, selectedCards: [] });
    },
    setActiveCategory: (category: NounCategoryId): void => set({ activeChapter: category, activeCategory: category, selectedCards: [] }),
    selectCard: (card: AacCard) => {
      const selectedNoun = get().selectedCards.find((c) => c.partOfSpeech === 'noun');
      const nextCards = card.partOfSpeech === 'noun' ? [card] : (selectedNoun ? [selectedNoun, card] : [card]);
      set({ selectedCards: nextCards });
      const fullSentence = nextCards.map((c) => c.speechText).join(' ');
      return { wordSpeech: card.speechText, completedSentenceSpeech: card.partOfSpeech === 'verb' && nextCards.length >= 2 ? fullSentence : null };
    },
    removeSelectedCardAt: (index: number): void => set((s) => ({ selectedCards: s.selectedCards.filter((_, idx) => idx !== index) })),
    clearSelectedVerb: (): void => set((s) => ({ selectedCards: s.selectedCards.filter((c) => c.partOfSpeech === 'noun') })),
    clearSentence: (): void => set({ selectedCards: [] }),
    getSentenceText: (): string => get().selectedCards.map((c) => c.speechText).join(' '),
    saveCurrentAsFavorite: (): boolean => {
      const cards = get().selectedCards;
      if (cards.length === 0) return false;
      const sentenceText = cards.map((c) => c.speechText).join(' ');
      if (get().favoriteSentences.some((f) => f.sentenceText === sentenceText)) return false;
      const updated = [{ id: `fav-${Date.now()}`, sentenceText, cards: [...cards] }, ...get().favoriteSentences];
      saveToStorage(getProfileStorageKey(STORAGE_KEYS.FAVORITE_SENTENCES, get().activeProfileId), updated);
      set({ favoriteSentences: updated });
      return true;
    },
    removeFavoriteSentence: (favoriteId: string): void => {
      const updated = get().favoriteSentences.filter((f) => f.id !== favoriteId);
      saveToStorage(getProfileStorageKey(STORAGE_KEYS.FAVORITE_SENTENCES, get().activeProfileId), updated);
      set({ favoriteSentences: updated });
    },
    applyFavoriteSentence: (favorite: FavoriteSentence): string => { set({ selectedCards: [...favorite.cards] }); return favorite.sentenceText; },
    addCustomCard: (card: AacCard): void => {
      const updated = [...get().customCards, card];
      saveToStorage(getProfileStorageKey(STORAGE_KEYS.CUSTOM_CARDS, get().activeProfileId), updated);
      set({ customCards: updated });
    },
    deleteCustomCard: (cardId: string): void => {
      const updated = get().customCards.filter((c) => c.id !== cardId);
      saveToStorage(getProfileStorageKey(STORAGE_KEYS.CUSTOM_CARDS, get().activeProfileId), updated);
      set((s) => ({ customCards: updated, selectedCards: s.selectedCards.filter((c) => c.id !== cardId) }));
    },
    toggleCardVisibility: (cardId: string): void => persistBoardConfig(toggleHiddenCardInConfig(get().boardConfig, cardId)),
    moveCardOrder: (partOfSpeech, cardId, direction, scopeCards): void => {
      const allSamePos = partOfSpeech === 'noun'
        ? [...DEFAULT_NOUN_CARDS, ...get().customCards.filter((c) => c.partOfSpeech === 'noun')]
        : [...DEFAULT_VERB_CARDS, ...get().customCards.filter((c) => c.partOfSpeech === 'verb')];
      persistBoardConfig(moveCardInOrderConfig(get().boardConfig, allSamePos, scopeCards, partOfSpeech, cardId, direction));
    },
    resetBoardConfig: (): void => persistBoardConfig(EMPTY_BOARD_CONFIG),
    updateTtsSettings: (partial: Partial<TtsSettings>): void => {
      const updated = { ...get().ttsSettings, ...partial };
      saveToStorage(STORAGE_KEYS.TTS_SETTINGS, updated);
      set({ ttsSettings: updated });
    },
  };
});

/**
 * @description 기본 카드·커스텀 카드에 이용자별 숨김 및 순서 설정을 반영하여 노출할 명사·동사 목록을 반환하는 순수 헬퍼
 */
export function getVisibleCards(
  activeCategory: NounCategoryId,
  customCards: readonly AacCard[],
  boardConfig: ProfileBoardConfig = EMPTY_BOARD_CONFIG
): { readonly nouns: AacCard[]; readonly verbs: AacCard[] } {
  const valid: readonly string[] = ['food', 'play', 'daily', 'body', 'people'];
  const allNouns = [...DEFAULT_NOUN_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'noun')];
  const allVerbs = [...DEFAULT_VERB_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'verb')];
  const categoryNouns = allNouns.filter((c) => (c.categoryId && valid.includes(c.categoryId) ? c.categoryId : 'daily') === activeCategory);
  return {
    nouns: filterAndSortCards(categoryNouns, boardConfig, 'noun'),
    verbs: filterAndSortCards(allVerbs, boardConfig, 'verb'),
  };
}
