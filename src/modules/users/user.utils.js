import { Group } from "./models/groups.model.js";
import { Role } from "./models/role.model.js";

export async function filterBuilder(filters) {
    const { name, username, group, role } = filters;
    const validatedFilter = {}

    if (name) {
        if (typeof name === 'string') {
            validatedFilter.name = name;
        } else {
            throw new ValidationError(`El nombre proporcionado no es valido.`);
        }
    }

    if (username) {
        if (typeof username === 'string') {
            validatedFilter.username = username;
        } else {
            throw new ValidationError(`El usuario proporcionado no es valido.`);
        }
    }

    if(group) {
        const intGroup = parseInt(group);
        const invalidGroupMsg = `El grupo proporcionado no es valido.`;
        
        if (!isNaN(intGroup)) {
            const existingGroup = await Group.findByPk(intGroup)

            if (!existingGroup) {
                throw new ValidationError(invalidGroupMsg);
            }

            validatedFilter.group_id = existingGroup.group_id;
        } else {
            throw new ValidationError(invalidGroupMsg);
        }
    }

    if(role) {
        const intRole = parseInt(role);
        const invalidRoleMsg = `El rol proporcionado no es valido.`;
        
        if (!isNaN(intRole)) {
            const existingRole = await Role.findByPk(intRole)

            if (!existingRole) {
                throw new ValidationError(invalidRoleMsg);
            }

            validatedFilter.role_id = existingRole.role_id;
        } else {
            throw new ValidationError(invalidRoleMsg);
        }
    }

    return validatedFilter;
}