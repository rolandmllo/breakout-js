import Brick from "./Brick.js";
import Brain from "../brain.js";
import Position from "./Position.js";

export default class BrickFactory {

    bricksStructure = {}
    bricks = [[]];

    constructor(brickStructure) {
        this.bricksStructure = brickStructure;
        this.constructBricks();
    }

    constructBricks() {
        for (const [row, values] of Object.entries(this.bricksStructure)) {
            this.bricks[row] = [];
            for (let col = 0; col < Brain.BRICK_COLS; col++) {
                this.bricks[row][col] = this.getBrick(row, col, values.points);
                //console.log("Building brick: " + row + " " + col, this.bricks[row][col])
            }
        }
    }

    getBrick(row, col, points) {
        const position = this.getBrickPosition(row, col);
        const brick = new Brick(position);
        brick.points = points;

        return brick;
    }

    getBrickPosition(row, col) {
        let left = Brain.BRICK_PADDING + (col * (Brain.BRICK_WIDTH + Brain.BRICK_PADDING)) | 0;
        let top = Brain.BRICK_TOP_OFFSET + (row * (Brain.BRICK_HEIGHT + Brain.BRICK_PADDING)) | 0;

        return new Position(Brain.BRICK_WIDTH, Brain.BRICK_HEIGHT, left, top);
    }

    getBricks() {
        return this.bricks;
    }
}