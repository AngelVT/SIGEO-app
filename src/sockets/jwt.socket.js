import jwt from "jsonwebtoken";
import { SIGEO_SECRET_JWT } from "../config/env.config.js";
import { findUserForAuthIdUsername } from "../modules/auth/auth.repo.js";

export async function verifySocketToken(token) {
    try {
        const decoded = jwt.verify(token, SIGEO_SECRET_JWT);

        const { user_uuid, username } = decoded;

        if (!user_uuid, !username) return null;

        const user = await findUserForAuthIdUsername(user_uuid, username);

        if (!user) null;

        return {
            user_uuid: user.user_uuid,
            user_id: user.user_id,
            name: user.name,
            username: user.username,
            role_id: user.role_id,
            role: user.role.role,
            group_id: user.group_id,
            group: user.group.group,
            permission_ids: user.permissions.map(p => p.UserPermissions.permission_id),
            permissions: user.permissions.map(p => p.permission),
        }
    } catch (error) {
        return null;
    }
}