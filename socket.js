import { Server } from "socket.io";

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: true,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User Connected ", socket.id);

        socket.on("disconnect", () => {
            console.log("User Disconnected ", socket.id);
        });
    });
}

export default initializeSocket;