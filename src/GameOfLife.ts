import EventEmitter from 'eventemitter3';

export interface Cell {
    row: number;
    col: number;
}

export interface ConstructorParams {
    cntRows: number;
    cntCols: number;
}


type Events = {
    generationChanged: (currentGeneration: number) => void,
}

export class GameOfLife {
    protected grid: boolean[][] = [];
    protected cntGenerations: number = 0;
    protected cntRows: number;
    protected cntCols: number;
    protected readonly eventEmitter = new EventEmitter<Events>();
    
    constructor(params: ConstructorParams) {
        this.cntRows = params.cntRows;
        this.cntCols = params.cntCols;

        this.resetGame();
    }

    protected isValidCell(row: number, col: number): boolean {
        return row >= 0 && row < this.cntRows && col >= 0 && col < this.cntCols;
    }

    public resetGame(): void {
        this.cntGenerations = 0;
        this.eventEmitter.emit("generationChanged", this.cntGenerations);
        this.resetState();
    }

    public getEventEmitter() {
        return this.eventEmitter;
    }

    protected resetState(): void {
        this.grid = Array.from({ length: this.cntRows }, () => Array(this.cntCols).fill(false));
    }

    public getCntGenerations(): number {
        return this.cntGenerations;
    }

    public processGeneration(): void {
        const newlyAliveCells: Cell[] = [];

        for (let row = 0; row < this.cntRows; row++) {
            for (let col = 0; col < this.cntCols; col++) {
                if (this.shouldCellLive(row, col)) {
                    newlyAliveCells.push({ row, col });
                }
            }
        }

        this.setState(newlyAliveCells);

        this.cntGenerations++;
        this.eventEmitter.emit("generationChanged", this.cntGenerations);
    }

    protected shouldCellLive(row: number, col: number): boolean {
        const cntAliveNeighbors = this.getCntAliveNeighbors(row, col);
        if (cntAliveNeighbors === 3) {
            return true;
        }

        if (this.isCellAlive(row, col)) {
            if (cntAliveNeighbors < 2 || cntAliveNeighbors > 3) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    protected getCntAliveNeighbors(row: number, col: number): number {
        /**
         * |--------|--------|--------|
         * | -1, -1 |  0, -1 |  1, -1 |
         * |--------|--------|--------|
         * | -1,  0 |  0,  0 |  1,  0 |
         * |--------|--------|--------|
         * | -1,  1 |  0,  1 |  1,  1 |
         * |--------|--------|--------|
         */
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];

        let aliveCount = 0;
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (this.isValidCell(newRow, newCol) && this.isCellAlive(newRow, newCol)) {
                aliveCount++;
                if (aliveCount > 3) {
                    // no need to check further, the cell will not live
                    break;
                }
            }
        }

        return aliveCount;
    }

    public isCellAlive(row: number, col: number): boolean {
        return this.grid[row][col];
    }

    public setState(aliveCells: Cell[]): void {
        this.resetState();

        for (const cell of aliveCells) {
            if (!this.isValidCell(cell.row, cell.col)) {
                throw new Error(`Invalid cell coordinates: (${cell.row}, ${cell.col})`);
            }

            this.grid[cell.row][cell.col] = true;
        }
    }

    /**
     * 
     * @param density - a number between 0 and 1 representing the probability of a cell being alive
     * @returns 
     */
    public getRandomState(density: number): Cell[] {
        const aliveCells: Cell[] = [];
        for (let row = 0; row < this.cntRows; row++) {
            for (let col = 0; col < this.cntCols; col++) {
                const shouldBeAlive = Math.random() < density;
                if (shouldBeAlive) {
                    aliveCells.push({ row, col });
                }
            }
        }

        return aliveCells;
    }

    public getAliveCells(): Cell[] {
        const aliveCells: Cell[] = [];
        for (let row = 0; row < this.cntRows; row++) {
            for (let col = 0; col < this.cntCols; col++) {
                if (this.isCellAlive(row, col)) {
                    aliveCells.push({ row, col });
                }
            }
        }

        return aliveCells;
    }
}