import * as userService from './user.service.js';
import { requestHandler } from '../../utils/request.utils.js';

export const getAllUsers = requestHandler(async (req, res) => {
    const response = await userService.requestAllUsers();

    res.status(200).json(response);

    console.log("Get request completed, all users requested");
});

export const getSingleUser = requestHandler(async (req, res) => {
    const { user_id } = req.params;

    const response = await userService.requestSingleUser(user_id);

    res.status(200).json(response);

    console.log("Get request completed, single user requested");
});

export const createUser = requestHandler(async (req, res) => {
    const { name, username, password, group, role, permissions } = req.body;

    const response = await userService.requestUserCreation(name, username, password, group, role, permissions);

    res.status(200).json(response);

    console.log("Create request completed, new user created");
});