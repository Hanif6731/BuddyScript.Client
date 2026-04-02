import { TOGGLE_MOBILE_NAV } from './Header.actions';

export interface HeaderState {
  isMobileNavOpen: boolean;
}

export const initialState: HeaderState = {
  isMobileNavOpen: false,
};

export function headerReducer(state: HeaderState, action: any): HeaderState {
  switch (action.type) {
    case TOGGLE_MOBILE_NAV:
      return { ...state, isMobileNavOpen: !state.isMobileNavOpen };
    default:
      return state;
  }
}
