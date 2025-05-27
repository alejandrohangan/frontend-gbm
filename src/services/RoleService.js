import GenericService from "./GenericService";
import apiService from "./apiService";

const RoleService = {
    getAll: () => GenericService.getAll("/roles"),
};

export default RoleService;