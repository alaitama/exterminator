

(function(ns){
    
    var DEBUG = true;

    //VARIABLES GLOBALES
    var sectionName = "game";
    var topUIName = "top_ui";
    var progressBarHero = null;
    var bottomUIName = "bottom_ui";
    //Origianl sizes id game
    var WIDTH = 600
    var HEIGHT = 450;
    var RATIO = null;
    //Original size of UI, saved because resized
    var topUIHeight = 20;
    var bottomUIHeight = 20;
    //Size of the game resized
    var currentWidth = null;
    var currentHeight = null;
    //Scaled ratio between the original size to current
    var scaledWidth = null;
    var scaledHeight = null;

    var iKeyUp = 38;
    var iKeyDown = 40;
    var iKeyLeft = 37;
    var iKeyRight = 39;
    var iKeyPaused = 80; //p
    
    var PAUSED = false;
    var POINTS = 0;

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
        //canvas = document.createElement("canvas");
        canvas = $('canvas')[0];
        ctx = canvas.getContext("2d");

        // the proportion of width to height
        RATIO = WIDTH / HEIGHT;

        // these will change when the screen is resized
        currentWidth = WIDTH;
        currentHeight = HEIGHT;

        // setting this is important
        // otherwise the browser will
        // default to 320 x 200
        canvas.width = WIDTH;
        canvas.height = HEIGHT - topUIHeight - bottomUIHeight;
        //canvas.height = HEIGHT;
        
        resizeGame();
        //loadCanvas('gameDiv');
        
        initControls();
        initUI();
        
        fpsElement = document.getElementById('fps');
        
        reset();
        lastAnimationFrameTime = Date.now();
        
        requestAnimationFrame(main);
        
    };
    
    resizeGame = function() {
 
        currentHeight = window.innerHeight;
        // resize the width in proportion to the new height
        currentWidth = currentHeight * RATIO;
        //Save scale ratio
        scaledWidth = WIDTH / currentWidth;
        scaledHeight = HEIGHT / currentHeight;
        
        var currentTopUIHeight = topUIHeight * (currentHeight / HEIGHT);
        var currentBottomUIHeight = bottomUIHeight * (currentHeight / HEIGHT);
        //currentCanvasHeight = canvas.height * RATIO;
        var currentCanvasHeight = currentHeight - currentTopUIHeight - currentBottomUIHeight;
        
        // this will create some extra space on the
        // page, allowing us to scroll past
        // the address bar, thus hiding it.
        /*
        if (android || ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }
        */
 
        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but
        // we're essentially scaling it with CSS
        $('#'+sectionName).css('height', currentHeight+"px");
        $('#'+sectionName).css('width', currentWidth+"px");                
        canvas.style.width = currentWidth + 'px';
        canvas.style.height = currentCanvasHeight + 'px';
        $('#'+topUIName).css('height', currentTopUIHeight + "px");
        $('#'+topUIName).css('width', currentWidth + "px");
        $('#'+bottomUIName).css('height', currentBottomUIHeight + "px");
        $('#'+bottomUIName).css('width', currentWidth + "px");
        
        
 
        // we use a timeout here because some mobile
        // browsers don't fire if there is not
        // a short delay
        window.setTimeout(function() {
                window.scrollTo(0,1);
        }, 1);
    };
    
    initAgent = function() {
        
        // we need to sniff out Android and iOS
        // so that we can hide the address bar in
        // our resize function
        ua = navigator.userAgent.toLowerCase();
        android = ua.indexOf('android') > -1 ? true : false;
        ios = ( ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1  ) ? 
            true : false;
            
    };
    
    initControls = function() {
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
        
        /*
        $('canvas').on('click', function(e) {
            console.log("e.client("+e.clientX+","+e.clientY+")");
            console.log("e.page("+e.pageX+","+e.pageY+")");
            console.log("e.offset("+e.offsetX+","+e.offsetY+")");
            console.log("e.layer("+e.layerX+","+e.layerY+")");
        });
        */
        $(window).on('resize', resizeGame);
        //Mouse Events
        $('canvas').on('mousemove', onMouseMove);
        $('canvas').on('dblclick', onDblClick);
        $('canvas').on('mousedown', function(){ return false; }); //corrigue la seleccion de texto al doble click
        //Touch Events
        $('touchstart touchmove tap', onTouchMove);
        $('doubleTap', onDoubleTouch);
        
        $('canvas').on('focusout', onFocusOut);
        $(document).on('keydown', onKeyDown);
    }
    
    onTouchMove = function(e) {
        e.preventDefault();
        
        mouseX = (e.touches[0].pageX - canvas.offsetLeft) * scaledWidth;
        mouseY = (e.touches[0].pageY - canvas.offsetTop) * scaledHeight;
    };
    
    onDoubleTouch = function(e) {
        jumpX = (e.touches[0].pageX - canvas.offsetLeft) * scaledWidth;
        jumpY = (e.touches[0].pageY - canvas.offsetTop) * scaledHeight;
    };
    
    onMouseMove = function(e) {
        e.preventDefault();
        //mouseX = e.clientX;
        //mouseY = e.clientY;
        //Funciona para Chrome, pero no en Firefox
        //mouseX = (e.offsetX || e.layerX) * scaledWidth;
        //mouseY = (e.offsetY || e.layerY) * scaledHeight;
        //Funciona en Chrome y Firefox
        mouseX = (e.pageX - canvas.offsetLeft) * scaledWidth;
        mouseY = (e.pageY - canvas.offsetTop) * scaledHeight;
        //mouseX = (e.offsetX || e.layerX);
        //mouseY = (e.offsetY || e.layerY);
    };
    
    onDblClick = function(e) {
        e.preventDefault();
        
        //jumpX = e.clientX;
        //jumpY = e.clientY;
        //jumpX = (e.offsetX || e.layerX) * scaledWidth;
        //jumpY = (e.offsetY || e.layerY) * scaledHeight;
        jumpX = (e.pageX - canvas.offsetLeft) * scaledWidth;
        jumpY = (e.pageY - canvas.offsetTop) * scaledHeight;
            
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
    
    initUI = function() {
        
        //Save to variables DOM Objetcs UI
        progressBarHero = new ProgressBar(document.getElementById('progressBarHero'))
		
        //var bar2 = new ProgressBar(document.getElementById('progressBarLevel'))
        //bar2.setPercentage(50);
        
                
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
        
        hero = new Hero(0,0, canvas.width, canvas.height);
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
        
        //UPDATE HERO
        hero.update(mouseX, mouseY, jumpX, jumpY, modifier);
        if(!hero.jumping) {
            jumpX = 0;
            jumpY = 0;
        }
        
        
        for(var i=0;i<numMonsters;i++) {
            //monster_moving(monsterList[i], modifier);
            monsterList[i].update(hero.x, hero.y, modifier);
        }
        
        shoot_moving(modifier);

        //Motor de deteccion de colisiones
        updateCollisions();
        
        //Update the UI
        updateUI();
        
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
                    
                    POINTS += currentMonster.points;
                    
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
                hero.life--;
                //reset();
            }
        }
    };
    
    var updateUI = function() {
        progressBarHero.setPercentage(hero.life / 10);
        
        document.getElementById('scoreDiv').innerHTML = POINTS;
    }    
    
    //SHOOT
    function addShoot() {
        
        if(!hero.jumping) {
            var x = hero.x;
            var y = hero.y;
            var vx = mouseX - hero.x;
            var vy = mouseY - hero.y;
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
        /*
        var randx = 32 + (Math.random() * (canvas.width - 64));
        var randy = 32 + (Math.random() * (canvas.height - 64));
        var randIncX = Math.random() < 0.5 ? true : false;
        var randIncY = Math.random() < 0.5 ? true : false;
        */
            
        var newMonster = new  Monster();
        newMonster.initPosition(currentWidth, currentHeight);
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





