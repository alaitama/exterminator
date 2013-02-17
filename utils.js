

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
   
};


function normalizeVector(vx, vy) {
    // Get absolute value of each vector
    ax = Math.abs(vx);
    ay = Math.abs(vy);

    // Create a ratio
    ratio = 1 / Math.max(ax, ay)
    ratio = ratio * (1.29289 - (ax + ay) * ratio * 0.29289)

    // Multiply by ratio
    ax = vx * ratio;
    ay = vy * ratio;
    
    //console.log("Normal de ("+vx+","+vy+") es ("+ax+","+ay+")");
    
    return [ax, ay];
};


CalculatorFPS = function() {
  var lastFPS = 0;
  var FPS = 0;

  return {
    calculateFPS: function(now, lastAnimationFrameTime) {
        FPS = 1000 / (now - lastAnimationFrameTime);
        FPS = FPS.toFixed(0);
        if(lastFPS != 0) {
            FPS = (lastFPS + FPS) / 2;
        }
    },
    getFPS: function() {
      return FPS;
    }
  }
}();
