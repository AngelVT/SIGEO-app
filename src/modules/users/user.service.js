import * as userRepo from './user.repo.js';
import { validate as isUuid } from 'uuid';
import ValidationError from '../../errors/validationError.js';
import ResourceError from '../../errors/ResourceError.js';
import { hash } from 'bcrypt';

export async function requestAllUsers() {
    const users = await userRepo.findAllUsers();

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

export async function requestUserCreation(name, username, password, group, role, permissions) {
    if (!name || !username || !password || !group || !role || !permissions) {
        throw new ValidationError("Solicitud fallida debido a información faltante.");
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await userRepo.saveNewUser(name, username, hashedPassword, role, group, permissions);

    if (!newUser) {
        throw new ValidationError(`El usuario ${username} ya existe.`);
    }

    return {
        user: newUser
    }
}