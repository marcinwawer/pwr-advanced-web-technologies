import { Server } from 'socket.io';
import { SocketData } from './types';

export const rooms = ['general', 'random', 'tech', 'games'];

export function getUsersInRoom(io: Server<any, any, any, SocketData>, room: string): string[] {
  const sids = io.sockets.adapter.rooms.get(room) || new Set<string>();
  return Array.from(sids)
    .map(id => io.sockets.sockets.get(id)?.data.user)
    .filter((u): u is string => !!u);
}