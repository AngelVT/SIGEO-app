import AppError from "./AppError.js";

class FileSystemError extends AppError {
    constructor(message) {
        super(`File System error: ${message}`, 500);
    }
}

export default FileSystemError;