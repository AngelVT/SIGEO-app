import * as oficioService from './oficio.service.js';
import { requestHandler } from '../../utils/request.utils.js';

//Oficio controllers
export const getPendingOficios = requestHandler(async (req, res) => {
    const { group_id } = req.user;
    const { full } = req;

    let response;

    if(full)
        response = await oficioService.requestAllPendingOficios();
    else
        response = await oficioService.requestAllGroupPendingOficios(group_id);
    

    res.status(200).json(response);

    console.log("Get request completed, all pending oficios requested");
});

export const getOficio = requestHandler(async (req, res) => {
    const { oficio_uuid } = req.params;
    const { group_id } = req.user;
    const { full } = req;

    let response;

    if(full)
        response = await oficioService.requestOficio(oficio_uuid);
    else
        response = await oficioService.requestGroupOficio(oficio_uuid, group_id);

    res.status(200).json(response);

    console.log("Get request completed, single oficio requested");
});

export const getAllOficios = requestHandler(async (req, res) => {
    const { group_id } = req.user;
    const { full } = req;

    let response;

    if(full)
        response = await oficioService.requestAllOficios();
    else
        response = await oficioService.requestAllGroupOficios(group_id);
    

    res.status(200).json(response);

    console.log("Get request completed, all oficios requested");
});

export const getUnansweredOficios = requestHandler(async (req, res) => {
    const { group_id } = req.user;
    const { full } = req;

    let response;

    if(full)
        response = await oficioService.requestUnansweredOficios();
    else
        response = await oficioService.requestGroupUnansweredOficios(group_id)

    res.status(200).json(response);

    console.log("Get request completed, all pending oficios requested");
});

export const createOficio = requestHandler(async (req, res) => {
    const { true_invoice, name, subject, reception_date, deadline, group, response_required } = req.body;

    const response = await oficioService.requestOficioCreation(true_invoice, name, subject, reception_date, deadline, group, response_required);

    res.status(200).json(response);

    console.log("Post request completed, new oficio created");
});

export const commentOficio = requestHandler(async (req, res) => {
    const { comment } = req.body;
    const { oficio_id } = req.params;
    const { user_id, group_id} = req.user;
    const { full} = req;

    let response;

    if (full)
        response = await oficioService.requestCommentCreation(oficio_id, comment, user_id);
    else
        response = await oficioService.requestGroupCommentCreation(oficio_id, comment, user_id, group_id);

    res.status(200).json(response);

    console.log("Post request completed, oficio comment created");
});

export const updateOficio = requestHandler(async (req, res) => {
    const { true_invoice, name, subject, reception_date, deadline, group, response_required } = req.body;
    const { oficio_id } = req.params;

    const response = await oficioService.requestOficioUpdate(oficio_id, true_invoice, name, subject, reception_date, deadline, group, response_required);
    
    res.status(200).json(response);

    console.log("Post request completed, oficio updated");
});

export const closeOficio = requestHandler(async (req, res) => {
    const { oficio_id } = req.params;
    const { comment } = req.body;
    const { user_id } = req.user;

    const response = await oficioService.requestOficioClosure(oficio_id, comment, user_id);

    res.status(200).json(response);

    console.log("Post request completed, oficio comment created");
});

//Emitted oficio controllers
export const getEmittedOficios = requestHandler(async (req, res) => {
    const response = await oficioService.requestAllEmittedOficios();

    res.status(200).json(response);

    console.log("Get request completed, all emitted oficios requested");
});

export const getEmittedOficio = requestHandler(async (req, res) => {
    const { emitted_of_uuid } = req.params;

    const response = await oficioService.requestEmittedOficio(emitted_of_uuid);

    res.status(200).json(response);

    console.log("Get request completed, single emitted oficio requested");
});

export const createEmittedOficio = requestHandler(async (req, res) => {
    const { emission_date, name, position, subject, reception_date, is_response, oficio_uuid } = req.body;

    const response = await oficioService.requestEmittedOficioCreation(emission_date, name, position, subject, reception_date, is_response, oficio_uuid);

    res.status(200).json(response);

    console.log("Post request completed, new emitted oficio created");
});

export const updateEmittedOficio = requestHandler(async (req, res) => {
    const { emission_date, name, position, subject, reception_date, is_response, oficio_uuid } = req.body;
    const { emitted_of_uuid } = req.params;

    const response = await oficioService.requestEmittedOficioUpdate(emitted_of_uuid, emission_date, name, position, subject, reception_date, is_response, oficio_uuid)
    
    res.status(200).json(response);

    console.log("Post request completed, emitted oficio updated");
});