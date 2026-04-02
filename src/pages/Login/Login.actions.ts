import { loginUser } from '../../services/apiService';
import type { LoginState, LoginAction } from './Login.reducer';
import type { User } from '../../types/models';

export const handleLoginAction = async (
    state: LoginState, 
    dispatch: React.Dispatch<LoginAction>, 
    setUser: (user: User) => void
) => {
    try {
        const user = await loginUser({ 
            email: state.email, 
            password: state.password,
            rememberMe: state.remember 
        });
        setUser(user);
    } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data || 'Login failed' });
    }
};
