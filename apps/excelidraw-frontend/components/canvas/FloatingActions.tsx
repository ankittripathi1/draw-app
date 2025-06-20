import { Download, Trash2, Palette } from "lucide-react";

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-3">
        <button
          title="Download Canvas"
          className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105 active:scale-95"
        >
          <Download
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </button>
        <button
          title="Clear Canvas"
          className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105 active:scale-95"
        >
          <Trash2
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </button>
        <button
          title="Color Palette"
          className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105 active:scale-95"
        >
          <Palette
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </button>
      </div>
    </div>
  );
}
