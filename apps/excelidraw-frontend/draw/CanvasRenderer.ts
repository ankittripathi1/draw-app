import { Shape, GameConfig, Point } from "@/types";
import { CANVAS_CONFIG } from "@/constants";

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private config: GameConfig;
  
  // Transform state
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.config = CANVAS_CONFIG;
  }

  // Transform methods
  setTransform(scale: number, offsetX: number, offsetY: number) {
    this.scale = scale;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  getTransform() {
    return { scale: this.scale, offsetX: this.offsetX, offsetY: this.offsetY };
  }

  // Convert screen coordinates to world coordinates
  screenToWorld(screenPoint: Point): Point {
    return {
      x: (screenPoint.x - this.offsetX) / this.scale,
      y: (screenPoint.y - this.offsetY) / this.scale
    };
  }

  // Convert world coordinates to screen coordinates
  worldToScreen(worldPoint: Point): Point {
    return {
      x: worldPoint.x * this.scale + this.offsetX,
      y: worldPoint.y * this.scale + this.offsetY
    };
  }

  private applyTransform() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
  }

  private resetTransform() {
    this.ctx.setTransform(1, 0, 0, 0, 1, 0);
  }
  clear() {
    this.resetTransform();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.applyTransform();
    this.drawBackground();
    this.drawGrid();
  }

  private drawBackground() {
    // Calculate the visible area in world coordinates
    const topLeft = this.screenToWorld({ x: 0, y: 0 });
    const bottomRight = this.screenToWorld({ x: this.canvas.width, y: this.canvas.height });
    
    // Create a modern white/light background with subtle gradient
    const gradient = this.ctx.createRadialGradient(
      (topLeft.x + bottomRight.x) / 2, (topLeft.y + bottomRight.y) / 2, 0,
      (topLeft.x + bottomRight.x) / 2, (topLeft.y + bottomRight.y) / 2, 
      Math.max(bottomRight.x - topLeft.x, bottomRight.y - topLeft.y) / 2
    );
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#f8fafc");
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }

  private drawGrid() {
    const { gridSize, dotSize } = this.config;
    
    // Calculate the visible area in world coordinates
    const topLeft = this.screenToWorld({ x: 0, y: 0 });
    const bottomRight = this.screenToWorld({ x: this.canvas.width, y: this.canvas.height });
    
    // Adjust grid size based on zoom level for better visibility
    const adjustedGridSize = gridSize;
    const adjustedDotSize = dotSize / this.scale;
    
    // Only draw grid if it's not too dense
    if (adjustedGridSize * this.scale > 5) {
      this.ctx.fillStyle = "#e2e8f0";
      
      // Calculate grid bounds
      const startX = Math.floor(topLeft.x / adjustedGridSize) * adjustedGridSize;
      const startY = Math.floor(topLeft.y / adjustedGridSize) * adjustedGridSize;
      const endX = Math.ceil(bottomRight.x / adjustedGridSize) * adjustedGridSize;
      const endY = Math.ceil(bottomRight.y / adjustedGridSize) * adjustedGridSize;
      
      // Draw dots
      for (let x = startX; x <= endX; x += adjustedGridSize) {
        for (let y = startY; y <= endY; y += adjustedGridSize) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, adjustedDotSize, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
      
      // Add major grid lines every 5 squares, but only if zoom level allows
      const majorGridSize = adjustedGridSize * 5;
      if (majorGridSize * this.scale > 20) {
        this.ctx.strokeStyle = "#cbd5e1";
        this.ctx.lineWidth = 0.5 / this.scale;
        
        // Major vertical lines
        for (let x = Math.floor(startX / majorGridSize) * majorGridSize; x <= endX; x += majorGridSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, startY);
          this.ctx.lineTo(x, endY);
          this.ctx.stroke();
        }
        
        // Major horizontal lines
        for (let y = Math.floor(startY / majorGridSize) * majorGridSize; y <= endY; y += majorGridSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(startX, y);
          this.ctx.lineTo(endX, y);
          this.ctx.stroke();
        }
      }
    }
  }
  drawShape(shape: Shape, isPreview = false) {
    const { shadowConfig, strokeConfig } = this.config;
    
    // Apply styling with scale-adjusted line width
    if (isPreview) {
      this.ctx.shadowColor = "rgba(59, 130, 246, 0.3)";
      this.ctx.shadowBlur = 8 / this.scale;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      this.ctx.strokeStyle = strokeConfig.previewColor;
    } else {
      this.ctx.shadowColor = shadowConfig.color;
      this.ctx.shadowBlur = shadowConfig.blur / this.scale;
      this.ctx.shadowOffsetX = shadowConfig.offsetX / this.scale;
      this.ctx.shadowOffsetY = shadowConfig.offsetY / this.scale;
      this.ctx.strokeStyle = strokeConfig.color;
    }
    
    this.ctx.lineWidth = strokeConfig.width / this.scale;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    if (shape.type === "rect") {
      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      this.ctx.beginPath();
      this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (shape.type === "pencil" && shape.points.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
      
      for (let i = 1; i < shape.points.length; i++) {
        this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      
      this.ctx.stroke();
      this.ctx.closePath();
    }

    // Reset shadow
    this.ctx.shadowColor = "transparent";
  }

  drawShapes(shapes: Shape[]) {
    shapes.forEach(shape => this.drawShape(shape));
  }

  renderFrame(shapes: Shape[], previewShape?: Shape) {
    this.clear();
    this.drawShapes(shapes);
    if (previewShape) {
      this.drawShape(previewShape, true);
    }
  }
}
