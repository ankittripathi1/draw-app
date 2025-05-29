// Canvas and Drawing Types
export type Tool = "circle" | "rect" | "pencil";

export type Point = {
  x: number;
  y: number;
};

export type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
} | {
  type: "pencil";
  points: Point[];
};

export interface CanvasProps {
  roomId: string;
  socket: WebSocket;
}

export interface GameConfig {
  gridSize: number;
  dotSize: number;
  shadowConfig: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  strokeConfig: {
    color: string;
    width: number;
    previewColor: string;
  };
}
