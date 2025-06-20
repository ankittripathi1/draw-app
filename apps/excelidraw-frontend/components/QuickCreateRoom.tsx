"use client";

import { Button } from "@/components/ui/Button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

interface QuickCreateRoomProps {
  onRoomCreated?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function QuickCreateRoom({
  onRoomCreated,
  onCancel,
  className = "",
}: QuickCreateRoomProps) {
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState("");

  const createRoom = async () => {
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.roomId) {
        if (onRoomCreated) {
          onRoomCreated();
        } else {
          window.location.href = `/canvas/${response.data.roomId}`;
        }
        setRoomName("");
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to create room";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">Create New Room</h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Room Name</label>
          <input
            type="text"
            placeholder="Enter room name..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === "Enter" && createRoom()}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={createRoom}
            variant="primary"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {loading ? "Creating..." : "Create Room"}
          </Button>

          {onCancel && (
            <Button onClick={onCancel} variant="outline" >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
