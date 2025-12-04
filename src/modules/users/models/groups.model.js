import { DataTypes } from "sequelize";
import { pool } from "../../../config/db.config.js";

export const Group = pool.define(
    'group', {
    group_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    group: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    group_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
    schema: 'users'
});