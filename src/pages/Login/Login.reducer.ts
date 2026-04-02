export type LoginState = { email: string; password: string; remember: boolean; error: string; };

export type LoginAction = 
  | { type: 'SET_EMAIL', payload: string }
  | { type: 'SET_PASSWORD', payload: string }
  | { type: 'SET_REMEMBER', payload: boolean }
  | { type: 'SET_ERROR', payload: string };

export function loginReducer(state: LoginState, action: LoginAction): LoginState {
    switch (action.type) {
        case 'SET_EMAIL': return { ...state, email: action.payload, error: '' };
        case 'SET_PASSWORD': return { ...state, password: action.payload, error: '' };
        case 'SET_REMEMBER': return { ...state, remember: action.payload };
        case 'SET_ERROR': return { ...state, error: action.payload };
        default: return state;
    }
}
