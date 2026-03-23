import { api } from './api';
import { User } from '../utils/storage';

// Tipos para as requisições de autenticação
export interface LoginData {
    email: string;
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
    token: string;
}

// Função de login
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);

    // Salvar o token e userId no localStorage
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.userId.toString());
    }

    return response.data;
};


export const signup = async (data: SignupData): Promise<User> => {
    console.log('Chamando signup:', {
        url: '/auth/register',
        data,
        baseURL: import.meta.env.VITE_API_URL
    });
    const response = await api.post<AuthResponse>('/auth/register', data);

    const user: User = {
        id: response.data.userId.toString(),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phoneNumber,
        token: response.data.token
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
