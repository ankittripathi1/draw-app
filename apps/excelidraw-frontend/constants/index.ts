import { GameConfig } from '@/types';

// Canvas Configuration
export const CANVAS_CONFIG: GameConfig = {
  gridSize: 25,
  dotSize: 1,
  shadowConfig: {
    color: "rgba(0, 0, 0, 0.1)",
    blur: 4,
    offsetX: 2,
    offsetY: 2,
  },
  strokeConfig: {
    color: "#1f2937",
    width: 2,
    previewColor: "#3b82f6",
  },
};

// Colors
export const COLORS = {
  background: {
    gradient: {
      start: "#ffffff",
      end: "#f8fafc",
    },
    grid: "#e2e8f0",
    majorGrid: "#cbd5e1",
  },
  preview: {
    stroke: "#3b82f6",
    shadow: "rgba(59, 130, 246, 0.3)",
  },
  pencil: {
    shadowBlur: 2,
    shadowOffset: 1,
  }
} as const;

// Animation Durations
export const ANIMATIONS = {
  button: {
    scale: 'duration-200',
    hover: 'duration-300',
  },
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    ping: 'animate-ping',
  }
} as const;

// Z-Index Layers
export const Z_INDEX = {
  canvas: 10,
  toolbar: 50,
  modal: 100,
} as const;
