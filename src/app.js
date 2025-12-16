import express from "express";
import path from 'path';
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from 'morgan';

import { __dirname, __dirstorage } from "./path.config.js";
import { SIGEO_SECRET_COOKIE } from "./config/env.config.js";
import { apiLimiter, authLimiter } from "./config/limmiter.config.js";
import { setDefaultDirectories } from "./config/storage.config.js";
import { checkDB } from "./config/db.config.js";
import { setDBDefaults } from "./config/db-values.config.js";
import helmetMiddleware from "./middlewares/helmet.js";
import authRoutes from './modules/auth/auth.routes.js';
import oficioRoutes from './modules/oficio/oficio.routes.js';
import userRoutes from './modules/users/user.routes.js';
import * as log from "./utils/log.utils.js";
import { verifyToken } from "./middlewares/authentication.js";

const app = express();

app.set('trust proxy', 1);

checkDB();

setDBDefaults();
setDefaultDirectories();

app.use(helmetMiddleware);

app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ limit: '3mb', extended: true }));

app.use(cookieParser(SIGEO_SECRET_COOKIE));

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/', express.static(path.join(__dirname, 'resources', 'client', 'login')));

app.use('/dashboard', verifyToken(), express.static(path.join(__dirname, 'resources', 'client', 'dash')));

app.use('/oficios', express.static(path.join(__dirstorage, 'oficios')));

app.use("/api", morgan('tiny', {
    stream: {
        write: (msg) => {
            log.consoleApi(msg.trim());
        }
    }
}));

app.use("/auth", morgan('tiny', {
    stream: {
        write: (msg) => {
            log.consoleAuth(msg.trim());
        }
    }
}));

app.use('/auth', authLimiter);

app.use('/auth', authRoutes);

app.use("/api", apiLimiter);

app.use('/api/oficio', oficioRoutes);

app.use('/api/user', userRoutes);

app.use((req, res) => {
    res.status(404).json({
        msg: "404 not found"
    })
});

export default app;