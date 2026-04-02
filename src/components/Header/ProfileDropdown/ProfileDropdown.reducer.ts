import { LOGOUT } from './ProfileDropdown.actions';

export interface ProfileDropdownState {
  loggedOut: boolean;
}

export const initialState: ProfileDropdownState = {
  loggedOut: false,
};

export function profileDropdownReducer(state: ProfileDropdownState, action: any): ProfileDropdownState {
  switch (action.type) {
    case LOGOUT:
      return { ...state, loggedOut: true };
    default:
      return state;
  }
}
