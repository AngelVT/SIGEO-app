import { Router } from "express";
import * as authControl from './auth.controller.js';

const router = Router();

router.post('/login', authControl.login);

export default router;