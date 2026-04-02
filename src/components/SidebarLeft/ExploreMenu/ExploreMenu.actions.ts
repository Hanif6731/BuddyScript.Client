export const CLICK_EXPLORE_ITEM = 'CLICK_EXPLORE_ITEM';

export const clickExploreItem = (item: string) => ({
  type: CLICK_EXPLORE_ITEM,
  payload: item,
});
