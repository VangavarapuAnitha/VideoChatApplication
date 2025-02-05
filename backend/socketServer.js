const { Server } = require("socket.io");
const io = new Server(5001, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("offer", (data) => {
        socket.broadcast.emit("offer", data);
    });

    socket.on("answer", (data) => {
        socket.broadcast.emit("answer", data);
    });

    socket.on("candidate", (data) => {
        socket.broadcast.emit("candidate", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

console.log("Socket.io server running on port 5001");
