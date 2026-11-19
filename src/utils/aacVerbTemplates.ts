import { AacCard, VerbMotionType } from '../types/aac';

/**
 * @description 동사 커스텀 카드 생성 시 선택할 수 있는 실제 동작 모션 옵션 목록
 */
export const VERB_MOTION_OPTIONS: { value: VerbMotionType; label: string }[] = [
  { value: 'begging', label: '🤲 주세요 (두 손 모아 받기)' },
  { value: 'eating', label: '🥄 먹어요 (입 벌려 먹기)' },
  { value: 'drinking', label: '🥤 마셔요 (컵 기울여 마시기)' },
  { value: 'riding', label: '🚗 타요 (탈것에 올라타 달리기)' },
  { value: 'takingOut', label: '📤 꺼내요 (상자/가방에서 꺼내기)' },
  { value: 'tearing', label: '🍬 뜯어요 (포장지 양옆으로 뜯기)' },
  { value: 'going', label: '🚶 가요 (목적지를 향해 걸어가기)' },
  { value: 'opening', label: '🚪 열어요 (뚜껑/문 활짝 열기)' },
  { value: 'puttingIn', label: '📥 넣어요·꽂아요 (안으로 넣기)' },
  { value: 'wearing', label: '👕 입어요·벗어요 (옷/신발 착탈의)' },
  { value: 'washing', label: '🫧 씻어요·닦아요 (깨끗이 닦기)' },
  { value: 'watching', label: '👀 봐요·들어요 (집중하기)' },
  { value: 'turningOn', label: '🎶 틀어주세요·불러요 (음악 활동)' },
  { value: 'dontTouch', label: '✋ 만지지 마세요·치워요 (제지하기)' },
  { value: 'liking', label: '👍 좋아요 (엄지척과 하트 표현)' },
  { value: 'delicious', label: '😋 맛있어요 (볼 감싸며 맛 음미하기)' },
  { value: 'fun', label: '😆 재밌어요 (신나게 만세하며 점프)' },
  { value: 'happy', label: '🥰 기분 좋아요 (하트와 함께 활짝 웃기)' },
  { value: 'hungry', label: '🤤 배고파요 (꼬르륵 배 잡고 음식 생각)' },
  { value: 'sick', label: '🤒 아파요 (반창고와 아픈 표정)' },
  { value: 'sleepy', label: '😴 졸려요 (쿨쿨 Zzz 잠자는 모습)' },
  { value: 'playing', label: '🎈 놀아요·던져요·굴려요 (신체 놀이)' },
  { value: 'more', label: '➕ 더 주세요 (하나 더 추가하기)' },
  { value: 'helping', label: '🤝 도와주세요·잡아요 (두 손 맞잡기)' },
  { value: 'refusing', label: '🙅 싫어요 (고개 저으며 거절)' },
  { value: 'greeting', label: '👋 안녕하세요 (손 흔들며 인사)' },
];

/**
 * @description 2페이지 전용 고빈도 동사·형용사(감정/상태) 통합 템플릿
 * (1페이지 명사와 자연스럽게 결합되도록 동작 동사와 감정·상태 형용사를 함께 구성)
 */
