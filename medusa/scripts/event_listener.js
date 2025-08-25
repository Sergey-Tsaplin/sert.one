function ToSceneCoord(mousePosition) {
    let p = new Point(
        mousePosition.x / (canvas.width / 2) - 1,
        mousePosition.y / (canvas.height / 2) - 1);
    p.x -= affineV.translation.x;
    p.y += affineV.translation.y;
    p.x /= affineV.scale.x;
    p.y /= -affineV.scale.y;
    return p;
}

function GetDistance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function GetMousePosition(e, t) {
    return new Point(e.pageX - t.offsetLeft, e.pageY - t.offsetTop);
}

function AddEvents() {
    let curMousePosition = new Point(0);
    let isMouseDown = -1;
    let isShiftDown = false;
    let movedAfterDown = false;

	canvas.addEventListener('mousedown', function(e) {
        movedAfterDown = false;
        move_mode = "none";
        curMousePosition = GetMousePosition(e, this);
        isMouseDown = e.which; 
    }, false);

    canvas.addEventListener('mousemove', function(e) {
        movedAfterDown = true;
        let mousePosition = GetMousePosition(e, this);
        if (isMouseDown == 2) {
            affineV.translation.x += (mousePosition.x - curMousePosition.x) / (canvas.width / 2);
            affineV.translation.y -= (mousePosition.y - curMousePosition.y) / (canvas.height / 2);
            curMousePosition = mousePosition;
        }
    }, false);

    canvas.addEventListener('mouseup', function(e) { 
        isMouseDown = -1;         
    }, false);

    addEventListener("keydown", function(e) { 
        isShiftDown |= (e.keyCode == 16);
        if (e.keyCode == 39) { affineV.translation.x -= 0.1; }
        if (e.keyCode == 37) { affineV.translation.x += 0.1; }
        if (e.keyCode == 38) { affineV.translation.y -= 0.1; }
        if (e.keyCode == 40) { affineV.translation.y += 0.1; }
    }, false);
    addEventListener("keyup", function(e) { isShiftDown &= (e.keyCode != 16); }, false);

    var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
    addEventListener(mousewheelevt, function(e) {
        let scale_up = 1 / 10, scale_down = 1 / 11; // Scale by 10% / 9% per wheel tick.
        let oldScale = new Point(affineV.scale.x, affineV.scale.y);
        if ((e.deltaY || e.detail || e.wheelDelta) > 0) {            
            affineV.scale.x -= affineV.scale.x * scale_down;
            affineV.scale.y -= affineV.scale.y * scale_down;            
        } else {
            affineV.scale.x += affineV.scale.x * scale_up;
            affineV.scale.y += affineV.scale.y * scale_up;
        }
        affineV.translation.x *= affineV.scale.x / oldScale.x;
        affineV.translation.y *= affineV.scale.y / oldScale.y;     
    }, false);
}
