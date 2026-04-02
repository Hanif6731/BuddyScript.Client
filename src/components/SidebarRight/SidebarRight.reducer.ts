import { SIDEBAR_RIGHT_INIT } from './SidebarRight.actions';

export interface SidebarRightState {
  isInitialized: boolean;
}

export const initialState: SidebarRightState = {
  isInitialized: true,
};

export function sidebarRightReducer(state: SidebarRightState, action: any): SidebarRightState {
  switch (action.type) {
    case SIDEBAR_RIGHT_INIT:
      return { ...state };
    default:
      return state;
  }
}
