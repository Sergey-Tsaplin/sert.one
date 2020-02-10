// Matrix 3x3 for Graphic

var m3 = {
    // Identity matrix
    identity: function() { return [1, 0, 0, 0, 1, 0, 0, 0, 1]; },

    // Returns matrix 3x3 for translation to tx, ty
    translation: function(tx, ty) { return [1, 0, 0, 0, 1, 0, tx, ty, 1]; },

    // Returns matrix 3x3 for rotation to angle in radians
    rotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [c, -s, 0, s, c, 0, 0, 0, 1];
    },

    // Returns matrix 3x3 for scaling on sx, sy
    scaling: function(sx, sy) { return [sx, 0, 0, 0, sy, 0, 0, 0, 1]; },

    // Returns a matrix thst is the result of Multiply matrix 3x3 a on b
    multiply: function(a, b) {
        let a00 = a[0 * 3 + 0], a01 = a[0 * 3 + 1], a02 = a[0 * 3 + 2];
        let a10 = a[1 * 3 + 0], a11 = a[1 * 3 + 1], a12 = a[1 * 3 + 2];
        let a20 = a[2 * 3 + 0], a21 = a[2 * 3 + 1], a22 = a[2 * 3 + 2];
        let b00 = b[0 * 3 + 0], b01 = b[0 * 3 + 1], b02 = b[0 * 3 + 2];
        let b10 = b[1 * 3 + 0], b11 = b[1 * 3 + 1], b12 = b[1 * 3 + 2];
        let b20 = b[2 * 3 + 0], b21 = b[2 * 3 + 1], b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },

    multiplyByVector: function(a, v) {
        let a00 = a[0 * 3 + 0], a01 = a[0 * 3 + 1], a02 = a[0 * 3 + 2];
        let a10 = a[1 * 3 + 0], a11 = a[1 * 3 + 1], a12 = a[1 * 3 + 2];
        let a20 = a[2 * 3 + 0], a21 = a[2 * 3 + 1], a22 = a[2 * 3 + 2];
        let v0 = v[0], v1 = v[1], v2 = v[2];
        return [
            a00 * v0 + a10 * v1 + a20 * v2,
            a01 * v0 + a11 * v1 + a21 * v2,
            a02 * v0 + a12 * v1 + a22 * v2];
    },

    inverse: function(a) {
        let a00 = a[0 * 3 + 0], a01 = a[1 * 3 + 0], a02 = a[2 * 3 + 0];
        let a10 = a[0 * 3 + 1], a11 = a[1 * 3 + 1], a12 = a[2 * 3 + 1];
        let a20 = a[0 * 3 + 2], a21 = a[1 * 3 + 2], a22 = a[2 * 3 + 2];
        let det = a00 * a11 * a22 + a01 * a12 * a20 + a10 * a21 * a02 - 
                  a02 * a11 * a20 - a01 * a10 * a22 - a12 * a21 * a00;
        let res = [
            a11 * a22 - a12 * a21, -a10 * a22 + a12 * a20, a10 * a21 - a11 * a20,
            -a01 * a22 + a02 * a21, a00 * a22 - a02 * a20, -a00 * a21 + a01 * a20,
            a01 * a12 - a02 * a11, -a00 * a12 + a02 * a10, a00 * a11 - a01 * a10];
        for (let i = 0; i < res.length; i++) res[i] /= det;
        return res;
    },

    translate: function (m, tx, ty) {
        return m3.multiply(m, m3.translation(tx, ty));
    },

    rotate: function (m, angleInRadians) {
        return m3.multiply(m, m3.rotation(angleInRadians));
    },

    scale: function (m, sx, sy) {
        return m3.multiply(m, m3.scaling(sx, sy));
    },
};
