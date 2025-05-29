"use client";

import { WS_URL, HTTP_BACKEND } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { ShareRoomModal } from "./ShareRoomModal";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { RoomInfo } from "@/types";
import axios from "axios";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchRoomInfo = async () => {
      try {
        // Try to fetch by ID first, then by slug
        let response;
        try {
          response = await axios.get(`${HTTP_BACKEND}/room/${roomId}`);
        } catch {
          // If roomId is not a slug, it might be an ID - we need to handle this in backend
          // For now, just set a basic room info
          setRoomInfo({
            id: parseInt(roomId),
            slug: `Room ${roomId}`,
            createdAt: new Date().toISOString(),
            adminId: "",
          });
          return;
        }

        if (response.data.room) {
          setRoomInfo(response.data.room);
        }
      } catch {
        console.error("Failed to fetch room info");
        // Set basic info if fetch fails
        setRoomInfo({
          id: parseInt(roomId) || 0,
          slug: `Room ${roomId}`,
          createdAt: new Date().toISOString(),
          adminId: "",
        });
      }
    };

    // Fetch room info first
    fetchRoomInfo();

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomId,
      });
      console.log(data);
      ws.send(data);
      setLoading(false);
    };

    ws.onerror = () => {
      setError("Failed to connect to server");
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, [roomId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg">Connecting to room...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Setting up your collaborative canvas
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="p-8 text-center max-w-md">
          <div className="text-lg font-semibold text-red-600 mb-4">
            Connection Failed
          </div>
          <div className="text-muted-foreground mb-6">{error}</div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Link href="/rooms">
              <Button variant="outline" size="sm">
                Back to Rooms
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Connecting to server....</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Fullscreen Canvas */}
      <Canvas
        roomId={roomId}
        socket={socket}
        roomInfo={roomInfo}
        onShareRoom={() => setShowShareModal(true)}
      />

      {/* Share Modal */}
      <ShareRoomModal
        roomId={roomId}
        roomName={roomInfo?.slug || `Room ${roomId}`}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
