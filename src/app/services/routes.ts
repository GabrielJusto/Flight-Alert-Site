import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});


api.interceptors.request.use((config) => {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const token = JSON.parse(user).token;
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Authorization header enviado:', config.headers['Authorization']);
    return config;
});


export interface Route {
    id?: string;
    userId: string;
    originIataCode: string;
    destinationIataCode: string;
    targetPrice: number;
    departureDay: string;
    returnDay?: string | null;
}



export async function addRoute(route: Route): Promise<boolean> {
    const response = await api.post('/routes/insert', route);
    if (response.status < 300) {
        return true;
    }
    return false;
}


