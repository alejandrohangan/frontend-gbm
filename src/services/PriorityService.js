import GenericService from "./GenericService";
import apiService from "./apiService";

const PriorityService = {
    getAll: () => GenericService.getAll("/priorities"),
    create: (data) => GenericService.create("/priorities", data),
    update: (id, data) => GenericService.update("/priorities", id, data),
    delete: (id) => GenericService.delete("/priorities", id),
    getById: async (id) => {
        try {
            const response = await apiService.request("get", `/priorities/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.message || "Prioridad obtenida correctamente"
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.error || "Error al obtener la prioridad",
                errors: error.response?.data?.errors || {}
            };
        }
    }
};

export default PriorityService;