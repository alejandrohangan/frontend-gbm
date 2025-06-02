import GenericService from "./GenericService";
import apiService from "./apiService";

const DashboardService = {
    getAll: () => GenericService.getAll("/dashboard"),
};

export default DashboardService;