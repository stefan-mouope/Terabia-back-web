// src/pages/VendorDashboard.tsx

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageCircle, Send } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";

import VendorStats from "./features/seller/VendorStats";
import ProductList from "./features/seller/ProductList";
import ProductFormModal from "./features/seller/ProductFormModal";
import type { Product } from "@/api/products";

export default function VendorDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();

  // === Gestion des produits ===
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const refreshData = () => setRefreshTrigger((prev) => prev + 1);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditingProduct(null);
  };

  // === Messagerie ===
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Charger les conversations du vendeur
  useEffect(() => {
    if (!user?.id) return;

    fetch("/api/messages/conversations", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setConversations(data.conversations);
      });
  }, [user?.id]);

  // Ouvrir une conversation
  const openConversation = (buyerId: string) => {
    setSelectedBuyer(buyerId);
    fetch(`/api/messages/conversation/${buyerId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setMessages(data.messages);
      });
  };

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


  
  // Envoyer un message
  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !selectedBuyer) return;

    socket.emit("privateMessage", {
      toUserId: selectedBuyer,
      message: newMessage.trim(),
      orderId: null,
    });

    setNewMessage("");
  };

  // Protection d'accès
  if (user?.role !== "seller") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-2xl font-bold text-red-600">
          Accès refusé – Réservé aux vendeurs
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* En-tête */}
        <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Tableau de bord vendeur
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Bonjour, {user?.name ?? "Vendeur"}
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            size="lg"
            className="shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un produit
          </Button>
        </div>

        {/* === SECTION 1 : Statistiques === */}
        <div className="mb-12">
          <VendorStats key={refreshTrigger} />
        </div>

        {/* === SECTION 2 : Produits + Messagerie côte à côte === */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Mes produits</h2>
            <ProductList
              key={`list-${refreshTrigger}`}
              onEdit={handleEdit}
              onRefresh={refreshData}
            />
          </div>

          {/* Messagerie */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MessageCircle className="h-6 w-6" />
                  Messages clients
                  {conversations.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {conversations.reduce((acc, c) => acc + (c.unread || 0), 0)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 flex flex-col flex-1">
                {/* Liste des conversations */}
                <ScrollArea className="flex-1">
                  {conversations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">
                      Aucun message pour l'instant
                    </p>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.buyer_id}
                        onClick={() => openConversation(conv.buyer_id)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                          selectedBuyer === conv.buyer_id ? "bg-primary/10" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="text-sm">
                              {conv.buyer_name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {conv.buyer_name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {conv.last_message || "Nouveau message"}
                            </p>
                          </div>
                          {conv.unread > 0 && (
                            <Badge variant="destructive">{conv.unread}</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>

                {/* Chat ouvert */}
                {selectedBuyer && (
                  <div className="border-t">
                    <ScrollArea className="h-64 p-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`mb-4 flex ${
                            msg.from === user?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl max-w-xs ${
                              msg.from === user?.id
                                ? "bg-primary text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>

                    <div className="p-4 border-t flex gap-2">
                      <Input
                        placeholder="Répondre..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <Button onClick={sendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal produit */}
      <ProductFormModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        onSuccess={refreshData}
        product={editingProduct}
      />

      <Footer />
    </div>
  );
}