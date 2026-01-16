import * as userRepo from './user.repo.js';
import { validate as isUuid } from 'uuid';
import ValidationError from '../../errors/validationError.js';
import ResourceError from '../../errors/ResourceError.js';
import { hash } from 'bcrypt';
import * as acValidations from '../../utils/access-control.utils.js';
import * as userUtils from './user.utils.js';

export async function requestAllUsers() {
    const users = await userRepo.findAllUsers();

    if (!users || users.length === 0) {
        throw new ResourceError('No hay usuarios para mostrar');
    }

    return {
        users
    }
}

export async function requestUsersFiltered(filters) {
    const validatedFilters = await userUtils.filterBuilder(filters);

    const users = await userRepo.findUsersFiltered(validatedFilters);

    if (!users || users.length === 0) {
        throw new ResourceError('No hay usuarios para mostrar');
    }

    return {
        users
    }
}

export async function requestSingleUser(user_id) {
    if (!isUuid(user_id)) {
        throw new ValidationError('Solicitud fallida debido a identificador invalido.');
    }

    const user = await userRepo.findSingleUser(user_id);

    if (!user) {
        throw new ResourceError('No se encontró ningún usuario con el Id dado');
    }

    return {
        user
    }
}

export async function requestUserCreation(name, middleName, lastName, username, password, group, role, permissions) {
    if (!name || !middleName || !lastName || !username || !password || !group || !role || !permissions) {
        throw new ValidationError("Solicitud fallida debido a información faltante.");
    }

    const hashedPassword = await hash(password, 10);

    if (!acValidations.validateGroup(group)) {
        throw new ValidationError("Solicitud fallida debido a grupo invalido");
    }

    if (!acValidations.validateRole(role)) {
        throw new ValidationError("Solicitud fallida debido a rol invalido.");
    }

    if (!acValidations.validatePermissions(permissions)) {
        throw new ValidationError("Solicitud fallida debido a permisos inválidos");
    }

    const newUser = await userRepo.saveNewUser(`${name.trim()} ${middleName.trim()} ${lastName.trim()}`, username, hashedPassword, role, group, permissions);

    if (!newUser) {
        throw new ValidationError(`El usuario ${username} ya existe.`);
    }

    return {
        user: newUser
    }
}

export async function requestUserUpdate(user_id, name, password, group, role, permissions) {
    if (!isUuid(user_id)) {
        throw new ValidationError('Solicitud fallida debido a identificador invalido.');
    }

    if (!name && !password && !group && !role && !permissions) {
        throw new ValidationError("Solicitud fallida debido a información faltante.");
    }

    let hashedPassword;

    if(password) {
        hashedPassword = await hash(password, 10)
    }

    if (group && !await acValidations.validateGroup(group)) {
        throw new ValidationError("Solicitud fallida debido a grupo invalido");
    }

    if (role && !await acValidations.validateRole(role)) {
        throw new ValidationError("Solicitud fallida debido a rol invalido.");
    }

    if(typeof permissions === 'string') {
        try {
            permissions = JSON.parse(permissions);
        } catch (error) {
            throw new ValidationError("Solicitud fallida debido a permisos inválidos");
        }
    }

    if (permissions && !await acValidations.validatePermissions(permissions)) {
        throw new ValidationError("Solicitud fallida debido a permisos inválidos");
    }

    const user = await userRepo.updateUser(user_id, name, hashedPassword, group, role, permissions);

    if (!user) {
        throw new ValidationError(`El usuario no existe.`);
    }

    return {
        user
    }
}