const OFFSET = 30;
const CELLS_WIDTH = 10;
const CELLS_HEIGHT = 10;
const CELL_SIDE = 60;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static isLess(point1, point2) { return point1.x < point2.x || (point1.x === point2.x && point1.y < point2.y); }
    static isSame(point1, point2) { return point1.x === point2.x && point1.y === point2.y; }
    sub(point) { return new Point(this.x - point.x, this.y - point.y); }
    add(x, y) { return new Point(this.x + x, this.y + y); }
}

class Drawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.translate(0, canvas.height);
        this.ctx.scale(1, -1);
    }

    clear() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
    moveTo(point) { this.ctx.moveTo(point.x, point.y); }
    lineTo(point) { this.ctx.lineTo(point.x, point.y); }
    drawPath(points) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        let first = true;
        points.forEach((point) => {
            if (first) {
                this.moveTo(point);
                first = false;
            } else {
                this.lineTo(point);
            }
        });
        this.ctx.stroke();
    }
}

class Cell {
    constructor(row, col) {
        this.pos = new Point(row, col);
        this.point = new Point(OFFSET + (col + 1) * CELL_SIDE, OFFSET + (row + 1) * CELL_SIDE);
    }

    isUnderPointer(pointer) { return Point.isSame(this.pos, pointer.pos); }
}

class Line {
    constructor(pos1, pos2) {
        let arr = Point.isLess(pos1, pos2) ? [pos1, pos2] : [pos2, pos1];
        this.pos1 = arr[0];
        this.pos2 = arr[1];
    }
    static cmp(line1, line2) {
        if (!Point.isSame(line1.pos1, line2.pos1)) { return Point.isLess(line1.pos1, line2.pos1) ? -1 : 1; }
        return Point.isSame(line1.pos2, line2.pos2) ? 0 : (Point.isLess(line1.pos2, line2.pos2) ? -1 : 1);
    }
    static isSame(line1, line2) {
        return Point.isSame(line1.pos1, line2.pos1) && Point.isSame(line1.pos2, line2.pos2);
    }

    sub(line) { return new Line(this.pos1.sub(line.pos1), this.pos2.sub(line.pos2)); }
    static create(arr2d) {
        let lines = [];
        arr2d.forEach((arr) => {
            lines.push(new Line(new Point(arr[0], arr[1]), new Point(arr[2], arr[3])));
        });
        lines.sort(Line.cmp);
        return lines;
    }
}

class Table {
    static WIDTH = (CELLS_WIDTH + 1) * CELL_SIDE + OFFSET * 2;
    static HEIGHT = (CELLS_HEIGHT + 1) * CELL_SIDE + OFFSET * 2;

    constructor() {
        this.cells = [];
        for (let i = 0; i < CELLS_HEIGHT; i++) {
            this.cells[i] = [];
            for (let j = 0; j < CELLS_WIDTH; j++) {
                this.cells[i].push(new Cell(i, j));
            }
        }
        this.lines = [];
    }

    addLine(pos1, pos2, isDrawing) {
        const line = new Line(pos1, pos2);
        this.lines = this.lines.filter((l) => { return !Line.isSame(l, line); });
        if (isDrawing) {
            this.lines.push(line);
        }
    }

    forEachCell(callback) {
        this.cells.forEach((row) => { row.forEach((cell) => { callback(cell); }); });
    }

    forEachLine(callback) {
        this.lines.forEach((line) => {
            const p1 = this.cells[line.pos1.x][line.pos1.y].point;
            const p2 = this.cells[line.pos2.x][line.pos2.y].point;
            callback(p1, p2);
        });
    }
}

class Pointer {
    constructor(table, row, col) {
        this.table = table;
        this.pos = new Point(row, col);
        this.isDrawing = false;
    }

    move(dr, dc) {
        if (dr === 0 && dc === 0) { return; }
        this.table.addLine(this.pos, this.pos.add(dr, dc), this.isDrawing);
        this.pos = this.pos.add(dr, dc);
    }
    changeIsDrawingState() { this.isDrawing = !this.isDrawing; }
}
