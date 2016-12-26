//Creacion de canvas y captacion de su contexto
window.onload = function () {
    var canvas = document.getElementById("canvasGame");
    var ctx = canvas.getContext("2d");
    //medidas del canvas
    canvas.width = 1000;
    canvas.height = 500;

    //Carga de la imagen de fondo, el escenario
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "../img/mapa.png";

    //Carga de la imagen de mario
    var marioReady = false;
    var marioImage = new Image();
    marioImage.onload = function () {
        marioReady = true;
    };
    marioImage.src = "../img/marioIzquierda.png";

    //Carga de la imagen del hongo rojo
    var hongoRojoReady = false;
    var hongoRojoImage = new Image();
    hongoRojoImage.onload = function () {
        hongoRojoReady = true;
    };
    hongoRojoImage.src = "../img/hongoRojo.png";

    //Carga de la imagen del hongo naranja
    var hongoNaranjaReady = false;
    var hongoNaranjaImage = new Image();
    hongoNaranjaImage.onload = function () {
        hongoNaranjaReady = true;
    };
    hongoNaranjaImage.src = "../img/hongoNaranja.png";

    //Carga de la imagen del goomba
    var goombaReady = false;
    var goombaImage = new Image();
    goombaImage.onload = function () {
        goombaReady = true;
    };
    goombaImage.src = "../img/goomba.png";

    //Carga de la imagen de la princesa
    var peachReady = false;
    var peachImage = new Image();
    peachImage.onload = function () {
        peachReady = true;
    };
    peachImage.src = "../img/peach.png";

    //Objetos y variables usadas en el juego
    var level = 1;
    var numHongos = 0;
    var monsters = [];
    var monstersCaught = 0;
    var frameRef;
    var msg = "Nivel: ";
    var rightOrLeft = 1;
    var range = 0;
    var changeLevelFlag = false;
    var counter = 0;
    var iterations = 150;
    var fontSize = "40px";
    var keysDown = {};
    var accelerationRate = 10;
    var foundPeach = false;
    var showedPeach = false;
    //sonidos del juego
    var audio = new Audio('../sounds/marioTrack.mp3');
    var gameOverAudio = new Audio("../sounds/gameOverTrack.mp3");
    var winAudio = new Audio("../sounds/winAudio.mp3");

    //Objeto Mario
    var mario = {
        // Velocidad en pixeles por segundo
        speed: 250,
        //posicion en el canvas
        x: canvas.width / 2,
        y: canvas.height / 2,
        //medias
        width: 30,
        height: 50,
        xdir: 0,
        ydir: 0
    };

    //Objeto princesa
    var peach = {
        //posicion en el canvas
        x: 30 + (Math.random() * (canvas.width - 60)),
        y: 30 + (Math.random() * (canvas.height - 60)),
    };

    //Objeto hongo rojo
    function hongoRojo() {
        x = 0;
        y = 0;
        this.image = hongoRojoImage;
        width = hongoRojoImage.width;
        height = hongoRojoImage.height;
        xdir = 0;
        ydir = 0;
        this.speed = 120;
        this.direction = Math.floor(Math.random() * 2);
        this.startSide = Math.floor(Math.random() * 2);
    };

    //Objeto hongo naranja
    function hongoNaranja() {
        x = 0;
        y = 0;
        this.image = hongoNaranjaImage;
        width = hongoNaranjaImage.width;
        height = hongoNaranjaImage.height;
        xdir = 0;
        ydir = 0;
        this.speed = 120;
        this.direction = Math.floor(Math.random() * 2);
        this.startSide = Math.floor(Math.random() * 2);
    };

    //Objeto goomba
    function goomba() {
        x = 0;
        y = 0;
        this.image = goombaImage;
        width = goombaImage.width;
        height = goombaImage.height;
        xdir = 0;
        ydir = 0;
        this.speed = 120;
        this.direction = Math.floor(Math.random() * 2);
        this.startSide = Math.floor(Math.random() * 2);
    };

    //area del juego para poner barreras a mario de que no se salga de los bordes del canvas
    var area = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height
    };

    // escuchadores de los eventos del teclado, cuando se presionan las flechas
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    //cambio de nivel cual Mario ya cogio todos los hongos del nivel actual
    var changeLevel = function () {
        level++;
        numHongos = 0;
        changeLevelFlag = true;
        monsters = [];
        foundPeach = false;
        iterations = 150;
        createMonsters(level);
        mario.x = canvas.width / 2;
        mario.y = canvas.height / 2;
    };

    //creacion de los hongos y los goomba
    var createMonsters = function (l) {
        if (monsters.length == 0) {
            for (var i = 0; i < l; i++) {
                monsters.push(new hongoRojo());
                monsters.push(new hongoNaranja());
            }
            for (var i = 0; i < 4 * l; i++) {
                monsters.push(new goomba());
            }
            for (var i = 0; i < monsters.length; i++) {
                //asignacion de posiciones aleatorias en el canvas
                monsters[i].x = 30 + (Math.random() * (canvas.width - 60));
                monsters[i].y = 30 + (Math.random() * (canvas.height - 60));
                monsters[i].speed += accelerationRate;
            }
            //aumento de velocida por cada nivel que se avance
            mario.speed += 5;
            accelerationRate += 10;
        }
    };

    //funcion llamada cuando de termina el juego
    var gameEnded = function () {
        gameOverAudio.play();
        iterations = 1000;
        changeLevelFlag = true;
        msg = "Has perdido";
        level = "";
        fontSize = "28px";
        window.setTimeout(function () {
            window.location = "../html/index.html";
        }, 4500);
    };

    //funcion llamada cuando se gana el juego
    var wonGame = function () {
        winAudio.play();
        iterations = 1000;
        changeLevelFlag = true;
        msg = "Has ganado";
        level = "";
        fontSize = "28px";
        window.setTimeout(function () {
            window.location = "../html/index.html";
        }, 6000);
    };

    // Actualizacion de la informacion de los objetos
    var update = function (modifier) {
        //dependiendo de la fecha presionada, se guarda la tecla presionada
        if (38 in keysDown) {
            mario.y -= mario.speed * modifier;
        }
        if (40 in keysDown) { // Player holding down
            mario.y += mario.speed * modifier;
        }

        if (37 in keysDown) { // Player holding left
            marioImage.src = "../img/marioIzquierda.png";
            mario.x -= mario.speed * modifier;
        }
        if (39 in keysDown) { // Player holding right
            marioImage.src = "../img/marioDerecha.png";
            mario.x += mario.speed * modifier;
        }

        //control de colisiones de mario con el area de juego
        if (mario.x <= area.x) {

            mario.xdir = 1;
            mario.x = area.x;
        } else if (mario.x + mario.width >= area.x + area.width) {
            // Right edge
            mario.xdir = -1;
            mario.x = area.x + area.width - mario.width;
        }

        //control de colisiones de mario con el area de juego
        if (mario.y <= area.y) {
            // Top edge
            mario.ydir = 1;
            mario.y = area.y;
        } else if (mario.y + mario.height >= area.y + area.height) {
            // Bottom edge
            mario.ydir = -1;
            mario.y = area.y + area.height - mario.height;
        }

        //Dependiendo de las condiciones, se hace que los goomba u hongos se muevan de un lado a otro
        switch (rightOrLeft) {
            case 1:
                range++;
                if (range == 25) {
                    rightOrLeft = 0;
                }
                break;
            case 0:
                range--;
                if (range == -25) {
                    rightOrLeft = 1;
                }
                break;
        }

        //movimiento aleatorio y sentido aleatorio de los hongos y goombas
        for (var i = 0; i < monsters.length; i++) {
            if (monsters[i].direction == 1) {
                if (monsters[i].startSide == 1) {
                    if (rightOrLeft == 1) {
                        monsters[i].x += modifier * monsters[i].speed;
                    } else {
                        monsters[i].x -= modifier * monsters[i].speed;
                    }
                } else {
                    if (rightOrLeft == 1) {
                        monsters[i].x -= modifier * monsters[i].speed;
                    } else {
                        monsters[i].x += modifier * monsters[i].speed;
                    }
                }
            } else {
                if (monsters[i].startSide == 1) {
                    if (rightOrLeft == 1) {
                        monsters[i].y += modifier * monsters[i].speed;
                    } else {
                        monsters[i].y -= modifier * monsters[i].speed;
                    }
                } else {
                    if (rightOrLeft == 1) {
                        monsters[i].y -= modifier * monsters[i].speed;
                    } else {
                        monsters[i].y += modifier * monsters[i].speed;
                    }
                }
            }
        }

        //Cuando Mario se encuentra con un hongo o goomba
        for (var i = 0; i < monsters.length; i++) {
            if (
                mario.x <= (monsters[i].x + 30) &&
                monsters[i].x <= (mario.x + 30) &&
                mario.y <= (monsters[i].y + 30) &&
                monsters[i].y <= (mario.y + 30)
            ) {

                if (monsters[i] instanceof goomba) {
                    //se resta un hongo si se encuenta un goomba
                    --monstersCaught;
                } else {
                    //se aumenta un hongo si se encuenta uno
                    numHongos++;
                    ++monstersCaught;

                }
                monsters.splice(i, 1);
            }
        }
        //si se encuentra con la princesa
        if (
            mario.x <= (peach.x + 30) &&
            peach.x <= (mario.x + 30) &&
            mario.y <= (peach.y + 30) &&
            peach.y <= (mario.y + 30)
        ) {
            foundPeach = true;
        }
        //si no se ha mostrado la princesa o si ya se mostro pero se oculto, se cambia su posicion
        if (!showedPeach) {
            peach.x = 30 + (Math.random() * (canvas.width - 60));
            peach.y = 30 + (Math.random() * (canvas.height - 60));
            foundPeach = false;
        }

        //si cogio los 25 hongos y llego donde la princesa
        if (foundPeach && monstersCaught >= 25) {
            audio.pause();
            audio.currentTime = 0;
            wonGame();
        } else
        //si no, continue el juego
        if (monstersCaught < 0) {
            audio.pause();
            audio.currentTime = 0;
            gameEnded();
        } else
        if (numHongos == level * 2) {
            changeLevel();
            render();
        } else
        if (monsters.length > 0) {
            render();
        }
    };

    //funcion que pinta todo
    var render = function () {

        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0, 1000, 600);
        }

        if (marioReady) {
            ctx.drawImage(marioImage, mario.x, mario.y, 30, 50);
        }

        if (hongoRojoReady || hongoNaranjaReady || goombaReady) {
            for (var i = 0; i < monsters.length; i++) {
                ctx.drawImage(monsters[i].image, monsters[i].x, monsters[i].y, 30, 30);
                if (monstersCaught >= 25) {
                    ctx.drawImage(peachImage, peach.x, peach.y, 40, 40);
                    showedPeach = true;
                } else {
                    showedPeach = false;
                    foundPeach = false;
                }
            }
        }

        //tablero de score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "30px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Hongos capturados: " + monstersCaught, 32, 20);

        //tablero que indica el nivel
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "30px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Nivel: " + level, 870, 20);

        //aviso de cambio de nivel
        if (counter < iterations && changeLevelFlag == true) {
            showLevel();
            counter++;
            //se reinicia posicion de mario
            if (!foundPeach) {
                mario.x = canvas.width / 2;
                mario.y = canvas.height / 2;
            }

        } else {
            counter = 0;
            changeLevelFlag = false;
        }
    };

    //funcion que muestra el nivel como un tablero antes de inicial el nivel en cuestion
    var showLevel = function () {
        ctx.fillStyle = "#FFB266";
        ctx.strokeRect(canvas.width / 2 - 100, canvas.height / 2 - 35, 200, 70);
        ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 35, 200, 70);
        ctx.fillStyle = "#ffffff";
        ctx.font = fontSize + " Verdana";
        ctx.fillText(msg + level, canvas.width / 2 - 90, canvas.height / 2 - 25);


    };

    createMonsters(1);
    //audio principal del juego
    audio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.play();

    // funcion principal
    var main = function () {
        var now = Date.now();
        var delta = now - then;
        //se llaman constantemente estas funciones, infinitamente
        //se actualiza la informacion y se pinta
        update(delta / 1000);
        render();

        then = now;

        //funcion que llama infinitamente a la funcion principal
        frameRef = requestAnimationFrame(main);
    };

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    //llamado al inicio del juego
    var then = Date.now();
    main();
};
