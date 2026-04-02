export const TOGGLE_GOING = 'TOGGLE_GOING';

export const toggleGoing = (id: number) => ({
  type: TOGGLE_GOING,
  payload: id,
});
