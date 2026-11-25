import { VerbMotionType } from '../types/aac';

/**
 * @description [HR-01, HR-05] 명사(1P)와 동사·형용사(2P) 조합 시 사물 불일치 없이
 * 선택한 명사와 아동의 행동이 정확히 일치하는 전용 일체형 동화풍 일러스트 매핑 모듈
 */

const C_DIR = './images/aac/combined';

/**
 * @description 명사 ID와 동사 ID가 정확히 일치하는 1:1 일체형 동화풍 일러스트 경로 테이블
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
  'noun-water__verb-cool': `${C_DIR}/motion-cool.jpg`,

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

  // 2. 놀이·장난감 실제 행동 일체형 일러스트 (공 올려요, 공 내려요 포함)
  'noun-swing__verb-ride': `${C_DIR}/noun-swing__verb-ride.jpg`,
  'noun-swing__verb-play': `${C_DIR}/noun-swing__verb-ride.jpg`,
  'noun-swing__verb-fun': `${C_DIR}/noun-swing__verb-ride.jpg`,
  'noun-swing__verb-push': `${C_DIR}/verb-push.jpg`,

  'noun-trampoline__verb-ride': `${C_DIR}/noun-trampoline__verb-ride.jpg`,
  'noun-trampoline__verb-play': `${C_DIR}/noun-trampoline__verb-ride.jpg`,
  'noun-trampoline__verb-fun': `${C_DIR}/noun-trampoline__verb-ride.jpg`,
  'noun-trampoline__verb-jump': `${C_DIR}/noun-trampoline__verb-ride.jpg`,
  'noun-trampoline__verb-jump-play': `${C_DIR}/noun-trampoline__verb-ride.jpg`,

  'noun-car__verb-ride': `${C_DIR}/noun-car__verb-ride.jpg`,
  'noun-car__verb-play': `${C_DIR}/noun-car__verb-ride.jpg`,
  'noun-car__verb-get-off': `${C_DIR}/verb-get-off.jpg`,

  'noun-bicycle__verb-ride': `${C_DIR}/noun-bicycle__verb-ride.jpg`,
  'noun-bicycle__verb-play': `${C_DIR}/noun-bicycle__verb-ride.jpg`,

  'noun-ball__verb-throw': `${C_DIR}/noun-ball__verb-throw.jpg`,
  'noun-ball__verb-play': `${C_DIR}/noun-ball__verb-throw.jpg`,
  'noun-ball__verb-roll': `${C_DIR}/noun-ball__verb-roll.jpg`,
  'noun-ball__verb-put-up': `${C_DIR}/noun-ball__verb-put-up.jpg`,
  'noun-ball__verb-put-down': `${C_DIR}/noun-ball__verb-put-down.jpg`,
  'noun-ball__verb-get-off': `${C_DIR}/noun-ball__verb-put-down.jpg`,
  'noun-ball__verb-hold-hand': `${C_DIR}/verb-hold-hand.jpg`,
  'noun-ball__verb-let-go': `${C_DIR}/verb-let-go.jpg`,

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

  'noun-doll__verb-put-up': `${C_DIR}/verb-put-up.jpg`,
  'noun-toy__verb-put-up': `${C_DIR}/verb-put-up.jpg`,
  'noun-toy__verb-put-down': `${C_DIR}/verb-put-down.jpg`,
  'noun-toy__verb-clean-up': `${C_DIR}/verb-clean-up.jpg`,
  'noun-block__verb-clean-up': `${C_DIR}/verb-clean-up.jpg`,
  'noun-toy__verb-takeout': `${C_DIR}/motion-takingOut.jpg`,
  'noun-toy__verb-putin': `${C_DIR}/motion-puttingIn.jpg`,
  'noun-toy__verb-open': `${C_DIR}/motion-opening.jpg`,
  'noun-mat__verb-lie-down': `${C_DIR}/motion-sleepy.jpg`,
  'noun-mat__verb-sleepy': `${C_DIR}/motion-sleepy.jpg`,

  // 3. 일상·신체·사람·장소 일체형 일러스트 (학교에 들어가요, 집에 들어가요 포함)
  'noun-school__verb-enter': `${C_DIR}/noun-school__verb-enter.jpg`,
  'noun-school__verb-go': `${C_DIR}/noun-school__verb-enter.jpg`,
  'noun-home__verb-enter': `${C_DIR}/noun-home__verb-enter.jpg`,
  'noun-home__verb-go': `${C_DIR}/noun-home__verb-enter.jpg`,
  'noun-home__verb-exit': `${C_DIR}/verb-exit.jpg`,
  'noun-door__verb-exit': `${C_DIR}/verb-exit.jpg`,
  'noun-hands__verb-wash': `${C_DIR}/noun-hands__verb-wash.jpg`,
  'noun-hands__verb-wipe': `${C_DIR}/verb-wipe.jpg`,
  'noun-hands__verb-hold-hand': `${C_DIR}/verb-hold-hand.jpg`,
  'noun-hands__verb-let-go': `${C_DIR}/verb-let-go.jpg`,
  'noun-chair__verb-sit': `${C_DIR}/noun-chair__verb-sit.jpg`,
  'noun-door__verb-open': `${C_DIR}/noun-door__verb-open.jpg`,
  'noun-door__verb-close': `${C_DIR}/verb-close.jpg`,
  'noun-hair__verb-comb': `${C_DIR}/noun-hair__verb-comb.jpg`,
  'noun-hair__verb-sick': `${C_DIR}/motion-sick.jpg`,
  'noun-tummy__verb-sick': `${C_DIR}/motion-sick.jpg`,
  'noun-tummy__verb-hungry': `${C_DIR}/motion-hungry.jpg`,
  'noun-teeth__verb-sick': `${C_DIR}/motion-sick.jpg`,
  'noun-bed__verb-sleepy': `${C_DIR}/motion-sleepy.jpg`,
  'noun-bed__verb-lie-down': `${C_DIR}/motion-sleepy.jpg`,
  'noun-clothes__verb-wear': `${C_DIR}/motion-wearing.jpg`,
  'noun-clothes__verb-take-off': `${C_DIR}/verb-take-off.jpg`,
  'noun-shoes__verb-take-off': `${C_DIR}/verb-take-off.jpg`,
  'noun-tissue__verb-wipe': `${C_DIR}/verb-wipe.jpg`,
};

/**
 * @description 사물에 구애받지 않는 순수 자동사·감각·상태 형용사 전용 일체형 동화풍 일러스트 테이블
 * (타동사나 장소 이동 동사는 다른 명사를 덮어쓰지 않도록 여기서 제외하고 선택한 명사와 결합 렌더링)
 */
