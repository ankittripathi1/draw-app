import * as React from "react";
import { cn } from "./utils";

export interface FeatureItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureItem = ({ className, title, description, icon, ...props }: FeatureItemProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-6 rounded-lg border",
        "bg-white dark:bg-black border-gray-200 dark:border-zinc-800",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
      {...props}
    >
      <div className="mb-4 text-4xl text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
};
FeatureItem.displayName = "FeatureItem";

export { FeatureItem };
