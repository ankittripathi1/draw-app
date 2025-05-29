import { useEffect, useRef, useState } from "react";
import { Game } from "@/draw/Game";
import { Tool, RoomInfo } from "@/types";
import { CanvasBackground } from "./canvas/CanvasBackground";
import { FloatingControlPanel } from "./canvas/FloatingControlPanel";

export function Canvas({
  roomId,
  socket,
  roomInfo,
  onShareRoom,
}: {
  socket: WebSocket;
  roomId: string;
  roomInfo: RoomInfo | null;
  onShareRoom: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      // Handle window resize to update canvas dimensions
      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  return (
    <CanvasBackground>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 cursor-crosshair drop-shadow-sm z-10 select-none"
        style={{
          background: "transparent",
          touchAction: "none", // Prevent touch scrolling
        }}
      />
      <FloatingControlPanel
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        roomInfo={roomInfo}
        roomId={roomId}
        onShareRoom={onShareRoom}
      />
    </CanvasBackground>
  );
}
