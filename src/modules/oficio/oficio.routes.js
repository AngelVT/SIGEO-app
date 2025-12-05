import { Router } from "express";
import * as oficioControl from './oficio.controller.js';

const router = Router();

router.get('/pending', oficioControl.getPendingOficios);

router.post('/', oficioControl.createOficio);

router.post('/:oficio_id', oficioControl.commentOficio);


export default router;