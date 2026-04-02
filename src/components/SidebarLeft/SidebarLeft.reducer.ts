import { SIDEBAR_INIT } from './SidebarLeft.actions';

export interface SidebarLeftState {
  isInitialized: boolean;
}

export const initialState: SidebarLeftState = {
  isInitialized: true,
};

export function sidebarLeftReducer(state: SidebarLeftState, action: any): SidebarLeftState {
  switch (action.type) {
    case SIDEBAR_INIT:
      return { ...state };
    default:
      return state;
  }
}
