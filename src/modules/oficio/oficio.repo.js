import { Oficio } from "./models/oficio.model.js";
import { Comment } from "./models/comment.model.js";

const OFICIO_ATTRIBUTES = { exclude: ['oficio_id'] }

export async function findPendingOficios(group) {
    return Oficio.findAll({
        where: {
            accomplished: false,
            group_id: group
        },
        attributes: OFICIO_ATTRIBUTES,
        nest: true
    })
}

export async function createOficio(oficio_invoice, deadline, group_id) {
    const [newOficio, created] = await Oficio.findOrBuild({
        where: {
            oficio_invoice
        },
        defaults: {
            oficio_invoice,
            deadline,
            group_id
        }
    });

    if (!created) return null;

    return generateSafeOficio(newOficio);
}

export async function createComment(oficio_uuid, user_id, comment_txt) {
    const targetOficio = await Oficio.findOne({
        where: {
            oficio_uuid
        }
    });

    if (targetOficio) return null;

    return targetOficio.addComment({
        user_id,
        comment_txt
    });
}

function generateSafeOficio(oficio) {
    const { oficio_id, ...safeOficio } = oficio.toJSON();
    return safeOficio;
}