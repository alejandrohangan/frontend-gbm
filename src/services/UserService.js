import GenericService from "./GenericService";

const UserService = {
    getAll: () => GenericService.getAll("/getUsers")
}

export default UserService;