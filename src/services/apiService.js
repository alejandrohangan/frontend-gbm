// apiService.js
import axios from "axios";
import Swal from "sweetalert2";

// 1. Crear una instancia personalizada de Axios con la URL base de tu API
const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

// 2. Interceptor que se ejecuta ANTES de cada petición
//    Aquí añadimos automáticamente el token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); 

    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }

    return config;
});

const apiService = {
    // 3. Método principal para hacer peticiones
    async request(method, endpoint, data = null) {
        try {
            const url = `${endpoint}`; // No hace falta BASE_URL aquí, ya lo tiene la instancia

            const config = {
                method,
                url,
            };

            if (data && (method === "post" || method === "put")) {
                config.data = data;
            }

            const response = await api(config); // 👈 Usamos la instancia personalizada
            console.log("API Response:", response); // Log completo de la respuesta
            console.log("API Response Data:", response.data); // Log de los datos
            return response.data;

        } catch (error) {
            // 4. Validación (422) típica de Laravel
            if (error.response && error.response.status === 422) {
                return Promise.reject({
                    response: {
                        data: {
                            error: "Error de validación",
                            errors: error.response.data.errors || {}
                        }
                    }
                });
            }

            // 5. Manejo genérico de errores
            this.handleError(error, false);
            throw error;
        }
    },

    // 6. Método para mostrar alertas de error con SweetAlert
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
    }
};

export default apiService;
