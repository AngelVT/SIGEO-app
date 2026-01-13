import { User } from "./models/user.model.js";
import { Role } from "./models/role.model.js";
import { Group } from "./models/groups.model.js";
import { Permission } from "./models/permissions.model.js";

const USER_MODELS = [
    {
        model: Role,
        attributes: ['role_id', 'role']
    },
    {
        model: Group,
        attributes: ['group_id', 'group']
    },
    {
        model: Permission,
        attributes: ['permission_id', 'permission']
    }
];

const USER_ATTRIBUTES = { exclude: ['user_id', 'password'] };

export async function findAllUsers() {
    return User.findAll({
        attributes: USER_ATTRIBUTES,
        include: USER_MODELS
    });
}

export async function findSingleUser(uuid) {
    return User.findOne({
        where: {
            user_uuid: uuid
        },
        attributes: USER_ATTRIBUTES,
        include: USER_MODELS
    });
}

export async function findUsersFiltered(filters) {
    return User.findAll({
        where: filters,
        attributes: USER_ATTRIBUTES,
        include: USER_MODELS
    });
}

export async function saveNewUser(name, username, password, role_id, group_id, permissions) {
    const [new_user, created] = await User.findOrCreate({
        where: {
            username
        },
        defaults: {
            name,
            username,
            password,
            role_id,
            group_id
        }
    });

    if (created) {
        await new_user.addPermissions(permissions);
    }

    return created ? generateSafeUser(new_user) : null;
}

export async function updateUser(user_uuid, name, password, group, role, permissions) {
    const user = await User.findOne({
        where: {
            user_uuid
        }
    });

    if (!user) return null;

    await user.update({
        name,
        password,
        group_id: group,
        role_id: role
    });

    if (permissions) {
        await user.setPermissions(permissions);
    }

    await user.reload({
        include: USER_MODELS
    });

    return generateSafeUser(user);
}

function generateSafeUser(user) {
    const { user_id, password, ...safeUser } = user.toJSON();
    return safeUser;
}