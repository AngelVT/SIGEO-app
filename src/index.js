import app from "./app.js";
import { SIGEO_APP_PORT } from "./config/env.config.js";

async function startServer() {
    try {
        // * initializing the server on the port
        const server = app.listen(SIGEO_APP_PORT, () => {
            console.log("Listening on port: ", SIGEO_APP_PORT);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();