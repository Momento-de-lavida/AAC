import { AacCard, ChildProfile, FavoriteSentence, NounCategory } from '../types/aac';
import { DEFAULT_VERB_CARDS, VERB_MOTION_OPTIONS } from './aacVerbTemplates';
import { SNACK_BAG_SVG_DATA_URL, SWING_SVG_DATA_URL, TRAMPOLINE_SVG_DATA_URL } from './playEquipmentSvg';

export { DEFAULT_VERB_CARDS, VERB_MOTION_OPTIONS };

/**
 * @description 새 아동(이용자) 등록 시 선택 가능한 친근한 아바타 이모지 목록
 */
export const PROFILE_AVATAR_EMOJIS: readonly string[] = [
  '🐣', '🐻', '🐰', '🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐸',
] as const;

/**
 * @description 최초 실행 시 기본 제공되는 아동(이용자) 프로필 목록
 */
export const DEFAULT_CHILD_PROFILES: readonly ChildProfile[] = [
  { id: 'child-daon', name: '다온이', avatarEmoji: '🐣' },
  { id: 'child-hajun', name: '하준이', avatarEmoji: '🐻' },
  { id: 'child-seoa', name: '서아', avatarEmoji: '🐰' },
] as const;

/**
 * @description 커스텀 카드 추가 모달에서 제공하는 빠른 선택용 친근한 이모지 목록
 */
export const CUSTOM_CARD_SAMPLE_EMOJIS: readonly string[] = [
  '🍓', '🧀', '🍌', '🍗', '🍦', '🚂', '🦖', '🎨', '🎹', '🐶', '🐱', '🤗',
] as const;

/**
 * @description 언어재활 치료를 위한 5대 명사(사물·어휘) 카테고리 정의
 */
export const NOUN_CATEGORIES: readonly NounCategory[] = [
  { id: 'food', label: '간식·음식', iconEmoji: '🥐', badgeColor: '#FF9F43' },
  { id: 'play', label: '놀이·장난감', iconEmoji: '🧸', badgeColor: '#54A0FF' },
  { id: 'daily', label: '일상·생활', iconEmoji: '🪥', badgeColor: '#48DBFB' },
  { id: 'people', label: '사람·장소', iconEmoji: '👨‍👩‍👧', badgeColor: '#FF6B6B' },
  { id: 'feeling', label: '감정·상태', iconEmoji: '💛', badgeColor: '#F368E0' },
] as const;

/**
 * @description 카테고리별로 표시될 기본 명사(무엇을?) 어휘 템플릿
 */
