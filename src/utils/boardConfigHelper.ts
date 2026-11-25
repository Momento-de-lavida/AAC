import { AacCard, ProfileBoardConfig } from '../types/aac';
import { PartOfSpeech } from '../types/common';

export const EMPTY_BOARD_CONFIG: ProfileBoardConfig = {
  hiddenCardIds: [],
  nounOrderIds: [],
  verbOrderIds: [],
};

/**
 * @description [HR-05] 지정된 ID 순서 배열(orderIds)에 따라 카드 목록을 정렬하는 순수 함수
 * (새로 추가된 카드는 기존 순서 뒤에 자연스럽게 이어집니다.)
 * @param {readonly AacCard[]} cards 정렬할 원본 카드 배열
 * @param {readonly string[]} orderIds 우선 정렬할 카드 ID 순서 배열
 * @returns {AacCard[]} 정렬된 새 카드 배열
 */
export function sortCardsByOrder(cards: readonly AacCard[], orderIds: readonly string[]): AacCard[] {
  if (orderIds.length === 0) return [...cards];
  const orderMap = new Map<string, number>();
  orderIds.forEach((id, idx) => orderMap.set(id, idx));

  return [...cards].sort((a, b) => {
    const idxA = orderMap.get(a.id);
    const idxB = orderMap.get(b.id);
    if (idxA !== undefined && idxB !== undefined) return idxA - idxB;
    if (idxA !== undefined) return -1;
    if (idxB !== undefined) return 1;
    return 0;
  });
}

/**
 * @description [HR-05] 숨김 처리된 카드(hiddenCardIds)를 제외하고, 아동별 순서대로 필터링·정렬된 카드를 반환하는 순수 함수
 * @param {readonly AacCard[]} cards 전체 카드 배열
 * @param {ProfileBoardConfig} config 아동별 보드 설정
 * @param {PartOfSpeech} partOfSpeech 품사 구분 ('noun' | 'verb')
 * @returns {AacCard[]} 아동 화면에 노출할 카드 배열
 */
export function filterAndSortCards(
  cards: readonly AacCard[],
  config: ProfileBoardConfig,
  partOfSpeech: PartOfSpeech
): AacCard[] {
  const hiddenSet = new Set(config.hiddenCardIds);
  const orderIds = partOfSpeech === 'noun' ? config.nounOrderIds : config.verbOrderIds;
  return sortCardsByOrder(cards, orderIds).filter((c) => !hiddenSet.has(c.id));
}

/**
 * @description [HR-05] 특정 카드의 숨김 상태를 토글하여 새 ProfileBoardConfig를 반환하는 순수 함수
 * @param {ProfileBoardConfig} config 기존 보드 설정
 * @param {string} cardId 숨기거나 다시 표시할 카드 ID
 * @returns {ProfileBoardConfig} 갱신된 보드 설정
 */
export function toggleHiddenCardInConfig(config: ProfileBoardConfig, cardId: string): ProfileBoardConfig {
  const exists = config.hiddenCardIds.includes(cardId);
  const hiddenCardIds = exists
    ? config.hiddenCardIds.filter((id) => id !== cardId)
    : [...config.hiddenCardIds, cardId];
  return { ...config, hiddenCardIds };
}

/**
 * @description [HR-05] 현재 목록 내에서 특정 카드의 순서를 한 칸 앞('up') 또는 뒤('down')로 이동한 새 ProfileBoardConfig를 반환하는 순수 함수
 * @param {ProfileBoardConfig} config 기존 보드 설정
 * @param {readonly AacCard[]} allSamePosCards 같은 품사의 전체 카드(커스텀 포함)
 * @param {readonly AacCard[]} scopeCards 현재 편집 화면에 표시 중인 카드 부분집합(예: 해당 카테고리 명사 또는 전체 동사)
 * @param {PartOfSpeech} partOfSpeech 품사 구분
 * @param {string} cardId 이동할 카드 ID
 * @param {'up' | 'down'} direction 이동 방향
 * @returns {ProfileBoardConfig} 갱신된 보드 설정
 */
export function moveCardInOrderConfig(
  config: ProfileBoardConfig,
  allSamePosCards: readonly AacCard[],
  scopeCards: readonly AacCard[],
  partOfSpeech: PartOfSpeech,
  cardId: string,
  direction: 'up' | 'down'
): ProfileBoardConfig {
  const currentOrderIds = partOfSpeech === 'noun' ? config.nounOrderIds : config.verbOrderIds;
  const fullOrdered = sortCardsByOrder(allSamePosCards, currentOrderIds).map((c) => c.id);
  const scopeOrdered = sortCardsByOrder(scopeCards, currentOrderIds).map((c) => c.id);

  const scopeIdx = scopeOrdered.indexOf(cardId);
  const targetScopeIdx = direction === 'up' ? scopeIdx - 1 : scopeIdx + 1;
  if (scopeIdx < 0 || targetScopeIdx < 0 || targetScopeIdx >= scopeOrdered.length) return config;

  const swapId = scopeOrdered[targetScopeIdx];
  const fullIdxA = fullOrdered.indexOf(cardId);
  const fullIdxB = fullOrdered.indexOf(swapId);
  if (fullIdxA < 0 || fullIdxB < 0) return config;

  const nextOrder = [...fullOrdered];
  nextOrder[fullIdxA] = swapId;
  nextOrder[fullIdxB] = cardId;

  return partOfSpeech === 'noun'
    ? { ...config, nounOrderIds: nextOrder }
    : { ...config, verbOrderIds: nextOrder };
}
