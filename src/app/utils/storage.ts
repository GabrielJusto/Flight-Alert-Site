// Utility functions for localStorage management

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  token?: string;
}

export interface Route {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  targetPrice: number;
  currentPrice: number;
  createdAt: string;
  active: boolean;
}

export interface PriceHistory {
  id: string;
  routeId: string;
  price: number;
  date: string;
}

// User management
export const saveUser = (user: User) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
};

// Routes management
export const saveRoute = (route: Route) => {
  const routes = getRoutes();
  routes.push(route);
  localStorage.setItem("routes", JSON.stringify(routes));
};

export const getRoutes = (): Route[] => {
  const routes = localStorage.getItem("routes");
  return routes ? JSON.parse(routes) : [];
};

export const getUserRoutes = (userId: string): Route[] => {
  return getRoutes().filter((route) => route.userId === userId);
};

export const getRouteById = (routeId: string): Route | null => {
  const routes = getRoutes();
  return routes.find((route) => route.id === routeId) || null;
};

export const updateRoute = (routeId: string, updates: Partial<Route>) => {
  const routes = getRoutes();
  const index = routes.findIndex((route) => route.id === routeId);
  if (index !== -1) {
    routes[index] = { ...routes[index], ...updates };
    localStorage.setItem("routes", JSON.stringify(routes));
  }
};

export const deleteRoute = (routeId: string) => {
  const routes = getRoutes();
  const filtered = routes.filter((route) => route.id !== routeId);
  localStorage.setItem("routes", JSON.stringify(filtered));
};

// Price history management
export const savePriceHistory = (history: PriceHistory) => {
  const allHistory = getPriceHistory();
  allHistory.push(history);
  localStorage.setItem("priceHistory", JSON.stringify(allHistory));
};

export const getPriceHistory = (): PriceHistory[] => {
  const history = localStorage.getItem("priceHistory");
  return history ? JSON.parse(history) : [];
};

export const getRoutePriceHistory = (routeId: string): PriceHistory[] => {
  return getPriceHistory().filter((history) => history.routeId === routeId);
};

// Initialize mock data
export const initializeMockData = () => {
  const routes = getRoutes();
  if (routes.length === 0) {
    // No mock data needed on first load
    return;
  }
};
