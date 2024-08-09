import Brain from "../brain.js";

export default class CollisionDetector {
    gameElements = [];
    gameState = null;
    ball = null;
    bricks = [[]];

    constructor(gameElements, gameState) {
        this.gameElements = gameElements;
        this.gameState = gameState;
        this.ball = this.gameElements[0];
        this.bricks = this.gameElements[2];
    }


    detect() {
        const ball = this.gameElements[0]
        const paddle = this.gameElements[1];
        let paddlePos = paddle.getBoundaries();
        let ballPos = ball.getBoundaries();

        this.detectPaddle(ballPos, paddlePos);
        this.detectBorders(ballPos);
        this.detectBottom(ballPos);
        this.detectBricks(ballPos);

    }

    detectPaddle(ballPos, paddlePos) {
        if (ballPos.bottom >= paddlePos.top &&
            ballPos.top < paddlePos.bottom &&
            ballPos.right >= paddlePos.left &&
            ballPos.left <= paddlePos.right) {

            this.ball.position.top = paddlePos.top - this.ball.position.height - 1;

            let collidePoint = (ballPos.centerX - (paddlePos.left + paddlePos.width / 2)) / (paddlePos.width / 2);

            let distance = collidePoint- paddlePos.left;
            let length = paddlePos.width;
            let angleRad = (distance / length -0.5) / 2 * Math.PI;

            this.ball.setVelocity(angleRad);
            this.ball.increaseSpeed();
        }
    }

    detectBricks(ballPos) {
        let collisionDetected = false;
        let bricksLeft = 0;
        for (let row = 0; row < this.bricks.length; row++) {
            for (let col = 0; col < this.bricks[row].length; col++) {
                let brick = this.bricks[row][col];

                if (!brick || brick.isDestroyed()) {
                    continue;
                }
                bricksLeft += 1;
                let brickPos = brick.getBoundaries();
                if (!collisionDetected && ballPos.right > brickPos.left && ballPos.left < brickPos.right &&
                    ballPos.bottom > brickPos.top && ballPos.top < brickPos.bottom) {

                    let ballPreviousPosition = {
                        left: ballPos.left - this.ball.velocity.x,
                        top: ballPos.top - this.ball.velocity.y,
                        right: ballPos.left + ballPos.width - this.ball.velocity.x,
                        bottom: ballPos.top + ballPos.height - this.ball.velocity.y
                    };

                    if (ballPreviousPosition.bottom <= brickPos.top || ballPreviousPosition.top >= brickPos.bottom) {
                        this.ball.changeVelocityY();
                    } else if (ballPreviousPosition.right <= brickPos.left || ballPreviousPosition.left >= brickPos.right) {
                        this.ball.changeVelocityX();
                    }
                    this.ball.increaseSpeed();
                    brick.setDestroyed();
                    brick.markAsDirty();
                    this.gameState.score += brick.points;

                    bricksLeft -= 1;
                    collisionDetected = true;
                }
            }
        }
        this.gameState.bricksLeft = bricksLeft;
    }


    detectBottom(ballPos) {
        if (ballPos.bottom >= Brain.HEIGHT) {
            this.gameState.balls -= 1;
            this.ball.reset();
            console.log("Ball hit the bottom, turn", this.gameState.balls);
        }
    }

    detectBorders(position) {
        if (position.left < 0 || position.left > Brain.WIDTH - position.width) {
            this.ball.changeVelocityX();
        }
        if (this.ball.position.top < 0 || this.ball.position.top > Brain.HEIGHT - this.ball.position.height) {
            this.ball.changeVelocityY();
        }
    }
}