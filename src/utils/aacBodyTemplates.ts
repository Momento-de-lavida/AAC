import { AacCard } from '../types/aac';

const N_IMG = './images/aac/nouns';

/**
 * @description [HR-01, HR-05] 1페이지 '신체·몸(body)' 카테고리 전용 21종 신체부위 명사 어휘 템플릿
 * (눈, 코, 입, 귀, 혀, 이, 이마, 눈썹, 턱, 머리카락, 목, 어깨, 팔, 팔꿈치, 손, 가슴, 배, 등, 엉덩이, 다리, 발)
 */
export const DEFAULT_BODY_NOUN_CARDS: readonly AacCard[] = [
  { id: 'noun-eye', label: '눈', speechText: '눈', partOfSpeech: 'noun', categoryId: 'body', emoji: '👁️', customImageUrl: `${N_IMG}/noun-eye.jpg` },
  { id: 'noun-nose', label: '코', speechText: '코', partOfSpeech: 'noun', categoryId: 'body', emoji: '👃', customImageUrl: `${N_IMG}/noun-nose.jpg` },
  { id: 'noun-mouth', label: '입', speechText: '입', partOfSpeech: 'noun', categoryId: 'body', emoji: '👄', customImageUrl: `${N_IMG}/noun-mouth.jpg` },
  { id: 'noun-ear', label: '귀', speechText: '귀', partOfSpeech: 'noun', categoryId: 'body', emoji: '👂', customImageUrl: `${N_IMG}/noun-ear.jpg` },
  { id: 'noun-tongue', label: '혀', speechText: '혀', partOfSpeech: 'noun', categoryId: 'body', emoji: '👅', customImageUrl: `${N_IMG}/noun-tongue.jpg` },
  { id: 'noun-teeth', label: '이', speechText: '이', partOfSpeech: 'noun', categoryId: 'body', emoji: '🦷', customImageUrl: `${N_IMG}/noun-teeth.svg` },
  { id: 'noun-forehead', label: '이마', speechText: '이마', partOfSpeech: 'noun', categoryId: 'body', emoji: '🧒', customImageUrl: `${N_IMG}/noun-forehead.jpg` },
  { id: 'noun-eyebrow', label: '눈썹', speechText: '눈썹', partOfSpeech: 'noun', categoryId: 'body', emoji: '🤨', customImageUrl: `${N_IMG}/noun-eyebrow.jpg` },
  { id: 'noun-chin', label: '턱', speechText: '턱', partOfSpeech: 'noun', categoryId: 'body', emoji: '🧔', customImageUrl: `${N_IMG}/noun-chin.jpg` },
  { id: 'noun-hair', label: '머리카락', speechText: '머리카락', partOfSpeech: 'noun', categoryId: 'body', emoji: '💇', customImageUrl: `${N_IMG}/noun-hair.jpg` },
  { id: 'noun-neck', label: '목', speechText: '목', partOfSpeech: 'noun', categoryId: 'body', emoji: '🧣', customImageUrl: `${N_IMG}/noun-neck.jpg` },
  { id: 'noun-shoulder', label: '어깨', speechText: '어깨', partOfSpeech: 'noun', categoryId: 'body', emoji: '🤷', customImageUrl: `${N_IMG}/noun-shoulder.jpg` },
  { id: 'noun-arm', label: '팔', speechText: '팔', partOfSpeech: 'noun', categoryId: 'body', emoji: '💪', customImageUrl: `${N_IMG}/noun-arm.jpg` },
  { id: 'noun-elbow', label: '팔꿈치', speechText: '팔꿈치', partOfSpeech: 'noun', categoryId: 'body', emoji: '💪', customImageUrl: `${N_IMG}/noun-elbow.jpg` },
  { id: 'noun-hands', label: '손', speechText: '손', partOfSpeech: 'noun', categoryId: 'body', emoji: '🤚', customImageUrl: `${N_IMG}/noun-hands.jpg` },
  { id: 'noun-chest', label: '가슴', speechText: '가슴', partOfSpeech: 'noun', categoryId: 'body', emoji: '👕', customImageUrl: `${N_IMG}/noun-chest.jpg` },
  { id: 'noun-tummy', label: '배', speechText: '배', partOfSpeech: 'noun', categoryId: 'body', emoji: '🫃', customImageUrl: `${N_IMG}/noun-tummy.svg` },
  { id: 'noun-back', label: '등', speechText: '등', partOfSpeech: 'noun', categoryId: 'body', emoji: '🔙', customImageUrl: `${N_IMG}/noun-back.jpg` },
  { id: 'noun-butt', label: '엉덩이', speechText: '엉덩이', partOfSpeech: 'noun', categoryId: 'body', emoji: '🍑', customImageUrl: `${N_IMG}/noun-butt.jpg` },
  { id: 'noun-leg', label: '다리', speechText: '다리', partOfSpeech: 'noun', categoryId: 'body', emoji: '🦵', customImageUrl: `${N_IMG}/noun-leg.jpg` },
  { id: 'noun-foot', label: '발', speechText: '발', partOfSpeech: 'noun', categoryId: 'body', emoji: '🦶', customImageUrl: `${N_IMG}/noun-foot.jpg` },
] as const;
