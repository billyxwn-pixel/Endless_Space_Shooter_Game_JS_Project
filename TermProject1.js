/**
 * step 1: Make var EnemyImage = new Image();
 * step 2: Inside DrawUpdate function: inside for(i = 0; i < enemies.length, i++)  
 * ----> ctx.save, ctx.translate(enemies[i].x, enemies[i].y)
 * ----> ctx.rotate(enemy.angle); --- use this!!!
 * ----> ctx.drawImage(); 
 * ----> ctx.restore. outside of for loop. 
 * 
 */

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function GameComponent(x, y) {
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0; 
    this.status = true;
}

var Player = new GameComponent(canvas.width/2, canvas.height/2);

Player.MovementSpeed = 2; // Dictates player's speed when moving.  

var PlayerHealthCount = 3000; // Player's health at beginning of game. 

var PlayerScoreCount = 0; // Player's score at beginning of game. 

var PlayerRadius = 20; // Dictates radius of player's circle. 

var PlayerImage = new Image(); // An object is created for PlayerImage.

var PlayerImageLoad = false; 

PlayerImage.onload = function() {  // When PlayerImageLoad is true,
    PlayerImageLoad = true;        // the image file of the player will be loaded onto the canvas. 
}

PlayerImage.src = "Player.png";    // Source of the image file for the player. 

////

/// Gif for explosion on impact!!!

var ExplosionGif = new Image(); 

var ExplosionLoad = false; 

ExplosionGif.onload = function() {
    ExplosionLoad = true; 
}

ExplosionGif = "thing.gif"; 

//// 

/// Enemy image sources!!! 

var EnemyRadius = 22; // Dictates radius of enemies's circles. 

var EnemyImage = new Image();

var EnemyImageLoad = false;

EnemyImage.onload = function() {
    EnemyImageLoad = true; 
}

EnemyImage.src = "EnemyShip.png"; /// fill this quote in with file name for enemy's image!!!

EnemyDeathCount = 0;

////

/// Bullet component of the game!!!

var bullets = []; 
var bulletSpeed = 20 

for (i = 0; i < 40; i++) {
    bullets[i] = new GameComponent(0, 0);   // Fetch a bullet from anywhere
    bullets[i].status = false;              // on the canvas. 
    
    // Default bullet (array) status is set to false!!!
}   

var enemies = [];

for (i = 0; i < 500; i++) {   /// 500 limits the total number enemies I will work with. 
    enemies[i] = new GameComponent(Math.floor(Math.random() * 801), 0);
    enemies[i].status = false;  /// makes an enemy as a new game component and draw it anywhere in the canvas.
    enemies[i].angle = 0;    /// status sets each enemy as false ---> so when each enemy is drawn when enemies status is true.
}   /// each enemy angle is initiated to 0 first. 

function enemySpeed(speed, enemy) {
    var x_change = Player.x - enemy.x; // Difference between x position of player object and enemy object. 
    var y_change = Player.y - enemy.y; // // Difference between y position of player object and enemy object.
    enemy.angle = Math.atan2(y_change, x_change); // Directionality is defined using arctan for the difference in the x and y positions between the player object and the enemy object. 
    enemy.vx = speed * Math.cos(enemy.angle); // cosine represents x - coordinates.
    enemy.vy = speed * Math.sin(enemy.angle); // sine represents y - coordinates. 
}

function enemyMove() {
    for (i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (enemy.status == true) { // the function checks for status of each enemy. If an enemy's status is true, the enemy's x and y positions will move towards the player. 
            enemy.x += enemy.vx; 
            enemy.y += enemy.vy;
        } 
    } 
}

function playerEnemyDistance (player_x, player_y, enemy_x, enemy_y, enemy) {  /// This function checks for enemy player collision
    var x_change = enemy.x - Player.x;
    var y_change = enemy.y - Player.y; 
    var realDistance = Math.sqrt(Math.pow(x_change, 2) + Math.pow(y_change, 2)); 
    if ((PlayerRadius + EnemyRadius) >= realDistance) {
        enemy.status = false; 
        PlayerHealthCount -= 500; 
        enemy.x = Math.floor(Math.random() * 801); // enemy's x - position is randomized between 0 to 800. 
        enemy.y = -200; // Enemy is sent to the outside of the top of the canvas. 
        var audio = new Audio("phaserDown3.ogg");
        audio.play();
    }
}

function ShootStuff() {  // Function ShootStuff() controls shooting in the game. Function is executed inside DrawUpdate() when variable PlayerShoot == true.  
    if (count > 10) {  // Controls fire rate!!! Once incremented past 15, count resets to 0. Process then repeats.
        count = 0;     // count increments by one, ten times per second (in function DrawUpdate()).
        for (i = 0; i < bullets.length; i++) {
            if (bullets[i].status == false) {
                bullets[i].status = true; // Changes default setting for bullets (an array) from false to true. 
                bullets[i].vy = -bulletSpeed;  // Once true, will draw bullets in DrawUpdate() function. 
                bullets[i].x = Player.x - 1;   // x & y coordinates of bullets wrt. Player position.
                bullets[i].y = Player.y - 15;
                var audio = new Audio("laser1.ogg");
                audio.play(); 
                break;  
            }
        }
    } 
}

