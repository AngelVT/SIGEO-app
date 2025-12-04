import { fileURLToPath } from "url";
import { dirname } from "path";
import { SIGEO_STORAGE_DIR } from "./config/env.config.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const __dirstorage = SIGEO_STORAGE_DIR;