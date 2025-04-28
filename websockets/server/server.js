const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const httpServer = createServer(app);

app.use("/uploads", express.static("uploads"));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const nickname = socket.handshake.query.nickname;
  console.log(`${nickname} connected`);

  let currentRoom = "general";

  socket.join(currentRoom);
  console.log(`${nickname} joined ${currentRoom}`);

  io.to(currentRoom).emit(
    "message",
    `${nickname} has joined room ${currentRoom}`
  );

  socket.on("switch_room", (newRoom) => {
    socket.leave(currentRoom);
    io.to(currentRoom).emit("message", `${nickname} has left the room`);

    currentRoom = newRoom;
    socket.join(currentRoom);

    io.to(currentRoom).emit(
      "message",
      `${nickname} has joined room ${currentRoom}`
    );
  });

  socket.on("send_message", (msg) => {
    io.to(currentRoom).emit("message", msg);
  });

  socket.on("typing", () => {
    socket.to(currentRoom).emit("typing", `${nickname} is typing...`);
  });

  socket.on("stop_typing", () => {
    socket.to(currentRoom).emit("stop_typing");
  });

  socket.on("send_image", (imageData) => {
    const buffer = Buffer.from(imageData.imageData.split(",")[1], "base64");
    const fileName = `${Date.now()}.png`;
    const filePath = path.join(__dirname, "uploads", fileName);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.log("Error saving image:", err);
        return;
      }
      console.log("Image saved:", filePath);

      io.to(currentRoom).emit("image_message", {
        id: imageData.id,
        author: imageData.author,
        date: imageData.date,
        type: "image",
        imgUrl: `http://localhost:3000/uploads/${fileName}`,
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(`${nickname} disconnected`);
    io.to(currentRoom).emit("message", `${nickname} has left the room`);
  });
});

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
