
function calculateFps() {
    var now = +new Date(),
        fps = 1000 / (now - lastTime);
        
    lastTime = now;
    
    return fps;
}
