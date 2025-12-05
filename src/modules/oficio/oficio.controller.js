import * as oficioService from './oficio.service.js';
import { requestHandler } from '../../utils/request.utils.js';

export const getPendingOficios = requestHandler(async (req, res) => {
    const { group } = req.user;

    const response = await oficioService.requestAllPendingOficios(group);

    res.status(200).json(response);

    console.log("Get request completed, al pending oficios requested");
});

export const createOficio = requestHandler(async (req, res) => {
    const { oficio_invoice, deadline, group } = req.body;

    const response = await oficioService.requestOficioCreation(oficio_invoice, deadline, group);

    res.status(200).json(response);

    console.log("Get request completed, al pending oficios requested");
});

export const commentOficio = requestHandler(async (req, res) => {
    const { comment } = req.body;
    const { oficio_id } = req.params;
    const { user_id } = req.user;

    const response = await oficioService.requestCommentCreation(oficio_id, comment, user_id);

    res.status(200).json(response);

    console.log("Get request completed, al pending oficios requested");
});