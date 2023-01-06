
import { html, LitElement, property, query } from 'lit';
import Stats from "stats.js";

export class MyElement extends LitElement {
  constructor() {
    super();
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");
    const vertices = this._createRects(500);
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

    
    

    let renderLoop = false;

    this.draw();
  

  }

  
  _createRects(numRects = 5000) {
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


  draw(time = Math.random(), cursor = Math.random()) {
    var stats = new Stats();
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    stats.begin();
    const shaderProgram = gl.createProgram();
    const uTimeLoc = gl.getUniformLocation(shaderProgram, "u_time");
    const uCursorLoc = gl.getUniformLocation(shaderProgram, "u_cursor");
    const vertices = this._createRects(500);
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

    gl.uniform1f(uTimeLoc, Math.random());
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



    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(uTimeLoc, 1 / time);
    gl.uniform1f(uCursorLoc, 1 / cursor);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
    stats.end();
    if (this.renderLoop) requestAnimationFrame(() => this.draw());
  }


  
  render() {  
    return html`
      Web Components are !
      <button @click="${this.clickHandler}">Click</button>
    `;

  }

  clickHandler(){
    
    this.renderLoop = !this.renderLoop;
    this.draw();
  }
}




customElements.define('test-element', MyElement)
