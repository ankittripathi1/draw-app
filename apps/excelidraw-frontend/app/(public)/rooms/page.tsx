"use client";
import { Button, LoadingState, ErrorState, PageHeader, EmptyState, Container, MainContent } from "@/components/ui";
import Card from "@repo/ui/card";
import { 
  Plus, Users, Calendar, ExternalLink, Copy, Palette, MessageCircle, Clock, 
  ArrowRight, Search, Filter, Globe, Lock, Crown, MoreVertical, Star,
  Grid3X3, List, Settings, Trash2
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { Room } from "@/types";
import { HTTP_BACKEND } from "@/config";

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'public' | 'private' | 'admin';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [joinRoomSlug, setJoinRoomSlug] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isPublicRoom, setIsPublicRoom] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRooms();
    // Get current user ID from token or user context
    const token = localStorage.getItem("token");
    if (token) {
      // You might want to decode the token to get user ID
      // For now using a placeholder
      setCurrentUserId("current-user-id");
    }
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
        { 
          roomName: newRoomName,
          isPublic: isPublicRoom 
        },
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

  const copyRoomLink = async (roomId: number) => {
    const link = `${window.location.origin}/canvas/${roomId}`;
    await navigator.clipboard.writeText(link);
    setCopiedRoomId(roomId.toString());
    setTimeout(() => setCopiedRoomId(null), 2000);
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const isRoomAdmin = (room: Room) => {
    return room.adminId === currentUserId;
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterType) {
      case 'public':
        return matchesSearch && room.isPublic;
      case 'private':
        return matchesSearch && !room.isPublic;
      case 'admin':
        return matchesSearch && isRoomAdmin(room);
      default:
        return matchesSearch;
    }
  });


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

  const RoomCard = ({ room }: { room: Room }) => (
    <Card className="group p-6 bg-gray-900/50 border-gray-800 hover:border-blue-500/50 hover:bg-gray-900/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      {/* Room Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/20">
            <Palette className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                {room.slug}
              </h3>
              {isRoomAdmin(room) && (
                <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" title="You're the admin" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {room.isPublic ? (
                <div className="flex items-center gap-1 text-green-400">
                  <Globe className="h-3 w-3" />
                  <span className="text-xs font-medium">Public</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <Lock className="h-3 w-3" />
                  <span className="text-xs font-medium">Private</span>
                </div>
              )}
              <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Room #{room.id}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyRoomLink(room.id)}
            className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8"
            title="Copy room link"
          >
            {copiedRoomId === room.id.toString() ? (
              <div className="h-4 w-4 text-green-500">✓</div>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8"
            title="Room options"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Room Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{getTimeAgo(room.createdAt)}</span>
          </div>
          <div className="text-gray-500 text-xs">
            {formatDate(room.createdAt)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{room._count?.chats || 0} messages</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Active</span>
          </div>
        </div>

        {/* Activity Preview */}
        <div className="pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-white">
                {room.slug.charAt(0).toUpperCase()}
              </div>
              <div className="h-6 w-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <span className="text-xs text-gray-500">Last activity {getTimeAgo(room.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/canvas/${room.id}`} className="block">
        <Button className="w-full bg-blue-600/90 hover:bg-blue-500 text-white border-0 group-hover:bg-blue-600 transition-all duration-200 py-3">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Room
          <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </Link>
    </Card>
  );

  const RoomListItem = ({ room }: { room: Room }) => (
    <Card className="group p-4 bg-gray-900/30 border-gray-800 hover:border-blue-500/50 hover:bg-gray-900/50 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/20">
          <Palette className="h-4 w-4 text-blue-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{room.slug}</h3>
            {isRoomAdmin(room) && <Crown className="h-4 w-4 text-yellow-500" />}
            {room.isPublic ? (
              <Globe className="h-4 w-4 text-green-400" />
            ) : (
              <Lock className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{room._count?.chats || 0} messages</span>
            <span>{getTimeAgo(room.createdAt)}</span>
            <span>Room #{room.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyRoomLink(room.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white h-8 w-8"
          >
            {copiedRoomId === room.id.toString() ? (
              <div className="h-4 w-4 text-green-500">✓</div>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Link href={`/canvas/${room.id}`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen ">
      <Container maxWidth="2xl">

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Create */}
              <Card className="p-6 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Quick Create</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Room name..."
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      onKeyPress={(e) => e.key === "Enter" && createRoom()}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublicRoom}
                      onChange={(e) => setIsPublicRoom(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-300">
                      Make room public
                    </label>
                  </div>

                  <Button 
                    onClick={createRoom} 
                    disabled={createLoading || !newRoomName.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0 py-3"
                  >
                    {createLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Room
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Join Room */}
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Join Room</h3>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Room ID or slug..."
                    value={joinRoomSlug}
                    onChange={(e) => setJoinRoomSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    onKeyPress={(e) => e.key === "Enter" && joinRoom()}
                  />
                  <Button 
                    onClick={joinRoom}
                    disabled={!joinRoomSlug.trim()}
                    variant="outline" 
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Join Room
                  </Button>
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <MainContent className="xl:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Drawing Rooms</h1>
                <p className="text-gray-400">Manage and access your collaborative workspaces</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Filters and View */}
              <div className="flex items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Rooms</option>
                  <option value="public">Public Only</option>
                  <option value="private">Private Only</option>
                  <option value="admin">My Rooms</option>
                </select>

                <div className="flex bg-gray-900/50 border border-gray-800 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Rooms Display */}
            {filteredRooms.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-800 bg-gray-900/30">
                <EmptyState
                  icon={<Users className="h-16 w-16 text-gray-600" />}
                  title={searchQuery ? "No rooms found" : "No rooms yet"}
                  description={
                    searchQuery 
                      ? `No rooms match "${searchQuery}". Try a different search term.`
                      : "Create your first drawing room to start collaborating with your team"
                  }
                  action={
                    !searchQuery ? (
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Room name..."]') as HTMLInputElement;
                          input?.focus();
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white border-0"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Room
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setSearchQuery("")}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Clear Search
                      </Button>
                    )
                  }
                />
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-3"
              }>
                {filteredRooms.map((room) => 
                  viewMode === 'grid' ? (
                    <RoomCard key={room.id} room={room} />
                  ) : (
                    <RoomListItem key={room.id} room={room} />
                  )
                )}
              </div>
            )}
          </MainContent>
        </div>
      </Container>
    </div>
  );
}