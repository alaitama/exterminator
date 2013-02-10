/*
 * HERO CLASS
 */
var Hero = function(posX, posY, sWidth, sHeight) {
    var self = this;
    self.x = posX,
	self.y = posY,
	self.width = 57, //42,// 64,
	self.height = 64, //47, // 64,
	self.radians = 0; 
    self.radiansDraw = 0;

    self.jumping = false;
    self.jumpSpeed = 300;
    //Dimension where the Hero can move
    self.areaWidth = sWidth;
    self.areaHeight = sHeight;
    
    self.life = 1000;
    // Animation settings
    self.vx = 0,
    self.vy = 0,
	//self.animSet = 4,
    self.animShotFrame = 0,
    self.animShotNumFrames = 2,
    self.animShotDelay = 200,
    self.animShotTimer = 0,
    
	self.animJumpFrame = 0,
	self.animJumpNumFrames = 4,
	self.animJumpDelay = 200,
	self.animJumpTimer = 0;
    
}

Hero.prototype.draw = function(ctx, heroImage) {
    var self = this;
    
    //console.log("DIBUJA " + self.x + ","+self.y)
    var spriteX = 0;
    if(self.jumping)
        spriteX = (this.animJumpFrame * this.width);
    else {
        if(self.animShotFrame > 0)
            spriteX = self.animJumpNumFrames * this.width;
    }
    
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

Hero.prototype.update = function(mouseX, mouseY, jumpX, jumpY, modifier) {
    var self = this;
    
    //Si no esta saltando, giramos
    /*
    if(jumpX!=0 || jumpY!=0) {
        self.jumping = true;
    }*/
    
    if(jumpX==0 && jumpY ==0) {
        self.radians = Math.atan2(mouseX - self.x, mouseY - self.y);
        //var degree = (radians * (180 / Math.PI) * -1) + 180; 
        
        self.animShotTimer += modifier*1000;
        if (self.animShotTimer >= self.animShotDelay) {
            // Enough time has passed to update the animation frame
            self.animShotTimer = 0; // Reset the animation timer
            ++self.animShotFrame;
            if (self.animShotFrame >= self.animShotNumFrames) {
                // We've reached the end of the animation frames; rewind
                self.animShotFrame = 0;
            }
        }
        
    }
    //Si esta saltando movemos
    else {
        //console.log("SALTANDOOOOO " + self.jumping);
        //self.jump(jumpX, jumpY, modifier);  
        //Si no esta saltando, calculamos posicion de salto
        if(!self.jumping) {
            console.log("JUMPING TRUE");
            self.jumping = true;
            self.vx = jumpX - self.x;
            self.vy = jumpY - self.y;

            var vecNormalized = normalizeVector(self.vx, self.vy);
            self.vx = vecNormalized[0] * self.jumpSpeed;
            self.vy = vecNormalized[1] * self.jumpSpeed;
                    
            ++self.animJumpFrame;
                    
        }
        
        self.x += self.vx * modifier;
        self.y += self.vy * modifier;
        
        //Control if Hero out of screen
        var middleWidth = self.width/2;
        var middleHeight = self.height/2;
        if(self.x < middleWidth)
            self.x = middleWidth;
        else if(self.x > self.areaWidth - middleWidth)
            self.x = self.areaWidth - middleWidth;
        else if(self.y < middleHeight)
            self.y = middleHeight;
        else if(self.y > self.areaHeight - middleHeight)
            self.y = self.areaHeight - middleHeight;
    
        self.animJumpTimer += modifier*1000;
        if (self.animJumpTimer >= self.animJumpDelay) {
            // Enough time has passed to update the animation frame
            self.animJumpTimer = 0; // Reset the animation timer
            ++self.animJumpFrame;
            if (self.animJumpFrame >= self.animJumpNumFrames) {
                // We've reached the end of the animation frames; rewind
                self.animJumpFrame = 0;
                console.log("JUMPING FALSE");
                self.jumping = false;
            }
        }
    }
}

Hero.prototype.jump = function(jumpX, jumpY, modifier) {
    //Si no esta saltando, calculamos posicion de salto
    if(!self.jumping) {
        console.log("JUMPING TRUE");
        self.jumping = true;
        self.vx = jumpX - self.x;
        self.vy = jumpY - self.y;

        var vecNormalized = normalizeVector(self.vx, self.vy);
        self.vx = vecNormalized[0] * self.jumpSpeed;
        self.vy = vecNormalized[1] * self.jumpSpeed;
                
        ++self.animFrame;
                
    }
            
    self.x += self.vx * modifier;
    self.y += self.vy * modifier;
            
    self.animTimer += modifier*1000;
    if (self.animTimer >= self.animDelay) {
        // Enough time has passed to update the animation frame
        self.animTimer = 0; // Reset the animation timer
        ++self.animFrame;
        if (self.animFrame >= self.animNumFrames) {
            // We've reached the end of the animation frames; rewind
            self.animFrame = 0;
            console.log("JUMPING FALSE");
            self.jumping = false;
        }
    }
    
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
var Monster = function (){
    var self = this;
    self.width = 42,
    self.height = 50,
    
    self.x = 0,
    self.y = 0,
    self.radians = 0;
    
    self.points = 10;
    
    //Movement variables
    self.speed = 200,
    self.plusMinus = false,
    self.noChangeDirTimer = 0,
    self.noChangeDirDelay = 400,
    self.stopTimer = 0,
    self.stopDelay = 2000,
    self.vx = 0,
    self.vy = 0;
    
    //Animation 
    self.animFrame = 0;
    self.animNumFrames = 4;
    self.animDelay = 200;
    self.animTimer = 0;
    
    self.counter = 0;
    
    //initPosition(sWidth, sHeight);
}

Monster.prototype.draw = function(ctx, monsterImage) {
    var self = this;
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
    ctx.save();
    ctx.translate(self.x, self.y); 
    ctx.rotate(-self.radians); 
        
    ctx.drawImage(
        monsterImage,
        spriteX, 0, self.width, self.height,
        0 - self.width/2, 0 - self.height/2, self.width, self.height
    );
    ctx.restore();
        
	
}

/*
 * Random position arround the perimeter of the canvas
 */
Monster.prototype.initPosition = function(sWidth, sHeight) {
    var self = this;
    //Random side: 0 left, 1 top, 2 right, 3 bottom
    var showSide = Math.floor(Math.random() * 4);
    var posX = 0;
    var posY = 0;
    //left
    if(showSide==0) {
        posX = 0 - self.width;
        posY = Math.random() * sHeight;
    }
    //top
    else if(showSide==1) {
        posX = Math.random() * sWidth;
        posY = 0 - self.height;
    }
    //right
    else if(showSide==2) {
        posX = sWidth + self.width;
        posY = Math.random() * sHeight;
    }
    //bottom
    else if(showSide==3) {
        posX = Math.random() * sWidth;
        posY = sHeight + self.height;
    }
    
    self.x = posX;
    self.y = posY;
}

Monster.prototype.update = function(heroX, heroY, modifier) {
    this.noChangeDirTimer += modifier*1000;
    //var newNoChangeDirDelay = Math.random()*1.8*this.noChangeDirDelay;
    if (this.noChangeDirTimer >= this.noChangeDirDelay) {
        // Enough time has passed to update the animation frame
        this.stopTimer += modifier*1000;
        this.vx = 0, this.vy = 0;
        //var newStopDelay = Math.random()*2*this.stopDelay;
        if(this.stopTimer >= this.stopDelay) {
            this.noChangeDirTimer = 0; // Reset the animation timer
            this.stopTimer = 0;
            
            
            this.radians = Math.atan2(heroX - this.x, heroY - this.y);
            
            this.vx = heroX - this.x;
            this.vy = heroY - this.y;
            
            /*
            this.waveX = this.vx + Math.cos(this.counter)*1000;
            this.waveY = this.vy + Math.sin(this.counter)*1000;
            */
            
            var vecNorm = normalizeVector(this.vx, this.vy);
            this.vx = vecNorm[0] * this.speed;
            this.vy = vecNorm[1] * this.speed;
        }
    }
    
    this.counter ++ ;
    
    this.x = this.x + this.vx*modifier;
    this.y = this.y + this.vy*modifier;

    
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
    self.speed = 300;
    
    var vecNorm = normalizeVector(vx, vy);
    self.vx = vecNorm[0] * self.speed;
    self.vy = vecNorm[1] * self.speed;
}

Shot.prototype.draw = function(ctx, balaImage) {
    ctx.save();
    ctx.translate(this.x, this.y); 
    ctx.rotate(-this.rad); 
    ctx.drawImage(balaImage,0 - balaImage.width/2 ,0 - balaImage.height/2);
    //ctx.drawImage(balaImage,0 ,0);
    ctx.restore();
}





