export const FOLLOW_USER = 'FOLLOW_USER';
export const IGNORE_USER = 'IGNORE_USER';

export const followUser = (id: number) => ({
  type: FOLLOW_USER,
  payload: id,
});

export const ignoreUser = (id: number) => ({
  type: IGNORE_USER,
  payload: id,
});
