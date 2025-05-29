"use client";

import { Button } from "@repo/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

interface QuickCreateRoomProps {
  onRoomCreated?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function QuickCreateRoom({ onRoomCreated, onCancel, className = "" }: QuickCreateRoomProps) {
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
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">Create New Room</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Room Name
          </label>
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
            size="lg"
            className={`flex items-center gap-2 ${loading || !roomName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {loading ? "Creating..." : "Create Room"}
          </Button>
          
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: randomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.roomId) {
        window.location.href = `/canvas/${response.data.roomId}`;
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className={`flex gap-3 ${className}`}>
        <Button 
          onClick={handleQuickCreate} 
          disabled={loading}
          size="lg"
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Quick Start
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowForm(true)}
          size="lg"
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Custom Room
        </Button>
      </div>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3">Create New Room</h3>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter room name..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
          onKeyPress={(e) => e.key === "Enter" && createRoom()}
          autoFocus
        />
        <Button onClick={createRoom} disabled={loading || !roomName.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
        </Button>
        <Button variant="outline" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}

export default QuickCreateRoom;
