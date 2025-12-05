import * as oficioRepo from './oficio.repo.js';
import { validate as isUuid } from 'uuid';
import ValidationError from '../../errors/validationError.js';
import ResourceError from '../../errors/ResourceError.js';

export async function requestAllPendingOficios(userGroup) {
    const oficios = await oficioRepo.findPendingOficios(userGroup);

    if (!oficios || oficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios pendientes.`,
            'Oficios pending request',
            `the search returned no results.`
        );
    }

    return {
        oficios
    }
}

export async function requestOficioCreation(oficio_invoice, deadline, group) {

    // TODO do other validations

    const oficio = await oficioRepo.createOficio(oficio_invoice, deadline, group);

    if(!oficio) {
        throw new ValidationError(`solicitud fallida, el folio ${oficio_invoice} ya existe.`,
            'Oficio creation request',
            `Request failed due to invoice ${oficio_invoice} already exist.`
        );
    }

    return {
        oficio
    }
}

export async function requestCommentCreation(oficio_uuid, comment_txt, user_id) {
    if (!isUuid(oficio_uuid)) {
        throw new ValidationError('Request failed due to invalid ID.',
            'Oficio comment request',
            `Request failed due to ID ${id} is invalid.`
        );
    }

    // TODO do other validations

    const comment = await oficioRepo.createComment(oficio_uuid, user_id, comment_txt);

    return {
        comment
    }
}