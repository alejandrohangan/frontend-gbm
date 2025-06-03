import apiService from "./apiService";
import GenericService from "./GenericService";

const DashboardService = {
    
    getData: async () => {
        return apiService.request('get', '/dashboard');
    }
};

export default DashboardService;