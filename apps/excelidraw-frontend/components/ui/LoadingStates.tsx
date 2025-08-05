import { ReactNode } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} ${className}`}
    />
  );
}

interface LoadingStateProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  title = "Loading...",
  description,
  size = "md",
}: LoadingStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 text-center">
        <LoadingSpinner size={size} className="mx-auto mb-4" />
        <div className="text-lg">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-2">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  children?: ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryText = "Try Again",
  children,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="p-8 text-center max-w-md">
        <div className="text-lg font-semibold text-red-600 mb-4">{title}</div>
        <div className="text-muted-foreground mb-6">{message}</div>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {retryText}
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
