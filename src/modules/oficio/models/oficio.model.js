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
        true_invoice: {
            type: DataTypes.STRING,
            defaultValue: '-',
            allowNull: false,
        },
        invoice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reception_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        accomplished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        response_required: {
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

        const { deadline, accomplished, oficio_id, group_id } = oficio;

        if(oficio_id && group_id) {
            const { group } = await oficio.getGroup({raw: true});
            const { oficio_invoice } = oficio;
            
            oficio.setDataValue("file", `/oficios/${group}/${oficio_invoice}.pdf`);
        }

        if (accomplished && typeof accomplished !== 'undefined') {
            statuses.push("atendido");
            oficio.setDataValue("status", statuses);
            return;
        }

        const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        if (deadline) {
            const today = normalize(new Date());
            const dl = normalize(new Date(deadline));

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
        }

        if (statuses.length > 0) {
            oficio.setDataValue("status", statuses);
        }
    };

    if (Array.isArray(result)) {
        await Promise.all(result.map(process));
    } else {
        await process(result);
    }
});