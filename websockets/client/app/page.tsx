"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const SOCKET_URL = "ws://localhost:3000";

type Message =
  | {
      id: string;
      author: string;
      message: string;
      date: string;
      type: "message";
    }
  | {
      id: string;
      author: string;
      date: string;
      imgUrl: string;
      type: "image";
    }
  | {
      id: string;
      author: string;
      to: string;
      message: string;
      date: string;
      type: "private";
    };

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState("general");
  const [messageHistory, setMessageHistory] = useState<(Message | string)[]>(
    []
  );
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const [privateRecipient, setPrivateRecipient] = useState<string | null>(
    null
  );
  const [someoneTyping, setSomeoneTyping] = useState("");
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!nickname) return;
    const s = io(SOCKET_URL, { query: { nickname } });
    s.on("connect_error", (err: Error) => {
      if (err.message === "NICK_IN_USE") {
        alert("This nick is already taken – choose another.");
        setNickname("");
        s.disconnect();
      }
    });
    s.on("message", (arg) => {
      setMessageHistory((prev) => [...prev, arg]);
    });
    s.on("typing", (arg) => {
      setSomeoneTyping(arg);
    });
    s.on("stop_typing", () => {
      setSomeoneTyping("");
    });
    s.on("image_message", (data) => {
      setMessageHistory((prev) => [...prev, data]);
    });
    s.on("update_user_list", (users: string[]) => {
      setUsersOnline(users);
    });
    s.on("private_message", (data) => {
      setMessageHistory((prev) => [...prev, { ...data, type: "private" }]);
    });
    s.on("error_message", (msg: string) => {
      alert(msg);
    });
    socket.current = s;
    return () => {
      s.disconnect();
      socket.current = null;
    };
  }, [nickname]);

  const changeRoom = (roomSelected: string) => {
    if (roomSelected !== room) {
      setMessageHistory([]);
      setPrivateRecipient(null);
      setRoom(roomSelected);
      socket.current?.emit("switch_room", roomSelected);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && socket.current) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.current?.emit("send_image", {
          id: crypto.randomUUID(),
          author: nickname,
          date: new Date(),
          type: "image",
          imageData: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (text: string) => {
    const id = crypto.randomUUID();
    const date = new Date().toISOString();
    if (privateRecipient) {
      if (privateRecipient === nickname) {
        alert("You cannot send a private message to yourself.");
        setPrivateRecipient(null);
        return;
      }
      socket.current?.emit("private_message", {
        to: privateRecipient,
        message: text,
        id,
        date,
      });
    } else {
      socket.current?.emit("send_message", {
        id,
        author: nickname,
        date,
        message: text,
        type: "message",
      });
    }
    socket.current?.emit("stop_typing");
  };

  if (!nickname) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <form
          className="flex flex-col items-center gap-8 w-1/4"
          action={(formData: FormData) => {
            const nicknameInput = formData.get("nickname");
            if (!nicknameInput) {
              alert("Nickname is required");
              return;
            }
            setNickname(nicknameInput as string);
          }}
        >
          <Input name="nickname" placeholder="Enter your nickname" />
          <Button type="submit">Join chat!</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col items-center gap-8 p-4">
        <h1 className="text-3xl font-bold">Simple chat based on websockets</h1>
        <div className="flex gap-4">
          <Button
            disabled={room === "general"}
            onClick={() => changeRoom("general")}
          >
            general
          </Button>
          <Button
            disabled={room === "tech"}
            onClick={() => changeRoom("tech")}
          >
            tech
          </Button>
          <Button
            disabled={room === "discussion"}
            onClick={() => changeRoom("discussion")}
          >
            discussion
          </Button>
        </div>
      </div>
      <div className="p-4 bg-gray-100">
        <h2 className="font-semibold">Users online in room {room}:</h2>
        <ul className="flex gap-2">
          {usersOnline
            .filter((user) => user !== nickname)
            .map((user) => (
              <li key={user}>
                <button
                  className={`px-2 py-1 border rounded ${
                    privateRecipient === user
                      ? "bg-blue-200"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() =>
                    setPrivateRecipient((prev) => (prev === user ? null : user))
                  }
                >
                  {user}
                </button>
              </li>
            ))}
        </ul>
        {privateRecipient && (
          <div className="mt-2 text-sm text-blue-700">
            Private message to: <strong>{privateRecipient}</strong>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto px-56">
        <div className="flex flex-col gap-4 items-center w-full">
          {messageHistory.map((message, index) =>
            typeof message === "string" ? (
              <div key={index}>{message}</div>
            ) : message.type === "message" ? (
              <Card
                key={message.id}
                className={`w-[350px] ${
                  message.author === nickname
                    ? "self-end bg-blue-100"
                    : "self-start bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle>{message.author}</CardTitle>
                  <CardDescription>
                    {new Date(message.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent
                  className={
                    message.author === nickname ? "text-blue-800" : ""
                  }
                >
                  {message.message}
                </CardContent>
              </Card>
            ) : message.type === "image" ? (
              <Card
                key={message.id}
                className={`w-[350px] ${
                  message.author === nickname
                    ? "self-end bg-blue-100"
                    : "self-start bg-white"
                }`}
              >
                <CardHeader>
                  <CardTitle>{message.author}</CardTitle>
                  <CardDescription>
                    {new Date(message.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={message.imgUrl}
                    alt="Shared image"
                    className="max-w-full h-auto"
                    unoptimized
                    width={350}
                    height={350}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card
                key={message.id}
                className={`w-[350px] ${
                  message.author === nickname
                    ? "self-end bg-purple-100"
                    : "self-start bg-gray-100"
                }`}
              >
                <CardHeader>
                  <CardTitle>
                    {message.author} → {message.to}
                  </CardTitle>
                  <CardDescription>
                    {new Date(message.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>{message.message}</CardContent>
              </Card>
            )
          )}
        </div>
        {someoneTyping !== "" && <span className="py-2">{someoneTyping}</span>}
      </div>
      <div className="w-full bg-background p-4 border-t">
        <div className="max-w-md mx-auto space-y-4">
          <form
            className="grid w-full items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              const fileInput = e.currentTarget.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement;
              if (fileInput.files?.length) {
                handleImageUpload({
                  target: fileInput,
                } as React.ChangeEvent<HTMLInputElement>);
                fileInput.value = "";
              }
            }}
          >
            <Label htmlFor="picture">Upload image </Label>
            <div className="flex gap-2">
              <Input id="picture" type="file" accept="image/*" />
              <Button type="submit">Send</Button>
            </div>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.message as HTMLInputElement;
              if (input.value) {
                handleSend(input.value);
                input.value = "";
              }
            }}
            className="flex gap-4"
          >
            <Input
              name="message"
              placeholder="Enter your message"
              onChange={(e) => {
                if (e.target.value !== "") {
                  socket.current?.emit("typing");
                } else {
                  socket.current?.emit("stop_typing");
                }
              }}
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}