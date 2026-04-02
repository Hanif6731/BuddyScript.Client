export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

export const setActiveTab = (tab: string) => ({
  type: SET_ACTIVE_TAB,
  payload: tab,
});
