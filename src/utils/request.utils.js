import ValidationError from "../errors/validationError.js";
import ResourceError from "../errors/ResourceError.js";
import DatabaseError from "../errors/databaseError.js";
import FileSystemError from "../errors/FileSystemError.js";
import AuthenticationError from "../errors/AuthenticationError.js";
import * as log from "./log.utils.js";

export function requestHandler(requestFn) {
    return async (req, res) => {
        try {
            await requestFn(req, res);
        } catch (error) {
            if (error instanceof ValidationError || error instanceof ResourceError) {
                // TODO log to request logs
                log.consoleError(error.message);
                return res.status(error.statusCode).json({ msg: error.message });
            }

            if (error instanceof AuthenticationError) {
                // TODO log to access logs
                log.consoleError(error.message);
                return res.status(error.statusCode).json({ msg: error.message });
            }

            if (error instanceof DatabaseError || error instanceof FileSystemError) {
                // TODO log to server logs
                log.consoleError(error.message);
                return res.status(error.statusCode).json({ msg: error.message });
            }

            // TODO log to server log
            log.consoleError(error);
            return res.status(500).json({ msg: "Unknown server error" });
        }
    }
}