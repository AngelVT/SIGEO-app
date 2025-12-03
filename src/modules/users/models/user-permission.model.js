import { pool } from "../../../config/db.config.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";
import { Permission } from "./permissions.model.js";

export const UserPermissions = pool.define('UserPermissions', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'user_id'
        }
    },
    permission_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Permission',
            key: 'permission_id'
        }
    }
}, {
    schema: 'users'
});

User.belongsToMany(Permission, { through: UserPermissions, foreignKey: 'user_id' });
Permission.belongsToMany(User, { through: UserPermissions, foreignKey: 'permission_id' });