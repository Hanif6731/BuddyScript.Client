import { TOGGLE_THEME } from './ThemeSwitcher.actions';

export interface ThemeSwitcherState {
  isDarkMode: boolean;
}

export const initialState: ThemeSwitcherState = {
  isDarkMode: false,
};

export function themeSwitcherReducer(state: ThemeSwitcherState, action: any): ThemeSwitcherState {
  switch (action.type) {
    case TOGGLE_THEME:
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
}
