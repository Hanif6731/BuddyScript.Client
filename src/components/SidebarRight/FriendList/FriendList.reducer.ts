import { SEARCH_FRIENDS } from './FriendList.actions';

export interface FriendListState {
  searchQuery: string;
}

export const initialState: FriendListState = {
  searchQuery: '',
};

export function friendListReducer(state: FriendListState, action: any): FriendListState {
  switch (action.type) {
    case SEARCH_FRIENDS:
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}
