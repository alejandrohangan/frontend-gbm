import GenericService from "./GenericService";
import apiService from "./apiService";

const RoleService = {
    getAll: () => GenericService.getAll("/roles"),

    delete: async (id) => {
        try {
            const deleteResult = await apiService.request('delete', `/roles/${id}`);
            return deleteResult;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, data) => {
        return apiService.request('put', `/roles/${id}`, data);
    },

    create: async (data) => {
        return apiService.request("post", 'roles', data);
    },

    getUserRoles: async (id) => {
        return apiService.request('get', `/user-roles/${id}`)
    },

    getById: async (id) => {
        return apiService.request('get', `/get-role/${id}`)
    },

    getPermissions: async () => {
        return apiService.request('get', `get-permissions`)
    },

    assignRole: async (roleId, userId) => {
        return apiService.request('post', `/roles/${roleId}/assign`, {
            user_id: userId
        });
    },

    revokeRole: async (roleId, userId) => {
        return apiService.request('post', `/roles/${roleId}/revoke`, {
            user_id: userId
        });
    }
};

export default RoleService;