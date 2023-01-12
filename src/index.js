import Stats from "stats.js";
import { html, LitElement, property, query_Selector } from 'lit';

export class MyElement extends LitElement {
  constructor() {
    super();
    this.renderLoop = true;
    this.buffer_json = [{}];
    this.temp_buffer = [{}];
    this.buffer_count = 0;
    // this.renderLoop = !this.renderLoop;
    
    
  }

  firstUpdated(){
    const canvas = this.shadowRoot.querySelector('#canvas')
    console.log(canvas);
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


    this.draw(gl ,uTimeLoc);

  }

  updateBuffer(sampleArr){
      console.log("buffer updating..");
      // gl.uniform1f(uTimeLoc, 1 / time);
      // TODO add code to manage display

      this.buffer_json = [
        1000,
        2000,
        100,
        300,
        0,
        0,
        0,
        100,
        0,
        200,
        0,
        6000,
        0,
        16,
        13,
        1020,
        856,
        29490,
        30491,
        28460,
        28387,
        29452,
        29179,
        31068,
        28270,
        28772,
        30732,
        29630,
        27902,
        26223,
        31250,
        29822,
        23244,
        26052,
        24036,
        28660,
        27555,
        31349,
        4590,
        5280,
        29863,
        29280,
        12147,
        27570,
        25651
    ];


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

  _createRects(numRects, buffer_json) {
    const width = 2 / numRects;
    const rects = [];
    let x = -1;
  
    for (let i = 0; i < buffer_json.length; i++) {
      const y = buffer_json.at(i) /(2 ** this.depth);
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
  

  draw(gl , uTimeLoc) {
    var time = Math.random()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(uTimeLoc, 1 / time);
    gl.drawArrays(gl.LINES, 0, this.buffer_json.length * 6);
    // stats.end();
    // if (this.renderLoop && this.buffer_count <= this.buffer_json.length){
    //     setTimeout(() => {
    //       requestAnimationFrame(() => this.draw());
    //     }, 10);
    // }
    if (this.renderLoop) requestAnimationFrame(() => this.draw(gl,uTimeLoc));
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
