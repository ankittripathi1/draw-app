import { ReactNode } from "react";

export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return (
        <button 
            onClick={onClick}
            className={`
                relative p-2.5 rounded-xl transition-all duration-300 ease-out group
                ${activated 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-105 ring-2 ring-blue-500/50" 
                    : "bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
                }
                hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300/70 dark:hover:border-gray-500/70
                backdrop-blur-sm
            `}
        >
            <div className={`transition-transform duration-200 ${activated ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            {activated && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
            )}
        </button>
    );
}

