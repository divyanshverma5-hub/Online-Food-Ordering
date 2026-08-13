import { Server } from "socket.io";

let io;

export function initializeSocket(server) {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log("Socket Connected:", socket.id);

        socket.on("register", ({ userId, role }) => {

            const room = `${role}_${userId}`;
            socket.join(room);
            console.log(`${room} joined`);

        });

        socket.on("disconnect", () => {
            console.log("Socket Disconnected:", socket.id);
        });

    });

}

export function emitToUser(role, userId, eventName, data) {

    if (!io) return;

    console.log(`Emitting ${eventName} to ${role}_${userId}`);
    const room = `${role}_${userId}`;

    console.log("EMITTING:", { room, eventName, data });

    console.log("ROOM SIZE:", io.sockets.adapter.rooms.get(room)?.size || 0);
    io.to(room).emit(eventName, data);
}