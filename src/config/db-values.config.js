import { pool } from "./db.config.js";
import * as log from '../utils/log.utils.js';
import { User } from "../modules/users/models/user.model.js";
import { Group } from "../modules/users/models/groups.model.js";
import { Role } from "../modules/users/models/role.model.js";
import { Permission } from "../modules/users/models/permissions.model.js";
import { UserPermissions } from "../modules/users/models/user-permission.model.js";
import { Oficio } from "../modules/oficio/models/oficio.model.js";
import { OficioEmitted } from "../modules/oficio/models/emitted-oficio.model.js";
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

    Oficio.hasOne(OficioEmitted, { foreignKey: 'oficio_id' });
    OficioEmitted.belongsTo(Oficio, { foreignKey: 'oficio_id' });
};

const setDefaultGroups = async () => {
    try {
        const count = await Group.count();

        if (count > 0) return;

        await Promise.all([
            Group.create({ group_id: 1, group: 'SYSTEM', group_name: "Sistema SIGEO"}),
            Group.create({ group_id: 2, group: 'DG', group_name: "Dirección General"}),
            Group.create({ group_id: 3, group: 'DLCU', group_name: "Dirección de Licencias y Control Urbano"}),
            Group.create({ group_id: 4, group: 'DIPE', group_name: "Dirección de Investigación y Planeación Estratégica"}),
            Group.create({ group_id: 5, group: 'OIC', group_name: "Órgano Interno de Control "}),
            Group.create({ group_id: 6, group: 'DAJ', group_name: "Dirección de Asuntos Jurídico"}),
            Group.create({ group_id: 7, group: 'DFA', group_name: "Dirección de Finanzas y Administración"})
        ]);

        log.consoleInfo("Default groups have been set");
    } catch (error) {
        console.log(error)
        log.consoleError(`Error establishing default user groups`);
    }
}

const setDefaultRoles = async () => {
    try {
        const count = await Role.count();

        if (count > 0) return;

        await Promise.all([
            Role.create({ role_id: 1, role: 'system'}),
            Role.create({ role_id: 2, role: 'admin'}),
            Role.create({ role_id: 3, role: 'moderator'}),
            Role.create({ role_id: 4, role: 'user'})
        ]);

        log.consoleInfo("Default roles have been set");
    } catch (error) {
        log.consoleError(`Error establishing default user roles`);
    }
}

const setDefaultPermissions = async () => {
    try {
        const count = await Permission.count();

        if (count > 0) return;

        await Promise.all([
            Permission.create({permission_id: 1, permission: "user:manage"}),
            Permission.create({permission_id: 2, permission: "user:read"}),
            Permission.create({permission_id: 3, permission: "user:create"}),
            Permission.create({permission_id: 4, permission: "user:update"}),
            Permission.create({permission_id: 5, permission: "user:delete"}),
            Permission.create({permission_id: 6, permission: "oficio:manage"}),
            Permission.create({permission_id: 7, permission: "oficio:read"}),
            Permission.create({permission_id: 8, permission: "oficio:create"}),
            Permission.create({permission_id: 9, permission: "oficio:update"}),
            Permission.create({permission_id: 10, permission: "oficio:close"}),
            Permission.create({permission_id: 11, permission: "oficio:delete"}),
            Permission.create({permission_id: 12, permission: "oficio:comment"}),
        ]);

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