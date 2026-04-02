import { TOGGLE_MORE_OPTIONS } from './NotificationDropdown.actions';

export interface NotificationDropdownState {
  isMoreOptionsShow: boolean;
}

export const initialState: NotificationDropdownState = {
  isMoreOptionsShow: false,
};

export function notificationDropdownReducer(state: NotificationDropdownState, action: any): NotificationDropdownState {
  switch (action.type) {
    case TOGGLE_MORE_OPTIONS:
      return { ...state, isMoreOptionsShow: !state.isMoreOptionsShow };
    default:
      return state;
  }
}
