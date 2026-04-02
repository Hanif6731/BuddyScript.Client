import { FEED_INIT } from './FeedMiddle.actions';

export interface FeedMiddleState {
  isLoaded: boolean;
}

export const initialState: FeedMiddleState = {
  isLoaded: true,
};

export function feedMiddleReducer(state: FeedMiddleState, action: any): FeedMiddleState {
  switch (action.type) {
    case FEED_INIT:
      return { ...state };
    default:
      return state;
  }
}
