import express from "express";
import path from 'path';
import { __dirname } from "./path.config.js";

const app = express();

app.use('/', express.static(path.join(__dirname, 'resources', 'client')));

app.use((req, res) => {
    res.status(404).json({
        msg: "404 not found"
    })
});

export default app;