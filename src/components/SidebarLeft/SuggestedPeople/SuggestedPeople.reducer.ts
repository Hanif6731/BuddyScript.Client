import { CONNECT_PERSON } from './SuggestedPeople.actions';

export interface SuggestedPeopleState {
  connectedIds: number[];
}

export const initialState: SuggestedPeopleState = {
  connectedIds: [],
};

export function suggestedPeopleReducer(state: SuggestedPeopleState, action: any): SuggestedPeopleState {
  switch (action.type) {
    case CONNECT_PERSON:
      return { ...state, connectedIds: [...state.connectedIds, action.payload] };
    default:
      return state;
  }
}
