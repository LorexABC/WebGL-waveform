import Stats from "stats.js";

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
canvas.style.height = `${window.innerHeight}px`;
canvas.style.width = `${window.innerWidth}px`;

/*======= Defining and storing the geometry ======*/
// rendering 1_000 triangles every 16ms

const vertices = createRects(500);

function createRects(numRects = 5000) {
  const width = 2 / numRects;
  const rects = [];
  let x = -1;

  for (let i = 0; i < numRects; i++) {
    const y = Math.random();
    // prettier-ignore
    rects.push(
      // 1st triangle
      x,y,0,
      x,-y,0,
      x+width,y,0,
      // 2nd triangle
      x,-y,0,
      x+width,y,0,
      x+width,-y,0,
    );
    x += width;
  }
  return rects;
}

// Create an empty buffer object
const vertex_buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

/*=================== Shaders ====================*/

// Vertex shader source code
const vertCode = `
  attribute vec3 coords;
  uniform float u_time;
  uniform float u_cursor;

  float rand (vec2 st) {
      return fract(sin(dot(st.xy,
                          vec2(12.9898,78.233)))*
          43758.5453123);
  }

  void main(void) {
    float y = coords.y * rand(vec2(u_time, abs(coords.y)));
  
    gl_Position = vec4(
      coords.x,
      y,
      0,
      1.0
    );
  }
`;

// Create a vertex shader object
const vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

// Fragment shader source code
const fragCode = "void main(void) {gl_FragColor = vec4(0.5,0.5,0.5,1);}";

// Create fragment shader object
const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragmentt shader
gl.compileShader(fragShader);

// Create a shader program object to store
// the combined shader program
const shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both the programs
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

/*======= Associating shaders to buffer objects ======*/

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

const uTimeLoc = gl.getUniformLocation(shaderProgram, "u_time");
gl.uniform1f(uTimeLoc, Math.random());
const uCursorLoc = gl.getUniformLocation(shaderProgram, "u_cursor");
gl.uniform1f(uCursorLoc, Math.random());

// Get the attribute location
const coord = gl.getAttribLocation(shaderProgram, "coords");

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

// Enable the attribute
gl.enableVertexAttribArray(coord);

/*============ Drawing the triangle =============*/

// Enable the depth test
gl.enable(gl.DEPTH_TEST);

gl.clearColor(0, 0, 0, 1);

// Set the view port
gl.viewport(0, 0, canvas.width, canvas.height);

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

let renderLoop = false;

function draw(time = Math.random(), cursor = Math.random()) {
  stats.begin();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform1f(uTimeLoc, 1 / time);
  gl.uniform1f(uCursorLoc, 1 / cursor);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
  stats.end();
  if (renderLoop) requestAnimationFrame(() => draw());
}

draw();

document.querySelector(".render-loop input").addEventListener("click", () => {
  renderLoop = !renderLoop;
  draw();
});

document.addEventListener("mousemove", (e) => {
  // Clear the color and depth buffer
  if (!renderLoop) {
    requestAnimationFrame(() => {
      draw(e.deltaX, e.deltaY);
    });
  }
});

window.addEventListener("resize", (e) => {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.height = `${window.innerHeight}px`;
  canvas.style.width = `${window.innerWidth}px`;
  gl.viewport(0, 0, canvas.width, canvas.height);
  if (!renderLoop) {
    draw(e.offsetX, e.offsetY);
  }
});
