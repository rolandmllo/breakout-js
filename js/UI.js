import Brain from "./brain.js";
import GameArea from "./components/GameArea.js";
import Header from "./components/Header.js";
import ModalDialog from "./components/ModalDialog.js";

export default class UI {
    static ASPECT_RATIO = 4 / 3;
    static MIN_HEADER_HEIGHT = 50;
    static MAX_HEADER_HEIGHT = 100;
    static HEADER_HEIGHT_SCALE = 0.05;


    brain = null;
    appContainer = null;
    header = null;
    gameArea = null;
    modalDialog = null;

    dimensions = {
        windowHeight: 0,
        windowWidth: 0,
        containerWidth: 0,
        headerHeight: 0,
        headerWidth: 0,
        gameAreaHeight: 0,
        gameAreaWidth: 0,
        scaleX: 0,
        scaleY: 0,
        gameAreaContainerOffset: {}
    }

    constructor(brain, appContainer) {
        this.appContainer = appContainer;
        this.brain = brain;
        this.header = new Header(appContainer, this.brain);
        this.gameArea = new GameArea(appContainer);
        this.modalDialog = new ModalDialog(appContainer, this.brain);

        this.elementsSetup(this.gameArea.element);

        window.addEventListener('resize', () => {
            this.modalDialog.remove();
            this.setScreenDimension();
            this.draw();
        });
    }

    elementsSetup(gameArea) {
        this.setScreenDimension();
        this.brain.paddle.parentElement = gameArea;
        this.brain.ball.parentElement = gameArea;

        const bricks = this.brain.bricks;
        for (const [row, value] of Object.entries(this.brain.bricksStructure)){
            for (let col = 0; col < bricks[row].length; col++){
                let brick = this.brain.bricks[row][col];
                brick.parentElement = gameArea;
                brick.className += value.color;
            }
        }
        this.brain.gameState.newGameBoard = false;
    }


    setScreenDimension() {

        this.dimensions.windowWidth = this.appContainer.offsetWidth;
        this.dimensions.windowHeight = window.innerHeight;

        this.dimensions.headerHeight = Math.max(UI.MIN_HEADER_HEIGHT, Math.min(UI.MAX_HEADER_HEIGHT, this.dimensions.windowHeight * UI.HEADER_HEIGHT_SCALE));

        const availableHeight = this.dimensions.windowHeight - this.dimensions.headerHeight - (GameArea.borderThickness * 2);
        const availableWidth = this.dimensions.windowWidth;

        let gameAreaWidth = availableWidth;
        let gameAreaHeight = availableWidth / UI.ASPECT_RATIO | 0;

        if (gameAreaHeight > availableHeight) {
            gameAreaHeight = availableHeight - (GameArea.borderThickness * 5);
            gameAreaWidth = availableHeight * UI.ASPECT_RATIO | 0;
        }

        const leftOffset = (this.dimensions.windowWidth - gameAreaWidth) / 2 | 0;

        this.dimensions.containerWidth = gameAreaWidth;

        this.dimensions.headerWidth = this.dimensions.containerWidth;
        this.header.updateSize(this.dimensions.containerWidth, this.dimensions.headerHeight, leftOffset);

        this.dimensions.gameAreaWidth = gameAreaWidth;
        this.dimensions.gameAreaHeight = gameAreaHeight;
        this.gameArea.updateSize(this.dimensions.gameAreaWidth, this.dimensions.gameAreaHeight, this.dimensions.headerHeight, leftOffset);

        this.dimensions.scaleX = this.dimensions.gameAreaWidth / Brain.WIDTH;
        this.dimensions.scaleY = this.dimensions.gameAreaHeight / Brain.HEIGHT;
        this.dimensions.gameAreaContainerOffset = this.gameArea.getTotalOffset();
    }


    getCalculatedScaledXY(x, y) {
        return {
            x: (x * this.dimensions.scaleX) | 0,
            y: (y * this.dimensions.scaleY) | 0
        }
    }

    getAdjustedSize({width, height, left, top}) {
        const scaledSize = this.getCalculatedScaledXY(width, height);
        const scaledPosition = this.getCalculatedScaledXY(left, top);

        const adjustedWidth = scaledSize.x;
        const adjustedHeight = scaledSize.y;
        const adjustedLeft = scaledPosition.x + this.dimensions.gameAreaContainerOffset.left + GameArea.borderThickness;
        const adjustedTop = scaledPosition.y + this.dimensions.gameAreaContainerOffset.top + GameArea.borderThickness;

        return {
            width: adjustedWidth,
            height: adjustedHeight,
            left: adjustedLeft,
            top: adjustedTop
        };
    }

    drawPaddle(paddle) {
        const adjustedPosition = this.getAdjustedSize(paddle.position);
        paddle.draw(adjustedPosition);
    }

    drawBall(ball) {
        const adjustedPosition = this.getAdjustedSize(ball.position);
        adjustedPosition.width = adjustedPosition.height;
        ball.draw(adjustedPosition);
    }

    drawBricks() {
        for (const [row] of Object.entries(this.brain.bricksStructure)){
            for (let col = 0; col < Brain.BRICK_COLS; col++){
            let brick = this.brain.bricks[row][col];
                if (!brick.isDestroyed()) {
                    let adjustedPosition = this.getAdjustedSize(brick.position);
                    brick.draw(adjustedPosition);
                }
            }
        }
    }

    drawGameElements() {
        this.gameArea.clear();
        this.header.updateHeaderContent(this.brain.gameState);
        this.drawPaddle(this.brain.paddle);
        this.drawBall(this.brain.ball);
        this.drawBricks();
    }

    draw() {
        if (this.brain.gameState.newGameBoard) {
            this.elementsSetup(this.gameArea);
            console.log("setup")
        }
        if (this.brain.gameState.isPaused || this.brain.gameState.gameOver || this.brain.gameState.showNewLevelScreen) {
            this.modalDialog.draw();
        } else {
            this.modalDialog.remove()
        }
        this.drawGameElements();
    }
}