import { pool } from "../../../config/db.config.js";
import { DataTypes } from "sequelize";
import { Role } from "./role.model.js";
import { Group } from "./groups.model.js";

export const User = pool.define(
    'user', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'role_id'
        },
        allowNull: false
        },
        group_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Group,
                key: 'group_id'
            },
            allowNull: false
        }
    },
    {
        schema: "users"
    }
);

User.belongsTo(Role, { foreignKey: 'role_id' });
User.belongsTo(Group, { foreignKey: 'group_id' });