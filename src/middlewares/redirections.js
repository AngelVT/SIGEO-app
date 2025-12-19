import { SIGEO_SECRET_JWT } from "../config/env.config.js";
import { findUserForAuthIdUsername } from '../modules/auth/auth.repo.js';
import jwt from 'jsonwebtoken';

export function groupRedirect(groups = [], url = '/api') {
    return async function (req, res, next) {
        const userGroup = req.user.group;

        if (groups.includes(userGroup)) {
            const params = req.params;

            let finalRedirectUrl = url;

            for (const key in params) {
                if (Object.hasOwnProperty.call(params, key)) {
                    const paramValue = params[key];
                    
                    finalRedirectUrl = finalRedirectUrl.replace(`:${key}`, paramValue);
                }
            }

            const queryParams = req.query;
            const queryKeys = Object.keys(queryParams);

            if (queryKeys.length > 0) {
                const searchParams = new URLSearchParams();
                
                for (const key of queryKeys) {
                    searchParams.append(key, queryParams[key]);
                }

                finalRedirectUrl += `?${searchParams.toString()}`;
            }


            return res.redirect(finalRedirectUrl);
        }

        return next();
    }
}

export function groupDelegate(groups = []) {
    return function (req, res, next) {
        const userGroup = req.user.group;

        if (groups.includes(userGroup)) {
            req.full = true;
            return next();
        }

        req.full = false;
        return next();
    }
}

export const loginRedirect = async (req, res, next) => {
    const clientToken = req.signedCookies.access_token;

    if (!clientToken) return next();

    let decoded;
    try {
        decoded = jwt.verify(clientToken, SIGEO_SECRET_JWT, { algorithms: ['HS256'] });

        const { user_uuid, username } = decoded;

        if (!user_uuid || !username) return next();

        const user = await findUserForAuthIdUsername(user_uuid, username);

        if (!user) return next();

        return res.redirect('/dashboard/');
    } catch (err) {
        return next();
    }
}