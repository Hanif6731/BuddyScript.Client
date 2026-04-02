import { TOGGLE_PROFILE_MENU } from './HeaderProfile.actions';

export interface HeaderProfileState {
  isProfileOpen: boolean;
}

export const initialState: HeaderProfileState = {
  isProfileOpen: false,
};

export function headerProfileReducer(state: HeaderProfileState, action: any): HeaderProfileState {
  switch (action.type) {
    case TOGGLE_PROFILE_MENU:
      return { ...state, isProfileOpen: !state.isProfileOpen };
    default:
      return state;
  }
}
