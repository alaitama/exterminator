
console.log("Init...");


function Monster(posX, posY, incX, incY){
    var self = this;
    self.x = posX;
    self.y = posY;
    self.width = 25;
    self.height = 25;
    self.speed = 128;
    self.incX = incX;
    self.incY = incY;
}
Monster.prototype.printPosition = function() {
  console.log("Posicion: x="+this.x+" y="+this.y);  
};

//VARIABLES GLOBALES
var sWidth = 512;
var sHeight = 480;

var iKeyUp = 38;
var iKeyDown = 40;
var iKeyLeft = 37;
var iKeyRight = 39;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

canvas.width = sWidth;
canvas.height = sHeight;

document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "./images/fondo.png";

//Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "./images/hero.png";

//Mouse interact Hero
var mouseX = 0;
var mouseY = 0;


//Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "./images/monster.png";

//Bala image
var balaReady = false;
var balaImage = new Image();
balaImage.onload = function () {
    balaReady = true;
};
monsterImage.src = "./images/bala.png";
	
// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};

var bala = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	rad: 0
};

var monstersCaught = 0;
var monsterList = [];
var numMonsters = 25;
	
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

canvas.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
        
}, true);

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
   	hero.y = canvas.height / 2;

    for(var i=0;i<numMonsters;i++) {
        
        // Throw the monster somewhere on the screen randomly
        var randx = 32 + (Math.random() * (canvas.width - 64));
        var randy = 32 + (Math.random() * (canvas.height - 64));
        var randIncX = Math.random() < 0.5 ? true : false;
        var randIncY = Math.random() < 0.5 ? true : false;
        
        var newMonster = new  Monster(randx, randy, randIncX, randIncY);
        monsterList.push(newMonster);
    }
};

//MONSTER_MOVIN
var monster_moving = function (monster, modifier) {
    if (monster.incX) {
        monster.x += monster.speed * modifier;
        if (monster.x + monster.width >= sWidth) {
            monster.incX = false;
        }
    }
    else {
        monster.x -= monster.speed * modifier;
        if (monster.x <= 0) {
            monster.incX = true;
        }
    }

    if (monster.incY) {
        monster.y += monster.speed * modifier;
        if (monster.y + monster.height >= sHeight) {
            monster.incY = false;
        }
    } else {
        monster.y -= monster.speed * modifier;
        if (monster.y <= 0) {
            monster.incY = true;
        }
    }
};


// Update game objects
var update = function (modifier) {
    if (iKeyUp in keysDown) { // Player holding up
	    hero.y -= hero.speed * modifier;
    }
	if (iKeyDown in keysDown) { // Player holding down
    	hero.y += hero.speed * modifier;
	}
    if (iKeyLeft in keysDown) { // Player holding left
	   	hero.x -= hero.speed * modifier;
    }
    if (iKeyRight in keysDown) { // Player holding right
    	hero.x += hero.speed * modifier;
    }
	
	for(var i=0;i<numMonsters;i++)
        monster_moving(monsterList[i], modifier);

	// Are they touching?
    for(var i=0;i<numMonsters;i++) {
        var currentMonster = monsterList[i];
        if (
            hero.x <= (currentMonster.x + 32)
            && currentMonster.x <= (hero.x + 32)
            && hero.y <= (currentMonster.y + 32)
            && currentMonster.y <= (hero.y + 32)
        ) {
            ++monstersCaught;
            reset();
        }
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
   		ctx.drawImage(bgImage, 0, 0);
    }

   	if (heroReady) {
    	//ctx.drawImage(heroImage, hero.x, hero.y);
    	var centerHeroX = hero.x; // - heroImage.width/2;
    	var centerHeroY = hero.y; // - heroImage.height/2;
    	//console.log(heroImage.x);
    	var radians = Math.atan2(mouseX - centerHeroX, mouseY - centerHeroY);
        var degree = (radians * (180 / Math.PI) * -1) + 90; 
        //ctx.rotate(Math.PI / 180 * 0.5); // 1/2 a degree
        //console.log(degree);
        ctx.save();
        ctx.translate(centerHeroX, centerHeroY); 
        ctx.rotate(-radians); 
        ctx.drawImage(heroImage,0 - heroImage.width/2 ,0 - heroImage.height/2);
        //ctx.rotate(radians);
        //ctx.translate(-centerHeroX,-centerHeroY);
		ctx.restore();
   	}
	
   	if (monsterReady) {
        for(var i=0;i<numMonsters;i++) {
            var currentMonster = monsterList[i];
            ctx.drawImage(monsterImage, currentMonster.x, currentMonster.y);
        }
   	}

    // Score
   	ctx.fillStyle = "rgb(250, 250, 250)";
   	ctx.font = "12px Helvetica";
   	ctx.textAlign = "left";
   	ctx.textBaseline = "top";
   	ctx.fillText("Goblins caught: " + monstersCaught, 1, 1);
};


// The main game loop
var main = function () {
    var now = Date.now();
   	var delta = now - then;

    update(delta / 1000);
   	render();

    then = now;
};


// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
//var book1 = new Book("High Performance JavaScript", "Yahoo! Press");
//var book2 = new Book("JavaScript: The Good Parts", "Yahoo! Press");
//console.log(book1 instanceof Book); //true
//console.log(book1 instanceof Object); //true
//book1.sayTitle(); //"High Performance JavaScript"
//console.log(book1.toString()); //"[object Object]"
/*
var monsters = [];
var numMonsters = 5;
for(var i=0;i<numMonsters;i++) {
    var monster = new Monster(i+1,(i+1)*2);
    monsters.push(monster);
}

console.log(monsters.length);
for(var i=0;i<monsters.length;i++) {
    var monster = monsters[i];
    monster.printPosition();
}
*/

reset();
for(var i=0;i<numMonsters;i++) {
    monsterList[i].printPosition();
}

console.log("Done");
