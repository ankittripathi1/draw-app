"use client";

import { Button } from "@/components/ui/Button";
import Card from "@repo/ui/card";
import { ArrowLeft, Plus, Users, Sparkles, PenTool } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export default function CreateRoomPage() {
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
      console.log(token);

      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        {
          name: roomName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Room created successfully:", response.data);
      console.log(response);
      if (response.data.roomId) {
        window.location.href = `/canvas/${response.data.roomId}`;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create room";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const quickTemplates = [
    {
      name: "Team Brainstorm",
      description: "Collaborative ideation session",
      icon: Sparkles,
    },
    {
      name: "Project Planning",
      description: "Organize tasks and workflows",
      icon: Users,
    },
    {
      name: "Design Review",
      description: "Gather feedback on designs",
      icon: PenTool,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/rooms">
            <Button variant="outline" >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Room
          </h1>
          <p className="text-muted-foreground mt-2">
            Set up a collaborative drawing space for your team
          </p>
        </div>

        {/* Room Creation Form */}
        <Card className="p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Room Name
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive name for your room..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                maxLength={50}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {roomName.length}/50 characters
              </div>
            </div>{" "}
            <div className="pt-4 border-t">
              <Button
                onClick={createRoom}
                variant="primary"
                className={`w-full ${loading || !roomName.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Creating..." : "Create Room"}
                <Plus className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Templates */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Start Templates</h3>
          <div className="grid gap-3">
            {quickTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => {
                  setRoomName(template.name);
                }}
                className="p-4 border border-border rounded-lg text-left hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <template.icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {template.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
