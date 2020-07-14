$(document).ready(function() {
    var canvas = $("#gameCanvas");
    var context = canvas.get(0).getContext("2d");
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();

    var stepX = 10;
    var stepY = 10;
    var birdStep = 3;
    var keySpace = 32;
    var arrowLeft = 37;
    var arrowUp = 38;
    var arrowRight = 39;
    var arrowDown = 40;
    
    var spriteColumns = 5;
    var spriteRows = 3;
    var currentFrame = 0;
    var maxHp = 100;
    var maxPetrol = 500;
    var playGame = false;
    var score;
    var bullets;
    var bird;
    var player;
    var Player = function (x, y) {
        this.x = x;
        this.y = y;
    };
    var imgPlayer1 = new Image();
    imgPlayer1.src = "assets/player_flying.png";
    var imgPlayer2 = new Image();
    imgPlayer2.src = "assets/player_running.png";
    var imgPlayer3 = new Image();
    imgPlayer3.src = "assets/player_flying_shoot.png";
    var imgPlayer4 = new Image();
    imgPlayer4.src = "assets/player_running_shoot.png";
    var imgBullet = new Image();
    imgBullet.src = "assets/long-ray.png";

    var imgBird = new Image();
    var Bullet = function(x, y) {
		this.x = x;
		this.y = y;
		this.width = 1;
		this.height = 1;		
		this.halfWidth = this.width/2;
        this.halfHeight = this.height/2;
        this.vX = 15;
    };
    var Bird = function(x, y) {
        this.x = x;
        this.y = y;
    }

    var gameUI = $("#gameUI");
    var uiMenu = $("#uiMenu");
    var uiRule = $("#uiRule");
    var uiCredit = $("#uiCredit");
    var uiStats = $("#uiStats");
    var uiWin = $("#uiWin");
    var uiLose = $("#uiLose");
    var scoreNum = $(".scoreNum");
    var playButton = $("#playButton");
    var ruleButton = $("#ruleButton");
    var creditButton = $("#creditButton");
    var backButton = $(".backButton");
    var hpBar = $("#hpBar");
    var petrolBar = $("#petrolBar");

    function draw_player_flying(x, y) {
        var frameWidth = imgPlayer1.width / spriteColumns;
        var frameHeight = imgPlayer1.height / spriteRows;
        var maxFrame = spriteColumns * spriteRows - 1;
        if(currentFrame > maxFrame) {currentFrame = 0};
        var column = currentFrame % spriteColumns;
        var row = Math.floor(currentFrame / spriteColumns);
        context.drawImage(imgPlayer1, column*frameWidth, row*frameHeight, 881, 639, x, y, 176, 121); 
    }

    function draw_player_running(x, y) {
        var frameWidth = imgPlayer2.width / spriteColumns;
        var frameHeight = imgPlayer2.height / spriteRows;
        var maxFrame = spriteColumns * spriteRows - 1;
        if(currentFrame > maxFrame) {currentFrame = 0};
        var column = currentFrame % spriteColumns;
        var row = Math.floor(currentFrame / spriteColumns);
        context.drawImage(imgPlayer2, column*frameWidth, row*frameHeight, 881, 639, x, y, 176, 121); 
    }

    function draw_bird(x, y) {
        if(currentFrame == 4) {
            imgBird.src = "assets/red_bird/frame-1.png";
        }else if(currentFrame == 8) {
            imgBird.src = "assets/red_bird/frame-2.png";
        }else if(currentFrame == 12) {
            imgBird.src = "assets/red_bird/frame-3.png";
        }else if(currentFrame == 16) {
            imgBird.src = "assets/red_bird/frame-4.png";
        }else if(currentFrame == 20) {
            currentFrame = 0;
        }
        context.drawImage(imgBird, x, y, 50, 35);
    }

    function draw_bullet(x, y) {
        context.drawImage(imgBullet, x, y, 33.8, 6.6);
    }

    function init() {
        //uiMenu.hide();
        playButton.click(function(e) {
            e.preventDefault();
            gameUI.hide();
            uiMenu.hide();
            uiStats.show();
            Start();
        });
        ruleButton.click(function(e) {
            e.preventDefault();
            uiMenu.hide();
            uiRule.show();
        });
        creditButton.click(function(e) {
            e.preventDefault();
            uiMenu.hide();
            uiCredit.show();
        });
        backButton.click(function(e) {
            e.preventDefault();
            uiMenu.show();
            uiRule.hide();
            uiCredit.hide();
        });
    };
    init();

    function Start() {
        if(!playGame) {
            playGame = true;
        };
        scoreNum.html("0");
        score = 0;
        hpBar.css({"width": "100%"});
        petrolBar.css({"width": "100%"})
        bullets = new Array();
        bird = new Array();
        numBirds = 3;
        
        for (var i = 0; i < numBirds; i++) {
            var x = Math.floor(Math.random()*(canvasWidth - canvasWidth/2))+canvasWidth/2;
            var y = Math.floor(Math.random()*(canvasHeight-190 - canvasHeight-190/5))+canvasHeight-150;
            bird.push(new Bird(x, y));
        };

        player = new Player(-50, 410);
        $(window).keydown(function(e) {
            var keyCode = e.keyCode;
            if (keyCode == arrowRight) {
                player.moveRight = true;
            } else if (keyCode == arrowUp) {
                player.moveUp = true;
            } else if (keyCode == arrowDown) {
                player.moveDown = true;
            } else if (keyCode == arrowLeft) {
                player.moveLeft = true;
            };
        });
        $(window).keyup(function(e) {
            var keyCode = e.keyCode;
            if (keyCode == arrowRight) {
                player.moveRight = false;
            } else if (keyCode == arrowUp) {
                player.moveUp = false;
            } else if (keyCode == arrowDown) {
                player.moveDown = false;
            } else if (keyCode == arrowLeft) {
                player.moveLeft = false;
            } else if(keyCode == keySpace) {
                bullets.push(new Bullet(player.x + 150, player.y + 55));
            };
        });
        Update();
    };

    function Update() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        //if(player.moveLeft) {player.x = player.x - stepX};
        //if(player.moveRight) {player.x = player.x + stepX};
        if(player.moveUp) {player.y = player.y - stepY};
        if(player.moveDown) {player.y = player.y + stepY};

        if (player.x < -50) {
            player.x = -50;
        } else if (player.x > canvasWidth + 50) {
            player.x = canvasWidth + 50;
        }
        if (player.y < 10) {
            player.y = 10;
        } else if (player.y > canvasHeight - 190) {
            player.y = canvasHeight - 190;
        };
        
        var bulletsLength = bullets.length;
		for (var i = 0; i < bulletsLength; i++) {
			var tmpBullet = bullets[i];
            draw_bullet(tmpBullet.x, tmpBullet.y);
            tmpBullet.x += tmpBullet.vX;
            if(tmpBullet.x >= canvasWidth) {
                var idxBullet = bullets.indexOf(tmpBullet);
                bullets.splice(idxBullet, 1);
                break;
            }
        }

        var birdLength = bird.length;
        for (var i = birdLength-1; i > -1; i--) {
            var tmpBird = bird[i];
            draw_bird(tmpBird.x, tmpBird.y);
            bird[i].x = bird[i].x - birdStep;
            var bulletsLength = bullets.length;
			for (var j = bulletsLength-1; j > -1; j--) {
				var tmpBullet = bullets[j];
				if (tmpBird.x + 50 >= tmpBullet.x && tmpBird.x + 0 < tmpBullet.x + 10 &&
                    tmpBird.y + 35 >= tmpBullet.y && tmpBird.y + 0 < tmpBullet.y + 6.6) {
                        var idxBird = bird.indexOf(tmpBird);
                        var idxBullet = bullets.indexOf(tmpBullet);
                        bird.splice(idxBird,1);
                        bullets.splice(idxBullet,1);
                        scoreNum.html(++score);
                        break;
                    }
            }
            if (tmpBird.x + 50 >= player.x && tmpBird.x + 0 < player.x + 150 &&
                tmpBird.y + 35 >= player.y && tmpBird.y + 0 < player.y + 121) {
                    var idxBird = bird.indexOf(tmpBird);
                    bird.splice(idxBird, 1);
                    if(maxHp > 0) {maxHp -= 10};
                    break;
                }
            if(tmpBird.x <= 10) {
                var idxBird = bird.indexOf(tmpBird);
                bird.splice(idxBird, 1);
                break;
            }
            while(bird.length < numBirds) {
                var x = Math.floor(Math.random()*(canvasWidth - canvasWidth/2))+canvasWidth/2;
                var y = Math.floor(Math.random()*(canvasHeight-190 - canvasHeight-190/5))+canvasHeight-150;
                bird.push(new Bird(x, y));
            }
        }
        currentFrame++;
        if(player.y < 410) {
            draw_player_flying(player.x, player.y);
            if(maxPetrol <= 0) {
                maxPetrol = 0;
                player.y += 10;
            } else if(maxPetrol <= 100) {
                maxPetrol--;
                player.y += 5;
            }else {
                maxPetrol--;
            }
        } else {
            if(maxPetrol <= 500) maxPetrol++;
            draw_player_running(player.x, player.y);
        };

        if(maxHp <= 0) {
            playGame = false;
            gameUI.show();
            uiLose.show();
        };

        hpBar.css({"width": maxHp + "%"});
        petrolBar.css({"width": maxPetrol/5 + "%"});
        if(playGame) {
            setTimeout(Update, 33);
        };
    };
});