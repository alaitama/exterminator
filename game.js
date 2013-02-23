

(function(ns){
    
    var DEBUG = true;
    
    //Variables calculo FPS
    var showFPS = true;
    var calculatorFPS = null;
    var calculatedFPS = 0;
    var lastFpsUpdateTime = 0;

    //VARIABLES GLOBALES
    
    
    //Origianl sizes id game
    var WIDTH = 600;
    var HEIGHT = 450;
    var RATIO = null;
    var DEVICE = null; //if is Desktop or Mobile
    
    /* ----UI ELEMENTS and DOM Elements----- */
    var sectionName = "game";
    var topUIName = "top_ui";
    var progressBarHero = null;
    var progressBarLevel = null;
    var bottomUIName = "bottom_ui";
    var splashName = "splash";
    
    //Original size of UI, saved because resized
    var topUIHeight = 30;
    var bottomUIHeight = 40;
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

    //Time refresh
    var lastAnimationFrameTime;

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    //bgImage.src = "./images/cement.jpg";
    bgImage.src = "./images/bg.jpg";

    //Hero image
    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
        heroReady = true;
    };
    //heroImage.src = "./images/hero.png";
    //heroImage.src = "./images/heroe_sprite64.png";
    heroImage.src = "./images/heroe_sprite57x64_color.png";

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
    //var numMonsters = 0;
    //Arrays for recicle objects
    var deletedShotList = [];
    var deletedMonsterList = [];
    
    var timerShoot = 200;
    //var idShootThread = null;
    var lastAddShootTime = 0;
    
    
    var timerMonster = 1000;
    //var idMonsterThread = null;
    var lastAddMonsterTime = 0;
    
    //var monstersCaught = 0;
    var monstersLevel = 100;
    
        
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
    initGame = function (device) {
        
        DEVICE = device;
        if(DEBUG)
            console.log("Device="+DEVICE);
        
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
        
        reset();
        lastAnimationFrameTime = Date.now();
        
        requestAnimationFrame(main);
        
    };
    
    resizeGame = function() {
        
        if(DEVICE == 'desktop') {
            var gameHeight = $('#'+sectionName).height();
            currentHeight = gameHeight;
            $('#gameDiv').height(gameHeight);
            $('#gameDiv').width(gameHeight * RATIO);
        }
        else {
            currentHeight = window.innerHeight;
        }
        
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

        $(window).on('resize', resizeGame);
        //Mouse Events
        $('canvas').on('mousemove', onMouseMove);
        $('canvas').on('dblclick', onDblClick);
        $('canvas').on('mousedown', function(){ return false; }); //corrigue la seleccion de texto al doble click
        
        //Touch Events
        $('canvas').bind('touchstart touchmove', onTouchMove);
        $('canvas').doubleTap(onDoubleTouch);
        
        //UI Clicks/Touchs
        $('#btnPause').on('mousedown', onClickPause)
        
        $('canvas').on('focusout', onFocusOut);
        $(document).on('keydown', onKeyDown);
    }
    
    onClickPause = function() {
        if(PAUSED) {
            $('#btnPause').attr("src", 'images/ui/btnPause.svg');
            hidePauseSplash();
        }
        else {
            $('#btnPause').attr("src", 'images/ui/btnPauseOn.svg');
            showPauseSplash();
        }
        
        PAUSED = !PAUSED;
        
    }
    
    onTouchMove = function(e) {
        e.preventDefault();
        
        mouseX = (e.touches[0].pageX - canvas.offsetLeft) * scaledWidth;
        mouseY = (e.touches[0].pageY - canvas.offsetTop) * scaledHeight;
    };
    
    onDoubleTouch = function(e) {
        jumpX = (e.data.touch.x1 - canvas.offsetLeft) * scaledWidth;
        jumpY = (e.data.touch.y1 - canvas.offsetTop) * scaledHeight;
        
        if(DEBUG)
            console.log("Jumped to: x=" + jumpX + ",y=" + jumpY);
    };
    
    onMouseMove = function(e) {
        e.preventDefault();

        //Funciona para Chrome, pero no en Firefox
        //mouseX = (e.offsetX || e.layerX) * scaledWidth;
        //mouseY = (e.offsetY || e.layerY) * scaledHeight;
        //Funciona en Chrome y Firefox
        mouseX = (e.pageX - canvas.offsetLeft) * scaledWidth;
        mouseY = (e.pageY - canvas.offsetTop) * scaledHeight;
    };
    
    onDblClick = function(e) {
        e.preventDefault();
        
        //Funciona para Chrome, pero no en Firefox
        //jumpX = (e.offsetX || e.layerX) * scaledWidth;
        //jumpY = (e.offsetY || e.layerY) * scaledHeight;
        //Funciona en Chrome y Firefox
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
        progressBarHero = new ProgressBar(document.getElementById('progressBarHero'));
        progressBarLevel = new ProgressBar(document.getElementById('progressBarLevel'));
        progressBarLevel.setPercentage(100);
        //calculatorFPS = CalculatorFPS();
                
        //Positions DIVs
        var gameCanvas = $('canvas');
        var splash = $('#splash');
        var left = gameCanvas.css('left');
        var width = gameCanvas.css('width');
        var height = 50;
        var top = gameCanvas.offset().top;
        
        console.log(left + " " + top + " " + width + " " + height)
        splash.css('left',0);
        splash.css('top', top + gameCanvas.height() / 2 - height / 2 );
        splash.css('width',width);
        splash.css('height',height);
        
    };
    
    showPauseSplash = function() {
        /*
        $('#' + splashName).css('opacity','1.0');
        $('#' + splashName).css('display','block');
        */
        $('#' + splashName).animate({
            opacity: 1.0
        }, 300.0);
        $('#' + splashName).css('display','block');
    }
    
    hidePauseSplash = function() {
        /*
        $('#' + splashName).css('opacity','0.0');
        $('#' + splashName).css('display','none');
        */
        $('#' + splashName).animate({
            opacity: 0.0
        }, 10.0);
        $('#' + splashName).css('display','none');
    }
    
    showRoundSplash = function() {
        var tmpFinish = false;
        //Show ROUND number and hide
        $('#' + splashName).html("ROUND " + ROUND);
        
        $('#' + splashName).animate({ opacity: 1.0 }, 300.0, "ease", function() {
            console.log("1");
            $('#' + splashName).css('display','block');
            $('#' + splashName).animate({ opacity: 0.0 }, 50.0, "ease", function() {
                console.log("2");
                //Show GO message
                $('#' + splashName).html("GO!");
                $('#' + splashName).animate({ opacity: 1.0 }, 50.0, "ease", function() {
                    console.log("3");
                    $('#' + splashName).animate({ opacity: 0.0 }, 50.0, "ease", function() {     
                        $('#' + splashName).css('display','none');   
                        tmpFinish = true;
                    });
                });
            });
        });
        
        //while(!tmpFinish) {}
        
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
    }
    
    
    
    // Reset the game when the player catches a monster
    reset = function () {
        //loadSettings();
        
        hero = new Hero(0,0, canvas.width, canvas.height);
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;

        //numMonsters = 0;
        //monstersCaught = 0;
        PAUSED = true;
        startRound();
        showRoundSplash();
        PAUSED = false;
        
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
        
        
        for(var i=0;i<monsterList.length;i++) {
            //monster_moving(monsterList[i], modifier);
            
            var currentMonster = monsterList[i];
            if(currentMonster.deleted==false) {
                currentMonster.update(hero.x, hero.y, modifier);
                
                //Si monster is completly dead, add to garbage list
                if(currentMonster.dead) {
                    if(DEBUG) 
                        console.log("Eliminamos Monster");
                    currentMonster.deleted = true;
                    deletedMonsterList.push(currentMonster);
                }
            }
        }
        
        updateShots(modifier);

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
        for(var i=0;i<monsterList.length;i++) {
            var currentMonster = monsterList[i];
            if(currentMonster.deleted==false && currentMonster.dying==false) {
                //Miramos si bala toca monster
                for(var j=0;j<balaList.length;j++) {
                    var currentBala = balaList[j];
                    if(currentBala.deleted==false) {
                        if(
                            currentBala.x <= (currentMonster.x + currentMonster.width)
                            && currentMonster.x <= (currentBala.x + currentBala.width)
                            && currentBala.y <= (currentMonster.y + currentMonster.height)
                            && currentMonster.y <= (currentBala.y + currentBala.height)
                        ) {
                            /*
                            balaListRemove.push(j);
                            monsterListRemove.push(i)
                            */
                            
                            /*
                            currentMonster.deleted=true;
                            deletedMonsterList.push(currentMonster);
                            */
                            currentMonster.dying = true;
                            
                            currentBala.deleted=true;
                            deletedShotList.push(currentBala);
                            
                            
                            POINTS += currentMonster.points;
                            monstersLevel--;
                            
                        }
                    }
                }
            }
        }
        
        //2.- Miramos monsters tocan heroe
        for(var i=0;i<monsterList.length;i++) {
            var currentMonster = monsterList[i];
            if(currentMonster.deleted==false && currentMonster.dying==false) {
                //Si montster ataca, miramos si se tocan 
                if(currentMonster.attack) {
                    //Si se estan tocando el ataque resta vida a heroe
                    if (
                    hero.x <= (currentMonster.x + currentMonster.width)
                    && currentMonster.x <= (hero.x + hero.width)
                    && hero.y <= (currentMonster.y + currentMonster.height)
                    && currentMonster.y <= (hero.y + hero.height)
                    ) {
                        hero.life -= currentMonster.hitPoints;
                    }
                    //Reset monster attack
                    currentMonster.attacking=false;
                    currentMonster.attack=false;
                }
            }
        }
    };
    
    var updateUI = function() {
        progressBarHero.setPercentage(hero.life / 10);
        progressBarLevel.setPercentage(monstersLevel);
        
        document.getElementById('scoreDiv').innerHTML = POINTS;
        
        if(showFPS) {
            var now = Date.now();
            if (now - lastFpsUpdateTime > 1000) {
                lastFpsUpdateTime = now;
                //document.getElementById('fpsDiv').innerHTML = CalculatorFPS.getFPS() + " fps";
                calculatedFPS = CalculatorFPS.getFPS();
            }
        }
        
    }    
    
    //SHOOT
    function addShoot() {
        
        if(!hero.jumping) {
            var x = hero.x;
            var y = hero.y;
            var vx = mouseX - hero.x;
            var vy = mouseY - hero.y;
            var rad = hero.radians;
            
            //Normalize vector
            var vecNorm = normalizeVector(vx, vy);
            vx = vecNorm[0], vy = vecNorm[1];
            
            var newShot = null;
            if(deletedShotList.length>0) {
                console.log("Recicla");
                newShot = deletedShotList.pop();
                if(newShot!=undefined) {
                    newShot.x = x, newShot.y=y, newShot.vx=vx,newShot.vy=vy,newShot.rad=rad;
                    newShot.deleted=false;
                }
            }
            else {
                newShot = new Shot(x,y,vx,vy,rad);
                balaList.push(newShot);
            }
            
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
        var newMonster = null;
        if(deletedMonsterList.length>0) {
            newMonster = deletedMonsterList.pop();
            newMonster.deleted=false;
            if(DEBUG)
                console.log("Recicla monster");
        }
        else {
            newMonster = new  Monster();
            monsterList.push(newMonster);
        }
        newMonster.initPosition(currentWidth, currentHeight);
        newMonster.resetStates();
        
        //numMonsters++;
    }
    
    
    //SHOOT_MOVING
    var updateShots = function (modifier) {
        
        var numBalas = balaList.length;
        //var balaListRemove = [];
        
        for(var i=0;i<numBalas;i++) {
            var currentBala = balaList[i];
            if(currentBala.deleted==false) {
                currentBala.update(modifier);
                
                //console.log(currentBala.x + ", " + currentBala.y);
                
                if(currentBala.x < 0 || currentBala.x > WIDTH  || currentBala.y < 0 || currentBala.y > HEIGHT) {
                    //balaListRemove.push(i);
                    currentBala.deleted=true;
                    if(currentBala!=undefined)
                        deletedShotList.push(currentBala);
                }
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
            for(var i=0;i<monsterList.length;i++) {
                if(monsterList[i].deleted==false)
                    monsterList[i].draw(ctx, monsterImage);
            }
        }
        
        if(balaReady) {
            var numBalas = balaList.length;
            
            for(var i=0;i<numBalas;i++) {
                if(balaList[i].deleted==false)
                    balaList[i].draw(ctx, balaImage);
            }
        }
        
        if (heroReady) {
            
            hero.draw(ctx, heroImage);

        }

        // Score
        if(showFPS) {
            ctx.fillStyle = "rgb(250, 250, 250)";
            ctx.font = "12px Helvetica";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(calculatedFPS + " fps", 1, 1);
        }
    };
    
    /* --- FUNCTIONS ABOUT ROUNDS GAME --- */
    var ROUND = 0;
    var startRound = function() {
        ROUND ++;
        timerMonster -= 100;
    }
    
    var restartObjects = function() {
        //Borramos todos los monstruos, muriendo y vivos
        for(var i=0;i<monsterList.length;i++) {
            var currentMonster = monsterList[i];
            if(!currentMonster.deleted) {
                currentMonster.resetStates();
                currentMonster.deleted=true;
                deletedMonsterList.push(currentMonster);
            }
        }
    }
    
    
    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - lastAnimationFrameTime;
        
        
        if(!PAUSED) {
            
            CalculatorFPS.calculateFPS(now, lastAnimationFrameTime);
            
            update(delta / 1000);
            render();
        }

        lastAnimationFrameTime = now;
        requestAnimationFrame(main);
    };


}(window));
//FIN 





