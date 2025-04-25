export interface ClientToServerEvents {
    setNick(
      nick: string,
      callback: (res: { success: boolean; message?: string; rooms?: string[] }) => void
    ): void;
    joinRoom(
      data: { room: string; user: string },
      callback: (res: { success: boolean; users: string[] }) => void
    ): void;
    leaveRoom(data: { room: string; user: string }): void;
    getRoomUsers(room: string): void;
    sendMessage(payload: { room: string; user: string; text: string; date: number }): void;
    typing(data: { room: string; user: string }): void;
    sendImage(payload: { room: string; user: string; image: string; date: number }): void;
    privateMessage(data: { to: string; from: string; text: string; date: number }): void;
  }
  export interface ServerToClientEvents {
    roomUsers(users: string[]): void;
    userJoined(data: { user: string; room: string; date: number }): void;
    userLeft(data: { user: string; room: string; date: number }): void;
    newMessage(payload: { room: string; user: string; text: string; date: number }): void;
    userTyping(user: string): void;
    newImage(payload: { room: string; user: string; image: string; date: number }): void;
    privateMessage(data: { from: string; text: string; date: number }): void;
  }
  export interface InterServerEvents {}
  export interface SocketData { user?: string }