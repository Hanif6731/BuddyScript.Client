import { LOGO_CLICK } from './HeaderLogo.actions';

export interface HeaderLogoState {
  clicked: boolean;
}

export const initialState: HeaderLogoState = {
  clicked: false,
};

export function headerLogoReducer(state: HeaderLogoState, action: any): HeaderLogoState {
  switch (action.type) {
    case LOGO_CLICK:
      return { ...state, clicked: true };
    default:
      return state;
  }
}
