import { useState } from "react";
import {
  Circle,
  Pencil,
  RectangleHorizontalIcon,
  Download,
  Trash2,
  Palette,
  Share2,
  Users,
  ArrowLeft,
  Menu,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { IconButton } from "../IconButton";
import { Tool, RoomInfo } from "@/types";
import { Button } from "@repo/ui/button";
import Link from "next/link";

interface FloatingControlPanelProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  roomInfo: RoomInfo | null;
  roomId: string;
  onShareRoom: () => void;
}

export function FloatingControlPanel({
  selectedTool,
  setSelectedTool,
  roomInfo,
  roomId,
  onShareRoom,
}: FloatingControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          title={isExpanded ? "Close Panel" : "Open Panel"}
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Floating Control Panel */}
      {isExpanded && (
        <div className="fixed top-20 left-6 z-40 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          {/* Room Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                {roomInfo?.slug || `Room ${roomId}`}
              </h2>
              <Link href="/rooms">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Exit
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Collaborative Room
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Connected
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Room ID:{" "}
              <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {roomId}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onShareRoom}
              className="w-full flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Room
            </Button>
          </div>

          {/* Drawing Tools */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Drawing Tools</h3>
            <div className="flex items-center gap-2 mb-3">
              <div title="Pencil Tool">
                <IconButton
                  onClick={() => setSelectedTool("pencil")}
                  activated={selectedTool === "pencil"}
                  icon={<Pencil size={18} />}
                />
              </div>
              <div title="Rectangle Tool">
                <IconButton
                  onClick={() => setSelectedTool("rect")}
                  activated={selectedTool === "rect"}
                  icon={<RectangleHorizontalIcon size={18} />}
                />
              </div>
              <div title="Circle Tool">
                <IconButton
                  onClick={() => setSelectedTool("circle")}
                  activated={selectedTool === "circle"}
                  icon={<Circle size={18} />}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
              Active: {selectedTool === "pencil" && "Pencil"}
              {selectedTool === "rect" && "Rectangle"}
              {selectedTool === "circle" && "Circle"}
            </div>
          </div>

          {/* View Controls */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">View Controls</h3>
            <div className="flex items-center gap-2">
              <button
                title="Zoom In"
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ZoomIn size={16} />
              </button>
              <button
                title="Zoom Out"
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ZoomOut size={16} />
              </button>
              <button
                title="Reset View"
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Canvas Actions */}
          <div>
            <h3 className="text-sm font-medium mb-3">Canvas Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                title="Download Canvas"
                className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm"
              >
                <Download size={16} />
                Download Canvas
              </button>
              <button
                title="Color Palette"
                className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg transition-colors text-sm"
              >
                <Palette size={16} />
                Color Palette
              </button>
              <button
                title="Clear Canvas"
                className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors text-sm"
              >
                <Trash2 size={16} />
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close panel when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
