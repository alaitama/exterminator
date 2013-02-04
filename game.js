

(function(ns){
    
    var DEBUG = true;

    //VARIABLES GLOBALES
    var WIDTH = 512;
    var HEIGHT = 480;

    var iKeyUp = 38;
    var iKeyDown = 40;
    var iKeyLeft = 37;
    var iKeyRight = 39;
    var iKeyPaused = 80; //p
    
    var PAUSED = false;

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
    var lastAnimationFrameTime;

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "./images/cement.jpg";

    //Hero image
    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
        heroReady = true;
    };
    //heroImage.src = "./images/hero.png";
    //heroImage.src = "./images/heroe_sprite64.png";
    heroImage.src = "./images/heroe_sprite42x47.png";

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
    var hero = null;
    
    //Variables globales
    var balaList = [];
    var monsterList = [];
    var numMonsters = 0;
    
    var timerShoot = 700;
    //var idShootThread = null;
    var lastAddShootTime = 0;
    
    
    var timerMonster = 1000;
    //var idMonsterThread = null;
    var lastAddMonsterTime = 0;
    
    var monstersCaught = 0;
        
    // Handle keyboard controls
    var keysDown = {};
    
    function loadCanvas(id) {
        div = document.getElementById(id);     
        div.appendChild(canvas);
    };
    
    function loadSettings() {
        timerMonster = document.forms[0].numMonsters.value;
        timerShoot = document.forms[0].timeShoot.value;
    };

    // Let's play this game!
    initGame = function () {
        
        // Create the canvas
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");

        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        
        
        loadCanvas('gameDiv');
        
        initUI();
        
        fpsElement = document.getElementById('fps');
        
        reset();
        lastAnimationFrameTime = Date.now();
        
        requestAnimationFrame(main);
        
    };
    
    initUI = function() {
        /*
        addEventListener("keydown", function (e) {
            keysDown[e.keyCode] = true;
        }, false);

        addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
        }, false);
                
        
        canvas.addEventListener('dblclick', function(e) {
            jumpX = e.clientX;
            jumpY = e.clientY;
            
            if(DEBUG)
                console.log("Jumped to: x=" + jumpX + ",y=" + jumpY);
        }, true);

        canvas.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, true);
        */
        $('canvas').on('mousemove', onMouseMove);
        $('canvas').on('dblclick', onDblClick);
        $('canvas').on('mousedown', function(){ return false; }); //corrigue la seleccion de texto al doble click
        
        $('canvas').on('focusout', onFocusOut);
        
        $(document).on('keydown', onKeyDown);
        
        //Positions DIVs
        var gameCanvas = $('canvas');
        var splash = $('#splash');
        var left = gameCanvas.css('left');
        var width = gameCanvas.css('width');
        var height = 100;
        var top = gameCanvas.css('top');
        
        console.log(left + " " + top + " " + width + " " + height)
        splash.css('left',0);
        splash.css('top',0);
        splash.css('width',width);
        splash.css('height',height);
        
    };
    
    onMouseMove = function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    
    onDblClick = function(e) {
        e.preventDefault();
        
        jumpX = e.clientX;
        jumpY = e.clientY;
            
        if(DEBUG)
            console.log("Jumped to: x=" + jumpX + ",y=" + jumpY);
    };
    
    onKeyDown = function(e) {
        if(e.keyCode == iKeyPaused) {
            PAUSED = !PAUSED;
            if(PAUSED)
                showPauseSplash();
            else
                hidePauseSplash();
        }
    }
    
    onFocusOut = function(e) {
        PAUSED = true;
        showPauseSplash();
    }
    
    showPauseSplash = function() {
        $('#splash').css('opacity','1.0');
        $('#splash').css('display','block');
    }
    
    hidePauseSplash = function() {
        $('#splash').css('opacity','0.0');
        $('#splash').css('display','none');
    }
    
    
    
    // Reset the game when the player catches a monster
    reset = function () {
        //loadSettings();
        
        hero = new Hero(0,0);
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;

        numMonsters = 0;
        monstersCaught = 0;

        /*
        if(idMonsterThread!=null) {
            window.clearInterval(idMonsterThread);
        }
        idMonsterThread = setInterval(addMonster, timerMonster);
        
        if(idShootThread!=null)
			window.clearInterval(idShootThread);
        idShootThread = setInterval(shoot, timerShoot);
        */
        
    };
    
    // Update game objects
    var update = function (modifier) {
        
        //Llamamos a procesos automaticos(equivale a setInterval manual)
        updateThreads();
        
        //Si no esta saltando, giramos
        if(jumpX==0 && jumpY==0) {
            
            hero.radiansDraw = Math.atan2(mouseX - hero.x, mouseY - hero.y - hero.height);
            hero.radians = Math.atan2(mouseX - hero.x, mouseY - hero.y);
            //var degree = (radians * (180 / Math.PI) * -1) + 180; 
        }
        //Si esta saltando movemos
        else {
            if(!hero.jumping) {
                hero.jumping = true;
                hero.vx = jumpX - hero.x;
                hero.vy = jumpY - hero.y - hero.height;

                // Get absolute value of each vector
                ax = Math.abs(hero.vx);
                ay = Math.abs(hero.vy);

                // Create a ratio
                ratio = 1 / Math.max(ax, ay)
                ratio = ratio * (1.29289 - (ax + ay) * ratio * 0.29289)

                // Multiply by ratio
                hero.vx = hero.vx * ratio * 300
                hero.vy = hero.vy * ratio * 300
                
                ++hero.animFrame;
                
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
        
        for(var i=0;i<numMonsters;i++) {
            //monster_moving(monsterList[i], modifier);
            monsterList[i].update(hero.x, hero.y, modifier);
        }
        
        shoot_moving(modifier);

        //Motor de deteccion de colisiones
        updateCollisions();
        
    };
    
    var updateThreads = function() {
        var now = Date.now();
        
        if (now - lastAddMonsterTime > timerMonster) {
		  lastAddMonsterTime = now;
		  addMonster();
        }
        
        if (now - lastAddShootTime > timerShoot) {
		  lastAddShootTime = now;
		  addShoot();
        }
    }
    
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
            if (monster.x + monster.width >= WIDTH) {
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
            if (monster.y + monster.height >= HEIGHT) {
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
    function addShoot() {
        
        if(!hero.jumping) {
            var x = hero.x;
            var y = hero.y;
            var vx = mouseX - hero.x;
            var vy = mouseY - hero.y - hero.height;
            var rad = hero.radians;
            
            var newBala = new Shot(x,y,vx,vy,rad);
            balaList.push(newBala);	
            
            if(DEBUG)
                console.log("Num balas: " + balaList.length);
        }
        
    };
    
    //NEW MONSTER
    function addMonster() {
        // Throw the monster somewhere on the screen randomly
        var randx = 32 + (Math.random() * (canvas.width - 64));
        var randy = 32 + (Math.random() * (canvas.height - 64));
        var randIncX = Math.random() < 0.5 ? true : false;
        var randIncY = Math.random() < 0.5 ? true : false;
            
        var newMonster = new  Monster(randx, randy, randIncX, randIncY);
        monsterList.push(newMonster);
        numMonsters++;
    }
    
    
    //SHOOT_MOVING
    var shoot_moving = function (modifier) {
        
        var numBalas = balaList.length;
        var balaListRemove = [];
        
        for(var i=0;i<numBalas;i++) {
            var currentBala = balaList[i]
            currentBala.x += currentBala.vx * modifier;
            currentBala.y += currentBala.vy * modifier;
            
            //console.log(currentBala.x + ", " + currentBala.y);
            
            if(currentBala.x < 0 || currentBala.x > WIDTH)
                balaListRemove.push(i);
            else if(currentBala.y < 0 || currentBala.y > HEIGHT)
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
            //ctx.drawImage(bgImage, 0, 0);
            ctx.fillStyle = ctx.createPattern(bgImage, "repeat");
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
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
		  fpsElement.innerHTML = calculateFps(now, lastAnimationFrameTime) + ' fps';
	   }

	   //return fps;
	}
    
    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - lastAnimationFrameTime;
        
        if(fpsElement!=null && fpsElement!=undefined)
            loadFps(now);
        
        if(!PAUSED) {
            update(delta / 1000);
            render();
        }

        lastAnimationFrameTime = now;
        requestAnimationFrame(main);
    };


}(window));
//FIN 





