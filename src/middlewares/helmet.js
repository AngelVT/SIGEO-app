import helmet from 'helmet';

const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
            ],
            scriptSrcAttr: [
                "'self'",
                "'unsafe-inline'",
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
            ],
            connectSrc: [
                "'self'"
            ],
            fontSrc: [
                "'self'"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https://mt1.google.com",
            ],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            frameSrc: ["'self'"]
        }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hidePoweredBy: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    hsts: {
        maxAge: 63072000,
        includeSubDomains: false,
        preload: false
    },
    frameguard: { action: 'sameorigin' },
    dnsPrefetchControl: { allow: false }
});

export default helmetMiddleware;