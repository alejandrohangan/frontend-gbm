import GenericService from "./GenericService";
import apiService from "./apiService";

const TagService = {
    getAll: () => GenericService.getAll("/tags"),
    create: (data) => GenericService.create("/tags", data),
    update: (id, data) => GenericService.update("/tags", id, data),
    delete: (id) => GenericService.delete("/tags", id),
    getById: async (id) => {
        try {
            const response = await apiService.request("get", `/tags/${id}`);
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

export default TagService;