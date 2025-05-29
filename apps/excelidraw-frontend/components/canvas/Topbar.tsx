import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "../IconButton";
import { Tool } from "@/types";

interface TopbarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}

export function Topbar({ selectedTool, setSelectedTool }: TopbarProps) {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-1">
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
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
          {selectedTool === "pencil" && "Pencil"}
          {selectedTool === "rect" && "Rectangle"}
          {selectedTool === "circle" && "Circle"}
        </div>
      </div>
    </div>
  );
}
