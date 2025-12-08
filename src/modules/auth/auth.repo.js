import { User } from "../users/models/user.model.js";
import { Role } from "../users/models/role.model.js";
import { Group } from "../users/models/groups.model.js";
import { Permission } from "../users/models/permissions.model.js";

const USER_MODELS = [
    {
        model: Role,
        attributes: ['role']
    },
    {
        model: Group,
        attributes: ['group']
    },
    {
        model: Permission,
        attributes: ['permission']
    }
];


export async function findUserForAuthIdUsername(uuid, username) {
    return User.findOne({
        where: {
            user_uuid: uuid,
            username
        },
        include: USER_MODELS,
        attributes: { exclude: ['password'] }
    });
}

export async function findUserForAuthUsername(username) {
    return User.findOne({
        where: {
            username
        },
        attributes: ['user_uuid','username', 'password']
    });
}