// src/pages/features/buyer/ProductDetailPage.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Send,
  ShoppingCart,
  User,
  MapPin,
  Package,
} from "lucide-react";

import { getProductById } from "@/api/products";
import { useCart } from "@/store/cartStore";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  created_at: string;
  sender_name?: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { addItem } = useCart();
  const { socket } = useSocket();
  const { user } = useAuth();

  // Charger le produit
  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then((res) => {
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          setProduct(null);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Charger l'historique des messages
  useEffect(() => {
    if (!product?.seller_id || !user?.id) return;

    fetch(`/api/messages/conversation/${product.seller_id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error("Erreur chargement messages:", err));
  }, [product?.seller_id, user?.id]);

  // Réception des nouveaux messages en temps réel
  useEffect(() => {
    if (!socket || !product?.seller_id || !user?.id) return;

    const handleNewMessage = (msg: Message) => {
      if (
        (msg.from === product.seller_id && msg.to === user.id) ||
        (msg.from === user.id && msg.to === product.seller_id)
      ) {
        setMessages((prev) => {
          // Évite les doublons
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, product?.seller_id, user?.id]);

  // Envoyer un message
  const sendMessage = () => {
    if (!socket || !message.trim() || !product?.seller_id || !user?.id) return;

    socket.emit("privateMessage", {
      toUserId: product.seller_id,
      message: message.trim(),
      orderId: null,
    });

    setMessage("");
  };

  // Ajouter au panier
  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "/placeholder.jpg",
      seller_name:
        product.seller?.name || product.seller_name || "Vendeur inconnu",
      seller_id: product.seller_id || product.seller?.id,
      quantity: 1,
    });

    alert(`${product.title} ajouté au panier !`);
  };

  // États de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
        <Package className="w-20 h-20 text-gray-400" />
        <h2 className="text-3xl font-bold text-gray-800">Produit non trouvé</h2>
        <Button asChild size="lg">
          <Link to="/catalog">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour au catalogue
          </Link>
        </Button>
      </div>
    );
  }

  const sellerName =
    product.seller?.name ||
    product.seller_name ||
    product.seller?.phone ||
    "Vendeur";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/catalog" className="flex items-center gap-2 text-lg">
            <ArrowLeft className="h-5 w-5" />
            Retour au catalogue
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl">
            <img
              src={product.images?.[0] || "/placeholder.jpg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4 text-lg px-5 py-2">
                Stock limité ({product.stock})
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4 text-lg px-5 py-2">
                Rupture de stock
              </Badge>
            )}
          </div>

          {/* Infos + Chat */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {product.title}
              </h1>
                <p className="text-4xl font-bold text-primary mt-4">
                  {(product.price ?? 0).toLocaleString()} FCFA
                  {product.unit && (
                    <span className="text-2xl text-gray-600 font-normal ml-2">
                      /{product.unit}
                    </span>
                  )}
                </p>

            </div>

            <div className="space-y-4 text-lg">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                <span>Vendu par <strong className="text-xl">{sellerName}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-gray-700">
                  {product.location_city || "Yaoundé"}
                </span>
              </div>
            </div>

            {product.description && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <Separator />

            <Button
              size="lg"
              className="w-full text-xl py-7"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-3 h-6 w-6" />
              {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </Button>

            {/* CHAT */}
            <Card className="border-2">
              <CardContent className="p-0">
                <div className="p-5 border-b bg-gradient-to-r from-primary/5 to-primary/10 flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-4 ring-white">
                    <AvatarFallback className="text-lg font-bold bg-primary text-white">
                      {sellerName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">Chat avec {sellerName}</p>
                    <p className="text-sm text-green-600 font-medium">En ligne</p>
                  </div>
                </div>

               <ScrollArea className="h-80 p-5">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground mt-10">
                        Démarrez la conversation
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`mb-5 flex ${
                            msg.from === user?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-5 py-3 rounded-2xl max-w-xs lg:max-w-md shadow-md ${
                              msg.from === user?.id
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="font-medium break-words">{msg.message}</p>
                            <p
                              className={`text-xs mt-2 ${
                                msg.from === user?.id ? "text-white/70" : "text-gray-500"
                              }`}
                            >
                              {msg.created_at
                                ? new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "--:--"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </ScrollArea>


                <div className="p-5 border-t bg-gray-50">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Posez une question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="text-base"
                    />
                    <Button
                      onClick={sendMessage}
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      disabled={!message.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}