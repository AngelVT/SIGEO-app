import { pool } from "./db.config.js";
import * as log from '../utils/log.utils.js';
import { User } from "../modules/users/models/user.model.js";
import { Group } from "../modules/users/models/groups.model.js";
import { Role } from "../modules/users/models/role.model.js";
import { Permission } from "../modules/users/models/permissions.model.js";
import { UserPermissions } from "../modules/users/models/user-permission.model.js";
import { Oficio } from "../modules/oficio/models/oficio.model.js";
import { Comment } from "../modules/oficio/models/comment.model.js";
import { SIGEO_DB_INIT } from "./env.config.js";

const createSchemas = async () => {
    try {
        if (SIGEO_DB_INIT === "true") {
            await pool.query('CREATE SCHEMA IF NOT EXISTS users');
            await pool.query('CREATE SCHEMA IF NOT EXISTS oficios');

            log.consoleInfo("Schemas established successfully.");
        }
    } catch (error) {
        log.consoleError('Error establishing schemas.');
    }
}

const applyAssociations = () => {
    User.belongsTo(Role, { foreignKey: 'role_id' });
    User.belongsTo(Group, { foreignKey: 'group_id' });
    User.hasMany(Comment, { foreignKey: 'user_id' });

    Role.hasMany(User, { foreignKey: 'role_id' });
    Group.hasMany(User, { foreignKey: 'group_id' });

    Comment.belongsTo(User, { foreignKey: 'user_id' });
    Comment.belongsTo(Oficio, { foreignKey: 'oficio_id' });

    User.belongsToMany(Permission, { through: UserPermissions, foreignKey: 'user_id' });
    Permission.belongsToMany(User, { through: UserPermissions, foreignKey: 'permission_id' });
    
    Oficio.hasMany(Comment, { foreignKey: 'oficio_id' });
    Oficio.belongsTo(Group, { foreignKey: 'group_id' });
};

const setDefaultGroups = async () => {
    try {
        const count = await Group.count();

        if (count > 0) return;

        // TODO set default groups
        //setTimeout(() => { }, 200)

        log.consoleInfo("Default groups have been set");
    } catch (error) {
        log.consoleError(`Error establishing default user groups`);
    }
}

const setDefaultRoles = async () => {
    try {
        const count = await Role.count();

        if (count > 0) return;

        // TODO set default roles
        //setTimeout(() => { }, 600)

        log.consoleInfo("Default roles have been set");
    } catch (error) {
        log.consoleError(`Error establishing default user roles`);
    }
}

const setDefaultPermissions = async () => {
    try {
        const count = await Permission.count();

        if (count > 0) return;

        // TODO set default roles
        //setTimeout(() => { }, 450)

        log.consoleInfo("Default permissions have been set");
    } catch (error) {
        log.consoleError(`Error establishing default user permissions`);
    }
}

const syncModels = async () => {
    try {
        if (SIGEO_DB_INIT === "true") {
            await pool.sync({alter: true});
            log.consoleInfo("Models synced successfully.");
        }
    } catch (error) {
        log.consoleError('Error syncing models.');
        console.log(error)
    }
}

export const setDBDefaults = async () => {
    await createSchemas();
    applyAssociations();
    await syncModels();
    setDefaultGroups();
    setDefaultRoles();
    setDefaultPermissions();
}