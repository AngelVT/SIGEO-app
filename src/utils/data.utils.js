import { isMatch, parseISO, isValid } from 'date-fns';
import { __dirstorage } from '../path.config.js';
import { fileTypeFromBuffer } from 'file-type';
import FileSystemError from '../errors/FileSystemError.js';
import path from 'path';
import { promises as fs } from 'fs';

export function validateDate(dateString) {
    if (!isMatch(dateString, 'yyyy-MM-dd')) return false;

    const date = parseISO(dateString);

    return isValid(date);
}

export function parseBool(value) {
    const values = ['true', 'false'];
    
    if (typeof value === 'undefined' || value === null) return undefined;

    if (typeof value === 'string') {
        if (!values.includes(value.toLowerCase())) return undefined;

        return value.toLowerCase() === 'true';
    }

    return Boolean(value);
}

export async function validatePFFile(file) {
    if (file.mimetype !== 'application/pdf') {
        return false;
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
        return false;
    }

    const detectedType = await fileTypeFromBuffer(file.buffer);
    if (!detectedType || detectedType.mime !== 'application/pdf') {
        return false;
    }

    return true;
}

export async function saveFile(folder, file) {
    const destination = path.join(__dirstorage, folder, `${file.originalname}`);

    const directory = path.dirname(destination);

    try {
        await fs.mkdir(directory, { recursive: true });
    } catch (error) {
        throw new FileSystemError("Error creando el directorio destino del archivo");
    }

    try {
        await fs.writeFile(destination, file.buffer);
    } catch (error) {
        throw new FileSystemError("Error al crear el archivo.");
    }

    return destination;
}

export async function removeFile(filePath) {
    await fs.unlink(filePath);
}