import { Router } from "express";
import * as userControl from './user.controller.js';
import { verifyToken, verifyGroup, verifyRole, verifyPermission } from "../../middlewares/authentication.js";

const router = Router();

router.get('/', [
    verifyToken(),
    verifyGroup(['SYSTEM']),
    verifyRole(['system']),
    verifyPermission(['user:read','user:manage'])
], userControl.getAllUsers);

router.get('/filtered', [
    verifyToken(),
    verifyGroup(['SYSTEM']),
    verifyRole(['system']),
    verifyPermission(['user:read','user:manage'])
], userControl.getUsersFiltered);

router.get('/id/:user_id', [
    verifyToken(),
    verifyGroup(['SYSTEM']),
    verifyRole(['system']),
    verifyPermission(['user:read','user:manage'])
], userControl.getSingleUser);

router.post('/', [
    verifyToken(),
    verifyGroup(['SYSTEM']),
    verifyRole(['system']),
    verifyPermission(['user:create','user:manage'])
], userControl.createUser);

router.patch('/:user_id', [
    verifyToken(),
    verifyGroup(['SYSTEM']),
    verifyRole(['system']),
    verifyPermission(['user:update','user:manage'])
], userControl.updateUser);

export default router;