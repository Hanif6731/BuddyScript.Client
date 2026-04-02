export const SEARCH_INPUT = 'SEARCH_INPUT';
export const SUBMIT_SEARCH = 'SUBMIT_SEARCH';

export const searchInput = (val: string) => ({
  type: SEARCH_INPUT,
  payload: val,
});

export const submitSearch = () => ({
  type: SUBMIT_SEARCH,
});
