import { Oficio } from "./models/oficio.model.js";
import { Comment } from "./models/comment.model.js";
import { User } from "../users/models/user.model.js";
import { OficioEmitted } from "./models/emitted-oficio.model.js";
import { Group } from "../users/models/groups.model.js";
import { Op } from "sequelize";

const OFICIO_MODELS = [
    {
        model: Group,
        attributes: ['group', 'group_name']
    },
    {
        model: Comment,
        attributes: ['comment_uuid','comment_txt', 'createdAt'],
        include: [
            {
                model: User,
                attributes: ['username', 'name']
            }
        ]
    },
    {
        model: OficioEmitted,
        attributes: ['emitted_of_uuid', 'emitted_of_invoice']
    }
]

const EMITTED_OFICIO_MODELS = [
    {
        model: Oficio,
        attributes: ['oficio_uuid', 'oficio_invoice']
    }
]

//Oficio repos
export async function findOficio(oficio_uuid) {
    const oficio = await Oficio.findOne({
        where: {
            oficio_uuid
        },
        include: OFICIO_MODELS,
    });

    return generateSafeOficio(oficio);
}

export async function findGroupOficio(oficio_uuid, group_id) {
    const oficio = await Oficio.findOne({
        where: {
            oficio_uuid,
            group_id
        },
        include: OFICIO_MODELS,
    });

    return generateSafeOficio(oficio);
}

export async function findAllOficios() {
    const oficios = await Oficio.findAll({
        include: OFICIO_MODELS,
        order: [
            ['invoice', 'ASC']
        ]
    });

    const cleanOficios = oficios.map(o => generateSafeOficio(o));

    return cleanOficios;
}

export async function findAllGroupOficios(group_id) {
    const oficios = await Oficio.findAll({
        where:{
            group_id
        },
        include: OFICIO_MODELS,
        order: [
            ['invoice', 'ASC']
        ]
    });

    const cleanOficios = oficios.map(o => generateSafeOficio(o));

    return cleanOficios;
}

export async function findPendingOficios() {
    const oficios = await Oficio.findAll({
        where: {
            accomplished: false
        },
        include: OFICIO_MODELS,
        order: [
            ['invoice', 'ASC']
        ]
    });

    const cleanOficios = oficios.map(o => generateSafeOficio(o));

    return cleanOficios;
}

export async function findGroupPendingOficios(group) {
    const oficios = await Oficio.findAll({
        where: {
            accomplished: false,
            group_id: group
        },
        include: OFICIO_MODELS,
        order: [
            ['invoice', 'ASC']
        ]
    });

    const cleanOficios = oficios.map(o => generateSafeOficio(o));

    return cleanOficios;
}

export async function findResponsePendingOficios() {
    return Oficio.findAll({
        where: {
            response_required: true,
            '$emitted_oficio.emitted_of_id$': {
                [Op.is]: null
            }
        },
        attributes: ['oficio_uuid', 'oficio_invoice', 'subject'],
        include: {
            model: OficioEmitted,
            required: false,
        }
    });
}

export async function findGroupResponsePendingOficios(group_id) {
    return Oficio.findAll({
        where: {
            response_required: true,
            group_id,
            '$emitted_oficio.emitted_of_id$': {
                [Op.is]: null
            }
        },
        attributes: ['oficio_uuid', 'oficio_invoice', 'subject'],
        include: {
            model: OficioEmitted,
            required: false,
        }
    });
}

export async function createOficio(oficio_invoice, true_invoice, invoice, year, name, subject, reception_date, deadline, group_id, response_required) {
    const [newOficio, created] = await Oficio.findOrCreate({
        where: {
            oficio_invoice,
            invoice,
            year
        },
        defaults: {
            oficio_invoice,
            true_invoice,
            invoice,
            year,
            name,
            subject,
            reception_date,
            deadline,
            group_id,
            response_required
        }
    });

    if (!created) return null;

    await newOficio.reload({
        include: OFICIO_MODELS
    });

    return generateSafeOficio(newOficio);
}

export async function updateOficio(oficio_uuid, true_invoice, name, subject, reception_date, deadline, group_id, response_required) {
    const oficio = await Oficio.findOne({
        where: {
            oficio_uuid,
            accomplished: false
        }
    });

    if (!oficio) return null;

    await oficio.update({
        true_invoice,
        name,
        subject,
        reception_date,
        deadline,
        group_id,
        response_required
    });

    await oficio.reload({
        include: OFICIO_MODELS
    });

    return generateSafeOficio(oficio)
}

