(function Pong() {
    
    //objects
    var paddleA =  $("#paddleA"),
    paddleB = $("#paddleB"),
    ball = $("#ball"),
    surface = $("#surface"),
    //env
    env = {
      divider : $("divider"),
      scoreA : $("scoreA"),
      scoreB : $("scoreB")
    },
    //top border bounding box
    topBorder = {
      x: surface.position().left,
      y: surface.position().top,
      width: 640,
      height: 2
    },
    //bottom border bounding box
    botBorder = {
      x: surface.position().left,
      y: 480,
      width: 640,
      height: 2
    },
    //left border bounding box
    leftBorder = {
      x: surface.position().left,
      y: surface.position().top,
      width: 2,
      height: 480
    },
    //right border bounding box
    rightBorder = {
      x: 640,
      y: surface.position().top,
      width: 2,
      height: 480
    },
    midX = surface.width()/2,
    midY = surface.height()/2,
    direction = 'nw',
    vx = 2.6, vy = 4.8,   //velocities
    paddleVelocityY = 0,
    paddleSpeed = 2,
    paddleFriction = 1.26,
    initEnv = function() {
      //set initial positions of objects
      //paddles in mid left & mid right ends of the surface (almost the end)
      // ball at center with divider 
      ball.css({left:midX, top:midY});
      paddleA.css({left:"5px", top:midY});
      paddleB.css({left:midX*2-10 + "px", top:midY});
    };

    function detectCollision(rect1, rect2) {
      /*console.log(rect1.x + ", " + (rect2.width + rect2.x));
      console.log(rect2.x + ", " + (rect1.width + rect1.x));
      console.log(rect1.y + ", " + (rect2.height + rect2.y));
      console.log(rect2.y + ", " + (rect2.y + rect2.height));*/
      if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y) {
          // collision detected!
          //console.log("collision detected");
        return true;
      } else {
        return false;
      }
    }

  var Ball = {
    currPos: {
      left: midX,
      top: midY
    },
    move: function() {
      var hitbox = {
        x: Ball.currPos.left,
        y: Ball.currPos.top,
        width: 8,
        height: 8
      };
      
      var paHitbox = PaddleA.getHitbox();
      
      //Detect collision with borders and paddle
      if (detectCollision(hitbox, topBorder)) {
        //calculate angle and bounce ball
          //Ball.currPos.left+=vx;
          //Ball.currPos.top+=vy;
          if(direction === 'nw') {
            direction = 'sw';
          } else if(direction === 'ne') {
            direction = 'se';
          }
      } else if (detectCollision(hitbox, botBorder)) {
          //Ball.currPos.left-=vx;
          //Ball.currPos.top-=vy;
          if(direction === 'se') {
            direction = 'ne';
          } else if(direction === 'sw') {
            direction = 'nw';
          }
      } else if (detectCollision(hitbox, leftBorder) || detectCollision(hitbox, paHitbox)) {
          if(direction === 'sw') {
            direction = 'se';
          } else if(direction === 'nw') {
            direction = 'ne';
          }
      } else if (detectCollision(hitbox, rightBorder)) {
          if(direction === 'ne') {
            direction = 'nw';
          } else if(direction === 'se') {
            direction = 'sw';
          }
      }

      //impart velocity to ball to make it move on collision
      //collision response
      //Or just use velocity to move ball in 4 different directions
      if(direction != null) {
        switch(direction) {
          case 'se':
              //move in south easterly direction
              Ball.currPos.top+=vy;
              Ball.currPos.left+=vx;
              break;
          case 'sw':
              //move in south westerly direction
              Ball.currPos.top+=vy;
              Ball.currPos.left-=vx;
              break;
          case 'ne':
              //move in north easterly direction
              Ball.currPos.top-=vy;
              Ball.currPos.left+=vx;
              break;
          case 'nw':
              //move in north westerly direction
              Ball.currPos.top-=vy;
              Ball.currPos.left-=vx;
              break;
        }
      }
      
    }
  };
  
  var PaddleA = {
    currPos: {
      left: 5,
      top: midY
    },
    move: function(direction) {

      var y = PaddleA.currPos.top;
      if(direction === 'up') {
        //console.log(PaddleA.currPos.top);
        //PaddleA.currPos.top-=4.5;
        if (paddleVelocityY > -paddleSpeed) {
            paddleVelocityY--;
        }
      } else if (direction === 'down') {
        if (paddleVelocityY < paddleSpeed) {
            paddleVelocityY++;
        }
      }
      paddleVelocityY *= paddleFriction;
      y += paddleVelocityY;

      console.log(paddleVelocityY + ", " + y);
      //bounds check
      if (y > 480) {
          y = 480;
      } else if (y <= 8) {
          y = 8;
      }

      paddleA.css({top:y});
    },
    getHitbox: function() {
          var hitbox = {
            x: PaddleA.currPos.left,
            y: PaddleA.currPos.top,
            width: 8,
            height: 32
          };
       return hitbox;
    }
  };

  var initKeys = function() {
    
    //Paddle A 
    var paHitBox = PaddleA.getHitbox();
    $( "html" ).keydown(function( event ) {
      //up arrow
      if ( event.which == 38 && !detectCollision(paHitBox, topBorder)) {
        //console.log("moving up");
        event.preventDefault();
        PaddleA.move('up');
      }// down arrow
        else if ( event.which == 40 && !detectCollision(paHitBox, botBorder))  {
        //console.log("moving down");
        event.preventDefault();
        PaddleA.move('down');
      } else if ( event.which == 32) {
         // To stop the game, use the following:
        clearInterval(Game._intervalId);
      }
    });
    
  };
  
  //TODO
  //1. gameloop using setInterval
  //2. update game logic
  //    - detect ball-paddle collision
  //    - on collision change ball direction
  var Game = {
    fps: 60,
    update: function() {
      Ball.move('nw');
      //console.log(Ball.currPos.left);
      ball.css({left:Ball.currPos.left, top:Ball.currPos.top});
    },
    draw: function() {
      
    },
    run: function() {
      //console.log(Game._intervalId);
      Game.update();
      Game.draw();      
    }
  };
  
  //console.log(this);
  
  //Initialize the Environment
  initEnv();
  //init key events
  initKeys();
  // Start the game loop
  Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
  Game.run();
  //clearInterval(Game._intervalId);

})();