export const DEFAULT_NOUN_CARDS: readonly AacCard[] = [
  // 1. 간식·음식 (food) — 과자봉지, 빨대, 주스 포함
  { id: 'noun-bread', label: '빵', speechText: '빵', partOfSpeech: 'noun', categoryId: 'food', emoji: '🥐' },
  { id: 'noun-snack-bag', label: '과자봉지', speechText: '과자봉지', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍪', customImageUrl: SNACK_BAG_SVG_DATA_URL },
  { id: 'noun-straw', label: '빨대', speechText: '빨대', partOfSpeech: 'noun', categoryId: 'food', emoji: '🥤' },
  { id: 'noun-juice', label: '주스', speechText: '주스', partOfSpeech: 'noun', categoryId: 'food', emoji: '🧃' },
  { id: 'noun-milk', label: '우유', speechText: '우유', partOfSpeech: 'noun', categoryId: 'food', emoji: '🥛' },
  { id: 'noun-water', label: '물', speechText: '물', partOfSpeech: 'noun', categoryId: 'food', emoji: '💧' },
  { id: 'noun-snack', label: '과자', speechText: '과자', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍪' },
  { id: 'noun-apple', label: '사과', speechText: '사과', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍎' },
  { id: 'noun-rice', label: '밥', speechText: '밥', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍚' },
  { id: 'noun-banana', label: '바나나', speechText: '바나나', partOfSpeech: 'noun', categoryId: 'food', emoji: '🍌' },

  // 2. 놀이·장난감 (play) — 그네, 장난감, 노래, 자동차, 공, 가위, 매트, 텐트 포함
  { id: 'noun-swing', label: '그네', speechText: '그네', partOfSpeech: 'noun', categoryId: 'play', emoji: '🪢', customImageUrl: SWING_SVG_DATA_URL },
  { id: 'noun-trampoline', label: '트램폴린', speechText: '트램폴린', partOfSpeech: 'noun', categoryId: 'play', emoji: '⏫', customImageUrl: TRAMPOLINE_SVG_DATA_URL },
  { id: 'noun-toy', label: '장난감', speechText: '장난감', partOfSpeech: 'noun', categoryId: 'play', emoji: '🧸' },
  { id: 'noun-song', label: '노래', speechText: '노래', partOfSpeech: 'noun', categoryId: 'play', emoji: '🎵' },
  { id: 'noun-car', label: '자동차', speechText: '자동차', partOfSpeech: 'noun', categoryId: 'play', emoji: '🚗' },
  { id: 'noun-ball', label: '공', speechText: '공', partOfSpeech: 'noun', categoryId: 'play', emoji: '⚽' },
  { id: 'noun-scissors', label: '가위', speechText: '가위로', partOfSpeech: 'noun', categoryId: 'play', emoji: '✂️' },
  { id: 'noun-mat', label: '매트', speechText: '매트에', partOfSpeech: 'noun', categoryId: 'play', emoji: '🛏️' },
  { id: 'noun-tent', label: '텐트', speechText: '텐트에', partOfSpeech: 'noun', categoryId: 'play', emoji: '⛺' },
  { id: 'noun-bicycle', label: '자전거', speechText: '자전거', partOfSpeech: 'noun', categoryId: 'play', emoji: '🚲' },
  { id: 'noun-block', label: '블록', speechText: '블록', partOfSpeech: 'noun', categoryId: 'play', emoji: '🧱' },
  { id: 'noun-bubble', label: '비눗방울', speechText: '비눗방울', partOfSpeech: 'noun', categoryId: 'play', emoji: '🫧' },
  { id: 'noun-book', label: '그림책', speechText: '그림책', partOfSpeech: 'noun', categoryId: 'play', emoji: '📘' },
  { id: 'noun-doll', label: '인형', speechText: '인형', partOfSpeech: 'noun', categoryId: 'play', emoji: '🧸' },
  { id: 'noun-crayon', label: '색연필', speechText: '색연필', partOfSpeech: 'noun', categoryId: 'play', emoji: '🖍️' },
  { id: 'noun-puzzle', label: '퍼즐', speechText: '퍼즐', partOfSpeech: 'noun', categoryId: 'play', emoji: '🧩' },

  // 3. 일상·생활 (daily) — 의자, 손, 문, 머리, 옷, 엘리베이터, 계단, 휴지, 쓰레기통 포함
  { id: 'noun-chair', label: '의자', speechText: '의자', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🪑' },
  { id: 'noun-hands', label: '손', speechText: '손', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🤚' },
  { id: 'noun-door', label: '문', speechText: '문', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🚪' },
  { id: 'noun-hair', label: '머리', speechText: '머리를', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🪮' },
  { id: 'noun-clothes', label: '옷', speechText: '옷', partOfSpeech: 'noun', categoryId: 'daily', emoji: '👕' },
  { id: 'noun-elevator', label: '엘리베이터', speechText: '엘리베이터', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🛗' },
  { id: 'noun-stairs', label: '계단', speechText: '계단', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🪜' },
  { id: 'noun-tissue', label: '휴지', speechText: '휴지로', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🧻' },
  { id: 'noun-trashcan', label: '쓰레기통', speechText: '쓰레기통에', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🗑️' },
  { id: 'noun-toilet', label: '화장실', speechText: '화장실', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🚽' },
  { id: 'noun-shoes', label: '신발', speechText: '신발', partOfSpeech: 'noun', categoryId: 'daily', emoji: '👟' },
  { id: 'noun-bag', label: '가방', speechText: '가방', partOfSpeech: 'noun', categoryId: 'daily', emoji: '🎒' },

  // 4. 사람·장소 (people) — 놀이터, 경사로, 병원, 마트, 학교 포함
  { id: 'noun-playground', label: '놀이터', speechText: '놀이터에', partOfSpeech: 'noun', categoryId: 'people', emoji: '🛝' },
  { id: 'noun-ramp', label: '경사로', speechText: '경사로', partOfSpeech: 'noun', categoryId: 'people', emoji: '🛤️' },
  { id: 'noun-hospital', label: '병원', speechText: '병원에', partOfSpeech: 'noun', categoryId: 'people', emoji: '🏥' },
  { id: 'noun-mart', label: '마트', speechText: '마트에', partOfSpeech: 'noun', categoryId: 'people', emoji: '🛒' },
  { id: 'noun-school', label: '학교', speechText: '학교에', partOfSpeech: 'noun', categoryId: 'people', emoji: '🏫' },
  { id: 'noun-home', label: '집', speechText: '집', partOfSpeech: 'noun', categoryId: 'people', emoji: '🏠' },
  { id: 'noun-mom', label: '엄마', speechText: '엄마', partOfSpeech: 'noun', categoryId: 'people', emoji: '👩' },
  { id: 'noun-dad', label: '아빠', speechText: '아빠', partOfSpeech: 'noun', categoryId: 'people', emoji: '👨' },
  { id: 'noun-teacher', label: '선생님', speechText: '선생님', partOfSpeech: 'noun', categoryId: 'people', emoji: '👩‍🏫' },

  // 5. 감정·상태 (feeling)
  { id: 'noun-happy', label: '기분 좋아요', speechText: '기분 좋아요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '😊' },
  { id: 'noun-hungry', label: '배고파요', speechText: '배고파요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '🍽️' },
  { id: 'noun-sick', label: '아파요', speechText: '아파요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '🩹' },
  { id: 'noun-sleepy', label: '졸려요', speechText: '졸려요', partOfSpeech: 'noun', categoryId: 'feeling', emoji: '😴' },
] as const;

/**
 * @description 즐겨찾기 챕터에 기본으로 탑재되는 자주 쓰는 핵심 표현 샘플 2종
 */
export const DEFAULT_FAVORITE_SENTENCES: readonly FavoriteSentence[] = [
  {
    id: 'fav-bread-give',
    sentenceText: '빵 주세요',
    cards: [DEFAULT_NOUN_CARDS[0], DEFAULT_VERB_CARDS[0]],
  },
  {
    id: 'fav-water-drink',
    sentenceText: '물 마셔요',
    cards: [DEFAULT_NOUN_CARDS[5], DEFAULT_VERB_CARDS[2]],
  },
] as const;
