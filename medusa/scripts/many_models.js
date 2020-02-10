"use strict";

function radToDeg(r) { return r * 180 / Math.PI; }
function degToRad(d) { return d * Math.PI / 180; }

class Affine {
    constructor(translation, rotation, scale) {
        this.translation = translation;
        this.rotation = rotation;
        this.scale = (typeof(scale) == "number" ? new Point(scale, scale) : scale);
    }

    GetMatrix() {
        let M = m3.identity();
        M = m3.translate(M, this.translation.x, this.translation.y);
        M = m3.rotate(M, this.rotation);
        M = m3.scale(M, this.scale.x, this.scale.y);
        return M;
    }

    MovePoint(p) {
        v = m3.multiply(this.GetMatrix(), [p.x, p.y, 1]);
        return newPoint(v[0], v[1]);
    }
}

class Model {
    constructor(model, translation, rotation, scale, color, z) {
        this.name = model.name;
        this.model = model;
        this.joins = [];
        this.affine = new Affine(translation, rotation, scale);
        this.indexNumber = model.index.length;
        this.z = (z == undefined ? 0 : z); // used for order of rendering.        
        this.color = color;

        let texels = this.model.uv;
        if (texels == undefined) texels = Array(model.vertex.length).fill(0.34);

        this.setArray("vertexBuffer", this.model.vertex, 2);
        this.setArray("texelBuffer", texels, 2);
        this.setArray("indexBuffer", this.model.index, 1); 
    }

    GetCoord() { return this.affine.translation; }

    setArray(buffer, data, item_size, is_index_buffer) {
        if (is_index_buffer == undefined) is_index_buffer = (item_size == 1);
        let buffer_type = (is_index_buffer ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER);
        let buffer_data = (is_index_buffer ? new Uint16Array(data) : new Float32Array(data));
        this[buffer] = gl.createBuffer();
        gl.bindBuffer(buffer_type, this[buffer]);
        gl.bufferData(buffer_type, buffer_data, gl.STATIC_DRAW);
        this[buffer].itemSize = item_size;
        this[buffer].numItems = data.length / item_size;
    }

    draw(matrixV) {
        let matrixM = this.affine.GetMatrix();

        let program = (this.color == undefined ? programTexture : programColor);
        let locations = program.locations;
        program.Use();

        gl.uniform3fv(locations["u_color"], this.color);            
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(locations["a_position"], 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix3fv(locations["u_MV"], false, m3.multiply(matrixV, matrixM));

        gl.drawElements(gl.TRIANGLES, this.indexNumber, gl.UNSIGNED_SHORT, 0);
    }
}

class ShaderProgram {
    constructor(vertex_shader, fragment_shader) {
        this.program = webglUtils.createProgramFromScripts(gl, [vertex_shader, fragment_shader]);
        this.locations = {};
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        this.Use();
    }

    Use() { gl.useProgram(this.program); }

    AddParameter(name) {        
        if (name[0] == 'a') {            
            this.locations[name] = gl.getAttribLocation(this.program, name);
            gl.enableVertexAttribArray(this.locations[name]);    
        } else if (name[0] == 'u') {
            this.locations[name] = gl.getUniformLocation(this.program, name);
        }
    }

    AddParameters(names) {
        for (let i = 0; i < names.length; i++) this.AddParameter(names[i]);
    }
}

let programTexture, programColor;

function setScene() {
    canvas = document.getElementById("canvas");
    canvas.width = document.getElementsByTagName("body")[0].clientWidth;
    canvas.height = document.getElementsByTagName("body")[0].clientHeight;

    AddEvents();
    init();

    affineV = new Affine(new Point(0, 0), 0, new Point(canvas.height / canvas.width, 1));

    models = [                
        new Model(SertModel_rect, new Point(0, 0), 0, 1, [0, 0, 0])
    ];

    setAnimation();
}

function init() {    
    gl = canvas.getContext("webgl");
    if (!gl) { return; }

    programColor = new ShaderProgram("3d-vertex-shader-color", "3d-fragment-shader-color");
    programColor.AddParameters(["a_position", "u_MV", "u_color"]);    
    
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
}


function setAnimation() {
  	let start = performance.now();
  	requestAnimationFrame(function setAnimation(time) {
        let qtme = time - start;
        animate(qtme / 1000);
        requestAnimationFrame(setAnimation);
  	});
}

var last_time;
function animate(tme) {	// tme is measured in seconds.  	
  	drawScene();
    let t = tme - last_time;
    last_time = tme;
}

function drawScene() {	
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.3, 0.45, 0.55, 1);
    let matrixV = affineV.GetMatrix();
    let order = [...Array(models.length).keys()].sort(function(i1, i2) {
        return models[i2].z - models[i1].z;
    });
    for (let i = 0; i < order.length; i++) {
        models[order[i]].draw(matrixV);
    }
}