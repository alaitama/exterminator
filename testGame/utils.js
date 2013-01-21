

function existsRequestAnimationFrame() {
    raf = window.mozRequestAnimationFrame    ||
          window.webkitRequestAnimationFrame ||
          window.msRequestAnimationFrame     ||
          window.oRequestAnimationFrame      ||
          window.requestAnimationFrame;
    if(raf) {
        console.log("Existe requestAnimationFrame");
        return true;
    }
    else {
        console.log("No existe requestAnimationFrame");
        return false;
    }
};


/*
function calculateFps() {
    var now = +new Date(),
        fps = 1000 / (now - lastTime);
        
    lastTime = now;
    
    return fps;
}
*/

    
function calculateFps(now, lastAnimationFrameTime) {
    
   var fps = 1000 / (now - lastAnimationFrameTime);
   return fps.toFixed(0);
   
}
