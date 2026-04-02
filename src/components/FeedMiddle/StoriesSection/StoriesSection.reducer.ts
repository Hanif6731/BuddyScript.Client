import { SCROLL_STORIES } from './StoriesSection.actions';

export interface StoriesSectionState {
  currentTranslate: number;
}

export const initialState: StoriesSectionState = {
  currentTranslate: 0,
};

export function storiesSectionReducer(state: StoriesSectionState, action: any): StoriesSectionState {
  switch (action.type) {
    case SCROLL_STORIES:
      return { ...state, currentTranslate: action.payload === 'right' ? state.currentTranslate - 200 : state.currentTranslate + 200 };
    default:
      return state;
  }
}
