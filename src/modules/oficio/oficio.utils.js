import { Oficio } from "./models/oficio.model.js";
import { OficioEmitted } from "./models/emitted-oficio.model.js";

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