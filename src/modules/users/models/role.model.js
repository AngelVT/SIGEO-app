import { DataTypes } from "sequelize";
import { pool } from "../../../config/db.config.js";

export const Role = pool.define(
    'role', {
    role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
    schema: 'users'
});