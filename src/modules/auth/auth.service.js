import * as authRepo from './auth.repo.js';
import AuthenticationError from '../../errors/AuthenticationError.js';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SIGEO_SECRET_JWT } from '../../config/env.config.js';

export async function requestLogin(username, password) {
    const user = await authRepo.findUserForAuthUsername(username);

    if (!user) {
        throw new AuthenticationError("Accesos denegado usuario dado no existe.");
        
    }

    if (!compare(password, user.password)) {
        throw new AuthenticationError("Accesos denegado usuario debido a credenciales invalidas.");
    }

    const token = jwt.sign({
            sub: "auth",
            user_uuid: user.user_uuid,
            username: user.username
        },
        SIGEO_SECRET_JWT,
        {
            algorithm: 'HS256',
            expiresIn: '12h'
        }
    );

    return {
        token
    }
}