function enemy_bulletImpact() {  /// Enemy and bullet collision check. 
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].status) {
            for (j = 0; j < bullets.length; j++) {
                if (bullets[j].status) {
                    if (bullets[j].x > enemies[i].x - EnemyRadius && bullets[j].x < enemies[i].x + EnemyRadius) {
                        if (bullets[j].y > enemies[i].y - EnemyRadius && bullets[j].y < enemies[i].y + EnemyRadius) {
                            enemies[i].status = false;
                            bullets[j].status = false; 
                            enemies[i].x = Math.floor(Math.random() * 801);
                            enemies[i].y = -200; 
                            PlayerHealthCount += 70;
                            PlayerScoreCount += 20;
                            var audio = new Audio("twoTone2.ogg");
                            audio.play();
                            EnemyDeathCount = 12; 
                        }
                    }
                }
            }
        }
    }       
}

var epilogue_game = 0; // Count is initiated at zero for when the player dies. 

function killPlayer() {  // Function for killing the player when the player's health is less than or equals to 0. The function is later called in the DrawUpdate() function. 
    if (PlayerHealthCount <= 0) {
        epilogue_game++
        if (epilogue_game == 10) {  // Once the count becomes zero after the player's health becomes less than or equals to 0, two alert messages will appear to let the player know that the game is over and what the player's score is.  
            alert("Game Over!!");
            alert("Your Score is: " + PlayerScoreCount);   
            location.reload();  // Reloads the game to the beginning.  
        }
        Player.status = false; // When the player's health is <= 0, the player object's status is set to false which thus kills the player in the game.     
    }
}

var backgroundStars = [];  // An array is initialized for the stars in the background of the game. 

for (i = 0; i < 60; i++) {  // The for loop gives the array 60 stars to work with. 
    backgroundStars[i] = new GameComponent(Math.floor(Math.random() * 801), Math.floor(Math.random() * 601));
}

function movingStars() {
    for (i = 0; i < backgroundStars.length; i++) {
        var stars1 = backgroundStars[i];
        stars1.y += 1;
        } 
} 

var PlayerShoot = false; 

var count = 0;  // Variable count is created to dictate rate of fire of bullets.

var right = false;

var left = false;

var up = false;

var down = false; 


var stop = false; 


document.addEventListener("keydown", function(e) {
    if(e.keyCode == 39) right = true;  
    // 39 move right
    if(e.keyCode == 37) left = true;
    // 37 move left
    if(e.keyCode == 38) up = true; 
    // 38 move up
    if(e.keyCode == 40) down = true;
    // 40 move down 
    
    if (e.keyCode == 32) {
        PlayerShoot = true; // Default setting for variable PlayerShoot = false. 
    }   // Once space key is down, PlayerShoot becomes true. 

    if(e.keyCode == 80) alert("PAUSED"); 
})


document.addEventListener("keyup", function(e) {
    if(e.keyCode == 39) right = false;
    // 39 move right
    if(e.keyCode == 37) left = false;
    // 37 move left
    if(e.keyCode == 38) up = false;
    // 38 move up
    if(e.keyCode == 40) down = false; 
    // 40 move down 
    if (e.keyCode == 32) {
        PlayerShoot = false; 
    }
})

// document.addEventListener("keyup", function(e) { /// continues game? 
//    if(e.keycode == 80) stop = false; 
//})


var enemySpawnRate = 280; /// 1st enemy spawn takes 2.8 seconds. 

var randomEnemy_XMove = 80; 

