import apiService from "./apiService";
import GenericService from "./GenericService";

const TicketService = {
    getAll: () => GenericService.getAll("/tickets"),
    update: (id, data) => GenericService.update("/tickets", id, data),
    delete: (id) => GenericService.delete("/tickets", id),
    getById: async (id) => {
        return await GenericService.getById("/tickets", id);
    },

    create: async (data) => {
        // Crear FormData para manejar archivos
        const formData = new FormData();

        // Agregar campos normales
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('priority_id', data.priority_id);
        formData.append('category_id', data.category_id);

        // Agregar tags como array
        if (data.tags && data.tags.length > 0) {
            data.tags.forEach((tagId, index) => {
                formData.append(`tags[${index}]`, tagId);
            });
        }

        // Agregar archivos
        if (data.attachments && data.attachments.length > 0) {
            data.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }

        return apiService.request('post', 'tickets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    close: async (id) => {
        try {
            const result = await apiService.request("put", `/tickets/${id}/close`);
            return { success: true, data: result, message: "Ticket cerrado correctamente" };
        } catch (error) {
            console.error("API error:", error);
            return {
                success: false,
                message: error.response?.data?.error || "Error al cerrar",
                errors: error.response?.data?.errors || {}
            };
        }
    },
    
    updateStatus: (id, status) => {
        return apiService.request('put', `/tickets/${id}/status`, { status });
    },

    getUserTickets: async () => {
        return apiService.request('get', `userTickets`);
    },

    getOpenTickets: async () => {
        return apiService.request('get', `openTickets`);
    },

    getReferenceData: async () => {
        return apiService.request('get', 'tickets-referenceData');
    }
};

export default TicketService;