import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api/v1",
    withCredentials: true, // Include cookies (for refreshToken)
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const TokenService = {
    getToken: () => localStorage.getItem("token"),
    setToken: (token: string) => localStorage.setItem("token", token),
    removeToken: () => localStorage.removeItem("token"),
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si l'erreur est une 401 et qu'aucun token n'est disponible
        if (error.response.status === 401 && !TokenService.getToken()) {
            console.warn("Aucun token disponible. Redirection vers /login");
            return Promise.reject(error); // Permet de gérer cette erreur côté front-end
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(API(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${API.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = data;
                TokenService.setToken(accessToken);

                API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                onRefreshed(accessToken);

                isRefreshing = false;

                return API(originalRequest);
            } catch (err: any) {
                console.error("Échec du rafraîchissement du token :", err.message);

                TokenService.removeToken();
                isRefreshing = false;

                window.location.href = "/login";
            }
        }

        // Passer toutes les autres erreurs
        return Promise.reject(error);
    }
);


export default API;
