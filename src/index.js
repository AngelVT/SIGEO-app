import app from "./app.js";
import { SIGEO_APP_PORT } from "./config/env.config.js";
import * as log from './utils/log.utils.js';
import { initSocket } from "./sockets/handler.socket.js";

async function startServer() {
    try {
        // * initializing the server on the port
        const server = app.listen(SIGEO_APP_PORT, () => {
            log.consoleInfo(`Listening on port ${SIGEO_APP_PORT}`)
        });

        initSocket(server);
    } catch (error) {
        console.error("Failed to start server:", error);
        log.consoleError(`Failed to start server:
        ${error}`)
        process.exit(1);
    }
}

startServer();