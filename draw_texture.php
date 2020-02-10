<!DOCTYPE html>
<html>
<head>
    <title>DrawTexture</title>
</head>
<body>
    <canvas id="canvas">
        Your browser is so bad and old, that can't do anything!
    </canvas>

    <script>
        let canvas = document.getElementById("canvas");
        let sz = 512;
        canvas.style.width = canvas.style.height = sz;
        canvas.width = canvas.height = sz;
        let ctx = canvas.getContext("2d");
        drawTramCar();

        function drawTramCar() {
            ctx.fillStyle = "#00BB00";
            ctx.fillRect(0, 0, sz, sz);
            ctx.fillStyle = "#000000";

            let side = sz * 0.24;
            let x0 = sz * 0.24;
            let y0 = sz * 0.12;
            let xx = sz * 0.26;
            let yy = sz * 0.28;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 2; j++) {
                    ctx.fillRect(x0 + xx * j, y0 + yy * i, side, side);
                }
            }            
        }        
    </script>
</body>
</html>