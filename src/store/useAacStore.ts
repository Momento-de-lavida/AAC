import { create } from 'zustand';
import { getProfileStorageKey, loadFromStorage, saveToStorage, STORAGE_KEYS } from '../services/storageService';
import { AacCard, ActiveChapterId, ChildProfile, FavoriteSentence, NounCategoryId, TtsSettings } from '../types/aac';
import {
  DEFAULT_CHILD_PROFILES, DEFAULT_FAVORITE_SENTENCES, DEFAULT_NOUN_CARDS, DEFAULT_VERB_CARDS,
} from '../utils/aacTemplates';
import { DEFAULT_TTS_CONFIG } from '../utils/constants';

/**
 * @description AAC 의사소통 보드 전역 스토어 상태 및 액션 인터페이스
 */
export interface AacStoreState {
  readonly profiles: ChildProfile[];
  readonly activeProfileId: string;
  readonly isProfileModalOpen: boolean;
  readonly activeChapter: ActiveChapterId;
  readonly activeCategory: NounCategoryId;
  readonly selectedCards: AacCard[];
  readonly customCards: AacCard[];
  readonly favoriteSentences: FavoriteSentence[];
  readonly ttsSettings: TtsSettings;
  readonly setProfileModalOpen: (open: boolean) => void;
  readonly selectProfile: (profileId: string) => void;
  readonly addProfile: (name: string, avatarEmoji: string) => ChildProfile | null;
  readonly deleteProfile: (profileId: string) => void;
  readonly setActiveChapter: (chapter: ActiveChapterId) => void;
  readonly setActiveCategory: (category: NounCategoryId) => void;
  readonly selectCard: (card: AacCard) => {
    readonly wordSpeech: string;
    readonly completedSentenceSpeech: string | null;
  };
  readonly removeSelectedCardAt: (index: number) => void;
  readonly clearSelectedVerb: () => void;
  readonly clearSentence: () => void;
  readonly getSentenceText: () => string;
  readonly saveCurrentAsFavorite: () => boolean;
  readonly removeFavoriteSentence: (favoriteId: string) => void;
  readonly applyFavoriteSentence: (favorite: FavoriteSentence) => string;
  readonly addCustomCard: (card: AacCard) => void;
  readonly deleteCustomCard: (cardId: string) => void;
  readonly updateTtsSettings: (partial: Partial<TtsSettings>) => void;
}

const DEFAULT_SETTINGS: TtsSettings = {
  rate: DEFAULT_TTS_CONFIG.DEFAULT_RATE, pitch: DEFAULT_TTS_CONFIG.DEFAULT_PITCH,
  volume: DEFAULT_TTS_CONFIG.DEFAULT_VOLUME, autoReadCompletedSentence: true, nounDisplayLimit: 99,
};

/** 특정 아동 프로필 ID에 해당하는 맞춤 카드와 즐겨찾기 목록을 스토리지에서 로드하는 내부 헬퍼 */
function loadProfileScopedData(profileId: string): { customCards: AacCard[]; favoriteSentences: FavoriteSentence[] } {
  const customRes = loadFromStorage<AacCard[]>(getProfileStorageKey(STORAGE_KEYS.CUSTOM_CARDS, profileId), []);
  const favRes = loadFromStorage<FavoriteSentence[]>(getProfileStorageKey(STORAGE_KEYS.FAVORITE_SENTENCES, profileId), [...DEFAULT_FAVORITE_SENTENCES]);
  return {
    customCards: customRes.ok ? customRes.data : [],
    favoriteSentences: favRes.ok ? favRes.data : [...DEFAULT_FAVORITE_SENTENCES],
  };
}

/**
 * @description [HR-01, HR-05] 아동(이용자)별 개인화 프로필, 단계별 선택, 즐겨찾기 분리 관리를 담당하는 Zustand 스토어
 */
