
//VARIABLES GLOBALES
var sWidth = 512;
var sHeight = 480;

var iKeyUp = 38;
var iKeyDown = 40;
var iKeyLeft = 37;
var iKeyRight = 39;

var canvas;
var ctx;

var then;
//var canvas = document.createElement("canvas");
//var ctx = canvas.getContext("2d");

//canvas.width = sWidth;
//canvas.height = sHeight;

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
var radians = 0;


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
balaImage.src = "./images/bala.png";
	
// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0,
    width: 25,
    height: 25,
    speed: 128,
    incX: true,
    incY: true
};

var bala = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	rad: 0,
	speed: 128
};

var monstersCaught = 0;
	
// Handle keyboard controls
var keysDown = {};

//MONSTER_MOVIN
var monster_moving = function (modifier) {
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


function shoot() {
	bala.x = hero.x;
	bala.y = hero.y;
	bala.vx = mouseX - hero.x;
	bala.vy = mouseY - hero.y;
	bala.rad = radians;	
	
};

//MONSTER_MOVIN
var shoot_moving = function (modifier) {
    bala.x += bala.vx * modifier;
    bala.y += bala.vy * modifier;
};

	
// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
   	hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
   	monster.x = 32 + (Math.random() * (canvas.width - 64));
   	monster.y = 32 + (Math.random() * (canvas.height - 64));
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
	
	
    monster_moving(modifier);
    
    shoot_moving(modifier);

	// Are they touching?
    if (
		bala.x <= (monster.x + 25)
		&& monster.x <= (bala.x + 10)
		&& bala.y <= (monster.y + 25)
		&& monster.y <= (bala.y + 10)
	) {
	    ++monstersCaught;
    	reset();
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
    	radians = Math.atan2(mouseX - centerHeroX, mouseY - centerHeroY);
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
		ctx.drawImage(monsterImage, monster.x, monster.y);
   	}
   	
   	if(balaReady) {
		//ctx.drawImage(balaImage, bala.x, bala.y);
        ctx.save();
        ctx.translate(bala.x, bala.y); 
        ctx.rotate(-bala.rad); 
        ctx.drawImage(balaImage,0 - balaImage.width/2 ,0 - balaImage.height/2);
		ctx.restore();
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

function loadCanvas(id) {
    div = document.getElementById(id);     
    div.appendChild(canvas);
};

// Let's play this game!
function initGame() {
	
	// Create the canvas
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = sWidth;
	canvas.height = sHeight;
	
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
	
	loadCanvas('gameDiv');
	
	reset();
	then = Date.now();
	setInterval(main, 1); // Execute as fast as possible
	
	setInterval(shoot, 1000);
};




