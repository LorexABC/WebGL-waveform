import Stats from "stats.js";
import { html, LitElement, property, query_Selector } from 'lit';

export class MyElement extends LitElement {
  constructor() {
    super();
    this.renderLoop = true;
    this.buffer_json = [{}];
    this.buffer_count = 0;
    // this.renderLoop = !this.renderLoop;
    
  }

  firstUpdated(){
    const canvas = this.shadowRoot.querySelector('#canvas')
    const gl = canvas.getContext("webgl");

    const vertices = this._createRects(this.signal, this.buffer_json);
    // const vertices = this._createRects_random(this.signal);
    
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
    // const uCursorLoc = gl.getUniformLocation(shaderProgram, "u_cursor");
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

    gl.clearColor(0, 0, 0, 1);

    // Set the view port
    gl.viewport(0, 0 , canvas.width, canvas.height );


  }

  updateBuffer(sampleArr){
      console.log("buffer updating..");
      // TODO add code to manage display
      this.draw(sampleArr);
  }

  static get properties(){
    return {
      depth: {type: Number},
      signal : {type: Number},
      sampleRate : {type: Number},
      x : {type : Number},
      buffer_json : {type : Array}
    }
  }

  _createRects( buffer_json) {
    const width = 2 / buffer_json.length;
    const rects = [];
    let x = -0.9;
    console.log(buffer_json.length)
    for (let i = 0; i < buffer_json.length; i++) {
      const y = buffer_json.at(i) /(2 ** this.depth);
      console.log(y);
      // prettier-ignore
      rects.push(
        // 1st triangle
        x,y,0,
        x,-y,0,
      );
      x += width;
    }
    return rects;
  }
  draw(sampleArr) {
    const canvas = this.shadowRoot.querySelector('#canvas')
    const gl = canvas.getContext("webgl");

    const vertices = this._createRects(sampleArr);
    // const vertices = this._createRects_random(this.signal);
    
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

    void main(void) {

      gl_Position = vec4(
        coords.x,
        coords.y,
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
    // const uCursorLoc = gl.getUniformLocation(shaderProgram, "u_cursor");
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

    gl.clearColor(0, 0, 0, 1);

    // Set the view port
    gl.viewport(0, 0 , canvas.width, canvas.height );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, sampleArr.length);
    // if (this.renderLoop && this.buffer_count <= this.buffer_json.length){
    //     setTimeout(() => {
    //       requestAnimationFrame(() => this.draw());
    //     }, 10);
    // }
    // if (this.renderLoop) requestAnimationFrame(() => this.draw(gl,uTimeLoc));
  } 
  render() {  
    return html`
    
      Web Components are !
      <button @click="${this.clickHandler}">Click</button>
      <canvas id = "canvas" style="width: 100%; height: 100%;"  ></canvas>
      
      `;
  }

  clickHandler(){
    
    this.renderLoop = !this.renderLoop;
    this.draw();
  }
}




customElements.define('webgl-waveform', MyElement)
