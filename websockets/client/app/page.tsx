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
  | { id: string; author: string; date: string; imgUrl: string; type: "image" };

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [messageHistory, setMessageHistory] = useState<(Message | string)[]>(
    []
  );
  const [room, setRoom] = useState("general");
  const socket = useRef<Socket | null>(null);
  const [someoneTyping, setSomeoneTyping] = useState("");

  useEffect(() => {
    if (!nickname) {
      return;
    }
    socket.current = io(SOCKET_URL, {
      query: {
        nickname: nickname,
      },
    });
    socket.current.on("connect_error", (err: Error) => {
      if (err.message === "NICK_IN_USE") {
        alert("This nick is already taken – choose another.");
        setNickname("");
        socket.current?.disconnect();
      } else {
        console.error("Connection error:", err);
      }
    });
    socket.current.on("message", (arg) => {
      setMessageHistory((prev) => [...prev, arg]);
    });
    socket.current.on("typing", (arg) => {
      setSomeoneTyping(arg);
    });
    socket.current.on("stop_typing", () => {
      setSomeoneTyping("");
    });
    socket.current.on("image_message", (data) => {
      setMessageHistory((prev) => [...prev, data]);
    });
  }, [nickname]);

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

  const changeRoom = (roomSelected: string) => {
    if (roomSelected !== room) {
      setMessageHistory([]);
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
          <Button disabled={room === "tech"} onClick={() => changeRoom("tech")}>
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
      <div className="flex-1 overflow-auto px-56">
        <div className="flex flex-col gap-4 items-center w-full">
          {messageHistory.map((message, index) =>
            typeof message === "string" ? (
              <div key={index}>{message}</div>
            ) : message.type === "message" ? (
              <Card
                className={`w-[350px] ${
                  message.author === nickname ? "self-end" : "self-start"
                }`}
                key={message.id}
              >
                <CardHeader>
                  <CardTitle>{message.author}</CardTitle>
                  <CardDescription>
                    {new Date(message.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>{message.message}</CardContent>
              </Card>
            ) : (
              <Card
                className={`w-[350px] ${
                  message.author === nickname ? "self-end" : "self-start"
                }`}
                key={message.id}
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
            action={(formData: FormData) => {
              const input = formData.get("message");
              if (input && socket.current) {
                socket.current.emit("send_message", {
                  id: crypto.randomUUID(),
                  author: nickname,
                  date: new Date(),
                  message: input,
                  type: "message",
                });
                socket.current.emit("stop_typing");
              }
            }}
            className="flex gap-4"
          >
            <Input
              name="message"
              placeholder="Enter your message"
              onChange={(e) => {
                if (e.target.value !== "" && socket.current) {
                  socket.current.emit("typing");
                } else if (e.target.value === "" && socket.current) {
                  socket.current.emit("stop_typing");
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
