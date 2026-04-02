import { SEARCH_INPUT, SUBMIT_SEARCH } from './HeaderSearch.actions';

export interface HeaderSearchState {
  searchValue: string;
}

export const initialState: HeaderSearchState = {
  searchValue: '',
};

export function headerSearchReducer(state: HeaderSearchState, action: any): HeaderSearchState {
  switch (action.type) {
    case SEARCH_INPUT:
      return { ...state, searchValue: action.payload };
    case SUBMIT_SEARCH:
      return { ...state };
    default:
      return state;
  }
}
