import Position from "./Position.js";

export default class AbstractGameElement {
    active = true;
    position = null;
    boundaries = null;
    constructor() {
        if (this.constructor === AbstractGameElement) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.boundaries = new Position();
        this.position = new Position();
    }

    calculateBoundaries() {
        let boundaries = {
            left: this.position.left,
            top: this.position.top,
            right: this.position.left + this.position.width,
            bottom: this.position.top + this.position.height,
            height: this.position.height,
            width: this.position.width
        }
        this.boundaries.setPosition(boundaries);

        return this.boundaries.getPosition();
    }
    getBoundaries() {
        return this.calculateBoundaries();
    }
}