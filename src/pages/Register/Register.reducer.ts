export type RegisterState = { firstName: string; lastName: string; email: string; password: string; error: string; };

export type RegisterAction = 
  | { type: 'SET_FIELD'; field: keyof RegisterState; value: string }
  | { type: 'SET_ERROR'; payload: string };

export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
    switch (action.type) {
        case 'SET_FIELD': return { ...state, [action.field]: action.value, error: '' };
        case 'SET_ERROR': return { ...state, error: action.payload };
        default: return state;
    }
}
