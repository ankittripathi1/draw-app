interface StatusBarProps {
  roomId: string;
}

export function StatusBar({ roomId }: StatusBarProps) {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-4 px-4 py-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span className="font-medium">Connected</span>
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {roomId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
