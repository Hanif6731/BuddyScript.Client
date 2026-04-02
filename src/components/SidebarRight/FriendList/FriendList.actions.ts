export const SEARCH_FRIENDS = 'SEARCH_FRIENDS';

export const searchFriends = (query: string) => ({
  type: SEARCH_FRIENDS,
  payload: query,
});
