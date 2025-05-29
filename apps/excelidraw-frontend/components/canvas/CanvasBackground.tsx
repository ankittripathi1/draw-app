interface CanvasBackgroundProps {
  children: React.ReactNode;
}

export function CanvasBackground({ children }: CanvasBackgroundProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>
      {children}
    </div>
  );
}
