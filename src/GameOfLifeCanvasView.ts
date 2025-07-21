import { GameOfLife, ConstructorParams, Cell } from "./GameOfLife";

interface ConstructorParamsHTMLCanvas extends ConstructorParams {
    cellSizePx: number;
    canvas: HTMLCanvasElement;
}

export class GameOfLifeCanvasView extends GameOfLife {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private cellSizePx: number;

    public constructor(params: ConstructorParamsHTMLCanvas) {
        super(params);

        if (!(params.canvas instanceof HTMLCanvasElement)) {
            throw new Error("Invalid canvas element provided.");
        }

        this.cellSizePx = params.cellSizePx;
        this.canvas = params.canvas;
        const ctx = this.canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Failed to get canvas context.");
        }
        this.ctx = ctx;

        this.canvas.width = params.cntCols * params.cellSizePx;
        this.canvas.height = params.cntRows * params.cellSizePx;

        const boundMouseMove = this.onCanvasMouseMove.bind(this);

        // Prevent the right-click context menu on canvas
        this.canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button !== 0 && e.button !== 2) {
                return;
            }

            const cell = this.findCellAt(e.offsetX, e.offsetY);
            if (!cell) {
                return;
            }

            if (e.button === 0) { // Left click
                this.grid[cell.row][cell.col] = true;

            } else if (e.button === 2) { // Right click
                this.grid[cell.row][cell.col] = false;

            }
            
            this.draw();    // TODO: draw only the changed cell

            this.canvas.addEventListener("mousemove", boundMouseMove);
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (e.button !== 0 && e.button !== 2) {
                return;
            }

            this.canvas.removeEventListener("mousemove", boundMouseMove);
        });
    }

    private onCanvasMouseMove(e: MouseEvent) {
        const leftButtonHeld = Boolean(e.buttons & (1 << 0));
        const rightButtonHeld = Boolean(e.buttons & (1 << 1));

        if (!leftButtonHeld && !rightButtonHeld) {
            // not supposed to reach that, but just in case. If we reached it, there's a bug somewhere
            throw new Error("Check your code, mouse buttons should be held down when this method is called!");
        }

        const cell = this.findCellAt(e.offsetX, e.offsetY);
        if (!cell) {
            return;
        }   

        if (leftButtonHeld) {
            this.grid[cell.row][cell.col] = true;
        } else if (rightButtonHeld) {
            this.grid[cell.row][cell.col] = false;
        }

        this.draw();    // TODO: draw only the changed cell
    }

    public draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < this.cntRows; y++) {
            for (let x = 0; x < this.cntCols; x++) {
                this.ctx.strokeStyle = 'lightgray';
                this.ctx.strokeRect(x * this.cellSizePx, y * this.cellSizePx, this.cellSizePx, this.cellSizePx);
                
                if (this.isCellAlive(y, x)) {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(x * this.cellSizePx, y * this.cellSizePx, this.cellSizePx, this.cellSizePx);
                }
            }
        }
    }
    
    public findCellAt(x: number, y: number): Cell | null {
        const row = Math.floor(y / this.cellSizePx);
        const col = Math.floor(x / this.cellSizePx);

        if (this.isValidCell(row, col)) {
            return { row, col };
        }
        return null;
    }

}