export const TOGGLE_POST_DROPDOWN = 'TOGGLE_POST_DROPDOWN';
export const LIKE_POST = 'LIKE_POST';
export const TOGGLE_COMMENTS = 'TOGGLE_COMMENTS';

export const togglePostDropdown = () => ({
  type: TOGGLE_POST_DROPDOWN,
});

export const likePost = () => ({
  type: LIKE_POST,
});

export const toggleComments = () => ({
  type: TOGGLE_COMMENTS,
});
