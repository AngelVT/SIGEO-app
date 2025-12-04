import { DataTypes } from "sequelize";
import { pool } from "../../../config/db.config.js";

export const Comment = pool.define(
    'comment', {
        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        comment_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        comment_txt: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{
        schema: 'oficios'
    }
);