const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const httpServer = createServer(app);

const activeNicknames = new Set();
const nicknameToSocketId = new Map();
const socketIdToNickname = new Map();

const emitUserList = (room) => {
  const clients = io.sockets.adapter.rooms.get(room) || new Set();
  const users = [];
  for (let id of clients) {
    const nick = socketIdToNickname.get(id);
    if (nick) users.push(nick);
  }
  io.to(room).emit("update_user_list", users);
};

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

io.use((socket, next) => {
  const nickname = socket.handshake.query.nickname;
  if (!nickname) {
    return next(new Error("Nickname empty"));
  }
  if (activeNicknames.has(nickname)) {
    return next(new Error("NICK_IN_USE"));
  }
  next();
});

io.on("connection", (socket) => {
  const nickname = socket.handshake.query.nickname;
  
  activeNicknames.add(nickname);
  nicknameToSocketId.set(nickname, socket.id);
  socketIdToNickname.set(socket.id, nickname);
  
  console.log(`${nickname} connected`);

  let currentRoom = "general";

  socket.join(currentRoom);
  console.log(`${nickname} joined ${currentRoom}`);

  emitUserList(currentRoom);
  io.to(currentRoom).emit(
    "message",
    `${nickname} has joined room ${currentRoom}`
  );

  socket.on("switch_room", (newRoom) => {
    const oldRoom = currentRoom;
    socket.leave(oldRoom);
    io.to(oldRoom).emit("message", `${nickname} has left the room`);
    emitUserList(oldRoom);
  
    currentRoom = newRoom;
    socket.join(currentRoom);
    io.to(currentRoom).emit("message", `${nickname} has joined room ${currentRoom}`);
    emitUserList(currentRoom);
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

  socket.on("private_message", ({ to, message, id, date }) => {
    const targetSocketId = nicknameToSocketId.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("private_message", {
        id,
        author: nickname,
        date,
        message,
      });
      socket.emit("private_message", {
        id,
        author: nickname,
        date,
        message,
        to,
      });
    } else {
      socket.emit("error_message", `Użytkownik ${to} jest offline.`);
    }
  });

  socket.on("disconnect", () => {
    activeNicknames.delete(nickname);
    nicknameToSocketId.delete(nickname);
    socketIdToNickname.delete(socket.id);
  
    io.to(currentRoom).emit("message", `${nickname} has left the room`);
    emitUserList(currentRoom);
  });
});

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
