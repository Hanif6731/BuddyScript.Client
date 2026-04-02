import { MOBILE_SEARCH_CLICK } from './MobileHeader.actions';

export interface MobileHeaderState {
  isSearchActive: boolean;
}

export const initialState: MobileHeaderState = {
  isSearchActive: false,
};

export function mobileHeaderReducer(state: MobileHeaderState, action: any): MobileHeaderState {
  switch (action.type) {
    case MOBILE_SEARCH_CLICK:
      return { ...state, isSearchActive: !state.isSearchActive };
    default:
      return state;
  }
}
