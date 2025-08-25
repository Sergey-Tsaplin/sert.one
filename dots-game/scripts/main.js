const drawer = new Drawer(document.getElementById("canvas"));
const table = new Table();
const pointer = new Pointer(table, 3, 4);

const smile = Line.create([[0,2,0,3],[0,2,1,1],[0,3,0,4],[0,4,1,5],[2,2,3,2],[2,4,3,4]]);

function redraw() {
    drawer.clear();
    let origin = new Point(OFFSET, OFFSET);
    let top = new Point(OFFSET, Table.HEIGHT - OFFSET);
    let right = new Point(Table.WIDTH - OFFSET, OFFSET);
    let d1 = CELL_SIDE * 0.5;
    let d2 = CELL_SIDE * 0.3;
    drawer.drawPath([origin, top, top.add(-d2, -d1), top, top.add(d2, -d1)]);
    drawer.drawPath([origin, right, right.add(-d1, d2), right, right.add(-d1, -d2)]);

    let base = origin;
    let d3 = CELL_SIDE * 0.12;
    for (let i = 0; i < CELLS_WIDTH; i++) {
        base = base.add(CELL_SIDE, 0);
        drawer.drawPath([base.add(0, -d3), base.add(0, d3)]);
    }
    base = origin;
    for (let i = 0; i < CELLS_HEIGHT; i++) {
        base = base.add(0, CELL_SIDE);
        drawer.drawPath([base.add(-d3, 0), base.add(d3, 0)]);
    }

    const r = CELL_SIDE * 0.07;
    const width = CELL_SIDE * 0.017;
    table.forEachCell((cell) => {
        drawer.ctx.beginPath();
        drawer.ctx.ellipse(cell.point.x, cell.point.y, r, r, 0, 0, Math.PI * 2);
        if (cell.isUnderPointer(pointer)) {
            drawer.ctx.strokeStyle = "#00f";
            drawer.ctx.lineWidth = width * 2.5;
            if (pointer.isDrawing) {
                drawer.ctx.fillStyle = "#00f";
                drawer.ctx.fill();
            }
        } else {
            drawer.ctx.lineWidth = width;
            drawer.ctx.strokeStyle = "#000";
        }
        drawer.ctx.stroke();
    });

    table.forEachLine((point1, point2) => { drawer.drawPath([point1, point2]); });

    let same = false;

    if (smile.length === table.lines.length) {
        const len = smile.length;
        table.lines.sort(Line.cmp);
        let diff = [];
        for (let i = 0; i < len; i++) { diff.push(table.lines[i].sub(smile[i])); }
        same = true;
        for (let i = 1; i < len; i++) { same &= Line.isSame(diff[i], diff[i - 1]); }
    }

    if (same) {
        console.log("CONGRATULATIONS! YOU DREW A PERFECT SMILE!");
        document.getElementById("status").innerHTML = "CONGRATULATIONS! YOU DREW A PERFECT SMILE!"
    } else {
        document.getElementById("status").innerHTML = "Draw a smile! Now cursor is in <strong>"
            + (pointer.isDrawing ? "painter" : "eraser") + "</strong> mode"
    }
}

moveCodes = {
    'ArrowUp':[1,0],'ArrowDown':[-1,0],'ArrowLeft':[0,-1],'ArrowRight':[0,1],
    'Numpad1':[-1,-1],'Numpad2':[-1,0],'Numpad3':[-1,1], 'Numpad4':[0,-1],
    'Numpad6':[0,1],'Numpad7':[1,-1],'Numpad8':[1,0],'Numpad9':[1,1],
    'KeyZ':[-1,-1],'KeyX':[-1,0],'KeyC':[-1,1], 'KeyA':[0,-1],
    'KeyD':[0,1],'KeyQ':[1,-1],'KeyW':[1,0],'KeyE':[1,1],
}
upDownCodes = {'Space':[1], 'Numpad5':[1], 'KeyS':[1]};
specialCodes = {'Enter':[1]};

document.addEventListener('keydown', (e) => {
    if (e.code in moveCodes || e.code in upDownCodes || e.code in specialCodes) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code in moveCodes) {
        const move = moveCodes[e.code];
        pointer.move(move[0], move[1]);
        redraw();
    }
    if (e.code in upDownCodes) {
        pointer.changeIsDrawingState();
        redraw();
    }
    if (e.code in specialCodes) {
        if (e.code === "Enter") {
            let dump="";
            table.lines.sort(Line.cmp);
            for (let i = 0; i < table.lines.length; i++) {
                if (i !== 0) { dump += ","; }
                const l = table.lines[i];
                dump += "[" + l.pos1.x + "," + l.pos1.y + "," + l.pos2.x + "," + l.pos2.y + "]";
            }
            console.log("[" + dump + "]");
        }
    }
});

redraw();
