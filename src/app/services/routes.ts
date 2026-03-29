import { Route } from "lucide-react";
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

export interface RouteDetail{
    id: string;
    userId: string;
    originIataCode: string;
    destinationIataCode: string;
    targetPrice: number;
    currentPrice: number;
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

export async function getUserRoutes(userId: string): Promise<RouteDetail[]> {
    const response = await api.get(`/routes/get-all/${userId}`);
    if (response.status < 300) {
        return response.data.map((route: any) => ({
            id: route.routeId,
            userId: route.userId,
            originIataCode: route.originIataCode,
            destinationIataCode: route.destinationIataCode,
            targetPrice: route.targetPrice,
            currentPrice: route.currentPrice,
            departureDay: route.departureDay,
            returnDay: null,
        }));
    }
    return [];
}

export async function deleteRoute(routeId: string): Promise<boolean> {
    const response = await api.delete(`/routes/delete/${routeId}`);
    return response.status < 300;
}


