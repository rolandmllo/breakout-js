import {AbstractUiElement} from "./AbstractUiElement.js";
import Position from "./Position.js";
import Brain from "../brain.js";

export default class Ball extends AbstractUiElement {

    velocity = {};
    baseSpeed = 5;
    initialSpeed = 5;
    speed = 0;
    speedIncrement = 0.02;
    maxSpeed = 20;
    minVerticalSpeed = 2;


    constructor() {
        super();
        this.className = 'ball';
        this.reset();
    }

    getInitialPosition() {
        let left = (Brain.WIDTH / 2) - 10 | 0;
        return new Position(20, 15, left, 200);
    }

    getInitialVelocity() {
        const angle = (Math.PI / 3) + (Math.random() * (Math.PI / 3));
        return {
            x: Math.cos(angle) * this.initialSpeed,
            y: Math.sin(angle) * this.initialSpeed
        };
    }

    setVelocity(angleRad) {
        this.velocity.x = Math.cos(angleRad) * this.speed;
        this.velocity.y = -Math.abs(Math.sin(angleRad) * this.speed);
    }

    increaseSpeed() {
        this.speed += this.speedIncrement;
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
    }

    changeVelocityX() {
        return this.velocity.x *= -1;
    }
    changeVelocityY() {
        return this.velocity.y *= -1;
    }

    updatePosition() {
        if (!this.active) return;

        const minVerticalSpeed = this.minVerticalSpeed;
        if (Math.abs(this.velocity.y) < minVerticalSpeed) {
            this.velocity.y = this.velocity.y < 0 ? -minVerticalSpeed : minVerticalSpeed;
        }
        this.position.left += this.velocity.x;
        this.position.top += this.velocity.y;

    }

    moveBall() {
        if (!this.active) {
            return
        }

        this.updatePosition();
    }

    getBoundaries() {
        const boundaries = super.getBoundaries();
        boundaries.velocityX = this.velocity.x;
        boundaries.velocityY = this.velocity.y;
        boundaries.centerX = boundaries.left + (boundaries.width / 2);

        return boundaries;
    }

    setDestroyed() {
        this.active = false;
    }

    reset() {
        this.position = this.getInitialPosition();
        this.velocity = this.getInitialVelocity();
        this.speed = this.initialSpeed;
    }

    setInitialSpeed(level) {
        this.initialSpeed = this.baseSpeed + (level - 1) * 2;
        this.speed = this.initialSpeed;
    }
}