import { Oficio } from "./models/oficio.model.js";
import { OficioEmitted } from "./models/emitted-oficio.model.js";
import { Group } from "../users/models/groups.model.js";
import ValidationError from "../../errors/validationError.js";

export async function generateOficioInvoice(year) {
    let invoice;
    let oficio_invoice;

    const invoices = await Oficio.findAll({
        where: {
            year
        },
        order: [
            ['invoice', 'DESC']
        ],
        attributes: ['invoice', 'year']
    });

    if (invoices.length == 0)
        invoice = 1;
    else
        invoice = invoices[0].invoice + 1;

    oficio_invoice = `FO-${invoice.toString().padStart(4, '0')}-${year}`;

    return {
        invoice,
        oficio_invoice
    }
}

export async function generateEmittedOficioInvoice(year) {
    let invoice;
    let emitted_of_invoice;

    const invoices = await OficioEmitted.findAll({
        where: {
            year
        },
        order: [
            ['invoice', 'DESC']
        ],
        attributes: ['invoice', 'year']
    });

    if (invoices.length == 0)
        invoice = 1;
    else
        invoice = invoices[0].invoice + 1;

    emitted_of_invoice = `EFO-${invoice.toString().padStart(4, '0')}-${year}`;

    return {
        invoice,
        emitted_of_invoice
    }
}

export async function filterBuilder(filters) {
    const { invoice, year, group, name, subject } = filters;
    const validatedFilter = {}

    if (!invoice && !year && !group && !name && !subject) {
        throw new ValidationError(`Se requiere mínimo uno de los siguientes filtros para realizar una búsqueda: folio, año, nombre, asunto.`);
    }

    if (invoice) {
        const intInvoice = parseInt(invoice);

        if (!isNaN(intInvoice)) {
            validatedFilter.invoice = intInvoice;
        } else {
            throw new ValidationError(`El folio proporcionado no es valido.`);
        }
    }

    if(year) {
        const intYear = parseInt(year);

        if (!isNaN(intYear) && intYear > 2024 && intYear < 2100 ) {
            validatedFilter.year = intYear;
        } else {
            throw new ValidationError(`El año proporcionado no es valido.`);
        }
    }

    if (name) {
        if (typeof name === 'string') {
            validatedFilter.name = name;
        } else {
            throw new ValidationError(`El nombre proporcionado no es valido.`);
        }
    }

    if (subject) {
        if (typeof subject === 'string') {
            validatedFilter.subject = subject;
        } else {
            throw new ValidationError(`El asunto proporcionado no es valido.`);
        }
    }

    if(group) {
        const intGroup = parseInt(group);
        const invalidGroupMsg = `El grupo proporcionado no es valido.`;
        
        if (!isNaN(intGroup)) {
            const existingGroup = await Group.findByPk(intGroup)

            if (!existingGroup) {
                throw new ValidationError(invalidGroupMsg);
            }

            validatedFilter.group_id = existingGroup.group_id;
        } else {
            throw new ValidationError(invalidGroupMsg);
        }
    }

    return validatedFilter;
}