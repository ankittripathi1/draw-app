import { Tool, Shape } from "@/types";
import { getExistingShapes } from "./http";
import { CanvasRenderer } from "./CanvasRenderer";
import { MouseHandler } from "./MouseHandler";
import { ShapeBuilder } from "./ShapeBuilder";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private renderer: CanvasRenderer;
    private mouseHandler: MouseHandler;
    private existingShapes: Shape[]
    private roomId: string;
    private selectedTool: Tool = "circle";
    
    // Zoom and pan state
    private scale = 1;
    private offsetX = 0;
    private offsetY = 0;
    private minScale = 0.1;
    private maxScale = 5;

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.renderer = new CanvasRenderer(canvas);
        this.mouseHandler = new MouseHandler(canvas);
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.init();
        this.initHandlers();
        this.setupMouseHandlers();
        this.updateRendererTransform();
    }
    
    destroy() {
        this.mouseHandler.destroy();
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
        this.mouseHandler.setTool(tool);
    }

    // Zoom and pan methods
    private updateRendererTransform() {
        this.renderer.setTransform(this.scale, this.offsetX, this.offsetY);
    }

    private zoom(delta: number, point: { x: number; y: number }) {
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));
        
        if (newScale !== this.scale) {
            // Zoom towards the mouse position
            const worldPoint = this.renderer.screenToWorld(point);
            
            this.scale = newScale;
            this.updateRendererTransform();
            
            // Adjust offset to keep the world point under the mouse
            const newScreenPoint = this.renderer.worldToScreen(worldPoint);
            this.offsetX += point.x - newScreenPoint.x;
            this.offsetY += point.y - newScreenPoint.y;
            
            this.updateRendererTransform();
            this.clearCanvas();
        }
    }

    private pan(deltaX: number, deltaY: number) {
        this.offsetX += deltaX;
        this.offsetY += deltaY;
        this.updateRendererTransform();
        this.clearCanvas();
    }

    // Reset zoom and pan to default
    resetView() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateRendererTransform();
        this.clearCanvas();
    }

    // Center view on content
    centerView() {
        if (this.existingShapes.length === 0) {
            this.resetView();
            return;
        }

        // Calculate bounds of all shapes
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        this.existingShapes.forEach(shape => {
            if (shape.type === "rect") {
                minX = Math.min(minX, shape.x);
                minY = Math.min(minY, shape.y);
                maxX = Math.max(maxX, shape.x + shape.width);
                maxY = Math.max(maxY, shape.y + shape.height);
            } else if (shape.type === "circle") {
                minX = Math.min(minX, shape.centerX - shape.radius);
                minY = Math.min(minY, shape.centerY - shape.radius);
                maxX = Math.max(maxX, shape.centerX + shape.radius);
                maxY = Math.max(maxY, shape.centerY + shape.radius);
            } else if (shape.type === "pencil") {
                shape.points.forEach(point => {
                    minX = Math.min(minX, point.x);
                    minY = Math.min(minY, point.y);
                    maxX = Math.max(maxX, point.x);
                    maxY = Math.max(maxY, point.y);
                });
            }
        });

        // Add padding
        const padding = 50;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        // Calculate scale to fit content
        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        const scaleX = this.canvas.width / contentWidth;
        const scaleY = this.canvas.height / contentHeight;
        this.scale = Math.min(scaleX, scaleY, this.maxScale);

        // Center the content
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        this.offsetX = this.canvas.width / 2 - centerX * this.scale;
        this.offsetY = this.canvas.height / 2 - centerY * this.scale;

        this.updateRendererTransform();
        this.clearCanvas();
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        console.log(this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.renderer.renderFrame(this.existingShapes);
    }

    private setupMouseHandlers() {
        this.mouseHandler.setCallbacks({
            onDrawStart: () => {
                // Drawing started - no action needed
            },
            onDrawMove: (currentPoint, startPoint, tool, pencilPath) => {
                // Create preview shape during drawing
                let previewShape: Shape | null = null;
                
                if (tool === "pencil" && pencilPath && pencilPath.length > 1) {
                    previewShape = ShapeBuilder.createPencilStroke(pencilPath);
                } else if (tool !== "pencil") {
                    previewShape = ShapeBuilder.createPreviewShape(
                        tool,
                        startPoint.x,
                        startPoint.y,
                        currentPoint.x,
                        currentPoint.y
                    );
                }
                
                if (previewShape) {
                    this.renderer.renderFrame(this.existingShapes, previewShape);
                }
            },
            onDrawEnd: (endPoint, startPoint, tool, pencilPath) => {
                // Create final shape
                let shape: Shape | null = null;
                
                if (tool === "pencil" && pencilPath && pencilPath.length > 1) {
                    shape = ShapeBuilder.createPencilStroke(pencilPath);
                } else if (tool === "rect") {
                    shape = ShapeBuilder.createRectangle(
                        startPoint.x,
                        startPoint.y,
                        endPoint.x,
                        endPoint.y
                    );
                } else if (tool === "circle") {
                    shape = ShapeBuilder.createCircle(
                        startPoint.x,
                        startPoint.y,
                        endPoint.x,
                        endPoint.y
                    );
                }
                
                if (shape) {
                    this.existingShapes.push(shape);
                    this.clearCanvas();
                    
                    // Send shape to server
                    this.socket.send(JSON.stringify({
                        type: "chat",
                        message: JSON.stringify({ shape }),
                        roomId: this.roomId
                    }));
                }
            },
            onZoom: (delta, point) => {
                this.zoom(delta, point);
            },
            onPan: (deltaX, deltaY) => {
                this.pan(deltaX, deltaY);
            },
            transformPoint: (screenPoint) => {
                return this.renderer.screenToWorld(screenPoint);
            }
        });
    }
}