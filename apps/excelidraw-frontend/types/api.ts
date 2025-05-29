// WebSocket and API Types
export interface SocketMessage {
  type: string;
  message: string;
  roomId: string;
}

export interface ShapeMessage {
  shape: Shape;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatMessage {
  message: string;
}

export interface GetShapesResponse {
  messages: ChatMessage[];
}

// Re-export from canvas types
export type { Shape, Point, Tool } from './canvas';
