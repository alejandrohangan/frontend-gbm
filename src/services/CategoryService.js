import GenericService from "./GenericService";
import apiService from "./apiService"; // Estaba faltando esta importación

const CategoryService = {
    getAll: () => GenericService.getAll("/categories"),
    create: (data) => GenericService.create("/categories", data),
    update: (id, data) => GenericService.update("/categories", id, data),
    delete: (id) => GenericService.delete("/categories", id),
    getById: async (id) => {
        try {
            const response = await apiService.request("get", `/categories/${id}`);
            return {
                success: true,
                data: response.data, // No necesitas data.data, solo data
                message: response.message || "Categoría obtenida correctamente"
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.error || "Error al obtener la categoría",
                errors: error.response?.data?.errors || {}
            };
        }
    }
};

export default CategoryService;