export async function createComment(oficio_uuid, user, comment_txt) {
    const targetOficio = await Oficio.findOne({
        where: {
            oficio_uuid,
            accomplished: false
        }
    });

    if (!targetOficio) return null;

    const createdComment = await targetOficio.createComment({
        user_id: user,
        comment_txt,
        oficio_id: targetOficio.oficio_id
    });

    await createdComment.reload({
        include: [
            {
                model: Oficio,
                attributes: ['oficio_uuid', 'oficio_invoice']
            },
            {
                model: User,
                attributes: ['name','username']
            }
        ]
    });

    const { comment_id, user_id, oficio_id, ...safeComment} = createdComment.toJSON();

    /*if(!targetOficio.response_required) {
        await targetOficio.update({
            accomplished: true
        });
    }*/

    return safeComment;
}

export async function createGroupComment(oficio_uuid, user, comment_txt, group_id) {
    const targetOficio = await Oficio.findOne({
        where: {
            oficio_uuid,
            accomplished: false,
            group_id
        }
    });

    if (!targetOficio) return null;

    const createdComment = await targetOficio.createComment({
        user_id: user,
        comment_txt,
        oficio_id: targetOficio.oficio_id
    });

    await createdComment.reload({
        include: [
            {
                model: Oficio,
                attributes: ['oficio_uuid', 'oficio_invoice']
            },
            {
                model: User,
                attributes: ['name','username']
            }
        ]
    });

    const { comment_id, user_id, oficio_id, ...safeComment} = createdComment.toJSON();

    /*if(!targetOficio.response_required) {
        await targetOficio.update({
            accomplished: true
        });
    }*/

    return safeComment;
}

export async function closeOficio(oficio_uuid, user_id, comment_txt) {
    const oficio = await Oficio.findOne({
        where: {
            oficio_uuid
        }
    });

    if (!oficio) return null;

    await oficio.update({
        accomplished: true
    });

    await oficio.createComment({
        user_id,
        comment_txt,
        oficio_id: oficio.oficio_id
    });

    await oficio.reload({
        include: OFICIO_MODELS
    });

    return generateSafeOficio(oficio);
}

export async function findOficioID(oficio_uuid) {
    return Oficio.findOne({
        where: {
            oficio_uuid
        },
        attributes: ['oficio_id', 'oficio_invoice', 'response_required'],
        include: {
            model: OficioEmitted,
            attributes: ['emitted_of_uuid', 'emitted_of_invoice']
        }
    });
}

function generateSafeOficio(oficio) {
    if(!oficio) {
        return;
    }

    const { oficio_id, ...safeOficio } = oficio.toJSON();
    return safeOficio;
}

//Emitted Oficio repos
export async function findAllEmittedOficios() {
    const oficios = await OficioEmitted.findAll({
        order: [
            ['invoice', 'ASC']
        ],
        include: EMITTED_OFICIO_MODELS
    });

    const cleanOficios = oficios.map(o => generateSafeEmittedOficio(o));

    return cleanOficios;
}

export async function findEmittedOficio(emitted_of_uuid) {
    const oficio = await OficioEmitted.findOne({
        where: {
            emitted_of_uuid
        },
        include: EMITTED_OFICIO_MODELS
    });

    return generateSafeEmittedOficio(oficio);
}

export async function createEmittedOficio(emitted_of_invoice, invoice, year, emission_date, name, position, subject, reception_date, is_response, oficio_id) {
    const [newOficio, created] = await OficioEmitted.findOrCreate({
        where: {
            emitted_of_invoice,
            invoice,
            year
        },
        defaults: {
            emitted_of_invoice,
            invoice,
            year,
            emission_date,
            name,
            position,
            subject,
            reception_date,
            is_response,
            oficio_id
        }
    });

    if (!created) return null;

    await newOficio.reload({
        include: EMITTED_OFICIO_MODELS
    })

    return generateSafeEmittedOficio(newOficio);
}

export async function updateEmittedOficio(emitted_of_uuid, emission_date, name, position, subject, reception_date, is_response, oficio_id) {
    const oficio = await OficioEmitted.findOne({
        where: {
            emitted_of_uuid
        }
    });

    await oficio.update({
        emission_date,
        name,
        position,
        subject,
        reception_date,
        is_response,
        oficio_id: is_response ? oficio_id : null
    });

    if (!oficio) return null;

    await oficio.reload({
        include: EMITTED_OFICIO_MODELS
    })

    return generateSafeEmittedOficio(oficio);
}

function generateSafeEmittedOficio(oficio) {
    if(!oficio) {
        return;
    }

    const { emitted_of_id, oficio_id, ...safeOficio } = oficio.toJSON();
    return safeOficio;
}