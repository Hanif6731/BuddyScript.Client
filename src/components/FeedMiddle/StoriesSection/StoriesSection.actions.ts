export const SCROLL_STORIES = 'SCROLL_STORIES';

export const scrollStories = (direction: 'left' | 'right') => ({
  type: SCROLL_STORIES,
  payload: direction,
});
