import AppError from "./AppError.js";

class ResourceError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

export default ResourceError;