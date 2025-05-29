import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-muted-foreground">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md">{description}</p>
        {action && action}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  backButton?: ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
  backButton,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backButton}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {action && action}
      </div>
    </div>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Container({
  children,
  className = "",
  maxWidth = "lg",
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
  };

  return (
    <div
      className={`container mx-auto px-4 py-8 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
    >
      {children}
    </div>
  );
}
