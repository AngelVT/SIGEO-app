import * as userService from './user.service.js';
import { requestHandler } from '../../utils/request.utils.js';

export const getAllUsers = requestHandler(async (req, res) => {
    const response = await userService.requestAllUsers();

    res.status(200).json(response);

    console.log("Get request completed, all users requested");
});

export const getUsersFiltered = requestHandler(async (req, res) => {
    const filters = req.query;

    const response = await userService.requestUsersFiltered(filters);

    res.status(200).json(response);

    console.log("Get request completed, filtered user search requested");
});

export const getSingleUser = requestHandler(async (req, res) => {
    const { user_id } = req.params;

    const response = await userService.requestSingleUser(user_id);

    res.status(200).json(response);

    console.log("Get request completed, single user requested");
});

export const createUser = requestHandler(async (req, res) => {
    const { name, middleName, lastName, username, password, group, role, permissions } = req.body;

    const response = await userService.requestUserCreation(name, middleName, lastName, username, password, group, role, permissions);

    res.status(200).json(response);

    console.log("Create request completed, new user created");
});

export const updateUser = requestHandler(async (req, res) => {
    const { name, password, group, role, permissions } = req.body;
    const { user_id } = req.params;

    const response = await userService.requestUserUpdate(user_id, name, password, group, role, permissions);

    res.status(200).json(response);

    console.log("Post request completed, user updated");
});