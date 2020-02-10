<!DOCTYPE html>
<!-- saved from url=(0040)http://sha-grisha.ru/psu/webgl/3D.1.html -->
<html lang="ru"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="./styles.css">
        <!-- <link rel="shortcut icon" href="./../favicon.png" type="image/png"> -->
        <script src="./scripts/webgl-utils.js"></script>
        <script src="./scripts/matrix.js"></script>
        <script src="./scripts/models.js"></script>
        <script src="./scripts/globals.js"></script>
        <script src="./scripts/point.js"></script>
        <script src="./scripts/many_models.js"></script>
        <script src="./scripts/event_listener.js"></script>
        <script id="3d-vertex-shader-texture" type="GLSL">
            attribute vec2 a_position;
            attribute vec2 a_textcoord;
            uniform mat3 u_MV;
            varying vec2 v_textcoord;
            void main() {
                v_textcoord = a_textcoord;
                vec3 position2d = u_MV * vec3(a_position, 1.0);
                gl_Position = vec4(position2d.x, position2d.y, 0.0, 1.0);
            }
        </script>
        <script id="3d-fragment-shader-texture" type="GLSL">
            precision mediump float;
            uniform sampler2D u_texture;
            varying vec2 v_textcoord;
            void main() {
                gl_FragColor = texture2D(u_texture, v_textcoord);                    
            }
        </script>
        <script id="3d-vertex-shader-color" type="GLSL">
            attribute vec2 a_position;
            uniform mat3 u_MV;
            varying vec2 v_pos;
            void main() {
                v_pos = a_position;
                vec3 position2d = u_MV * vec3(a_position, 1.0);
                gl_Position = vec4(position2d.x, position2d.y, 0.0, 1.0);
            }
        </script>        
        <script id="3d-fragment-shader-color" type="GLSL">
            precision mediump float;
            uniform vec3 u_color;
            varying vec2 v_pos;  

            vec2 getNewXY(float x, float y, float xx, float yy) {
                //return vec2(x * x - y * y + xx, 2.0 * x * y + yy);
                return vec2(x * x - y * y + xx, x * y * 2.0 + yy);
            }      

            vec3 getColorPos(float ratio, vec3 c0, vec3 c1, float steps, float mx) {
                //return (c1 * steps + c0 * (mx - steps)) / mx;  
                //return (c0 * steps + c1 * (mx - steps)) / mx;
                // return c1;
                return (c0 + c1 * ratio) / (ratio + 1.0);
            }    

            vec3 getColorNeg(float ratio, vec3 c0, vec3 c1, float steps, float mx) {
                return (c0 + c1 * ratio) / (ratio + 1.0);
                //return c1;
            }    

            
            const vec3 c0 = vec3(0.0, 0.0, 1.0);            
            const vec3 cN = vec3(1.0, 1.0, 1.0);
            const vec3 cP = vec3(0.0, 1.0, 0.0);
            const int mx = 34;
            const float INF_LEN = 1000.0;

            vec4 cntColor(vec2 point) {                
                vec2 cur = point;
                vec2 cur10;
                int steps_to_inf = -1;
                for (int i = 0; i < mx; i++) {
                    if (steps_to_inf == -1) {
                        cur = getNewXY(cur.x, cur.y, point.x, point.y);
                        if (length(cur) > INF_LEN) {
                            steps_to_inf = i + 1;                        
                        }                        
                    }
                }

                if (length(point) == 0.0) {
                    return vec4(c0, 1.0);
                }

                vec3 col;
                if (steps_to_inf == -1) {                    
                    vec2 kk = cur - point;
                    kk = kk / length(kk);
                    kk = kk * 0.5 + vec2(1.0, 1.0);
                    float ratio = clamp(0.8 * length(point) / length(cur), 0.0, 1.0);
                    col = vec3(0.0, kk.x, kk.y) * ratio;
                    //col = vec3(ratio, ratio, ratio);
                } else {
                    float k1 = log(float(steps_to_inf));
                    float k2 = 3.0;
                    col = (k1 * cP + k2 * c0) / (k1 + k2);
                }

                return vec4(col, 1.0);
            }

            void main() {                
                gl_FragColor = cntColor(v_pos);
            }
        </script>
        <title>many 2D Models by Sert</title>
    </head>
    <body onload="setScene()">    	
    <canvas id="canvas">
        Your browser is so bad and old, that can't do anything!
    </canvas>

</body></html>