import { Sequelize } from "sequelize";
import { SIGEO_DB_DATABASE, SIGEO_DB_HOST, SIGEO_DB_PORT, SIGEO_DB_DIALECT, SIGEO_DB_TIMEZONE, SIGEO_DB_USER, SIGEO_DB_PASSWORD } from "./env.config.js";
import * as log from '../utils/log.utils.js';

export const pool = new Sequelize(SIGEO_DB_DATABASE, SIGEO_DB_USER, SIGEO_DB_PASSWORD, {
    host: SIGEO_DB_HOST,
    port: SIGEO_DB_PORT,
    dialect: SIGEO_DB_DIALECT,
    logging: false,
    timezone: SIGEO_DB_TIMEZONE
});

export const checkDB = async () => {
    try {
        await pool.authenticate();
        log.consoleInfo('DB connection successful');
    } catch (error) {
        log.consoleError( `Error connecting to the DB:
    DB -> ${SIGEO_DB_DATABASE}
    Host -> ${SIGEO_DB_HOST}
    Port -> ${SIGEO_DB_PORT}
    User -> ${SIGEO_DB_USER}

    Error -> ${error}`);
    }
};