/**
 * @description [HR-01, HR-05] 명사(1P)와 동사·형용사(2P) 조합 시 스티커 합성 없이
 * 사물과 아동의 행동이 하나의 완성된 동화책 장면으로 그려진 전용 일체형 동화풍 일러스트 매핑 모듈
 */

const C_DIR = '/images/aac/combined';

/**
 * @description 명사 ID와 동사 ID 조합(`nounId__verbId`)에 대응하는 일체형 동화풍 일러스트 경로 테이블
 */
export const DEDICATED_COMBINED_IMAGES: Readonly<Record<string, string>> = {
  // 1. 간식·음식 실제 섭취 및 동작 일체형 일러스트
  'noun-bread__verb-eat': `${C_DIR}/noun-bread__verb-eat.jpg`,
  'noun-bread__verb-delicious': `${C_DIR}/noun-bread__verb-eat.jpg`,
  'noun-bread__verb-give': `${C_DIR}/noun-bread__verb-give.jpg`,
  'noun-bread__verb-more': `${C_DIR}/noun-bread__verb-give.jpg`,

  'noun-juice__verb-drink': `${C_DIR}/noun-juice__verb-drink.jpg`,
  'noun-juice__verb-eat': `${C_DIR}/noun-juice__verb-drink.jpg`,
  'noun-juice__verb-delicious': `${C_DIR}/noun-juice__verb-drink.jpg`,
  'noun-juice__verb-pour': `${C_DIR}/noun-juice__verb-pour.jpg`,

  'noun-milk__verb-drink': `${C_DIR}/noun-milk__verb-drink.jpg`,
  'noun-milk__verb-eat': `${C_DIR}/noun-milk__verb-drink.jpg`,
  'noun-milk__verb-delicious': `${C_DIR}/noun-milk__verb-drink.jpg`,
  'noun-milk__verb-give': `${C_DIR}/noun-milk__verb-give.jpg`,
  'noun-milk__verb-more': `${C_DIR}/noun-milk__verb-give.jpg`,

  'noun-water__verb-drink': `${C_DIR}/noun-water__verb-drink.jpg`,
  'noun-water__verb-eat': `${C_DIR}/noun-water__verb-drink.jpg`,

  'noun-snack__verb-eat': `${C_DIR}/noun-snack__verb-eat.jpg`,
  'noun-snack__verb-delicious': `${C_DIR}/noun-snack__verb-eat.jpg`,
  'noun-snack__verb-give': `${C_DIR}/noun-snack__verb-give.jpg`,
  'noun-snack__verb-more': `${C_DIR}/noun-snack__verb-give.jpg`,

  'noun-snack-bag__verb-tear': `${C_DIR}/noun-snack-bag__verb-tear.jpg`,
  'noun-snack-bag__verb-open': `${C_DIR}/noun-snack-bag__verb-tear.jpg`,
  'noun-snack-bag__verb-eat': `${C_DIR}/noun-snack__verb-eat.jpg`,
  'noun-snack-bag__verb-give': `${C_DIR}/noun-snack__verb-give.jpg`,

  'noun-straw__verb-insert-straw': `${C_DIR}/noun-straw__verb-insert-straw.jpg`,
  'noun-straw__verb-putin': `${C_DIR}/noun-straw__verb-insert-straw.jpg`,
  'noun-straw__verb-drink': `${C_DIR}/noun-juice__verb-drink.jpg`,

  'noun-apple__verb-eat': `${C_DIR}/noun-apple__verb-eat.jpg`,
  'noun-apple__verb-delicious': `${C_DIR}/noun-apple__verb-eat.jpg`,

  'noun-rice__verb-eat': `${C_DIR}/noun-rice__verb-eat.jpg`,
  'noun-rice__verb-delicious': `${C_DIR}/noun-rice__verb-eat.jpg`,
  'noun-rice__verb-hungry': `${C_DIR}/motion-hungry.jpg`,

  'noun-banana__verb-eat': `${C_DIR}/noun-banana__verb-eat.jpg`,
  'noun-banana__verb-delicious': `${C_DIR}/noun-banana__verb-eat.jpg`,

  // 2. 놀이·장난감 실제 행동 일체형 일러스트
  'noun-swing__verb-ride': `${C_DIR}/noun-swing__verb-ride.jpg`,
  'noun-swing__verb-play': `${C_DIR}/noun-swing__verb-ride.jpg`,
  'noun-swing__verb-fun': `${C_DIR}/noun-swing__verb-ride.jpg`,
  'noun-swing__verb-push': `${C_DIR}/noun-swing__verb-ride.jpg`,

  'noun-trampoline__verb-ride': `${C_DIR}/noun-trampoline__verb-ride.jpg`,
  'noun-trampoline__verb-play': `${C_DIR}/noun-trampoline__verb-ride.jpg`,
  'noun-trampoline__verb-fun': `${C_DIR}/noun-trampoline__verb-ride.jpg`,

  'noun-car__verb-ride': `${C_DIR}/noun-car__verb-ride.jpg`,
  'noun-car__verb-play': `${C_DIR}/noun-car__verb-ride.jpg`,

  'noun-bicycle__verb-ride': `${C_DIR}/noun-bicycle__verb-ride.jpg`,
  'noun-bicycle__verb-play': `${C_DIR}/noun-bicycle__verb-ride.jpg`,

  'noun-ball__verb-throw': `${C_DIR}/noun-ball__verb-throw.jpg`,
  'noun-ball__verb-play': `${C_DIR}/noun-ball__verb-throw.jpg`,
  'noun-ball__verb-roll': `${C_DIR}/noun-ball__verb-roll.jpg`,

  'noun-scissors__verb-cut': `${C_DIR}/noun-scissors__verb-cut.jpg`,
  'noun-book__verb-watch': `${C_DIR}/noun-book__verb-watch.jpg`,
  'noun-book__verb-open': `${C_DIR}/noun-book__verb-watch.jpg`,

  'noun-song__verb-sing': `${C_DIR}/noun-song__verb-sing.jpg`,
  'noun-song__verb-turn-on': `${C_DIR}/noun-song__verb-sing.jpg`,
  'noun-song__verb-listen': `${C_DIR}/noun-song__verb-listen.jpg`,

  'noun-tent__verb-enter': `${C_DIR}/noun-tent__verb-enter.jpg`,
  'noun-tent__verb-play': `${C_DIR}/noun-tent__verb-enter.jpg`,

  'noun-bubble__verb-play': `${C_DIR}/noun-bubble__verb-play.jpg`,
  'noun-bubble__verb-watch': `${C_DIR}/noun-bubble__verb-play.jpg`,
  'noun-bubble__verb-fun': `${C_DIR}/noun-bubble__verb-play.jpg`,

  'noun-toy__verb-takeout': `${C_DIR}/motion-takingOut.jpg`,
  'noun-toy__verb-putin': `${C_DIR}/motion-puttingIn.jpg`,
  'noun-toy__verb-open': `${C_DIR}/motion-opening.jpg`,
  'noun-mat__verb-lie-down': `${C_DIR}/motion-sleepy.jpg`,
  'noun-mat__verb-sleepy': `${C_DIR}/motion-sleepy.jpg`,

  // 3. 일상·생활·신체 & 사람·장소 일체형 일러스트
  'noun-hands__verb-wash': `${C_DIR}/noun-hands__verb-wash.jpg`,
  'noun-hands__verb-wipe': `${C_DIR}/noun-hands__verb-wash.jpg`,
  'noun-hands__verb-hold-hand': `${C_DIR}/motion-helping.jpg`,
  'noun-chair__verb-sit': `${C_DIR}/noun-chair__verb-sit.jpg`,
  'noun-door__verb-open': `${C_DIR}/noun-door__verb-open.jpg`,
  'noun-hair__verb-comb': `${C_DIR}/noun-hair__verb-comb.jpg`,
  'noun-hair__verb-sick': `${C_DIR}/motion-sick.jpg`,
  'noun-tummy__verb-sick': `${C_DIR}/motion-sick.jpg`,
  'noun-tummy__verb-hungry': `${C_DIR}/motion-hungry.jpg`,
  'noun-teeth__verb-sick': `${C_DIR}/motion-sick.jpg`,
  'noun-bed__verb-sleepy': `${C_DIR}/motion-sleepy.jpg`,
  'noun-bed__verb-lie-down': `${C_DIR}/motion-sleepy.jpg`,
  'noun-clothes__verb-wear': `${C_DIR}/motion-wearing.jpg`,
};

/**
 * @description 선택된 명사 ID와 동사 ID에 해당하는 전용 일체형 동화풍 일러스트 경로를 조회하는 순수 함수
 * @param {string} nounId 선택된 명사 카드 ID
 * @param {string} verbId 선택된 동사 카드 ID
 * @returns {string | undefined} 전용 일체형 동화풍 일러스트 URL (없으면 undefined)
 */
export function getDedicatedCombinedIllustration(nounId: string, verbId: string): string | undefined {
  return DEDICATED_COMBINED_IMAGES[`${nounId}__${verbId}`];
}
