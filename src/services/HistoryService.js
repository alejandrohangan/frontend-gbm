import GenericService from "./GenericService";

const HistoryService = {
    getAll: () => GenericService.getAll("/ticket-history"),
};

export default HistoryService;