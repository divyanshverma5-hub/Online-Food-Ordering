import { io } from "socket.io-client";

let socket = null;

export function connectSocket() {

    if (socket) return socket;

    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("id");

    if (!role || !userId) {
        return null;
    }

    socket = io("http://localhost:3000", { transports: ["websocket"] });

    socket.on("connect", () => {
        console.log("✅ Socket Connected");

        socket.emit("register", {
            userId,
            role
        });

    });

    socket.on("disconnect", () => {
        console.log("❌ Socket Disconnected");
    });

    return socket;
}

export function getSocket() {
    return socket;
}