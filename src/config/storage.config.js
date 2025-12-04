import { __dirstorage } from "../path.config.js";
import path from "path";
import fs from "fs";

import * as log from '../utils/log.utils.js';

export const setDefaultDirectories = async () => {
    createDirectory('oficios', "Oficios");
}

function createDirectory(dir, subject) {
    const directoryPath = path.join(__dirstorage, dir);

    fs.access(directoryPath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdir(directoryPath, { recursive: true }, (err) => {
                if (err) {
                    log.consoleError(`Error creating ${subject} storage directory`);
                } else {
                    log.consoleInfo(`${subject} storage directory was created`);
                }
            });
        } /*else {
            log.consoleInfo(`${subject} storage directory already exists`);
        }*/
    });
}