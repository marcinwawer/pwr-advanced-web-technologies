import { Server, Socket } from 'socket.io';
import { rooms, getUsersInRoom } from './utils';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
} from './types';

export function registerSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) {
  io.on(
    'connection',
    (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
      socket.on('setNick', (nick, callback) => {
        for (const [, s] of io.sockets.sockets) {
          if (s.data.user === nick) {
            return callback({ success: false, message: 'This nick is already in use.' });
          }
        }
        socket.data.user = nick;
        callback({ success: true, rooms });
      });

      socket.on('joinRoom', ({ room, user }, callback) => {
        socket.join(room);
        const users = getUsersInRoom(io, room);
        callback({ success: true, users });
        socket.to(room).emit('userJoined', { user, room, date: Date.now() });
        io.to(room).emit('roomUsers', users);
      });

      socket.on('leaveRoom', ({ room, user }) => {
        socket.leave(room);
        const users = getUsersInRoom(io, room);
        io.to(room).emit('userLeft', { user, room, date: Date.now() });
        io.to(room).emit('roomUsers', users);
      });

      socket.on('disconnecting', () => {
        const user = socket.data.user ?? 'Unknown';
        for (const room of socket.rooms) {
          if (room === socket.id) continue;
          const users = getUsersInRoom(io, room);
          socket.to(room).emit('userLeft', { user, room, date: Date.now() });
          socket.to(room).emit('roomUsers', users);
        }
      });

      socket.on('getRoomUsers', room => {
        socket.emit('roomUsers', getUsersInRoom(io, room));
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
    }
  );
}