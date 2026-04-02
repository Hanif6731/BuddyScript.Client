import { SET_ACTIVE_TAB } from './MobileFooterNav.actions';

export interface MobileFooterNavState {
  activeTab: string;
}

export const initialState: MobileFooterNavState = {
  activeTab: 'feed',
};

export function mobileFooterNavReducer(state: MobileFooterNavState, action: any): MobileFooterNavState {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}
