import {Paddle} from "./components/Paddle.js";
import Ball from "./components/Ball.js";
import CollisionDetector from "./components/CollisionDetector.js";
import BrickFactory from "./components/BrickFactory.js";
import GameState from "./components/GameState.js";
import LocalStorageScorePersistence from "./components/LocalStorageScorePersistence.js";


export default class Brain {
    static WIDTH = 1024;
    static HEIGHT = 768;

    static BRICK_COLS = 14;
    static BRICK_TOP_OFFSET = 50;
    static BRICK_PADDING = 3;
    static BRICK_HEIGHT = 15;
    static BRICK_WIDTH = (Brain.WIDTH - Brain.BRICK_COLS * Brain.BRICK_PADDING) / Brain.BRICK_COLS | 0;

    bricksStructure = {
        0: {color: "red", points: 7},
        1: {color: "red", points: 7},
        2: {color: "orange", points: 5},
        3: {color: "orange", points: 5},
        4: {color: "green", points: 3},
        5: {color: "green", points: 3},
        6: {color: "yellow", points: 1},
        7: {color: "yellow", points: 1},
    }

    gameElements = [];
    collisionDetector = null;
    paddle = null;
    ball = null;
    bricks = [[]];
    gameState = null;
    scorePersistence = null;
    newBoard = true;

    constructor() {
        console.log("Brain constructor...")
        this.scorePersistence = new LocalStorageScorePersistence();
        this.newGame()
    }

    newGame() {
        this.gameState = new GameState();
        this.gameElements = [];
        this.newGameBoard();
        console.log("New game")
    }

    newGameBoard() {
        this.paddle = new Paddle(Brain.BRICK_WIDTH, Brain.BRICK_HEIGHT);
        this.ball = new Ball();
        const bricksBuilder = new BrickFactory(this.bricksStructure);
        this.bricks = bricksBuilder.getBricks();
        this.gameElements = [];
        this.gameElements.push(this.ball, this.paddle, this.bricks);
        this.collisionDetector = new CollisionDetector(this.gameElements, this.gameState);
        this.gameState.newGameBoard = true;
        this.gameState.level++;
        this.ball.setInitialSpeed(this.gameState.level);
        this.togglePause();
        console.log("new gameboard", this.gameState);
    }

    playGame() {
        if (!this.gameState.isPaused && this.isNewLevel()) {
            this.prepareNewLevel();
            this.gameState.isPaused = true;
        }
        else if (this.isGameOver() || this.gameState.isPaused) {
            return;
        }

        if (!this.gameState.isPaused && this.gameState.showNewLevelScreen) {
            this.gameState.showNewLevelScreen = false;
            return;
        }
        if (this.gameState.newGame) {
            this.gameState.newGame = false;
        }

        this.collisionDetector.detect();
        this.moveBall();
    }

    prepareNewLevel() {
        this.gameState.showNewLevelScreen = true;
        this.gameState.newLevel = false;
        this.newGameBoard();
    }

    togglePause() {
        if (this.gameState.gameOver) {
            return;
        }
        return this.gameState.isPaused = !this.gameState.isPaused;
    }

    isGameOver() {
        if (this.gameState.balls > 0 && !this.gameState.gameOver) {
            return false;
        }
        this.gameState.gameOver = true
        console.log("game over")
        return true;
    }

    isNewLevel() {
        if (this.gameState.balls > 0 && this.gameState.bricksLeft <= 0 && !this.gameState.newLevel) {
            this.gameState.newLevel = true;
            return true;
        }
        return false;
    }

    moveBall() {
        if (!this.ball.active) {
            return
        }
        this.ball.moveBall();
    }

    startMovePaddle(step) {
        this.paddle.startMove(step);
    }

    saveScore({name, score}) {
        this.scorePersistence.save({name, score});
    }

    getScores() {
        return this.scorePersistence.getAll();
    }

    stopMovePaddle() {
        this.paddle.stopMove();
    }
}