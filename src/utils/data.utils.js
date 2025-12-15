import { isMatch, parseISO, isValid } from 'date-fns';

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