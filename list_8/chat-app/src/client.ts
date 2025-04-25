import { io, Socket } from 'socket.io-client';

interface MessagePayload {
  room: string;
  user: string;
  text?: string;
  image?: string;
  date: number;
}

interface SetNickResponse {
  success: boolean;
  message?: string;
  rooms?: string[];
}
interface JoinRoomResponse {
  success: boolean;
  users: string[];
}

const socket: Socket = io();

const leaveBtn = document.getElementById('leave-btn') as HTMLButtonElement;
const currentRoomSpan = document.getElementById('current-room') as HTMLSpanElement;
const roomsContainer = document.getElementById('rooms') as HTMLDivElement;
const chatContainer = document.getElementById('chat') as HTMLDivElement;
const usersList = document.getElementById('users') as HTMLDivElement;
const messagesList = document.getElementById('messages') as HTMLDivElement;
const typingDiv = document.getElementById('typing') as HTMLDivElement;
const form = document.getElementById('form') as HTMLFormElement;
const input = document.getElementById('input') as HTMLInputElement;
const imgInput = document.getElementById('imgInput') as HTMLInputElement;
const imageModal = document.getElementById('image-modal') as HTMLDivElement;
const modalImg = document.getElementById('modal-img') as HTMLImageElement;

let currentRoom = '';
let nick = '';

function createUserElement(u: string): HTMLDivElement {
  const div = document.createElement('div');
  div.textContent = u + (u === nick ? ' (You)' : '');
  div.className = 'user';
  if (u !== nick) {
    div.onclick = () => {
      const text = prompt(`Private message to ${u}:`);
      if (!text) return;
      socket.emit('privateMessage', { to: u, from: nick, text, date: Date.now() });
      addMessage({ user: nick, text, date: Date.now(), private: true });
    };
  }
  return div;
}

function addMessage(msg: { user: string; text?: string; image?: string; date: number; private?: boolean }) {
  const div = document.createElement('div');
  const isMine = msg.user === nick;
  div.className = 'message ' + (isMine ? 'mine' : 'other') + (msg.private ? ' private' : '');

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent =
    (msg.private ? 'PM od ' : '') +
    `${msg.user} • ${new Date(msg.date).toLocaleTimeString()}`;
  div.appendChild(meta);

  if (msg.text) {
    const p = document.createElement('p');
    p.textContent = msg.text;
    div.appendChild(p);
  } else if (msg.image) {
    const img = document.createElement('img');
    img.src = 'data:image/jpeg;base64,' + msg.image;
    img.className = 'chat-img';
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      imageModal.style.display = 'flex';
    });
    div.appendChild(img);
  }

  messagesList.appendChild(div);
  messagesList.scrollTop = messagesList.scrollHeight;
}

function askNick(): void {
  const name = prompt('Enter your nickname:')?.trim();
  if (!name) return askNick();

  socket.emit('setNick', name, (res: SetNickResponse) => {
    if (!res.success) {
      alert(res.message);
      return askNick();
    }
    nick = name;
    renderRooms(res.rooms!);
  });
}

function renderRooms(rooms: string[]): void {
  roomsContainer.innerHTML = '';
  for (const roomName of rooms) {
    const btn = document.createElement('button');
    btn.textContent = roomName;
    btn.onclick = () => {
      socket.emit(
        'joinRoom',
        { room: roomName, user: nick },
        (res: JoinRoomResponse) => {
          currentRoom = roomName;
          currentRoomSpan.textContent = `Room: ${roomName}`;
          roomsContainer.style.display = 'none';
          chatContainer.style.display  = 'flex';
          messagesList.innerHTML = '';
          typingDiv.textContent = '';
          usersList.innerHTML = '';
          res.users.forEach(u => usersList.appendChild(createUserElement(u)));
        }
      );
    };
    roomsContainer.appendChild(btn);
  }
}

leaveBtn.onclick = () => {
  if (!currentRoom) return;
  socket.emit('leaveRoom', { room: currentRoom, user: nick });
  currentRoom = '';
  currentRoomSpan.textContent = '';
  messagesList.innerHTML = '';
  typingDiv.textContent = '';
  chatContainer.style.display  = 'none';
  roomsContainer.style.display = 'block';
};

socket.on('roomUsers', (users: string[]) => {
  usersList.innerHTML = '';
  users.forEach(u => usersList.appendChild(createUserElement(u)));
});
socket.on('userJoined', ({ user, room }) =>
  addMessage({ user: 'System', text: `${user} joined ${room}`, date: Date.now() })
);
socket.on('userLeft', ({ user, room }) =>
  addMessage({ user: 'System', text: `${user} left ${room}`, date: Date.now() })
);
socket.on('newMessage', (msg: MessagePayload) =>
  addMessage({ user: msg.user, text: msg.text, date: msg.date })
);
socket.on('newImage', (msg: MessagePayload) =>
  addMessage({ user: msg.user, image: msg.image, date: msg.date })
);
socket.on('userTyping', (user: string) => {
  typingDiv.textContent = `${user} is writing...`;
  setTimeout(() => (typingDiv.textContent = ''), 2000);
});
socket.on('privateMessage', ({ from, text, date }) =>
  addMessage({ user: from, text, date, private: true })
);

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || !currentRoom) return;
  socket.emit('sendMessage', { room: currentRoom, user: nick, text, date: Date.now() });
  input.value = '';
});
input.addEventListener('input', () => {
  if (currentRoom) socket.emit('typing', { room: currentRoom, user: nick });
});
imgInput.addEventListener('change', () => {
  const file = imgInput.files?.[0];
  if (!file || !currentRoom) return;
  const reader = new FileReader();
  reader.onload = () => {
    const b64 = (reader.result as string).split(',')[1];
    socket.emit('sendImage', { room: currentRoom, user: nick, image: b64, date: Date.now() });
  };
  reader.readAsDataURL(file);
});

imageModal.addEventListener('click', () => {
  imageModal.style.display = 'none';
  modalImg.src = '';
});

askNick();