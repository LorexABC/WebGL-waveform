function connectSampleStreamToWebGLWaveForm(){
    console.log("Connecting sample stream to component");
    let webglWavform = document.getElementById('wav');
    if(webglWavform!=null) console.log("Found display element.");

    connectStream(webglWavform);

}

function connectStream(el){

    // This must match the component config.
    let bitDepth = 4; // 16 values
    let sampleRate = 1000 // samples per second (need to get this update 44.1k)
    let intervalPeriodms = 100;
    let bufferSize = sampleRate*intervalPeriodms/1000;
    
    console.log("For a " + intervalPeriodms + " ms period at a sample rate of " + sampleRate
        + ", a " + bufferSize + " samples are needed each buffer.")
    
    setInterval(()=>{

        let samples = [];
        for(i = 0; i < 100; i++){
            let random = Math.random();
            let scaledByBitDepth = Math.pow(bitDepth,2) * random;
            samples.push(scaledByBitDepth);
        }

        el.updateBuffer(samples);

    }, intervalPeriodms);

}
connectSampleStreamToWebGLWaveForm();