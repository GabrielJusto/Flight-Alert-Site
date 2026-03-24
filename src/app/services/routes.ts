import api from "./api";

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


