
import { html, LitElement, property, query } from 'lit';

export class MyElement extends LitElement {
  constructor() {
    super();
    this.renderLoop = true;
    this.buffer_json = [{}];
    // this.renderLoop = !this.renderLoop;
    this.draw();
  }

  static get properties(){
    return {
      depth: {type: Number},
      signal : {type: Number},
      during : {type: Number},
      x : {type : Number},
      buffer_json : {type : Array}
    }
  }

  _createRects(numRects, buffer_json) {
    const width = 2 / 100;
    const rects = [];
    let x = this.x;
    // console.log(this.buffer_json.length);
    for (let i = 0; i < this.buffer_json.length; i++) {
      const y = buffer_json.at(i);
      
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
  _createRects_random(numRects ) {
    const width = 2 / numRects;
    const rects = [];
    let x = this.x;
    // console.log(this.buffer_json.length);
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
    console.log(this.buffer_json);
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");
    const shaderProgram = gl.createProgram();
    // const uTimeLoc = gl.getUniformLocation(shaderProgram, "u_time");
    // const uCursorLoc = gl.getUniformLocation(shaderProgram, "u_cursor");
    const vertices = this._createRects(this.signal, this.buffer_json);
    // const vertices = this._createRects_random(this.signal);
    
    const vertex_buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

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
    const fragCode = "void main(void) {gl_FragColor = vec4(0.1,0.1,0.1,1);}";

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

    // gl.uniform1f(uTimeLoc, Math.random());
    // gl.uniform1f(uCursorLoc, Math.random());

    // Get the attribute location
    const coord = gl.getAttribLocation(shaderProgram, "coords");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============ Drawing the triangle =============*/

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(255, 255, 255, 1);

    // Set the view port
    gl.viewport(0, canvas.height/2 - this.depth/2 , canvas.width, this.depth );

    
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.uniform1f(uTimeLoc, 1 / time);
    // gl.uniform1f(uCursorLoc, 1 / cursor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length/3 );
    // stats.end();
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
