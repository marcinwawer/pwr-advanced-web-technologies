import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';

interface ClientToServerEvents {
  setNick: (
    nick: string,
    callback: (res: { success: boolean; message?: string; rooms?: string[] }) => void
  ) => void;
  joinRoom: (
    data: { room: string; user: string },
    callback: (res: { success: boolean; users: string[] }) => void
  ) => void;
  leaveRoom: (data: { room: string; user: string }) => void;
  getRoomUsers: (room: string) => void;
  sendMessage: (payload: { room: string; user: string; text: string; date: number }) => void;
  typing: (data: { room: string; user: string }) => void;
  sendImage: (payload: { room: string; user: string; image: string; date: number }) => void;
  privateMessage: (data: { to: string; from: string; text: string; date: number }) => void;
}

interface ServerToClientEvents {
  roomUsers: (users: string[]) => void;
  userJoined: (data: { user: string; room: string; date: number }) => void;
  userLeft: (data: { user: string; room: string; date: number }) => void;
  newMessage: (payload: { room: string; user: string; text: string; date: number }) => void;
  userTyping: (user: string) => void;
  newImage: (payload: { room: string; user: string; image: string; date: number }) => void;
  privateMessage: (data: { from: string; text: string; date: number }) => void;
}

interface InterServerEvents {}
interface SocketData { user?: string }

const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer);

const PORT = process.env.PORT || 3000;
const rooms = ['general', 'random', 'tech', 'games'];

app.use(express.static(path.join(__dirname, '..', 'public')));

function getUsersInRoom(room: string): string[] {
  const sids = io.sockets.adapter.rooms.get(room) || new Set<string>();
  return Array.from(sids)
    .map(id => io.sockets.sockets.get(id)?.data.user)
    .filter((u): u is string => !!u);
}

io.on('connection', (socket) => {

  socket.on('setNick', (nick, callback) => {
    for (const [, s] of io.sockets.sockets) {
      if (s.data.user === nick) {
        return callback({ success: false, message: 'This nick is already in use.' });
      }
    }
    socket.data.user = nick;
    callback({ success: true, rooms });
    console.log(`user ${nick} connected`);
  });

  socket.on('joinRoom', ({ room, user }, callback) => {
    socket.join(room);
    const users = getUsersInRoom(room);
    callback({ success: true, users });
    socket.to(room).emit('userJoined', { user, room, date: Date.now() });
    io.to(room).emit('roomUsers', users);
  });

  socket.on('leaveRoom', ({ room, user }) => {
    socket.leave(room);
    const users = getUsersInRoom(room);
    io.to(room).emit('userLeft', { user, room, date: Date.now() });
    io.to(room).emit('roomUsers', users);
  });

  socket.on('disconnecting', () => {
    const user = socket.data.user ?? 'Unknown';
    for (const room of socket.rooms) {
      if (room === socket.id) continue;
      const users = getUsersInRoom(room);
      socket.to(room).emit('userLeft', { user, room, date: Date.now() });
      socket.to(room).emit('roomUsers', users);
    }
    console.log(`user ${user} disconnected`);
  });

  socket.on('getRoomUsers', (room) => {
    socket.emit('roomUsers', getUsersInRoom(room));
  });

  socket.on('sendMessage', payload => io.to(payload.room).emit('newMessage', payload));
  socket.on('typing', ({ room, user }) => socket.to(room).emit('userTyping', user));
  socket.on('sendImage', payload => io.to(payload.room).emit('newImage', payload));

  socket.on('privateMessage', ({ to, from, text, date }) => {
    for (const [, s] of io.sockets.sockets) {
      if (s.data.user === to) {
        s.emit('privateMessage', { from, text, date });
        break;
      }
    }
  });

});

httpServer.listen(PORT, () => {
  console.log(`server is live on http://localhost:${PORT}`);
});