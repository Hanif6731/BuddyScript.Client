import { registerUser } from '../../services/apiService';
import type { RegisterState, RegisterAction } from './Register.reducer';

export const handleRegisterAction = async (
    state: RegisterState, 
    dispatch: React.Dispatch<RegisterAction>,
    navigate: (path: string) => void
) => {
    try {
        await registerUser({ 
            firstName: state.firstName, 
            lastName: state.lastName, 
            email: state.email, 
            password: state.password 
        });
        navigate('/login');
    } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data || 'Registration failed' });
    }
};
