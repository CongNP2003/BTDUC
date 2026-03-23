import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

axiosClient.interceptors.request.use(
    (config) => {
        if (config.url.includes("/auth/login")) {
            return config;
        }

        const token = localStorage.getItem("token");

        console.log("Token:", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Authorization:", config.headers.Authorization);
        } else {
            console.log("Không có token");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("Lỗi response:", error);

        if (error.response?.status === 401) {
            console.warn("Token hết hạn");

            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;