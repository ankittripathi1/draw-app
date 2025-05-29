// Room and User Types
export interface Room {
  id: number;
  slug: string;
  createdAt: string;
  adminId?: string;
  isPublic?: boolean;
  _count?: {
    chats: number;
  };
}

export interface RoomInfo {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

export interface RoomListItem {
  id: number;
  slug: string;
  createdAt: string;
  isPublic: boolean;
  adminId: string;
}

export interface CreateRoomPayload {
  roomName: string;
  isPublic?: boolean;
}

export interface QuickTemplate {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export interface RoomCanvasProps {
  roomId: string;
}

export interface ShareRoomModalProps {
  roomId: string;
  roomName: string;
  isOpen: boolean;
  onClose: () => void;
}
