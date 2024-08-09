import AbstractGameElement from "./AbstractGameElement.js";

export class AbstractUiElement extends AbstractGameElement {

    parentElement = null;
    element = null;
    dirty = true;

    color = '';

    constructor(parentElement) {
        super();
        if (this.constructor === AbstractUiElement) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.parentElement = parentElement;
    }

    markAsDirty(){
        return this.dirty =  true;
    };

    getTotalOffset() {
        let element = this.element;
        let totalTop = 0, totalLeft = 0;
        while (element) {
            totalTop += element.offsetTop || 0;
            totalLeft += element.offsetLeft || 0;
            element = element.offsetParent;
        }
        return {top: totalTop, left: totalLeft};
    }

    clear() {
        this.element.innerHTML = "";
    }

    getPositionOnScreen(element) {
        const elementRect = element || this.element.getBoundingClientRect();

        this.top = elementRect.top;
        this.right = elementRect.right;
        this.bottom = elementRect.bottom;
        this.left = elementRect.left;
        this.height = this.bottom - this.top;
        this.width = this.right - this.left;
        this.className = '';

        return {
            top: this.top,
            right: this.right,
            bottom: this.bottom,
            left: this.left,
            height: this.height,
            width: this.width
        }
    }

    appendChild(childElement) {
        this.element.appendChild(childElement);
    }

    get element() {
        return this.element;
    }

    draw(position) {
        this.element = null;

        this.element = document.createElement('div');
        this.element.className = this.className;

        this.element.style.left = position.left + 'px';
        this.element.style.top = position.top + 'px';
        this.element.style.width = position.width + 'px';
        this.element.style.height = position.height + 'px';

        this.element.style.zIndex = '10';
        this.element.style.position = 'fixed';
        this.element.style.backgroundColor = this.color;

        this.parentElement.appendChild(this.element);
        this.dirty = false;
    }
}