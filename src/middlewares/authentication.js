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
                return res.redirect(`/login?url=${destination}`);
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
            if (error.message === 'jwt expired') {
                return res.status(401).json({ msg: 'Session expired' })
            }

            if (options.redirect) {
                return res.redirect('/login');
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
            permissions: user.permissions.map(p => p.permission),
        };

        next();
    };
}

export function verifyGroup(allowedGroups = []) {
    return async function (req, res, next) {

        const userGroup = req.user.group;

        if (!userGroup) {
            return res.status(403).json({ msg: 'Access denied: No group membership.' });
        }

        if (allowedGroups.includes(userGroup)) {
            return next();
        }

        return res.status(403).json({ msg: 'Access denied: Insufficient group privileges.' });
    }
}

export function verifyRole(allowedRoles = []) {
    return async function (req, res, next) {
        const userRole = req.user.role;

        if (!userRole) {
            return res.status(403).json({ msg: 'Access denied: No role associated with user' });
        }

        if (allowedRoles.includes(userRole)) {
            return next();
        }

        return res.status(403).json({ msg: 'Access denied: Insufficient role privileges.' });
    };
}

export function verifyPermission(allowedPermissions = []) {
    return function (req, res, next) {
        const userPermissions = req.user.permissions;

        if (!Array.isArray(userPermissions)) {
            return res.status(403).json({ msg: 'Access denied: No permissions' });
        }

        for (const p of userPermissions) {
            if (allowedPermissions.includes(p)) {
            return next();
        }
        }

        return res.status(403).json({ msg: 'Access denied: Missing required permission' });
    };
}