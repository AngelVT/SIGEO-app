import { pool } from "../../../config/db.config.js";
import { DataTypes } from "sequelize";

export const OficioEmitted = pool.define(
    'emitted_oficio', {
        emitted_of_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        emitted_of_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        emitted_of_invoice: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        invoice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        emission_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reception_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        is_response: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        file: {
            type: DataTypes.VIRTUAL,
            get() {
                return `/oficios/emitidos/${this.emitted_of_invoice}.pdf`
            }
        }
    },
    {
        schema: "oficios"
    }
);
