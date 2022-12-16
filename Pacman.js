"use strict";
var rc; 
var cnt = 100;
let fin = 0;
let factor = 1;
var prev_dir = 'ArrowRight';
var t = 0;
let program;
let border;
let pacman;
var gl;
var points;
var colors;
var NumPoints = 5000;
var pts;
var cls;
var cx = 0;
var cy = 0;
var r = 0.04;
var theta1 = Math.PI / 4;
var theta2 = -Math.PI / 4;
var theta_ul = Math.PI / 4;
var theta_ll = -Math.PI / 4;
var theta_b = 0;
var inc = 0;
var dec = 1;

function update_points() {
    points.push(pts[0]);
    points.push(pts[1]);
    points.push(pts[2]);
    points.push(pts[1]);
    points.push(pts[2]);
    points.push(pts[3]);

    colors.push(cls[0]);
    colors.push(cls[1]);
    colors.push(cls[2]);
    colors.push(cls[1]);
    colors.push(cls[2]);
    colors.push(cls[3]);
    pts = [];
    cls = [];
}

function valid_move(tx, ty) {
    for (var i = 0; i < border.length - pacman.length; i += 3) {
        var x1 = border[i][0];
        var y1 = border[i][1];
        var x2 = border[i + 1][0];
        var y2 = border[i + 1][1];
        var x3 = border[i + 2][0];
        var y3 = border[i + 2][1];
        var area123 = 1 / 2.0 * Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)));
        var areac23 = 1 / 2.0 * Math.abs((tx * (y2 - y3) + x2 * (y3 - ty) + x3 * (ty - y2)));
        var area1c3 = 1 / 2.0 * Math.abs((x1 * (ty - y3) + tx * (y3 - y1) + x3 * (y1 - ty)));
        var area12c = 1 / 2.0 * Math.abs((x1 * (y2 - ty) + x2 * (ty - y1) + tx * (y1 - y2)));
        if (area123 == area12c + area1c3 + areac23) {
            return 1;
        } else {
            return 0;
        }
    }

}

var cross2 = function(points1, points2, points3, triangle1, triangle2, triangle3) {
    var pa = points1;
    var pb = points2;
    var pc = points3;
    var p0 = triangle1;
    var p1 = triangle2;
    var p2 = triangle3;
    var dXa = pa[0] - p2[0];
    var dYa = pa[1] - p2[1];
    var dXb = pb[0] - p2[0];
    var dYb = pb[1] - p2[1];
    var dXc = pc[0] - p2[0];
    var dYc = pc[1] - p2[1];
    var dX21 = p2[0] - p1[0];
    var dY12 = p1[1] - p2[1];
    var D = dY12 * (p0[0] - p2[0]) + dX21 * (p0[1] - p2[1]);
    var sa = dY12 * dXa + dX21 * dYa;
    var sb = dY12 * dXb + dX21 * dYb;
    var sc = dY12 * dXc + dX21 * dYc;
    var ta = (p2[1] - p0[1]) * dXa + (p0[0] - p2[0]) * dYa;
    var tb = (p2[1] - p0[1]) * dXb + (p0[0] - p2[0]) * dYb;
    var tc = (p2[1] - p0[1]) * dXc + (p0[0] - p2[0]) * dYc;
    if (D < 0) return ((sa >= 0 && sb >= 0 && sc >= 0) ||
        (ta >= 0 && tb >= 0 && tc >= 0) ||
        (sa + ta <= D && sb + tb <= D && sc + tc <= D));
    return ((sa <= 0 && sb <= 0 && sc <= 0) ||
        (ta <= 0 && tb <= 0 && tc <= 0) ||
        (sa + ta >= D && sb + tb >= D && sc + tc >= D));
}

var trianglesIntersect4 = function(t01, t02, t03, t11, t12, t13) {
    return !(cross2(t01, t02, t03, t11, t12, t13) ||
        cross2(t11, t12, t13, t01, t02, t03));
}


function boundary_check() {
    for (var i = 0; i < border.length; i += 3) {
        if (trianglesIntersect4(pacman[0], pacman[1], pacman[2], border[i], border[i + 1], border[i + 2])) {
            return 1;
        }
        if (trianglesIntersect4(pacman[2], pacman[3], pacman[4], border[i], border[i + 1], border[i + 2])) {
            return 1;
        }
    }
    return 0;


}


