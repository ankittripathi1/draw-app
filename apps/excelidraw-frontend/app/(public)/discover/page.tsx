"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Users, Calendar, ExternalLink, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HTTP_BACKEND } from "@/config";
import { Room } from "@/types";
import axios from "axios";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Discover Rooms
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore and join drawing rooms created by the community
            </p>
          </div>
          <Link href="/create-room">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Room
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">
                {searchTerm ? "No rooms found" : "No rooms available"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Be the first to create a drawing room for others to discover"}
              </p>
              {!searchTerm && (
                <Link href="/create-room">
                  <Button variant="primary" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Room
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold truncate">
                    {room.slug}
                  </h3>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Created {formatDate(room.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-sm text-muted-foreground">Hello</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => joinRoom(room.id)}
                    variant="primary"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Join Room
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
