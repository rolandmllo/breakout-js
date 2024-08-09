import Brain from "./brain.js";
import UI from "./ui.js";

function validateIndexHtml() {
    if (document.querySelectorAll("#container").length !== 1) {
        throw Error("Validation");
    }
}

function uiDrawRepeater(ui, brain) {
    ui.draw();
    brain.playGame();

    requestAnimationFrame(() => {
        uiDrawRepeater(ui, brain);
    });
}

function main() {
    validateIndexHtml()
    const appDiv = document.querySelector("#container")

    const brain = new Brain();
    const ui = new UI(brain, appDiv);

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
                brain.startMovePaddle(-1);
                break;
            case 'ArrowLeft':
                brain.startMovePaddle(1);
                break;
            case ' ':
                brain.togglePause();
                break;
        }

        document.addEventListener('keyup', (e) => {
            brain.stopMovePaddle();
        });

        document.getElementById('moveLeft').addEventListener('touchstart', (e) => {
            e.preventDefault();
            brain.startMovePaddle(1);
        }, { passive: false });

        document.getElementById('moveLeft').addEventListener('touchend', (e) => {
            e.preventDefault();
            brain.stopMovePaddle();
        }, { passive: false });

        document.getElementById('moveRight').addEventListener('touchstart', (e) => {
            e.preventDefault();
            brain.startMovePaddle(-1);
        }, { passive: false });

        document.getElementById('moveRight').addEventListener('touchend', (e) => {
            e.preventDefault();
            brain.stopMovePaddle();
        }, { passive: false });

        document.getElementById('togglePause').addEventListener('touchstart', (e) => {
            e.preventDefault();
            brain.togglePause();
        }, { passive: false });

        document.getElementById('modal').addEventListener('touchstart', (e) => {
            if (!e.target.closest('#newGameButton, #gameOverForm, #gameOverForm *')) {
                e.preventDefault();
                brain.togglePause();
            }
        }, { passive: false });
    });

    requestAnimationFrame(() => {
        uiDrawRepeater(ui, brain);
    });
}

//================main=================//
console.log("App startup...")

main();