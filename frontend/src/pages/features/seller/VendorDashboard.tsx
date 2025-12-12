// src/pages/VendorDashboard.tsx  (remplace ou ajoute cette section)

import { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Badge } from "lucide-react";

export default function VendorDashboard() {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]); // toutes les convs
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Charger toutes les conversations du vendeur
  useEffect(() => {
    if (!user?.id) return;

    fetch("/api/messages/conversations", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.success) setConversations(data.conversations);
      });
  }, [user?.id]);

  // Charger les messages quand on clique sur un acheteur
  const openConversation = (buyerId: string) => {
    setSelectedBuyer(buyerId);
    fetch(`/api/messages/conversation/${buyerId}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.success) setMessages(data.messages);
      });
  };

  // Réception en temps réel
   // Réception en temps réel des nouveaux messages
  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleNewMessage = (msg: any) => {
      // Si le message est destiné au vendeur (msg.to === vendeur)
      if (msg.to === user.id) {
        setMessages((prev) => {
          // Évite les doublons
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        // Notification sonore (optionnel)
        new Audio("/notification.mp3").play().catch(() => {});
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup CORRECT
    return () => {
      socket.off("newMessage", handleNewMessage); // LES () ICI !
    };
  }, [socket, user?.id]);


  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !selectedBuyer) return;

    socket.emit("privateMessage", {
      toUserId: selectedBuyer,
      message: newMessage.trim(),
      orderId: null,
    });

    setNewMessage("");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-10">Tableau de bord vendeur</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Messages ({conversations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {conversations.map((conv) => (
                <div
                  key={conv.buyer_id}
                  onClick={() => openConversation(conv.buyer_id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedBuyer === conv.buyer_id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{conv.buyer_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{conv.buyer_name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.last_message}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="ml-auto">{conv.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Zone de chat */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedBuyer ? "Discussion en cours" : "Sélectionnez une conversation"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.from === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-xs lg:max-w-md ${
                      msg.from === user?.id ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </ScrollArea>

            {selectedBuyer && (
              <div className="p-4 border-t flex gap-3">
                <Input
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}