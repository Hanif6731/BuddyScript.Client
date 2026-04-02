export const UPDATE_POST_TEXT = 'UPDATE_POST_TEXT';
export const SUBMIT_POST = 'SUBMIT_POST';

export const updatePostText = (text: string) => ({
  type: UPDATE_POST_TEXT,
  payload: text,
});

export const submitPost = () => ({
  type: SUBMIT_POST,
});
