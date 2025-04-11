import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8000/api";

const apiService = {
    async request(method, endpoint, data = null) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const config = { method, url };

            if (data && (method === "post" || method === "put")) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Error de validación
                return Promise.reject({
                    response: {
                        data: {
                            error: "Error de validación",
                            errors: error.response.data.errors || {}
                        }
                    }
                });
            }
            this.handleError(error, false);
            throw error;
        }
    },

    handleError(error, showAlert = true) {
        console.error("Error:", error);
        if (error.response && showAlert) {
            Swal.fire({
                title: "Error",
                text: error.response.data?.error || "Ha ocurrido un error",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    },
};

export default apiService;