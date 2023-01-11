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
    this.draw();
  }

  static get properties(){
    return {
      depth: {type: Number},
      signal : {type: Number},
  
      x : {type : Number},
      buffer_json : {type : Array}
    }
  }

  _createRects(numRects, buffer_json) {
    this.buffer_count ++;

    
    const width = 2 / numRects;
    const rects = [];
    let x = this.x;
    for (let i = 0; i < this.buffer_count; i++) {
      const y = buffer_json.at(i) / 65355;
      if (this.depth < 32678)
      {
        var temp = 0;
        console.log((((32678-this.depth) / 65355) ) + "========" + this.depth );
        if(y > (((32678-this.depth) / 65355) )){
          temp = -(this.depth / 65355);
        } else {
          temp = -y;
        }

        rects.push(
          // 1st triangle
          x, y ,0,
          x,temp ,0,
          x+width, y ,0,
          // x+width, -2 ,0,
          // // 2nd triangle
          x,temp , 0,
          x+width, y  ,0,
          x+width,temp  ,0,
        );  
      }
      else{
       
        if(y < (this.depth / 65355/2)){
          x+= width;
          continue;
          
        }
          
        var temp = (this.depth / 65355/2);
        console.log(temp + "=========" + y);
        rects.push(
          // 1st triangle
          x,temp ,0,
          x,y ,0,
          x+width,temp ,0,
          // 2nd triangle
          x,y , 0,
          x+width,y ,0,
          x+width,temp  ,0,
        );  
      }
      // prettier-ignore
      // rects.push(
      //   // 1st triangle
        // x,y ,0,
        // x,-y ,0,
        // x+width,y ,0,
        // // 2nd triangle
        // x,-y , 0,
        // x+width,y ,0,
        // x+width,-y  ,0,
      // );
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
      var y = Math.random();
      
      if (this.depth < (65355 /2))
      {
        var temp = 0;
        if(y > 0.5){
          temp = -0.2;
        } else {
          temp = -y;
        }

        // console.log(temp);
        rects.push(
          // 1st triangle
          x, y ,0,
          x,temp ,0,
          x+width, y ,0,
          // x+width, -2 ,0,
          // // 2nd triangle
          x,temp , 0,
          x+width, y  ,0,
          x+width,temp  ,0,
        );  
      }
      else{
        var temp = 0.9;
        
        if(y < 0.9){
          x += width;
          continue;
        }
          
        // console.log(temp);
        rects.push(
          // 1st triangle
          x, temp ,0,
          x,y ,0,
          x+width, temp ,0,
          // x+width, -2 ,0,
          // // 2nd triangle
          x,y , 0,
          x+width, temp  ,0,
          x+width,y  ,0,
        );  
      }
      
      x += width;
    }
    return rects;
  }


  draw(time = Math.random(), cursor = Math.random()) {

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

    // const uTimeLoc = gl.getUniformLocation(shaderProgram, "u_time");
    // gl.uniform1f(uTimeLoc, Math.random());
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

    // var stats = new Stats();
    // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom);

    // console.log(gl.ARRAY_BUFFER);
    // stats.begin();
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.uniform1f(uTimeLoc, 1 / time);
    // gl.uniform1f(uCursorLoc, 1 / cursor);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
    // stats.end();
    if (this.renderLoop && this.buffer_count <= this.buffer_json.length){
        setTimeout(() => {
          requestAnimationFrame(() => this.draw());
        }, 100);
        
        
    }
    // if (this.renderLoop) requestAnimationFrame(() => this.draw());
  }


  
  render() {  
    return html`
    
      Web Components are !
      <button @click="${this.clickHandler}">Click</button>
      <canvas id = "canvas" style="width: 100%; height: 100%;"></canvas>
      
      `;

  }

  clickHandler(){
    
    this.renderLoop = !this.renderLoop;
    this.draw();
  }
}




customElements.define('webgl-waveform', MyElement)
