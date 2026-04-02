import { TOGGLE_NOTIFICATIONS } from './HeaderNav.actions';

export interface HeaderNavState {
  isNotificationsOpen: boolean;
}

export const initialState: HeaderNavState = {
  isNotificationsOpen: false,
};

export function headerNavReducer(state: HeaderNavState, action: any): HeaderNavState {
  switch (action.type) {
    case TOGGLE_NOTIFICATIONS:
      return { ...state, isNotificationsOpen: !state.isNotificationsOpen };
    default:
      return state;
  }
}
