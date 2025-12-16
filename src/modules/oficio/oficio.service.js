import * as oficioRepo from './oficio.repo.js';
import { validate as isUuid } from 'uuid';
import ValidationError from '../../errors/validationError.js';
import ResourceError from '../../errors/ResourceError.js';
import * as oficioUtils from './oficio.utils.js';
import { validateGroup } from '../../utils/access-control.utils.js';
import { validateDate, parseBool, validatePFFile, saveFile, removeFile } from '../../utils/data.utils.js';
import { pool } from '../../config/db.config.js';
import { consoleError, consoleInfo } from '../../utils/log.utils.js';
import FileSystemError from '../../errors/FileSystemError.js';

//Oficio services
export async function requestAllPendingOficios() {
    const oficios = await oficioRepo.findPendingOficios();

    if (!oficios || oficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios pendientes.`);
    }

    return {
        oficios
    }
}

export async function requestAllGroupPendingOficios(userGroup) {
    const oficios = await oficioRepo.findGroupPendingOficios(userGroup);

    if (!oficios || oficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios pendientes.`);
    }

    return {
        oficios
    }
}

export async function requestOficio(oficio_uuid) {
    if (!isUuid(oficio_uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    const oficio = await oficioRepo.findOficio(oficio_uuid);

    if(!oficio) {
        throw new ResourceError("El oficio solicitado no existe.")
    }

    return {
        oficio
    }
}

export async function requestGroupOficio(oficio_uuid, group_id) {
    if (!isUuid(oficio_uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    const oficio = await oficioRepo.findGroupOficio(oficio_uuid, group_id);

    if(!oficio) {
        throw new ResourceError("El oficio solicitado no existe o no tienes los permisos para verlo.")
    }

    return {
        oficio
    }
}

export async function requestAllOficios() {
    const oficios = await oficioRepo.findAllOficios();

    if (!oficios || oficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios pendientes.`);
    }

    return {
        oficios
    }
}

export async function requestAllGroupOficios(userGroup) {
    const oficios = await oficioRepo.findAllGroupOficios(userGroup);

    if (!oficios || oficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios pendientes.`);
    }

    return {
        oficios
    }
}

export async function requestUnansweredOficios() {
    const oficios = await oficioRepo.findResponsePendingOficios();

    if (!oficios || oficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios sin respuesta pendientes.`);
    }

    return {
        oficios
    }
}

export async function requestGroupUnansweredOficios(userGroup) {
    const oficios = await oficioRepo.findGroupResponsePendingOficios(userGroup);

    if (!oficios || oficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios sin respuesta pendientes.`);
    }

    return {
        oficios
    }
}

export async function requestOficioCreation(true_invoice, name, subject, reception_date, deadline, group, response_required, file) {
    if (!true_invoice || !name || !subject || !reception_date || !deadline || !group || typeof response_required === 'undefined' || !file) {
        throw new ValidationError("No se pudo crear el oficio debido a información faltante.");
    }

    const responseRequired = parseBool(response_required);

    if (typeof responseRequired !== 'boolean') {
        throw new ValidationError("Solicitud invalidad debido a datos inválidos, comprueba tu información e intenta de nuevo");
    }

    const groupString = await validateGroup(group);

    if (!groupString) {
        throw new ValidationError("Solicitud fallida debido a que el grupo dado es invalido.");
    }

    if (!validateDate(reception_date) || !validateDate(deadline)) {
        throw new ValidationError("Solicitud invalidad debido a fechas invalidas, procura seguir el formato AAAA-MM-DD");
    }

    if(!validatePFFile(file)) {
        throw new ValidationError(`Solicitud fallida, el archivo proporcionado no es un PDF valido.`);
    }

    const date = new Date;

    const year = date.getFullYear();

    const { oficio_invoice, invoice } = await oficioUtils.generateOficioInvoice(year);

    let filePath;
    let oficio;

    try {
        oficio = await pool.transaction(async transaction => {
            transaction.afterCommit(() => {
                consoleInfo(`${oficio_invoice} transaction closed`)
            });

            const oficioRecord = await oficioRepo.createOficio(oficio_invoice, true_invoice, invoice, year, name, subject, reception_date, deadline, group, responseRequired, transaction);

            if(!oficioRecord) {
                throw new ValidationError(`Solicitud fallida, el folio ${oficio_invoice} ya existe.`);
            }

            file.originalname = `${oficio_invoice}.pdf`

            filePath = await saveFile(`oficios/${groupString}`, file);

            return oficioRecord;
        });
    } catch (error) {
        if (filePath) {
            try {
                await removeFile(filePath);
            } catch (error) {
                consoleError(`CRITICAL: Failed to delete orphaned file ${filePath}: ${error.message}`);
            }
        }
        
        throw error;
    }

    return {
        oficio
    }
}

export async function requestOficioUpdate(oficio_uuid, true_invoice, name, subject, reception_date, deadline, response_required, file) {
    if (!isUuid(oficio_uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    if (!true_invoice && !name && !subject && !reception_date && !deadline && !group && typeof response_required === 'undefined' && !file) {
        throw new ValidationError("No se pudo actualizar el oficio debido a información faltante.");
    }

    if (typeof response_required !== 'undefined') {
        const responseRequired = parseBool(response_required);

        if (typeof responseRequired !== 'boolean') {
            throw new ValidationError("Solicitud fallida debido a datos inválidos.");
        }
    }

    /*if (group && !validateGroup(group)) {
        throw new ValidationError("Solicitud fallida debido a que el grupo dado es invalido.");
    }*/

    if (reception_date && !validateDate(reception_date)) {
        throw new ValidationError("Solicitud invalidad debido a fechas invalidas, procura seguir el formato AAAA-MM-DD");
    }

    if (deadline && !validateDate(deadline)) {
        throw new ValidationError("Solicitud invalidad debido a fechas invalidas, procura seguir el formato AAAA-MM-DD");
    }

    if (file && !validatePFFile(file)) {
        throw new ValidationError(`Solicitud fallida, el archivo proporcionado no es un PDF valido.`);
    }

    let filePath;
    let oficio;

    try {
        oficio = await pool.transaction(async transaction => {
            const oficioRecord = await oficioRepo.updateOficio(oficio_uuid, true_invoice, name, subject, reception_date, deadline, response_required, transaction);

            if(!oficioRecord) {
                throw new ValidationError(`Solicitud fallida, el oficio no existe o ya fue cerrado.`);
            }

            if (file) {
                file.originalname = `${oficioRecord.oficio_invoice}.pdf`

                filePath = await saveFile(`oficios/${oficioRecord.group.group}`, file);
            }

            return oficioRecord;
        });
    } catch (error) {
        if (!filePath) {
            consoleError("File not updated");
        }

        throw error;
    }

    return {
        oficio
    }
}

export async function requestCommentCreation(oficio_uuid, comment_txt, user_id) {
    if (!isUuid(oficio_uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    if (!comment_txt) {
        throw new ValidationError("No se pudo crear el comentario debido a información faltante");
    }

    const comment = await oficioRepo.createComment(oficio_uuid, user_id, comment_txt);

    if(!comment) {
        throw new ResourceError("No se pudo generar el comentario debido a que el oficio objetivo no existe o ya fue cerrado.")
    }

    return {
        comment
    }
}

export async function requestGroupCommentCreation(oficio_uuid, comment_txt, user_id, group_id) {
    if (!isUuid(oficio_uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    if (!comment_txt) {
        throw new ValidationError("No se pudo crear el comentario debido a información faltante");
    }

    const comment = await oficioRepo.createGroupComment(oficio_uuid, user_id, comment_txt, group_id);

    if(!comment) {
        throw new ResourceError("No se pudo generar el comentario debido a que el oficio objetivo no existe, ya fue cerrado o no cuentas con los permisos para comentar este oficio.")
    }

    return {
        comment
    }
}

export async function requestOficioClosure(oficio_uuid, comment_txt, user_id) {
    if (!isUuid(oficio_uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    if(!comment_txt) {
        throw new ValidationError('Debes de incluir un comentario para poder cerrar el oficio.');
    }

    const oficio = await oficioRepo.closeOficio(oficio_uuid, user_id, comment_txt);

    if(!oficio) {
        throw new ResourceError("No se pudo cerrar debido a que el oficio solicitado no existe.")
    }

    return {
        oficio
    }
}

//Emitted oficio services
export async function requestAllEmittedOficios() {
    const emittedOficios = await oficioRepo.findAllEmittedOficios();

    if (!emittedOficios || emittedOficios.length === 0) {
        throw new ResourceError(`No se encontraron oficios emitidos existentes.`);
    }

    return {
        emittedOficios
    }
}

export async function requestEmittedOficio(uuid) {
    if (!isUuid(uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    const emittedOficio = await oficioRepo.findEmittedOficio(uuid);

    if(!emittedOficio) {
        throw new ResourceError("No se pudo generar el comentario debido a que el oficio no existe.")
    }

    return {
        emittedOficio
    }
}

export async function requestEmittedOficioCreation(emission_date, name, position, subject, reception_date, is_response, oficio_uuid, file) {
    if (typeof is_response === 'undefined') {
        throw new ValidationError("No se pudo crear el oficio debido a información faltante.");
    }

    const isResponse = parseBool(is_response);

    if (typeof isResponse !== 'boolean') {
        throw new ValidationError("Solicitud fallida debido a datos inválidos, comprueba tu información e intenta de nuevo");
    }

    if (isResponse && !oficio_uuid) {
        throw new ValidationError("solicitud fallida debido a que se requiere proporcionar un oficio valido cuando se quiere emitir un oficio de respuesta.");
    }

    if ((emission_date && !validateDate(emission_date)) || (reception_date && !validateDate(reception_date))) {
        throw new ValidationError("Solicitud invalidad debido a fechas invalidas, procura seguir el formato AAAA-MM-DD");
    }

    if (file && !validatePFFile(file)) {
        throw new ValidationError(`Solicitud fallida, el archivo proporcionado no es un PDF valido.`);
    }

    let target_oficio_id;

    if (isResponse) {
        if (!isUuid(oficio_uuid)) {
            throw new ValidationError("Solicitud fallida debido a que el Oficio al que se responde es invalido");
        }

        const { oficio_id, oficio_invoice, emitted_oficio, response_required } = await oficioRepo.findOficioID(oficio_uuid);

        if (!response_required) {
            throw new ValidationError(`Solicitud fallida debido a que el oficio ${oficio_invoice} no requiere una respuesta`);
        }

        if (emitted_oficio) {
            throw new ValidationError(`Solicitud fallida debido a que el oficio ${oficio_invoice} ya tiene un oficio de respuesta ${emitted_oficio.emitted_of_invoice}`);
        }

        target_oficio_id = oficio_id;

        if (!oficio_id) {
            throw new ValidationError("Solicitud fallida debido a que el oficio al que se responde no existe");
        }
    }

    const date = new Date;

    const year = date.getFullYear();

    const { emitted_of_invoice, invoice } = await oficioUtils.generateEmittedOficioInvoice(year);

    let filePath;
    let emittedOficio;

    try {
        emittedOficio = await pool.transaction(async transaction => {
            const emittedOficioRecord = await oficioRepo.createEmittedOficio(emitted_of_invoice, invoice, year, emission_date, name, position, subject, reception_date, isResponse, target_oficio_id, transaction);

            if(!emittedOficioRecord) {
                throw new ValidationError(`Solicitud fallida, el folio ${emitted_of_invoice} ya existe.`);
            }

            if (file) {
                file.originalname = `${emitted_of_invoice}.pdf`

                filePath = await saveFile(`oficios/emitidos`, file);
            }

            return emittedOficioRecord;

        });
    } catch (error) {
        if (filePath) {
            try {
                await removeFile(filePath);
            } catch (error) {
                consoleError(`CRITICAL: Failed to delete orphaned file ${filePath}: ${error.message}`);
            }
        }
        
        throw error;
    }

    return {
        emittedOficio
    }
}

export async function requestEmittedOficioUpdate(emitted_of_uuid, emission_date, name, position, subject, reception_date, is_response, oficio_uuid, file) {
    if (!isUuid(emitted_of_uuid)) {
        throw new ValidationError('Solicitud fallida debido a id invalido.');
    }

    if(!emission_date && !name && !position && !subject && !reception_date && typeof is_response === 'undefined' && !oficio_uuid && !file) {
        throw new ValidationError("No se pudo actualizar el oficio debido a información faltante");
    }

    if (emission_date && !validateDate(emission_date)) {
        throw new ValidationError("Solicitud invalidad debido a fechas invalidas, procura seguir el formato AAAA-MM-DD");
    }

    if (reception_date && !validateDate(reception_date)) {
        throw new ValidationError("Solicitud invalidad debido a fechas invalidas, procura seguir el formato AAAA-MM-DD");
    }

    if (file && !validatePFFile(file)) {
        throw new ValidationError(`Solicitud fallida, el archivo proporcionado no es un PDF valido.`);
    }

    let isResponse;

    if (typeof is_response !== 'undefined') {
        isResponse = parseBool(is_response);

        if (typeof isResponse !== 'boolean') {
            throw new ValidationError("No se pudo actualizar el oficio debido a información invalida");
        }

        if (isResponse && !oficio_uuid) {
            throw new ValidationError("No se pudo crear el oficio debido a información faltante.");
        }

        if (isResponse && !isUuid(emitted_of_uuid)) {
            throw new ValidationError("No se pudo actualizar el oficio debido a información invalida");
        }
    }

    let target_oficio_id;

    if (isResponse) {
        const { oficio_id, oficio_invoice, emitted_oficio, response_required } = await oficioRepo.findOficioID(oficio_uuid);

        target_oficio_id = oficio_id;

        if (!oficio_id) {
            throw new ValidationError("Solicitud fallida debido a que el oficio al que se responde no existe");
        }

        if (!response_required) {
            throw new ValidationError(`Solicitud fallida debido a que el oficio ${oficio_invoice} no requiere una respuesta`);
        }

        if (emitted_oficio) {
            throw new ValidationError(`Solicitud fallida debido a que el oficio ${oficio_invoice} ya tiene un oficio de respuesta ${emitted_oficio.emitted_of_invoice}`);
        }
    }

    let filePath;
    let emittedOficio;

    try {
        emittedOficio = await pool.transaction(async transaction => {
            const emittedOficioRecord = await oficioRepo.updateEmittedOficio(emitted_of_uuid, emission_date, name, position, subject, reception_date, is_response, target_oficio_id, transaction);

            if(!emittedOficioRecord) {
                throw new ValidationError(`Solicitud fallida, el folio solicitado no existe.`);
            }

            if (file) {
                file.originalname = `${emitted_of_invoice}.pdf`

                filePath = await saveFile(`oficios/emitidos`, file);
            }

            return emittedOficioRecord;
        });
    } catch (error) {
        if (!filePath) {
            consoleError("File not updated");
        }

        throw error;
    }

    return {
        emittedOficio
    }
}