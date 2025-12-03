import { DataTypes } from "sequelize";
import { pool } from "../../../config/db.config.js";

export const Permission = pool.define(
    'permission', {
        permission_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        permission: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
        schema: 'users'
    }
);