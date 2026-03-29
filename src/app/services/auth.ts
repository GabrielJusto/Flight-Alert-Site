import { User } from '../utils/storage';
import { api } from './api';

export interface LoginData {
    username: string;
    password: string;
}

export interface SignupData {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface AuthResponse {
    userId: number;
    name: string;
    lastName?: string | null;
    email: string;
    token: string;
}

export const login = async (data: LoginData): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const user: User = {
        id: response.data.userId.toString(),
        name: response.data.name, 
        email: response.data.email,
        token: response.data.token,
    };
    return user;
};


export const signup = async (data: SignupData): Promise<User> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    const user: User = {
        id: response.data.userId.toString(),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        token: response.data.token,
    };

    return user;
};


// export const logout = async (): Promise<void> => {
//   try {
//     await api.post('/auth/logout');
//   } catch (error) {
//     console.error('Erro ao fazer logout:', error);
//   } finally {
//     // Remover dados locais independente do resultado
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('currentUser');
//   }
// };


// export const checkAuth = async (): Promise<User | null> => {
//   try {
//     const response = await api.get<{ user: User }>('/auth/me');
//     return response.data.user;
//   } catch (error) {
//     return null;
//   }
// };
