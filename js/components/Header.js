import {AbstractUiElement} from "./AbstractUiElement.js";

export default class Header extends AbstractUiElement {
    currentScoreElement = null;
    ballsCountElement = null;
    maxScoreElement = null;
    leftOffset = 0;


    brain = null;
    currentScore = 0;
    maxScore = 0;
    gameBall = 1;

    constructor(appContainer, brain) {
        super(appContainer);
        this.element = appContainer.querySelector("#header");
        this.brain = brain;

        this.setupHeader()
    }

    setupHeader() {
        this.element.style.position = 'fixed';
        this.element.style.top = '0';
        this.element.style.zIndex = '20';
        this.element.style.display = 'flex';
        this.element.style.justifyContent = 'space-between';
        this.element.style.alignItems = 'center';

        this.getCurrentScore();
        this.getMaxScore();
        this.getBallsCount();
    }

    updateSize(width, height, leftOffset) {
        this.leftOffset = leftOffset;
        this.element.style.left = `${leftOffset}px`;
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;

        this.updateHeaderContentPositions();
    }

    updateHeaderContentPositions() {
        const scoreLeft = this.leftOffset + this.element.offsetWidth * 0.02;
        const ballsLeft = this.leftOffset + this.element.offsetWidth * 0.95;
        const maxScoreLeft = this.leftOffset + this.element.offsetWidth * 0.45;

        const verticalPosition = (this.element.offsetHeight - 30) / 2;

        if (this.currentScoreElement) {
            this.currentScoreElement.style.left = `${scoreLeft}px`;
            this.currentScoreElement.style.top = `${verticalPosition}px`;
        }

        if (this.ballsCountElement) {
            this.ballsCountElement.style.left = `${ballsLeft}px`;
            this.ballsCountElement.style.top = `${verticalPosition}px`;
        }

        if (this.maxScoreElement) {
            this.maxScoreElement.style.left = `${maxScoreLeft}px`;
            this.maxScoreElement.style.top = `${verticalPosition}px`;
        }
    }

    updateMaxScore() {
        if (this.brain.newGame || this.brain.gameOver) {
            const scores = this.brain.getScores();
            this.maxScore = scores.length > 0 ?
                scores.reduce((max, current) => Math.max(max, current.score), scores[0].score) : 0;
        }
    }

    updateHeaderContent(gameState) {
        if (this.currentScore === gameState.score && this.maxScore === gameState.maxScore &&
            this.gameBall === gameState.balls) return;

        this.currentScore = gameState.score;
        this.gameBall = gameState.balls;
        this.updateMaxScore()

        this.currentScoreElement.innerText = this.currentScore.toString().padStart(3, '0');
        this.ballsCountElement.innerText = this.gameBall;
        this.maxScoreElement.innerText = this.maxScore.toString().padStart(3, '0');
    }

    getCurrentScore() {
        this.currentScoreElement = document.createElement('div');
        this.currentScoreElement.style.position = 'fixed';
        this.currentScoreElement.className = 'header-text-score';
        this.currentScoreElement.innerText = this.currentScore.toString().padStart(3, '0');
        this.element.appendChild(this.currentScoreElement);
        return this.currentScoreElement;
    }

    getBallsCount() {
        this.ballsCountElement = document.createElement('div');
        this.ballsCountElement.style.position = 'fixed';
        this.ballsCountElement.className = 'header-text-balls';
        this.ballsCountElement.innerText = this.gameBall;
        this.element.appendChild(this.ballsCountElement);
        return this.ballsCountElement;
    }

    getMaxScore() {

        this.maxScoreElement = document.createElement('div');
        this.maxScoreElement.style.position = 'fixed';
        this.maxScoreElement.className = 'header-text-score';
        this.maxScoreElement.innerText = this.maxScore.toString().padStart(3, '0');
        this.element.appendChild(this.maxScoreElement);
        return this.maxScoreElement;
    }
}