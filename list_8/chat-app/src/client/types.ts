export interface MessagePayload {
    room: string;
    user: string;
    text?: string;
    image?: string;
    date: number;
  }
  export interface SetNickResponse {
    success: boolean;
    message?: string;
    rooms?: string[];
  }
  export interface JoinRoomResponse {
    success: boolean;
    users: string[];
  }