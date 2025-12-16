import { Router } from "express";
import * as oficioControl from './oficio.controller.js';
import { verifyToken, verifyGroup, verifyRole, verifyPermission } from "../../middlewares/authentication.js";
import { groupDelegate } from "../../middlewares/redirections.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

//Oficio Routes
router.get('/in/pending', [
    verifyToken(),
    verifyPermission(['oficio:read','oficio:manage']),
], oficioControl.getPendingOficios);

router.get('/in/unanswered', [
    verifyToken(),
    verifyPermission(['oficio:read','oficio:manage']),
    groupDelegate(['DG', 'SYSTEM'])
], oficioControl.getUnansweredOficios);

router.get('/in/id/:oficio_uuid', [
    verifyToken(),
    verifyPermission(['oficio:read','oficio:manage']),
    groupDelegate(['DG', 'SYSTEM'])
], oficioControl.getOficio);

router.get('/in', [
    verifyToken(),
    verifyPermission(['oficio:read','oficio:manage']),
    groupDelegate(['DG', 'SYSTEM'])
], oficioControl.getAllOficios);

router.post('/in', [
    verifyToken(),
    verifyGroup(['DG', 'SYSTEM']),
    verifyRole(['system', 'admin']),
    verifyPermission(['oficio:create','oficio:manage']),
    upload.single('oficio_pdf')
], oficioControl.createOficio);

router.patch('/in/:oficio_id', [
    verifyToken(),
    verifyGroup(['DG', 'SYSTEM']),
    verifyRole(['system', 'admin']),
    verifyPermission(['oficio:update','oficio:manage']),
    upload.single('oficio_pdf')
], oficioControl.updateOficio);

router.post('/in/comment/:oficio_id', [
    verifyToken(),
    verifyRole(['system', 'admin', 'moderator']),
    verifyPermission(['oficio:comment','oficio:manage']),
    groupDelegate(['DG', 'SYSTEM'])
], oficioControl.commentOficio);

router.patch('/in/close/:oficio_id', [
    verifyToken(),
    verifyGroup(['DG', 'SYSTEM']),
    verifyRole(['system', 'admin']),
    verifyPermission(['oficio:close','oficio:manage'])
], oficioControl.closeOficio);

//Emitted oficio Routes
router.get('/emitted', [
    verifyToken(),
    verifyGroup(['DG', 'SYSTEM']),
    verifyRole(['system', 'admin']),
    verifyPermission(['oficio:read','oficio:manage'])
], oficioControl.getEmittedOficios);

router.get('/emitted/:emitted_of_uuid', [
    verifyToken(),
    verifyGroup(['DG', 'SYSTEM']),
    verifyRole(['system', 'admin']),
    verifyPermission(['oficio:read','oficio:manage'])
], oficioControl.getEmittedOficio);

router.post('/emitted', [
    verifyToken(),
    verifyGroup(['DG', 'SYSTEM']),
    verifyRole(['system', 'admin']),
    verifyPermission(['oficio:create','oficio:manage']),
    upload.single('oficio_pdf')
], oficioControl.createEmittedOficio);

router.patch('/emitted/:emitted_of_uuid', [
    verifyToken(),
    verifyGroup(['DG', 'SYSTEM']),
    verifyRole(['system', 'admin']),
    verifyPermission(['oficio:update','oficio:manage']),
    upload.single('oficio_pdf')
], oficioControl.updateEmittedOficio);

export default router;