export const INTRANSITIVE_VERB_SCENE_IMAGES: Readonly<Record<string, string>> = {
  'verb-jump': `${C_DIR}/motion-jumping.jpg`,
  'verb-jump-play': `${C_DIR}/verb-jump-play.jpg`,
  'verb-run': `${C_DIR}/motion-running.jpg`,
  'verb-cool': `${C_DIR}/motion-cool.jpg`,
  'verb-warm': `${C_DIR}/motion-warm.jpg`,
  'verb-cold-weather': `${C_DIR}/motion-coldWeather.jpg`,
  'verb-cold-touch': `${C_DIR}/motion-coldTouch.jpg`,
  'verb-hot': `${C_DIR}/motion-hot.jpg`,
  'verb-tired': `${C_DIR}/motion-tired.jpg`,
  'verb-difficult': `${C_DIR}/motion-difficult.jpg`,
};

/**
 * @description 선택된 명사 ID와 동사 ID에 해당하는 1:1 전용 일체형 동화풍 일러스트를 조회하는 순수 함수
 */
export function getDedicatedCombinedIllustration(nounId: string, verbId: string): string | undefined {
  return DEDICATED_COMBINED_IMAGES[`${nounId}__${verbId}`] ?? INTRANSITIVE_VERB_SCENE_IMAGES[verbId];
}

/**
 * @description 1:1 전용 조합이 없을 때 동사 ID 또는 모션 타입에 가장 알맞은 동화풍 행동 배경 이미지를 반환하는 함수
 */
export function getVerbActionBackground(verbId: string, motion: VerbMotionType): string {
  const specificVerbBg: Readonly<Record<string, string>> = {
    'verb-get-off': `${C_DIR}/verb-get-off.jpg`,
    'verb-exit': `${C_DIR}/verb-exit.jpg`,
    'verb-hold-hand': `${C_DIR}/verb-hold-hand.jpg`,
    'verb-let-go': `${C_DIR}/verb-let-go.jpg`,
    'verb-open': `${C_DIR}/verb-open.jpg`,
    'verb-close': `${C_DIR}/verb-close.jpg`,
    'verb-take-off': `${C_DIR}/verb-take-off.jpg`,
    'verb-wipe': `${C_DIR}/verb-wipe.jpg`,
    'verb-push': `${C_DIR}/verb-push.jpg`,
    'verb-clean-up': `${C_DIR}/verb-clean-up.jpg`,
    'verb-put-up': `${C_DIR}/verb-put-up.jpg`,
    'verb-put-down': `${C_DIR}/verb-put-down.jpg`,
  };
  return specificVerbBg[verbId] ?? `${C_DIR}/motion-${motion}.jpg`;
}
