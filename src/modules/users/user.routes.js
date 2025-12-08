import { Router } from "express";
import * as userControl from './user.controller.js';
import { verifyToken } from "../../middlewares/authentication.js";

const router = Router();

router.get('/', verifyToken(), userControl.getAllUsers);

router.get('/:user_id', verifyToken(), userControl.getSingleUser);

router.post('/', userControl.createUser);

export default router;