// src/components/ChatWindow.tsx
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: number;
  senderId: string;
  message: string;
  created_at: string;
}

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  orderId?: number;
}

export default function ChatWindow({ receiverId, receiverName, orderId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { socket } = useSocket();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: Message) => {
      if (
        (msg.senderId === receiverId && msg.receiverId === user?.id) ||
        (msg.senderId === user?.id && msg.receiverId === receiverId)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, receiverId, user?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !user) return;

    socket.emit("send_message", {
      senderId: user.id,
      receiverId,
      message: input,
      orderId,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-96 bg-card rounded-lg border">
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{receiverName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{receiverName}</p>
          <p className="text-xs text-green-600">En ligne</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`mb-4 flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.senderId === user?.id ? "bg-primary text-white" : "bg-muted"
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Écrivez un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}