import jwt from 'jsonwebtoken';
import { SIGEO_SECRET_JWT } from '../config/env.config.js';
import { findUserForAuthIdUsername } from '../modules/auth/auth.repo.js';

export function verifyToken(options = {
    blockAccess: true,
    redirect: false,
    mandatory: true
}) {
    return async function (req, res, next) {
        const clientToken = req.signedCookies.access_token;

        if (!clientToken) {
            if (options.redirect) {
                const destination = encodeURIComponent(req.originalUrl);
                return res.redirect(`/?url=${destination}`);
            }

            if (options.blockAccess) {
                return res.status(401).json({ msg: 'Token not provided' });
            }

            if (!options.mandatory) {
                return next();
            }
        }

        let decoded;
        try {
            decoded = jwt.verify(clientToken, SIGEO_SECRET_JWT, { algorithms: ['HS256'] });
        } catch (error) {
            if (options.redirect) {
                return res.redirect('/');
            }
            return res.status(401).json({ msg: 'Token verification failed' });
        }

        const { user_uuid, username } = decoded;

        if (!user_uuid || !username) {
            return res.status(401).json({ msg: 'Invalid token provided' });
        }

        const user = await findUserForAuthIdUsername(user_uuid, username);

        if (!user) {
            return res.status(401).json({ msg: 'Invalid token provided' });
        }

        req.user = {
            user_id: user.user_id,
            name: user.name,
            username: user.username,
            role_id: user.role_id,
            role: user.role.role,
            group_id: user.group_id,
            group: user.group.group,
            permission_ids: user.permissions.map(p => p.UserPermissions.permission_id),
            permission_ids: user.permissions.map(p => p.permission),
        };

        next();
    };
}