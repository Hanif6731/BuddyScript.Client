export const CONNECT_PERSON = 'CONNECT_PERSON';

export const connectPerson = (id: number) => ({
  type: CONNECT_PERSON,
  payload: id,
});
