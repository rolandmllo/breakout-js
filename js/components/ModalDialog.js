import {AbstractUiElement} from "./AbstractUiElement.js";

export default class ModalDialog extends AbstractUiElement {
    brain = null;
    modalCurtain = null;

    constructor(container, brain) {
        super(container);
        this.brain = brain;
        this.element = document.querySelector('#modal');
        this.modalCurtain = document.createElement('div');
        this.modalCurtain.id = 'modalCurtain';
    }

    draw() {
        if (this.dirty) {
            this.showModal()
        }
    }

    showModal() {
        if (!this.element.contains(this.modalCurtain)) {
            this.element.appendChild(this.modalCurtain);
        }
        this.modalCurtain.innerHTML = '';
        this.dirty = false;

        const gameAreaDiv = document.querySelector("#gameArea");

        const dialogWindow = document.createElement('div');
        dialogWindow.className = 'modalWindow';
        this.modalCurtain.appendChild(dialogWindow);

        const gameAreaRect = gameAreaDiv.getBoundingClientRect();
        dialogWindow.style.width = `${gameAreaRect.width}px`;
        dialogWindow.style.height = `${gameAreaRect.height}px`;
        dialogWindow.style.position = 'absolute';
        dialogWindow.style.left = `${gameAreaRect.left}px`;
        dialogWindow.style.top = `${gameAreaRect.top}px`;

        const contentDiv = document.createElement('div');
        contentDiv.id = 'modalContent';

        if (this.brain.gameState.showNewLevelScreen) {
            this.showNewLevel(contentDiv);
        }
        else if (this.brain.gameState.newGame) {
            this.showStartGame(contentDiv);
        } else if (this.brain.gameState.gameOver) {
            this.showGameOver(contentDiv);
        } else if (this.brain.gameState.isPaused) {
            this.showGamePaused(contentDiv);
        } else {
            this.remove()
        }
        dialogWindow.appendChild(contentDiv);

        this.markAsDirty()
    }

    showStartGame(contentDiv) {
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.innerHTML = '<h2>Breakout!</h2>' +
            '<p>Use arrows to move the paddle and spacebar to start or stop the game</p>'

        contentDiv.appendChild(textDiv)
    }
    showNewLevel(contentDiv) {
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.innerHTML = `<h2>Level ${this.brain.gameState.level}!</h2>` +
            '<p>Press space to start</p>'

        contentDiv.appendChild(textDiv)
    }

    showGamePaused(contentDiv) {
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.innerHTML = '<h2>Game paused!</h2>' +
            '<p>Press space to continiue</p>'

        contentDiv.appendChild(textDiv)
    }

    clickHandler(playerName) {
        const score = {
            name: playerName,
            score: this.brain.gameState.score
        };

        this.brain.saveScore(score);

        const contentDiv = document.querySelector("#modalContent")
        contentDiv.innerHTML = '';

        this.showScores(contentDiv);
    }

    showGameOver(dialogDiv) {
        const textDiv = document.createElement('div');
        textDiv.id = 'gameOver';
        textDiv.innerHTML = `<h3>Game Over!</h3>
            Your score: ${this.brain.gameState.score.toString().padStart(3, '0')} </p>
            <p>Enter your name:
            <form id="gameOverForm">
            <input name="name" type="text" autocomplete="off"/> 
            <button type="submit">Submit</button>
            </form>
             `;

        dialogDiv.appendChild(textDiv);
        this.modalCurtain.appendChild(dialogDiv);

        const form = document.getElementById('gameOverForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = form.elements['name'].value;
            this.clickHandler(name);
        };
    }

    showScores(contentDiv) {
        const scores = this.brain.getScores();

        const validScores = scores.filter(score => score.name.trim() !== '');
        validScores.sort((a, b) => b.score - a.score);
        const topTenScores = validScores.slice(0, 10);

        contentDiv.innerHTML = '<h2>Scores: </h2>';
        const scoreList = document.createElement('ol');

        topTenScores.forEach((score, index) => {
            let listItem = document.createElement('li');
            listItem.innerHTML = `${score.score.toString().padStart(3, '0')} ${score.name}`;

            scoreList.appendChild(listItem);
        });
        contentDiv.appendChild(scoreList)

        const newGameButton = document.createElement('button');
        newGameButton.id = "newGameButton"
        newGameButton.textContent = 'New Game';
        newGameButton.onclick = () => {
            this.remove()
            this.brain.newGame();
        };
        contentDiv.appendChild(newGameButton)

    }

    remove() {
        if (this.element.contains(this.modalCurtain)) {
            this.element.removeChild(this.modalCurtain);
        }
        this.markAsDirty();
    }
}