import apiService from "./apiService";
import GenericService from "./GenericService";

const TicketService = {
    getAll: () => GenericService.getAll("/tickets"),
    create: (data) => GenericService.create("/tickets", data),
    update: (id, data) => GenericService.update("/tickets", id, data),
    delete: (id) => GenericService.delete("/tickets", id),
    getById: async (id) => {
        return await GenericService.getById("/tickets", id);
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
        return apiService.request('get',`openTickets`);
    },

    getReferenceData: async () => {
        return apiService.request('get', 'tickets-referenceData');
    }
};

export default TicketService;