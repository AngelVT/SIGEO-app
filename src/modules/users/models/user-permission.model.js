import { pool } from "../../../config/db.config.js";

export const UserPermissions = pool.define('UserPermissions', {}, {
    schema: 'users',
    timestamps: false
});