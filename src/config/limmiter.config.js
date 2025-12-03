import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: "Demasiadas solicitudes a API desde esta IP intenta de nuevo mas tarde."
    },
    skipSuccessfulRequests: false
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: "Demasiadas solicitudes a API desde esta IP intenta de nuevo mas tarde."
    },
    skipSuccessfulRequests: false
});