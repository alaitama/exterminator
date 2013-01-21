/*
 * MONSTER CLASS
 */
var Monster = function (posX, posY, incX, incY){
    var self = this;
    self.x = posX,
    self.y = posY,
    self.width = 25,
    self.height = 25,
    self.speed = 128,
    self.incX = incX,
    self.incY = incY;
}

Monster.prototype.draw = function(ctx, monsterImage) {
        ctx.drawImage(monsterImage, this.x, this.y);
}


/*
 * SHOT CLASS
 */
function Shot(posX, posY, vx, vy, rad){
    var self = this;
    self.x = posX,
    self.y = posY,
    self.width = 10,
    self.height = 10,
    self.vx = vx,
    self.vy = vy,
    self.rad = rad;
}

Shot.prototype.draw = function(ctx, balaImage) {
    ctx.save();
    ctx.translate(this.x, this.y); 
    ctx.rotate(-this.rad); 
    ctx.drawImage(balaImage,0 - balaImage.width/2 ,0 - balaImage.height/2);
    ctx.restore();
}





