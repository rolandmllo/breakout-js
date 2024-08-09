import {AbstractUiElement} from "./AbstractUiElement.js";
import Position from "./Position.js";

export default class Brick extends AbstractUiElement {

    constructor(position) {
        super();
        this.className = 'brick ';
        this.position = position;

        this.points = 0;
    }


    setDestroyed() {
        this.active = false;
    }
    isDestroyed() {
        return !this.active;
    }

}