function key_pressed(x) {
    boundary_check();
    if (x == 'ArrowLeft') {
        cx -= 0.01;
        // if (valid_move(cx + r, cy + r) == 0 && valid_move(cx - r, cy + r) == 0 && valid_move(cx + r, cy - r) == 0 && valid_move(cx - r, cy - r) == 0) {} else {
        //     cx += 0.01;
        // }
        if (prev_dir != x) {
            prev_dir = x
            theta_ul = Math.PI;
            theta_ll = -3 * Math.PI / 4;
            theta2 = theta_ll;
            theta_b = 3 * Math.PI / 4;
            theta1 = theta_b;
        }
        // render();
    } else if (x == 'ArrowRight') {
        cx += 0.01;
        // if (valid_move(cx + r, cy + r) == 0 && valid_move(cx - r, cy + r) == 0 && valid_move(cx + r, cy - r) == 0 && valid_move(cx - r, cy - r) == 0) {
        //     cx -= 0.01
        // }
        if (prev_dir != x) {
            prev_dir = x;
            theta_ul = Math.PI / 4;
            theta_ll = -Math.PI / 4;
            theta1 = theta_ul;
            theta2 = theta_ll;
            theta_b = 0;
        }
    } else if (x == 'ArrowUp') {
        cy += 0.01;
        // if (valid_move(cx + r, cy + r) == 0 && valid_move(cx - r, cy + r) == 0 && valid_move(cx + r, cy - r) == 0 && valid_move(cx - r, cy - r) == 0) {
        //     cy -= 0.01;
        // }
        if (prev_dir != x) {
            prev_dir = x;
            theta_ul = Math.PI / 4;
            theta_ll = -Math.PI / 4;
            theta1 = theta_ul;
            theta2 = theta_ll;
            theta_b = 0;
        }

        // render();
    } else if (x == 'ArrowDown') {
        cy -= 0.01;
        // if (valid_move(cx + r, cy + r) == 0 && valid_move(cx - r, cy + r) == 0 && valid_move(cx + r, cy - r) == 0 && valid_move(cx - r, cy - r) == 0) {
        //     cy += 0.01;
        // }
        if (prev_dir != x) {
            prev_dir = x;
            theta_ul = Math.PI / 4;
            theta_ll = -Math.PI / 4;
            theta1 = theta_ul;
            theta2 = theta_ll;
            theta_b = 0;
        }

        // render();
    }
}


