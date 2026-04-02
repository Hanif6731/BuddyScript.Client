import { TOGGLE_GOING } from './SidebarEvents.actions';

export interface SidebarEventsState {
  goingIds: number[];
}

export const initialState: SidebarEventsState = {
  goingIds: [],
};

export function sidebarEventsReducer(state: SidebarEventsState, action: any): SidebarEventsState {
  switch (action.type) {
    case TOGGLE_GOING:
      if (state.goingIds.includes(action.payload)) {
        return { ...state, goingIds: state.goingIds.filter(id => id !== action.payload) };
      } else {
        return { ...state, goingIds: [...state.goingIds, action.payload] };
      }
    default:
      return state;
  }
}
