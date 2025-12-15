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