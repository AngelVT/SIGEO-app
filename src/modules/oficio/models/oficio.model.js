import { DataTypes } from "sequelize";
import { pool } from "../../../config/db.config.js";

export const Oficio = pool.define(
    'oficio', {
        oficio_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        oficio_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        oficio_invoice: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        deadline: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        accomplished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    {
        schema: "oficios"
    }
);

Oficio.addHook('afterFind', async (result) => {
    if (!result) return;

    const process = async (oficio) => {
        const statuses = [];

        if (oficio.accomplished) {
            statuses.push("atendido");
            oficio.setDataValue("status", statuses);
            return;
        }

        const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        const today = normalize(new Date());
        const dl = normalize(new Date(oficio.deadline));

        const diff = Math.floor((dl - today) / (1000 * 60 * 60 * 24));

        if (diff > 2) {
            statuses.push("pendiente");
        }

        if (diff >= 0 && diff <= 2) {
            statuses.push("por vencer");
        }

        if (diff < 0) {
            statuses.push("vencido");
        }

        const comments = await oficio.getComments();
        if (comments.length > 0) {
            statuses.push("en proceso");
        }

        oficio.setDataValue("status", statuses);
    };

    if (Array.isArray(result)) {
        await Promise.all(result.map(process));
    } else {
        await process(result);
    }
});