export const useAacStore = create<AacStoreState>((set, get) => {
  const savedProfilesRes = loadFromStorage<ChildProfile[]>(STORAGE_KEYS.CHILD_PROFILES, [...DEFAULT_CHILD_PROFILES]);
  const initialProfiles = savedProfilesRes.ok && savedProfilesRes.data.length > 0 ? savedProfilesRes.data : [...DEFAULT_CHILD_PROFILES];
  const savedActiveIdRes = loadFromStorage<string>(STORAGE_KEYS.ACTIVE_PROFILE_ID, initialProfiles[0].id);
  const initialProfileId = savedActiveIdRes.ok && initialProfiles.some((p) => p.id === savedActiveIdRes.data)
    ? savedActiveIdRes.data
    : initialProfiles[0].id;
  const savedSettingsRes = loadFromStorage<TtsSettings>(STORAGE_KEYS.TTS_SETTINGS, DEFAULT_SETTINGS);
  const initialScoped = loadProfileScopedData(initialProfileId);

  return {
    profiles: initialProfiles, activeProfileId: initialProfileId, isProfileModalOpen: true,
    activeChapter: 'food', activeCategory: 'food', selectedCards: [],
    customCards: initialScoped.customCards, favoriteSentences: initialScoped.favoriteSentences,
    ttsSettings: savedSettingsRes.ok ? { ...DEFAULT_SETTINGS, ...savedSettingsRes.data } : DEFAULT_SETTINGS,

    setProfileModalOpen: (open: boolean): void => set({ isProfileModalOpen: open }),

    selectProfile: (profileId: string): void => {
      const target = get().profiles.find((p) => p.id === profileId);
      if (!target) return;
      saveToStorage(STORAGE_KEYS.ACTIVE_PROFILE_ID, target.id);
      const scoped = loadProfileScopedData(target.id);
      set({ activeProfileId: target.id, isProfileModalOpen: false, selectedCards: [], ...scoped });
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
      set({
        profiles: updated, activeProfileId: newProfile.id, isProfileModalOpen: false,
        selectedCards: [], customCards: [], favoriteSentences: initialFavs,
      });
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
        const scoped = loadProfileScopedData(nextActive.id);
        set({ profiles: updated, activeProfileId: nextActive.id, selectedCards: [], ...scoped });
      } else {
        set({ profiles: updated });
      }
    },

    setActiveChapter: (chapter: ActiveChapterId): void => {
      if (chapter === 'favorites') set({ activeChapter: 'favorites' });
      else set({ activeChapter: chapter, activeCategory: chapter, selectedCards: [] });
    },

    setActiveCategory: (category: NounCategoryId): void => {
      set({ activeChapter: category, activeCategory: category, selectedCards: [] });
    },

    selectCard: (card: AacCard) => {
      const selectedNoun = get().selectedCards.find((c) => c.partOfSpeech === 'noun');
      const nextCards = card.partOfSpeech === 'noun' ? [card] : (selectedNoun ? [selectedNoun, card] : [card]);
      set({ selectedCards: nextCards });
      const fullSentence = nextCards.map((c) => c.speechText).join(' ');
      return {
        wordSpeech: card.speechText,
        completedSentenceSpeech: card.partOfSpeech === 'verb' && nextCards.length >= 2 ? fullSentence : null,
      };
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

    applyFavoriteSentence: (favorite: FavoriteSentence): string => {
      set({ selectedCards: [...favorite.cards] });
      return favorite.sentenceText;
    },

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

    updateTtsSettings: (partial: Partial<TtsSettings>): void => {
      const updated = { ...get().ttsSettings, ...partial };
      saveToStorage(STORAGE_KEYS.TTS_SETTINGS, updated);
      set({ ttsSettings: updated });
    },
  };
});

/**
 * @description 기본 카드와 커스텀 카드를 합쳐 현재 카테고리의 명사 목록과 동사·형용사 목록을 반환하는 순수 헬퍼
 */
export function getVisibleCards(
  activeCategory: NounCategoryId,
  customCards: readonly AacCard[]
): { readonly nouns: AacCard[]; readonly verbs: AacCard[] } {
  const valid: readonly string[] = ['food', 'play', 'daily', 'people'];
  const allNouns = [...DEFAULT_NOUN_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'noun')];
  const allVerbs = [...DEFAULT_VERB_CARDS, ...customCards.filter((c) => c.partOfSpeech === 'verb')];
  return { nouns: allNouns.filter((c) => (c.categoryId && valid.includes(c.categoryId) ? c.categoryId : 'daily') === activeCategory), verbs: allVerbs };
}