window.onload = function init() // The first function to get executed
    {

        var canvas = document.getElementById("gl-canvas");

        gl = WebGLUtils.setupWebGL(canvas); // Initializing WebGL API
        if (!gl) { alert("WebGL isn't available"); }

        //
        //  Initialize our data for the Sierpinski Gasket
        //

        // First, initialize the corners of our gasket with three points.
        window.addEventListener('keydown', function(e) {
            console.log(e.key);
            key_pressed(e.key);
        }, false);
        let canvasElem = document.querySelector("canvas");

        canvasElem.addEventListener("mousedown", function(e) {
            // getMousePosition(canvasElem, e);
        });
        var vertices = [
            vec2(-1, -1),
            vec2(0, 1),
            vec2(1, -1)
        ];

        // Specify a starting point p for our iterations
        // p must lie inside any set of three vertices

        var u = add(vertices[0], vertices[1]);
        var v = add(vertices[0], vertices[2]);
        var p = scale(0.25, add(u, v));

        // And, add our initial point into our array of points

        points = [];
        colors = [];

        // Compute new points
        // Each new point is located midway between
        // last point and a randomly chosen vertex

        // for (var i = -0.7; i <= 0.7; i += 1.4) {
        //     for (var j = -1; j <= 1; j += 2) {
        //         p = vec2(i, -j)
        //         points.push(p);
        //         colors.push(vec3(0.0, 0.0, 1.0));
        //     }

        // }
        // for (var i = -0.68; i <= 0.68; i += 1.36) {
        //     for (var j = -0.98; j <= 0.98; j += 1.96) {
        //         p = vec2(i, -j)
        //         points.push(p);
        //         colors.push(vec3(0.0, 0.0, 0.0));
        //     }

        // }



        // Borders definition
        pts = [];
        cls = [];
        border = [
            vec2(-0.7, 0.32), vec2(-0.7, 1.0), vec2(-0.69, 0.32),
            vec2(-0.7, 1.0), vec2(-0.69, 0.32), vec2(-0.69, 1.0),
            vec2(-0.7, -1.0), vec2(-0.7, -0.32), vec2(-0.69, -1.0),
            vec2(-0.7, -0.32), vec2(-0.69, -1.0), vec2(-0.69, -0.32),
            vec2(0.69, 0.32), vec2(0.69, 1.0), vec2(0.7, 0.32),
            vec2(0.69, 1.0), vec2(0.7, 0.32), vec2(0.7, 1.0),
            vec2(0.69, -1.0), vec2(0.69, -0.32), vec2(0.7, -1.0),
            vec2(0.69, -0.32), vec2(0.7, -1.0), vec2(0.7, -0.32),
            vec2(-0.7, 0.99), vec2(-0.7, 1.0), vec2(0.7, 0.99),
            vec2(-0.7, 1.0), vec2(0.7, 0.99), vec2(0.7, 1.0),
            vec2(-0.7, -1.0), vec2(-0.7, -0.99), vec2(0.7, -1.0),
            vec2(-0.7, -0.99), vec2(0.7, -1.0), vec2(0.7, -0.99),
            vec2(-0.7, 0.06), vec2(-0.7, 0.07), vec2(-0.45, 0.06),
            vec2(-0.7, 0.07), vec2(-0.45, 0.06), vec2(-0.45, 0.07),
            vec2(-0.7, -0.07), vec2(-0.7, -0.06), vec2(-0.45, -0.07),
            vec2(-0.7, -0.06), vec2(-0.45, -0.07), vec2(-0.45, -0.06),
            vec2(-0.7, 0.32), vec2(-0.7, 0.33), vec2(-0.45, 0.32),
            vec2(-0.7, 0.33), vec2(-0.45, 0.32), vec2(-0.45, 0.33),
            vec2(-0.7, -0.33), vec2(-0.7, -0.32), vec2(-0.45, -0.33),
            vec2(-0.7, -0.32), vec2(-0.45, -0.33), vec2(-0.45, -0.32),
            vec2(-0.46, -0.33), vec2(-0.46, -0.06), vec2(-0.45, -0.33),
            vec2(-0.46, -0.06), vec2(-0.45, -0.33), vec2(-0.45, -0.06),
            vec2(-0.46, 0.06), vec2(-0.46, 0.33), vec2(-0.45, 0.06),
            vec2(-0.46, 0.33), vec2(-0.45, 0.06), vec2(-0.45, 0.33),
            vec2(0.45, 0.06), vec2(0.45, 0.07), vec2(0.7, 0.06),
            vec2(0.45, 0.07), vec2(0.7, 0.06), vec2(0.7, 0.07),
            vec2(0.45, -0.07), vec2(0.45, -0.06), vec2(0.7, -0.07),
            vec2(0.45, -0.06), vec2(0.7, -0.07), vec2(0.7, -0.06),
            vec2(0.45, 0.32), vec2(0.45, 0.33), vec2(0.7, 0.32),
            vec2(0.45, 0.33), vec2(0.7, 0.32), vec2(0.7, 0.33),
            vec2(0.45, -0.33), vec2(0.45, -0.32), vec2(0.7, -0.33),
            vec2(0.45, -0.32), vec2(0.7, -0.33), vec2(0.7, -0.32),
            vec2(0.45, -0.33), vec2(0.45, -0.06), vec2(0.46, -0.33),
            vec2(0.45, -0.06), vec2(0.46, -0.33), vec2(0.46, -0.06),
            vec2(0.45, 0.06), vec2(0.45, 0.33), vec2(0.46, 0.06),
            vec2(0.45, 0.33), vec2(0.46, 0.06), vec2(0.46, 0.33), // Borders End
            vec2(-0.59, 0.67), vec2(-0.59, 0.87), vec2(-0.45, 0.67),
            vec2(-0.59, 0.87), vec2(-0.45, 0.67), vec2(-0.45, 0.87),
            vec2(-0.59, 0.45), vec2(-0.59, 0.55), vec2(-0.45, 0.45),
            vec2(-0.59, 0.55), vec2(-0.45, 0.45), vec2(-0.45, 0.55),
            vec2(0.45, 0.67), vec2(0.45, 0.87), vec2(0.59, 0.67),
            vec2(0.45, 0.87), vec2(0.59, 0.67), vec2(0.59, 0.87),
            vec2(0.45, 0.45), vec2(0.45, 0.55), vec2(0.59, 0.45),
            vec2(0.45, 0.55), vec2(0.59, 0.45), vec2(0.59, 0.55), // Top outer most boxes end
            vec2(-0.35, 0.67), vec2(-0.35, 0.87), vec2(-0.14, 0.67),
            vec2(-0.35, 0.87), vec2(-0.14, 0.67), vec2(-0.14, 0.87),
            vec2(0.35, 0.67), vec2(0.35, 0.87), vec2(0.14, 0.67),
            vec2(0.35, 0.87), vec2(0.14, 0.67), vec2(0.14, 0.87), // Top inner boxes end
            vec2(0.04, 0.67), vec2(0.04, 0.99), vec2(-0.04, 0.67),
            vec2(0.04, 0.99), vec2(-0.04, 0.67), vec2(-0.04, 0.99), // Top middle line end
            vec2(-0.35, 0.06), vec2(-0.35, 0.55), vec2(-0.27, 0.06),
            vec2(-0.35, 0.55), vec2(-0.27, 0.06), vec2(-0.27, 0.55),
            vec2(-0.35, 0.26), vec2(-0.35, 0.33), vec2(-0.14, 0.26),
            vec2(-0.35, 0.33), vec2(-0.14, 0.26), vec2(-0.14, 0.33),
            vec2(0.35, 0.06), vec2(0.35, 0.55), vec2(0.27, 0.06),
            vec2(0.35, 0.55), vec2(0.27, 0.06), vec2(0.27, 0.55),
            vec2(0.35, 0.26), vec2(0.35, 0.33), vec2(0.14, 0.26),
            vec2(0.35, 0.33), vec2(0.14, 0.26), vec2(0.14, 0.33), // upper sideways T shaped thing end 
            vec2(0.04, 0.26), vec2(0.04, 0.55), vec2(-0.04, 0.26),
            vec2(0.04, 0.55), vec2(-0.04, 0.26), vec2(-0.04, 0.55),
            vec2(-0.17, 0.45), vec2(-0.17, 0.55), vec2(0.17, 0.45),
            vec2(-0.17, 0.55), vec2(0.17, 0.45), vec2(0.17, 0.55), // T end
            vec2(0.35, -0.33), vec2(0.35, -0.06), vec2(0.27, -0.33),
            vec2(0.35, -0.06), vec2(0.27, -0.33), vec2(0.27, -0.06),
            vec2(-0.35, -0.33), vec2(-0.35, -0.06), vec2(-0.27, -0.33),
            vec2(-0.35, -0.06), vec2(-0.27, -0.33), vec2(-0.27, -0.06), // Lower side bar end
            vec2(0.04, -0.27), vec2(0.04, -0.51), vec2(-0.04, -0.27),
            vec2(0.04, -0.51), vec2(-0.04, -0.27), vec2(-0.04, -0.51),
            vec2(-0.17, -0.27), vec2(-0.17, -0.33), vec2(0.17, -0.27),
            vec2(-0.17, -0.33), vec2(0.17, -0.27), vec2(0.17, -0.33), // lower upper T end
            vec2(0.04, -0.63), vec2(0.04, -0.87), vec2(-0.04, -0.63),
            vec2(0.04, -0.87), vec2(-0.04, -0.63), vec2(-0.04, -0.87),
            vec2(-0.17, -0.63), vec2(-0.17, -0.69), vec2(0.17, -0.63),
            vec2(-0.17, -0.69), vec2(0.17, -0.63), vec2(0.17, -0.69), // lower lower t end
            vec2(0.35, -0.51), vec2(0.35, -0.45), vec2(0.14, -0.51),
            vec2(0.35, -0.45), vec2(0.14, -0.51), vec2(0.14, -0.45),
            vec2(-0.35, -0.51), vec2(-0.35, -0.45), vec2(-0.14, -0.51),
            vec2(-0.35, -0.45), vec2(-0.14, -0.51), vec2(-0.14, -0.45), // lower middle horizontal bar end
            vec2(-0.59, -0.81), vec2(-0.59, -0.87), vec2(-0.14, -0.81),
            vec2(-0.59, -0.87), vec2(-0.14, -0.81), vec2(-0.14, -0.87),
            vec2(-0.35, -0.63), vec2(-0.35, -0.87), vec2(-0.27, -0.63),
            vec2(-0.35, -0.87), vec2(-0.27, -0.63), vec2(-0.27, -0.87),
            vec2(0.59, -0.81), vec2(0.59, -0.87), vec2(0.14, -0.81),
            vec2(0.59, -0.87), vec2(0.14, -0.81), vec2(0.14, -0.87),
            vec2(0.35, -0.63), vec2(0.35, -0.87), vec2(0.27, -0.63),
            vec2(0.35, -0.87), vec2(0.27, -0.63), vec2(0.27, -0.87), // side unequal t end
            vec2(0.49, -0.45), vec2(0.49, -0.69), vec2(0.45, -0.45),
            vec2(0.49, -0.69), vec2(0.45, -0.45), vec2(0.45, -0.69),
            vec2(0.59, -0.45), vec2(0.59, -0.51), vec2(0.45, -0.45),
            vec2(0.59, -0.51), vec2(0.45, -0.45), vec2(0.45, -0.51),
            vec2(-0.49, -0.45), vec2(-0.49, -0.69), vec2(-0.45, -0.45),
            vec2(-0.49, -0.69), vec2(-0.45, -0.45), vec2(-0.45, -0.69),
            vec2(-0.59, -0.45), vec2(-0.59, -0.51), vec2(-0.45, -0.45),
            vec2(-0.59, -0.51), vec2(-0.45, -0.45), vec2(-0.45, -0.51), // lower side L shape end
            vec2(-0.69, -0.63), vec2(-0.69, -0.69), vec2(-0.59, -0.63),
            vec2(-0.69, -0.69), vec2(-0.59, -0.63), vec2(-0.59, -0.69),
            vec2(0.69, -0.63), vec2(0.69, -0.69), vec2(0.59, -0.63),
            vec2(0.69, -0.69), vec2(0.59, -0.63), vec2(0.59, -0.69), // lower corner bar end
            vec2(-0.17, -0.15), vec2(-0.17, -0.14), vec2(0.17, -0.15),
            vec2(-0.17, -0.14), vec2(0.17, -0.15), vec2(0.17, -0.14),
            vec2(-0.17, 0.15), vec2(-0.17, 0.14), vec2(-0.05, 0.15),
            vec2(-0.17, 0.14), vec2(-0.05, 0.15), vec2(-0.05, 0.14),
            vec2(0.17, 0.15), vec2(0.17, 0.14), vec2(0.05, 0.15),
            vec2(0.17, 0.14), vec2(0.05, 0.15), vec2(0.05, 0.14),
            vec2(-0.17, -0.14), vec2(-0.17, 0.14), vec2(-0.16, -0.14),
            vec2(-0.17, 0.14), vec2(-0.16, -0.14), vec2(-0.16, 0.14),
            vec2(0.17, -0.14), vec2(0.17, 0.14), vec2(0.16, -0.14),
            vec2(0.17, 0.14), vec2(0.16, -0.14), vec2(0.16, 0.14), // middle square end
        ];
        pacman = [
            vec2(cx + r, cy + r), vec2(cx + r, cy - r), vec2(cx - r, cy + r),
            vec2(cx + r, cy - r), vec2(cx - r, cy + r), vec2(cx - r, cy - r),
        ];
        console.log(border.length);
        for (var i = 0; i < border.length; i++) {
            points.push(border[i]);
        }
        for (var i = 0; i < border.length; i++) {
            colors.push(vec3(1.0, 0.0, 1.0));
        }
        // Boxes start after 108
        for (var i = 0; i < pacman.length; i++) {
            points.push(pacman[i]);
        }
        for (var i = 0; i < pacman.length; i++) {
            colors.push(vec3(0.0, 0.0, 1.0));
        }

        console.log(points);
        console.log(colors);
        // let temp = [vec2(-0.7, 1), vec2(-0.7, 0.66), vec2(-0.69, 1), vec2(-0.69, 0.66)]

        //
        //  Configure WebGL
        //
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        //  Load shaders and initialize attribute buffers

        program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);

        // Load the data into the GPU
        var bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        var offset = gl.getAttribLocation(program, "offset");


        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        var cbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        var center_x = gl.getUniformLocation(program, "center_x");
        gl.uniform1f(center_x, cx);
        var center_y = gl.getUniformLocation(program, "center_y");
        gl.uniform1f(center_y, cy);
        var radius = gl.getUniformLocation(program, "radius");
        gl.uniform1f(radius, r);
        var width = gl.getUniformLocation(program, "width");
        gl.uniform1f(width, canvas.width);
        var height = gl.getUniformLocation(program, "height");
        gl.uniform1f(height, canvas.height);

        render();

        // Associate out shader variables with our data buffer

    };


