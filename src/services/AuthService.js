import apiService from "./apiService";

const AuthService = {
    async login(userData) {
        return await apiService.request("post", "/login", userData);
    },

    async logout() {
        return await apiService.request("post", "/logout");
    },

    async me() {
        return await apiService.request("get", "/me");
    }
};

export default AuthService;