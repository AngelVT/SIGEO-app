import AppError from "./AppError.js";

class AuthenticationError extends AppError {
    constructor(message) {
        super(`Authentication error: ${message}`, 401);
    }
}

export default AuthenticationError;