function render() {
    if (fin == 1) {
        factor += 0.005;
        if (factor >= 0.8) {
            fin = 0;
        }
    } else if (fin == 0) {
        factor -= 0.005;
        if (factor <= 0.4) {
            fin = 1;
        }
    }
    if (dec == 1) {
        theta1 -= 0.02;
        theta2 += 0.02;
        if (theta1 < theta_b) {
            dec = 0;
            inc = 1;
        }
    } else if (inc = 1) {
        theta1 += 0.01;
        theta2 -= 0.01;
        if (theta1 > theta_ul) {
            dec = 1;
            inc = 0;
        }
    }
    if (cx > 0.7 + r) {
        cx = -0.7
    } else if (cx < -0.7 - r) {
        cx = 0.7
    }
    pacman = [
        vec2(cx + r, cy + r), vec2(cx + r, cy - r), vec2(cx - r, cy + r),
        vec2(cx + r, cy - r), vec2(cx - r, cy + r), vec2(cx - r, cy - r),
    ];
    var validity = boundary_check();
    if (validity == 0) {
        for (var i = 0; i < pacman.length; i++) {
            points.pop();
        }
        for (var i = 0; i < pacman.length; i++) {
            points.push(pacman[i]);
        }
    } else {
        if (prev_dir == "ArrowRight") {
            cx -= 0.01;
        } else if (prev_dir == "ArrowLeft") {
            cx += 0.01;
        } else if (prev_dir == "ArrowUp") {
            cy -= 0.01;
        } else if (prev_dir == "ArrowDown") {
            cy += 0.01;
        }
        pacman = [
            vec2(cx + r, cy + r), vec2(cx + r, cy - r), vec2(cx - r, cy + r),
            vec2(cx + r, cy - r), vec2(cx - r, cy + r), vec2(cx - r, cy - r),
        ];
    }


    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    var center_x = gl.getUniformLocation(program, "center_x");
    gl.uniform1f(center_x, cx);
    var center_y = gl.getUniformLocation(program, "center_y");
    gl.uniform1f(center_y, cy);
    var t1 = gl.getUniformLocation(program, "t1");
    gl.uniform1f(t1, theta1);
    var t2 = gl.getUniformLocation(program, "t2");
    gl.uniform1f(t2, theta2);
    var clc = gl.getUniformLocation(program, "clc");
    gl.uniform1f(clc, factor);
    
    if (cnt == 100){
        cnt = 0;
        rc = vec3(Math.random()+0.1, Math.random()+0.1, Math.random()+0.1);
    }
    var rndclr = gl.getUniformLocation(program, "rndclr");
    gl.uniform3fv(rndclr, rc);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    cnt++;
    window.requestAnimationFrame(render);

}