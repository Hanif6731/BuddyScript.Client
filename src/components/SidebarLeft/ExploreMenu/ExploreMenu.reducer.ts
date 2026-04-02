import { CLICK_EXPLORE_ITEM } from './ExploreMenu.actions';

export interface ExploreMenuState {
  activeItem: string;
}

export const initialState: ExploreMenuState = {
  activeItem: 'Learning',
};

export function exploreMenuReducer(state: ExploreMenuState, action: any): ExploreMenuState {
  switch (action.type) {
    case CLICK_EXPLORE_ITEM:
      return { ...state, activeItem: action.payload };
    default:
      return state;
  }
}
