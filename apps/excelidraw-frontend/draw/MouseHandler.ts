import { Tool, Point } from "@/types";

export class MouseHandler {
  private canvas: HTMLCanvasElement;
  private isDrawing = false;
  private isPanning = false;
  private startPosition: Point = { x: 0, y: 0 };
  private lastPanPosition: Point = { x: 0, y: 0 };
  private currentTool: Tool = "circle";
  private pencilPath: Point[] = [];

  private onDrawStart?: (point: Point, tool: Tool) => void;
  private onDrawMove?: (currentPoint: Point, startPoint: Point, tool: Tool, pencilPath?: Point[]) => void;
  private onDrawEnd?: (endPoint: Point, startPoint: Point, tool: Tool, pencilPath?: Point[]) => void;
  private onZoom?: (delta: number, point: Point) => void;
  private onPan?: (deltaX: number, deltaY: number) => void;
  private transformPoint?: (screenPoint: Point) => Point;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initEventListeners();
  }

  setTool(tool: Tool) {
    this.currentTool = tool;
  }

  setCallbacks(callbacks: {
    onDrawStart?: (point: Point, tool: Tool) => void;
    onDrawMove?: (currentPoint: Point, startPoint: Point, tool: Tool, pencilPath?: Point[]) => void;
    onDrawEnd?: (endPoint: Point, startPoint: Point, tool: Tool, pencilPath?: Point[]) => void;
    onZoom?: (delta: number, point: Point) => void;
    onPan?: (deltaX: number, deltaY: number) => void;
    transformPoint?: (screenPoint: Point) => Point;
  }) {
    this.onDrawStart = callbacks.onDrawStart;
    this.onDrawMove = callbacks.onDrawMove;
    this.onDrawEnd = callbacks.onDrawEnd;
    this.onZoom = callbacks.onZoom;
    this.onPan = callbacks.onPan;
    this.transformPoint = callbacks.transformPoint;
  }
  private getMousePosition(e: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  private getWorldPosition(screenPoint: Point): Point {
    return this.transformPoint ? this.transformPoint(screenPoint) : screenPoint;
  }

  private handleMouseDown = (e: MouseEvent) => {
    const screenPos = this.getMousePosition(e);
    
    // Check for pan mode (middle mouse button or space + left click)
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      this.isPanning = true;
      this.lastPanPosition = screenPos;
      this.canvas.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }

    // Regular drawing
    if (e.button === 0 && !this.isPanning) {
      this.isDrawing = true;
      this.startPosition = this.getWorldPosition(screenPos);
      
      if (this.currentTool === "pencil") {
        this.pencilPath = [this.startPosition];
      }
      
      this.onDrawStart?.(this.startPosition, this.currentTool);
    }
  };
  private handleMouseMove = (e: MouseEvent) => {
    const screenPos = this.getMousePosition(e);

    if (this.isPanning) {
      const deltaX = screenPos.x - this.lastPanPosition.x;
      const deltaY = screenPos.y - this.lastPanPosition.y;
      this.onPan?.(deltaX, deltaY);
      this.lastPanPosition = screenPos;
      return;
    }

    if (!this.isDrawing) return;
    
    const currentPosition = this.getWorldPosition(screenPos);
    
    if (this.currentTool === "pencil") {
      this.pencilPath.push(currentPosition);
      this.onDrawMove?.(currentPosition, this.startPosition, this.currentTool, this.pencilPath);
    } else {
      this.onDrawMove?.(currentPosition, this.startPosition, this.currentTool);
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.style.cursor = 'default';
      return;
    }

    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    const screenPos = this.getMousePosition(e);
    const endPosition = this.getWorldPosition(screenPos);
    
    if (this.currentTool === "pencil") {
      this.pencilPath.push(endPosition);
      this.onDrawEnd?.(endPosition, this.startPosition, this.currentTool, this.pencilPath);
      this.pencilPath = [];
    } else {
      this.onDrawEnd?.(endPosition, this.startPosition, this.currentTool);
    }
  };

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    const screenPos = this.getMousePosition(e);
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    
    this.onZoom?.(delta, screenPos);
  };

  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  private initEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false });
    this.canvas.addEventListener("contextmenu", this.handleContextMenu);
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.canvas.removeEventListener("contextmenu", this.handleContextMenu);
  }
}
