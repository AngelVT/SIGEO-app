import { Server } from "socket.io";
import { verifySocketToken } from "./jwt.socket.js";
import { SIGEO_SECRET_COOKIE } from "../config/env.config.js";
import cookie from "cookie";
import signature from "cookie-signature";

let io;

export async function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const rawCookie = socket.request.headers.cookie;
            if (!rawCookie) return next(new Error("No cookies"));

            const cookies = cookie.parse(rawCookie);

            const token = cookies["access_token"];
            if (!token) return next(new Error("No signed cookie"));

            if (token.substr(0, 2) !== "s:")
            return next(new Error("Cookie is not signed"));

            const unsignedToken = signature.unsign(token.slice(2), SIGEO_SECRET_COOKIE);

            if (!unsignedToken)
            return next(new Error("Invalid signature"));

            const payload = await verifySocketToken(unsignedToken);

            if (!payload) {
                socket.emit("auth_error", { message: "Invalid or expired token" });
                return socket.disconnect(true);
            }

            socket.user = payload;

            next();

        } catch (error) {
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", socket => {
        const roles = ['system', 'admin'];

        const { user_uuid, group, role } = socket.user;

        socket.join(`user_${user_uuid}`);

        socket.join(`oficios_${group}`);

        if (group === 'SYSTEM' || group === 'DG' && roles.includes(role)) {
            socket.join('oficios_admin');
        }

        socket.on("disconnect", () => {
            //console.log("Client disconnected:", socket.id);
        });
    });
}

export function getIO() {
    return io;
}