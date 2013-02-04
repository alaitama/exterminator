/*
 * HERO CLASS
 */
var Hero = function(posX, posY) {
    var self = this;
    self.x = posX,
	self.y = posY,
	self.width = 64,
	self.height = 64,
	self.radians = 0; 
	// Animation settings
    self.jumping = false,
    self.vx = 0,
    self.vy = 0,
	self.animSet = 4,
	self.animFrame = 0,
	self.animNumFrames = 4,
	self.animDelay = 100,
	self.animTimer = 0
    
}

Hero.prototype.draw = function(ctx, heroImage) {
    var self = this;
    
    //console.log("DIBUJA " + self.x + ","+self.y)
    
    var spriteX = (this.animFrame * this.width);
    
    var centerHeroX = self.x;
    var centerHeroY = self.y;
    
    // Render image to canvas
    ctx.save();
    ctx.translate(centerHeroX, centerHeroY); 
    ctx.rotate(-self.radians); 
    
    
    ctx.drawImage(
        heroImage,
        spriteX, 0, self.width, self.height,
        0 - self.width/2, 0 - self.height/2, self.width, self.height
    );
    
    //ctx.drawImage(heroImage, 0 - self.width/2, 0 - self.height/2);
    
    ctx.restore();
    
    //ctx.drawImage(heroImage, self.x, self.y);
        
}


/*
 * MONSTER CLASS
 */
var Monster1 = function (posX, posY, incX, incY){
    var self = this;
    self.x = posX,
    self.y = posY,
    self.width = 62,
    self.height = 64,
    self.speed = 128,
    self.incX = incX,
    self.incY = incY;
    self.animFrame = 0;
    self.animNumFrames = 4;
    self.animDelay = 200;
    self.animTimer = 0;
}

Monster1.prototype.draw = function(ctx, monsterImage) {
        //ctx.drawImage(monsterImage, this.x, this.y);
        
        // Determine which part of the sprite sheet to draw from
        /*
		var spriteX = (
			(this.animSet * (this.width * this.animNumFrames)) +
			(this.animFrame * this.width)
		);
        */
        
        var spriteX = (this.animFrame * this.width);
        
        // Render image to canvas
		ctx.drawImage(
			monsterImage,
			spriteX, 0, this.width, this.height,
			this.x, this.y, this.width, this.height
		);
}

/*
 * MONSTER CLASS
 */
var Monster = function (posX, posY, incX, incY){
    var self = this;
    self.x = posX,
    self.y = posY,
    self.width = 42,
    self.height = 50,
    self.speed = 128,
    self.incX = incX,
    self.incY = incY;
    self.animFrame = 0;
    self.animNumFrames = 4;
    self.animDelay = 200;
    self.animTimer = 0;
}

Monster.prototype.draw = function(ctx, monsterImage) {
        //ctx.drawImage(monsterImage, this.x, this.y);
        
        // Determine which part of the sprite sheet to draw from
        /*
		var spriteX = (
			(this.animSet * (this.width * this.animNumFrames)) +
			(this.animFrame * this.width)
		);
        */
        
        var spriteX = (0 * this.width);
        
        // Render image to canvas
		ctx.drawImage(
			monsterImage,
			spriteX, 0, this.width, this.height,
			this.x, this.y, this.width, this.height
		);
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
    //ctx.drawImage(balaImage,0 ,0);
    ctx.restore();
}





