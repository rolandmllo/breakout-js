export default class Position {
    width = 0;
    height = 0;

    top = 0;
    left = 0;
    bottom = 0;
    right = 0;

    constructor(width, height, left, top) {
        this.width = width;
        this.height = height;
        this.left = left;
        this.top = top;
    }

    setPosition({height, width, left, top, right, bottom}) {
        this.width = width;
        this.height = height;
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    getPosition() {
        return {
            width: this.width,
            height: this.height,
            left: this.left,
            top: this.top,
            right: this.right,
            bottom: this.bottom,
        }
    }
}