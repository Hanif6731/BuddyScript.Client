import { TOGGLE_POST_DROPDOWN, LIKE_POST, TOGGLE_COMMENTS } from './PostItem.actions';

export interface PostItemState {
  isDropdownOpen: boolean;
  isLiked: boolean;
  showComments: boolean;
}

export const initialState: PostItemState = {
  isDropdownOpen: false,
  isLiked: false,
  showComments: false,
};

export function postItemReducer(state: PostItemState, action: any): PostItemState {
  switch (action.type) {
    case TOGGLE_POST_DROPDOWN:
      return { ...state, isDropdownOpen: !state.isDropdownOpen };
    case LIKE_POST:
      return { ...state, isLiked: !state.isLiked };
    case TOGGLE_COMMENTS:
      return { ...state, showComments: !state.showComments };
    default:
      return state;
  }
}
