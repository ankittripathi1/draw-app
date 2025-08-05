"use client";

import Card from "@repo/ui/card";
import { Users, Calendar, ExternalLink, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HTTP_BACKEND } from "@/config";
import { Room } from "@/types";
import axios from "axios";
import { Button, LoadingState } from "@/components/ui";

export default function DiscoverPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = rooms.filter((room) =>
        room.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchTerm, rooms]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${HTTP_BACKEND}/rooms/public`);
      setRooms(response.data || []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const joinRoom = (roomId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = `/signin?redirect=/canvas/${roomId}`;
      return;
    }
    window.location.href = `/canvas/${roomId}`;
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading your rooms..."
        description="Please wait while we fetch your drawing rooms"
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Discover Public Rooms
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Explore and join drawing rooms created by the community.
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              placeholder="Search by room name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-full bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <Card className="p-12 text-center bg-card rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <Users className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-2xl font-semibold">
                {searchTerm ? "No rooms found" : "No public rooms available"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchTerm
                  ? "Try adjusting your search terms to find other public rooms."
                  : "Why not be the first to create a public room and share your ideas with the world?"}
              </p>
              <Link href="/create-room">
                <Button variant="primary" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create a Public Room
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="p-6 bg-card rounded-lg hover:shadow-xl transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold truncate">
                      {room.slug}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(room.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{room._count?.chats || 0} participants</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => joinRoom(room.id)}
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Join Room
                </Button>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/">
            <Button variant="outline" className="bg-blue-600/90 hover:bg-blue-500 text-white border-0 group-hover:bg-blue-600 transition-all duration-200 py-3">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
