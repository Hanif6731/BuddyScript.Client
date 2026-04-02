import { FOLLOW_USER, IGNORE_USER } from './SuggestedFollow.actions';

export interface SuggestedFollowState {
  followedIds: number[];
  ignoredIds: number[];
}

export const initialState: SuggestedFollowState = {
  followedIds: [],
  ignoredIds: [],
};

export function suggestedFollowReducer(state: SuggestedFollowState, action: any): SuggestedFollowState {
  switch (action.type) {
    case FOLLOW_USER:
      return { ...state, followedIds: [...state.followedIds, action.payload] };
    case IGNORE_USER:
      return { ...state, ignoredIds: [...state.ignoredIds, action.payload] };
    default:
      return state;
  }
}
