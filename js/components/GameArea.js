import {AbstractUiElement} from "./AbstractUiElement.js";

export default class GameArea extends AbstractUiElement {
    static borderThickness = 10;

    constructor(appContainer) {
        super(appContainer);
        this.element = appContainer.querySelector("#gameArea");

        this.setupGameArea()
    }

    setupGameArea() {
        this.element.style.position = 'fixed';
        this.element.style.left = '0px';
        this.element.style.zIndex = '10';
        this.element.className = "border";
        this.element.style.border = GameArea.borderThickness + 'px solid deepskyblue';
    }

    updateSize(width, height, gameAreaTop, leftOffset) {
        this.element.style.left = `${leftOffset}px`;
        this.element.style.top = `${gameAreaTop}px`;
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
    }
}