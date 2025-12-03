import { pool } from "./db.config.js";
import * as log from '../utils/log.utils.js';

const createSchemas = async () => {
    try {
        await pool.query('CREATE SCHEMA IF NOT EXISTS users');
        await pool.query('CREATE SCHEMA IF NOT EXISTS folios');

        log.consoleInfo("Schemas established successfully.")
    } catch (error) {
        log.consoleError('Error establishing schemas.')
    }
}

export const setDBDefaults = async () => {
    createSchemas();
}