export const DEFAULT_VERB_CARDS: readonly AacCard[] = [
  // 기본 핵심 요구·식음·이동 동사
  { id: 'verb-give', label: '주세요', speechText: '주세요', partOfSpeech: 'verb', emoji: '🤲', motionType: 'begging' },
  { id: 'verb-eat', label: '먹어요', speechText: '먹어요', partOfSpeech: 'verb', emoji: '🍽️', motionType: 'eating' },
  { id: 'verb-drink', label: '마셔요', speechText: '마셔요', partOfSpeech: 'verb', emoji: '🥤', motionType: 'drinking' },
  { id: 'verb-tear', label: '뜯어요', speechText: '뜯어요', partOfSpeech: 'verb', emoji: '🍬', motionType: 'tearing' },
  { id: 'verb-insert-straw', label: '꽂아요', speechText: '꽂아요', partOfSpeech: 'verb', emoji: '🧃', motionType: 'puttingIn' },
  { id: 'verb-pour', label: '부어요', speechText: '부어요', partOfSpeech: 'verb', emoji: '🫗', motionType: 'drinking' },
  { id: 'verb-ride', label: '타요', speechText: '타요', partOfSpeech: 'verb', emoji: '🚗', motionType: 'riding' },
  { id: 'verb-get-off', label: '내려요', speechText: '내려요', partOfSpeech: 'verb', emoji: '🚶', motionType: 'going' },
  { id: 'verb-go', label: '가요', speechText: '가요', partOfSpeech: 'verb', emoji: '🏃', motionType: 'going' },
  { id: 'verb-go-up', label: '올라가요', speechText: '올라가요', partOfSpeech: 'verb', emoji: '🧗', motionType: 'going' },
  { id: 'verb-go-down', label: '내려가요', speechText: '내려가요', partOfSpeech: 'verb', emoji: '🛝', motionType: 'going' },
  { id: 'verb-enter', label: '들어가요', speechText: '들어가요', partOfSpeech: 'verb', emoji: '⛺', motionType: 'puttingIn' },

  // 착석·기립·신체 자세 및 손 동작
  { id: 'verb-sit', label: '앉아요', speechText: '앉아요', partOfSpeech: 'verb', emoji: '🪑', motionType: 'puttingIn' },
  { id: 'verb-stand', label: '일어나요', speechText: '일어나요', partOfSpeech: 'verb', emoji: '🧍', motionType: 'playing' },
  { id: 'verb-lie-down', label: '누워요', speechText: '누워요', partOfSpeech: 'verb', emoji: '🛌', motionType: 'liking' },
  { id: 'verb-hold-hand', label: '잡아요', speechText: '잡아요', partOfSpeech: 'verb', emoji: '🤝', motionType: 'helping' },
  { id: 'verb-let-go', label: '놓아요', speechText: '놓아요', partOfSpeech: 'verb', emoji: '🖐️', motionType: 'takingOut' },
  { id: 'verb-move-away', label: '치워요', speechText: '치워요', partOfSpeech: 'verb', emoji: '🫸', motionType: 'dontTouch' },
  { id: 'verb-dont-touch', label: '만지지 마세요', speechText: '만지지 마세요', partOfSpeech: 'verb', emoji: '✋', motionType: 'dontTouch' },

  // 문·도구·위생·착탈의 일상 동작
  { id: 'verb-open', label: '열어요', speechText: '열어요', partOfSpeech: 'verb', emoji: '🔓', motionType: 'opening' },
  { id: 'verb-close', label: '닫아요', speechText: '닫아요', partOfSpeech: 'verb', emoji: '🔒', motionType: 'puttingIn' },
  { id: 'verb-cut', label: '잘라요', speechText: '잘라요', partOfSpeech: 'verb', emoji: '✂️', motionType: 'tearing' },
  { id: 'verb-comb', label: '빗어요', speechText: '빗어요', partOfSpeech: 'verb', emoji: '🪮', motionType: 'washing' },
  { id: 'verb-wear', label: '입어요', speechText: '입어요', partOfSpeech: 'verb', emoji: '👕', motionType: 'wearing' },
  { id: 'verb-take-off', label: '벗어요', speechText: '벗어요', partOfSpeech: 'verb', emoji: '🧥', motionType: 'takingOut' },
  { id: 'verb-shoes-on', label: '신어요', speechText: '신어요', partOfSpeech: 'verb', emoji: '👟', motionType: 'wearing' },
  { id: 'verb-wipe', label: '닦아요', speechText: '닦아요', partOfSpeech: 'verb', emoji: '🧻', motionType: 'washing' },
  { id: 'verb-wash', label: '씻어요', speechText: '씻어요', partOfSpeech: 'verb', emoji: '🧼', motionType: 'washing' },
  { id: 'verb-throw-away', label: '버려요', speechText: '버려요', partOfSpeech: 'verb', emoji: '🗑️', motionType: 'puttingIn' },
  { id: 'verb-takeout', label: '꺼내요', speechText: '꺼내요', partOfSpeech: 'verb', emoji: '📤', motionType: 'takingOut' },
  { id: 'verb-putin', label: '넣어요', speechText: '넣어요', partOfSpeech: 'verb', emoji: '📥', motionType: 'puttingIn' },

  // 놀이·음악·감정·상태(형용사)·상호작용 서술어
  { id: 'verb-push', label: '밀어요', speechText: '밀어요', partOfSpeech: 'verb', emoji: '👐', motionType: 'playing' },
  { id: 'verb-roll', label: '굴려요', speechText: '굴려요', partOfSpeech: 'verb', emoji: '⚽', motionType: 'riding' },
  { id: 'verb-throw', label: '던져요', speechText: '던져요', partOfSpeech: 'verb', emoji: '🤾', motionType: 'playing' },
  { id: 'verb-sing', label: '불러요', speechText: '불러요', partOfSpeech: 'verb', emoji: '🎤', motionType: 'turningOn' },
  { id: 'verb-listen', label: '들어요', speechText: '들어요', partOfSpeech: 'verb', emoji: '🎧', motionType: 'watching' },
  { id: 'verb-turn-on', label: '틀어주세요', speechText: '틀어주세요', partOfSpeech: 'verb', emoji: '🎶', motionType: 'turningOn' },
  { id: 'verb-watch', label: '봐요', speechText: '봐요', partOfSpeech: 'verb', emoji: '👀', motionType: 'watching' },
  { id: 'verb-play', label: '하고 싶어요', speechText: '하고 싶어요', partOfSpeech: 'verb', emoji: '🙌', motionType: 'playing' },
  { id: 'verb-more', label: '더 주세요', speechText: '더 주세요', partOfSpeech: 'verb', emoji: '➕', motionType: 'more' },
  { id: 'verb-help', label: '도와주세요', speechText: '도와주세요', partOfSpeech: 'verb', emoji: '🆘', motionType: 'helping' },
  { id: 'verb-like', label: '좋아요', speechText: '좋아요', partOfSpeech: 'verb', emoji: '🥰', motionType: 'liking' },
  { id: 'verb-delicious', label: '맛있어요', speechText: '맛있어요', partOfSpeech: 'verb', emoji: '😋', motionType: 'delicious' },
  { id: 'verb-fun', label: '재밌어요', speechText: '재밌어요', partOfSpeech: 'verb', emoji: '🥳', motionType: 'fun' },
  { id: 'verb-happy', label: '기분 좋아요', speechText: '기분 좋아요', partOfSpeech: 'verb', emoji: '😄', motionType: 'happy' },
  { id: 'verb-hungry', label: '배고파요', speechText: '배고파요', partOfSpeech: 'verb', emoji: '🤤', motionType: 'hungry' },
  { id: 'verb-sick', label: '아파요', speechText: '아파요', partOfSpeech: 'verb', emoji: '🤒', motionType: 'sick' },
  { id: 'verb-sleepy', label: '졸려요', speechText: '졸려요', partOfSpeech: 'verb', emoji: '😴', motionType: 'sleepy' },
  { id: 'verb-refuse', label: '싫어요', speechText: '싫어요', partOfSpeech: 'verb', emoji: '🙅', motionType: 'refusing' },
  { id: 'verb-greet', label: '안녕하세요', speechText: '안녕하세요', partOfSpeech: 'verb', emoji: '👋', motionType: 'greeting' },
] as const;