function DrawUpdate() {

    gameCounter++; 

    enemymoveCounter++; 

    if (PlayerHealthCount >= 3000) { /// Player's health count. Can display in game!!!
        PlayerHealthCount = 3000; 
    }

    if (gameCounter % enemySpawnRate == 0) {
        enemySpawnRate -= 5; // Enemy's spawn rate increases by 50 milliseconds with every interval that the DrawUpdate() function is executed. 
        if (enemySpawnRate <= 6) {
            enemySpawnRate = 6;
        }
        for (i = 0; i < enemies.length; i++) {
            if (enemies[i].status == false) {
                enemies[i].status = true; // Sets the status of each enemy object to true if it was false. 
                break; 
            }
        }
    }

    Player.vx = 0;
    Player.vy = 0;
    if (right) { // Player will move right when right is true. 
        Player.vx = Player.MovementSpeed;
    } 
    if (left) {  // Player will move left when left is true. 
        Player.vx = -Player.MovementSpeed; 
    }
    if (up) {  // Player will move up when up is true. 
        Player.vy = -Player.MovementSpeed;
    }
    if (down) {   // Player will move down when down is true. 
        Player.vy = Player.MovementSpeed; 
    }

    // The coding lines below checks for player's collision with the boundaries of the canvas. 

    Player.x += Player.vx;
    Player.y += Player.vy; 
    if (Player.x < 20) {
        Player.x = 20;
    } 
    if (Player.x > canvas.width - 20) {
        Player.x = canvas.width - 20;
    }
    if (Player.y < 20) {
        Player.y = 20;
    }
    if (Player.y > canvas.height - 20) {
        Player.y = canvas.height - 20; 
    }

     // The coding lines above checks for player's collision with the boundaries of the canvas.
    
    if (PlayerShoot == true) {  // When keyCode 32 is executed, the function ShootStuff() is called. 
        ShootStuff(); 
    }

    for (i = 0; i < bullets.length; i++) {
        var projectile = bullets[i]; 
        if (projectile.status == true) {
            projectile.y += projectile.vy; // No x - movement speed was created since each bullet only travels in the y direction. 
        }
    }

    for (i = 0; i < bullets.length; i++) {
        if (bullets[i].status == true) {
            if (bullets[i].y < -40) {     // length of bullet is 40px. Thererefore, must 
                bullets[i].status = false; //be -40 for bullet to be off canvas. 
            }
        }
    }

    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].status == true) {
            if (i % 2 == 1) {  /// Every odd enemy spawned will only move towards the bottom of canvas.
                enemies[i].vy = 1; 
                enemies[i].angle = Math.PI/2; 
                if (enemies[i].vx > 0) {
                    enemies[i].vx = 2;
                }
                if (enemies[i].vx < 0) {
                    enemies[i].vx = -2;
                }
                else {
                    enemies[i].vx = 2; 
                }
                if (enemymoveCounter % randomEnemy_XMove == 0) {
                    randomEnemy_XMove -= 5;
                    if (randomEnemy_XMove <= 40) {
                        randomEnemy_XMove = 40;
                        enemies[i].vx *= -1;
                    }
                }
            }
            else {
                enemySpeed(0.95, enemies[i]);  // Dictates how fast enemy is moving towards player.
            }
        }
    }

    enemyMove(); 

    for (i = 0; i < enemies.length; i++) {
        if (i % 2 == 1) {
            if (enemies[i].status == true) {
                if (enemies[i].y >= 700) {
                    enemies[i].y = -100;
                    enemies[i].x = Math.floor(Math.random() * 801);  
                    enemies[i].status = false; 
                }
            }
        }
    }

    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].status == true) {
            playerEnemyDistance (Player.x, Player.y, enemies[i].x, enemies[i].y, enemies[i]);  
        }
    }
     
    enemy_bulletImpact(); 

    killPlayer(); 

    movingStars(); 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < backgroundStars.length; i++) {
        var FX = backgroundStars[i];
        if (FX.status == true) {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.beginPath(); 
            ctx.arc(FX.x, FX.y, 1, 0, Math.PI * 2); 
            ctx.fill(); 
            if (FX.y == 605) {
                FX.y = -15; 
            }
        }
    }

    if (Player.status) {
        ctx.drawImage(PlayerImage, Player.x - PlayerImage.width/2, Player.y - PlayerImage.height/2);
        
    }
    
    for(i = 0; i < bullets.length; i++) {
        var projectile = bullets[i];
        if (projectile.status == true) {    // Checks to see if there 
            ctx.fillStyle = "rgb(72, 255, 0)";       // is a bullet. If there
            ctx.beginPath();                // is one, the bullet is drawn.
            ctx.rect(projectile.x, projectile.y, 2, 40); 
            ctx.fill(); 
        }
    }

    for (i = 0; i < enemies.length; i++) {
        var badGuys = enemies[i];
        if (badGuys.status == true) {
            ctx.save();
            ctx.translate(enemies[i].x, enemies[i].y) 
            ctx.rotate(badGuys.angle - Math.PI/2); ////////////////////!!!!!!!!!!!!
            ctx.drawImage(EnemyImage, 0 - EnemyImage.width/2, 0 - EnemyImage.height/2);
            ctx.restore();
        }
    } 

    if (PlayerHealthCount >= 0 && PlayerHealthCount <= 3000) {  // Displays the player's health points on the canvas. 
        ctx.font = "30px Arial";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "white");
        gradient.addColorStop("0.5", "white");
        gradient.addColorStop("1.0", "white");
        ctx.fillStyle = gradient;
        ctx.fillText("Health: " + PlayerHealthCount, 20, 560); 
       }
    
    if (PlayerScoreCount >= 0) {  // Displays the player's score on the canvas. 
        ctx.font = "30px Arial";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "white");
        gradient.addColorStop("0.5", "white");
        gradient.addColorStop("1.0", "white");
        ctx.fillStyle = gradient;
        ctx.fillText("Score: " + PlayerScoreCount, 600, 560); 
       }

    if (ExplosionLoad == true) {
        ctx.drawImage(ExplosionGif, 0 - ExplosionGif.width/2, 0 - ExplosionGif.height/2); 
    }

    count += 1; // count is incremented by one every time canvas clears and re-draws contents.  
}

setInterval(DrawUpdate, 10); // Interval is created for the DrawUpdate() function.
                             // Every 10 milliseconds, the DrawUpdate() function will be executed. 
var gameCounter = 0;

var enemymoveCounter = 0; 


