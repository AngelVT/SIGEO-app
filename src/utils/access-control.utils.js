import { Group } from "../modules/users/models/groups.model.js";
import { Role } from "../modules/users/models/role.model.js";
import { Permission } from "../modules/users/models/permissions.model.js";

export async function validateGroup(group_id) {
    if (isNaN(parseInt(group_id))) return false;

    const group = await Group.findByPk(parseInt(group_id));

    if (!group) return false;

    return true;
}

export async function validateRole(role_id) {
    if (isNaN(parseInt(role_id))) return false;

    const role = await Role.findByPk(parseInt(role_id));

    if (!role) return false;

    return true
}

export async function validatePermissions(permissions) {
    if (!Array.isArray(permissions) || permissions.length === 0) return false;

    for (const perm of permissions) {
        if (isNaN(parseInt(perm))) return false;

        const permission = await Permission.findByPk(perm);

        if (!permission) return false;
    }

    return true
}