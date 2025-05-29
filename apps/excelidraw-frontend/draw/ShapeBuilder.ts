import { Tool, Shape, Point } from "@/types";

export class ShapeBuilder {
  static createRectangle(startX: number, startY: number, endX: number, endY: number): Shape {
    return {
      type: "rect",
      x: startX,
      y: startY,
      width: endX - startX,
      height: endY - startY
    };
  }

  static createCircle(startX: number, startY: number, endX: number, endY: number): Shape {
    const width = endX - startX;
    const height = endY - startY;
    const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;
    
    return {
      type: "circle",
      radius,
      centerX,
      centerY
    };
  }

  static createPencilStroke(points: Point[]): Shape {
    return {
      type: "pencil",
      points: [...points]
    };
  }

  static createPreviewShape(
    tool: Tool, 
    startX: number, 
    startY: number, 
    currentX: number, 
    currentY: number,
    pencilPath?: Point[]
  ): Shape | null {
    switch (tool) {
      case "rect":
        return this.createRectangle(startX, startY, currentX, currentY);
      case "circle":
        return this.createCircle(startX, startY, currentX, currentY);
      case "pencil":
        return pencilPath && pencilPath.length > 1 
          ? this.createPencilStroke(pencilPath) 
          : null;
      default:
        return null;
    }
  }
}
