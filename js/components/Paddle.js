import {AbstractUiElement} from "./AbstractUiElement.js";
import Position from "./Position.js";
import Brain from "../Brain.js";

export class Paddle extends AbstractUiElement {

    static PADDLE_STEP = 22;
    #intervalId = null;

    constructor(width, height) {
        super()
        this.className = 'paddle';
        this.position = new Position(width, height, 0, 720);
    }

    validateAndFixPosition() {
        if (this.position.left <= 0) {
            this.position.left = 0;
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }

        if (this.position.left >= Brain.WIDTH - this.position.width) {
            this.position.left = Brain.WIDTH - this.position.width;
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
        this.markAsDirty();
    }


    startMove(step) {
        if (this.#intervalId !== null) return;

        this.#intervalId = setInterval(() => {
            this.position.left += step * -(Paddle.PADDLE_STEP);
            this.validateAndFixPosition();
        }, 40)
    }

    stopMove() {
        if (!this.#intervalId) return;
        clearInterval(this.#intervalId);
        this.#intervalId = null;
        this.validateAndFixPosition();
    }
}