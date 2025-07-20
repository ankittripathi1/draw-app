import { cn } from "./utils";
import { type JSX } from "react";

export default function Card({
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
    if (href) {
        return (
            <a
                className={cn(`block p-6 border border-border rounded-lg hover:shadow-lg transition-shadow `,className)}
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

    return (
        <div className={cn(`p-6 border border-border rounded-lg bg-card`,className)}>
            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
            {children}
        </div>
    );
}
