import { UPDATE_POST_TEXT, SUBMIT_POST } from './PostCreator.actions';

export interface PostCreatorState {
  postText: string;
}

export const initialState: PostCreatorState = {
  postText: '',
};

export function postCreatorReducer(state: PostCreatorState, action: any): PostCreatorState {
  switch (action.type) {
    case UPDATE_POST_TEXT:
      return { ...state, postText: action.payload };
    case SUBMIT_POST:
      return { ...state, postText: '' };
    default:
      return state;
  }
}
