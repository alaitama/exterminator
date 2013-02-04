

(function(ns){
    
    var DEBUG = true;

    //VARIABLES GLOBALES
    var sWidth = 512;
    var sHeight = 480;

    var iKeyUp = 38;
    var iKeyDown = 40;
    var iKeyLeft = 37;
    var iKeyRight = 39;

    //Mouse interact Hero
    var mouseX = 0;
    var mouseY = 0;
    var radians = 0;
    var jumpX = 0;
    var jumpY = 0;

    //Canvas element and Context
    var canvas;
    var ctx;
    //Element for FPS
    var fpsElement = null;

    //Time refresh
    var then;

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
    //heroImage.src = "./images/hero.png";
    heroImage.src = "./images/heroe_sprite64.png";

    //Monster image
    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
        monsterReady = true;
    };
    //monsterImage.src = "./images/cucasprite_64.png";
    monsterImage.src = "./images/monster.png";

    //Bala image
    var balaReady = false;
    var balaImage = new Image();
    balaImage.onload = function () {
        balaReady = true;
    };
    balaImage.src = "./images/bala.png";
        
    // Game objects
    /*
    var hero = {
        speed: 256, // movement in pixels per second
        x: 0,
        y: 0
    };
    */
    var hero = null;
    
    //Variables globales
    var balaList = [];
    var monsterList = [];
    var numMonsters = 30;
    var timerShoot = 500;
    var idShootThread = null;
    
    var monstersCaught = 0;
        
    // Handle keyboard controls
    var keysDown = {};
    
    function loadCanvas(id) {
        div = document.getElementById(id);     
        div.appendChild(canvas);
    };

    // Let's play this game!
    initGame = function () {
        
        // Create the canvas
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");

        canvas.width = sWidth;
        canvas.height = sHeight;
        
        
        canvas.addEventListener('dblclick', function(e) {
            jumpX = e.clientX;
            jumpY = e.clientY;
            
            if(DEBUG)
                console.log("Jumped to: x=" + jumpX + ",y=" + jumpY);
                
        }, true);

        canvas.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            console.log    
        }, true);
        
        loadCanvas('gameDiv');
        
        fpsElement = document.getElementById('fps');
        
        reset();
        then = Date.now();
        
        requestAnimationFrame(main);
        
    };
    
    // Reset the game when the player catches a monster
    reset = function () {
        
        hero = new Hero(0,0);
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
        if(idShootThread!=null)
			window.clearInterval(idShootThread);
        idShootThread = setInterval(shoot, timerShoot);
    };
    
    // Update game objects
    var update = function (modifier) {
        
        //Si no esta saltando, giramos
        if(jumpX==0 && jumpY==0) {
            
            hero.radians = Math.atan2(mouseX - hero.x - hero.width, mouseY - hero.y);
            var degree = (radians * (180 / Math.PI) * -1) + 180; 
        }
        //Si esta saltando movemos
        else {
            if(!hero.jumping) {
                hero.jumping = true;
                hero.vx = jumpX - hero.x - hero.width;
                hero.vy = jumpY - hero.y;
            }
            
            hero.x += hero.vx * modifier;
            hero.y += hero.vy * modifier;
            
            hero.animTimer += modifier*1000;
            if (hero.animTimer >= hero.animDelay) {
                // Enough time has passed to update the animation frame
                hero.animTimer = 0; // Reset the animation timer
                ++hero.animFrame;
                if (hero.animFrame >= hero.animNumFrames) {
                    // We've reached the end of the animation frames; rewind
                    hero.animFrame = 0;
                    hero.jumping = false;
                    jumpX = 0;
                    jumpY = 0;
                }
            }
            
        }
        
        for(var i=0;i<numMonsters;i++)
            monster_moving(monsterList[i], modifier);
        
        shoot_moving(modifier);

        //Motor de deteccion de colisiones
        updateCollisions();
        
    };
    
    
    var updateCollisions = function() {
        
        //1.- Miramos si Balas tocan a Monsters
        var monsterListRemove = []; //Lista para elminar monsters tocados
        var balaListRemove = []; //Lista para eliminar balas que tocan monster
        for(var i=0;i<numMonsters;i++) {
            var currentMonster = monsterList[i];
            
            //Miramos si bala toca monster
            for(var j=0;j<balaList.length;j++) {
                var currentBala = balaList[j];
                if(
                    currentBala.x <= (currentMonster.x + currentMonster.width)
                    && currentMonster.x <= (currentBala.x + currentBala.width)
                    && currentBala.y <= (currentMonster.y + currentMonster.height)
                    && currentMonster.y <= (currentBala.y + currentBala.width)
                ) {
                    balaListRemove.push(j);
                    monsterListRemove.push(i)
                    
                }
            }
        }
        //2.- Borra monsters tocados
        if(monsterListRemove.length > 0) {
            for(var j=monsterListRemove.length-1;j>=0;j--) {
                if(DEBUG)
                    console.log("Borrar " + monsterListRemove[j]);
                if(monsterListRemove[j]!=undefined) 
                    monsterList.splice(monsterListRemove[j],1);
                    numMonsters --;
            }
        }
        //3.- Borra balas que tocan monster
        if(balaListRemove.length > 0) {
            for(var j=balaListRemove.length-1;j>=0;j--) {
                if(DEBUG)
                    console.log("Borrar " + balaListRemove[j]);
                if(balaListRemove[j]!=undefined) 
                    balaList.splice(balaListRemove[j],1);
            }
        }
        
        //4.- Miramos monsters tocan heroe
        for(var i=0;i<numMonsters;i++) {
            var currentMonster = monsterList[i];
            
            //Miramos si monster toca heroe
            if (
                hero.x <= (currentMonster.x + currentMonster.width)
                && currentMonster.x <= (hero.x + 32)
                && hero.y <= (currentMonster.y + currentMonster.height)
                && currentMonster.y <= (hero.y + 32)
            ) {
                ++monstersCaught;
                //reset();
            }
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
        
        //Monster calc animSet
        // Update hero animation
        monster.animTimer += modifier * 1000;
        if (monster.animTimer >= monster.animDelay) {
            // Enough time has passed to update the animation frame
            monster.animTimer = 0; // Reset the animation timer
            ++monster.animFrame;
            if (monster.animFrame >= monster.animNumFrames) {
                // We've reached the end of the animation frames; rewind
                monster.animFrame = 0;
            }
        }
    };
    
    //SHOOT
    function shoot() {
        
        if(!hero.jumping) {
            var x = hero.x;
            var y = hero.y;
            var vx = mouseX - hero.x - hero.width/2;
            var vy = mouseY - hero.y;
            var rad = hero.radians;
            
            var newBala = new Shot(x,y,vx,vy,rad);
            balaList.push(newBala);	
            
            if(DEBUG)
                console.log("Num balas: " + balaList.length);
        }
        
    };
    
    //SHOOT_MOVING
    var shoot_moving = function (modifier) {
        
        var numBalas = balaList.length;
        var balaListRemove = [];
        
        for(var i=0;i<numBalas;i++) {
            var currentBala = balaList[i]
            currentBala.x += currentBala.vx * modifier;
            currentBala.y += currentBala.vy * modifier;
            
            //console.log(currentBala.x + ", " + currentBala.y);
            
            if(currentBala.x < 0 || currentBala.x > sWidth)
                balaListRemove.push(i);
            else if(currentBala.y < 0 || currentBala.y > sHeight)
                balaListRemove.push(i);
            
        }
        //Remove balas out screen
        //console.log(balaListRemove.length);
        if(balaListRemove.length > 0) {
            for(var j=balaListRemove.length-1;j>=0;j--) {
                if(DEBUG)
                    console.log("Borrar " + balaListRemove[j]);
                if(balaListRemove[j]!=undefined) 
                    balaList.splice(balaListRemove[j],1);
            }
        }
    };
    
    // Draw everything
    var render = function () {
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }

        
        if (monsterReady) {
            for(var i=0;i<numMonsters;i++) {
                monsterList[i].draw(ctx, monsterImage);
            }
        }
        
        if(balaReady) {
            var numBalas = balaList.length;
            
            for(var i=0;i<numBalas;i++) {
                balaList[i].draw(ctx, balaImage);
            }
        }
        
        if (heroReady) {
            
            hero.draw(ctx, heroImage);

        }

        // Score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "12px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Goblins caught: " + monstersCaught, 1, 1);
    };
    
    /*
     * Carga elemento DOM fps cada segundo
     */
    var lastFpsUpdateTime = 0;
    function loadFps(now) {
	   if (now - lastFpsUpdateTime > 1000) {
		  lastFpsUpdateTime = now;
		  fpsElement.innerHTML = calculateFps(now, then) + ' fps';
	   }

	   //return fps;
	}
    
    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - then;
        
		//loadFps(now);
        update(delta / 1000);
        render();

        then = now;
        requestAnimationFrame(main);
    };


}(window));
//FIN 





