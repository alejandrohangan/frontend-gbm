import apiService from "./apiService";
import Swal from "sweetalert2";

const GenericService = {
    async getAll(endpoint) {
        try {
            const response = await apiService.request("get", endpoint);
            return response || [];
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    },

    async getById(endpoint, id) {
        try {
            const response = await apiService.request("get", `${endpoint}/${id}`);
            return { success: true, data: response, message: "Elemento obtenido correctamente" };
        } catch (error) {
            console.error(`Error fetching ${endpoint} with ID ${id}:`, error);
            return {
                success: false,
                message: error.response?.data?.error || "Error al obtener el elemento",
                errors: error.response?.data?.errors || {}
            };
        }
    },

    async create(endpoint, data) {
        try {
            const createdItem = await apiService.request("post", endpoint, data);
            return { success: true, data: createdItem, message: "Creado correctamente" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.error || "Error al crear",
                errors: error.response?.data?.errors || {}
            };
        }
    },

    async update(endpoint, id, data) {
        try {
            const updatedItem = await apiService.request("put", `${endpoint}/${id}`, data);
            return { success: true, data: updatedItem, message: "Actualizado correctamente" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.error || "Error al actualizar",
                errors: error.response?.data?.errors || {}
            };
        }
    },

    async delete(endpoint, id) {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede revertir",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                await apiService.request("delete", `${endpoint}/${id}`);
                return { success: true };
            }
            return null;
        } catch (error) {
            console.error(`Error deleting from ${endpoint}:`, error);
            return null;
        }
    },
};

export default GenericService;