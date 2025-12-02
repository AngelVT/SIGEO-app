import AppError from "./AppError.js";

class DatabaseError extends AppError {
    constructor(message) {
        super(`Database error: ${message}`, 500);
    }
}

export default DatabaseError;