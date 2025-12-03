import jwt from 'jsonwebtoken';
import { SIGEO_SECRET_JWT } from '../config/env.config.js';

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
            decoded = jwt.verify(clientToken, MV_SECRET_JWT, { algorithms: ['HS256'] });
        } catch (error) {
            if (redirect) {
                return res.redirect('/');
            }
            return res.status(401).json({ msg: 'Token verification failed' });
        }

        // TODO verify token content

        // TODO use token info to get the complete user information from the DB
        const user = 'DB'

        if (!user) {
            return res.status(401).json({ msg: 'Invalid token provided' });
        }

        // TODO append user information to the req object
        req.user = {
            
        };

        next();
    };
}