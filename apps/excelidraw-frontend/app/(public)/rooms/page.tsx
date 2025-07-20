"use client";

import { Button } from "@/components/ui/Button";
import Card from "@repo/ui/card";
import { Plus, Users, Calendar, ExternalLink, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HTTP_BACKEND } from "@/config";
import { Room } from "@/types";
import { LoadingState, ErrorState } from "@/components/ui/LoadingStates";
import { PageHeader, EmptyState, Container } from "@/components/ui/Layout";
import axios from "axios";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [joinRoomSlug, setJoinRoomSlug] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  useEffect(() => {
    fetchUserRooms();
  }, []);

  const fetchUserRooms = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data.rooms || []);
    } catch (error: unknown) {
      console.error("Failed to fetch rooms:", error);
      setError("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    setCreateLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: newRoomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.roomId) {
        window.location.href = `/canvas/${response.data.roomId}`;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create room";
      alert(errorMessage);
    } finally {
      setCreateLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!joinRoomSlug.trim()) return;

    try {
      const response = await axios.get(`${HTTP_BACKEND}/room/${joinRoomSlug}`);
      if (response.data.room) {
        window.location.href = `/canvas/${response.data.room.id}`;
      } else {
        alert("Room not found");
      }
    } catch {
      alert("Room not found or error occurred");
    }
  };

  const copyRoomLink = (roomSlug: string) => {
    const link = `${window.location.origin}/canvas/${roomSlug}`;
    navigator.clipboard.writeText(link);
    alert("Room link copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading your rooms..."
        description="Please wait while we fetch your drawing rooms"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchUserRooms}
        retryText="Reload Rooms"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <PageHeader
          title="My Drawing Rooms"
          description="Create new rooms or join existing ones to start collaborating"
          action={
            <div className="flex gap-3">
              <Button
                onClick={() => setShowJoinForm(true)}
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
                Join Room
              </Button>
              <Link href="/create-room">
                <Button >
                  <Plus className="h-4 w-4" />
                  Create Room
                </Button>
              </Link>
            </div>
          }
        />

        {/* Quick Actions */}
        {(showCreateForm || showJoinForm) && (
          <Card className="p-6 mb-8">
            {showCreateForm && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Create New Room</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter room name..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                    onKeyPress={(e) => e.key === "Enter" && createRoom()}
                  />
                  <Button onClick={createRoom} >
                    {createLoading ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {showJoinForm && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Join Existing Room
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter room slug or ID..."
                    value={joinRoomSlug}
                    onChange={(e) => setJoinRoomSlug(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                    onKeyPress={(e) => e.key === "Enter" && joinRoom()}
                  />
                  <Button onClick={joinRoom}>Join</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowJoinForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <Card className="border-dashed border-2">
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="No rooms yet"
              description="Create your first drawing room to start collaborating with your team"
              action={
                <Link href="/create-room">
                  <Button variant="primary" >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Room
                  </Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold truncate">
                    {room.slug}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyRoomLink(room.id.toString())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Created {formatDate(room.createdAt)}
                  </div>
                  {room._count && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {room._count.chats} messages
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/canvas/${room.id}`} className="flex-1">
                    <Button variant="primary" >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Room
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" >
              Back to Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
