import { type JSX } from "react";

export function Card({
  className = "",
  title,
  children,
  href,
}: {
  className?: string;
  title?: string;
  children: React.ReactNode;
  href?: string;
}): JSX.Element {
  // If href is provided, render as a link
  if (href) {
    return (
      <a
        className={`block p-6 border border-border rounded-lg hover:shadow-lg transition-shadow ${className}`}
        href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {title && (
          <h2 className="text-lg font-semibold mb-2">
            {title} <span>-&gt;</span>
          </h2>
        )}
        <div>{children}</div>
      </a>
    );
  }

  // Otherwise render as a regular div
  return (
    <div className={`p-6 border border-border rounded-lg bg-card ${className}`}>
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
