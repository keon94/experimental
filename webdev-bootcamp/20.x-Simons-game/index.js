
let levelTitle = $("#level-title");
let buttons = $(".btn");

function activateRandomSquare() {
    let sqNum = Math.floor(Math.random() * 4);
    switch (sqNum) {
        case 0:
            return "green";
        case 1:
            return "red";
        case 2:
            return "blue";
        case 3:
            return "yellow";
    }
}

function animateScreen(button, wasCorrect=true) {
    button.fadeOut(200).fadeIn(200);
    let body = $("body");
    if (!wasCorrect) {
        body.addClass("game-over");
        setTimeout(function() {
            body.removeClass("game-over");
        }, 200);
    }
}

function playSound(color, wasCorrect=true) {
    if (!wasCorrect) {
        let sound = new Audio("sounds/wrong.mp3");
        sound.play();
    } else if (color != null) {
        let sound = new Audio("sounds/" + color + ".mp3");
        sound.play();
    }
}

function proceedToNextLevel() {
    let randomColor = activateRandomSquare();
    expectedSequence.push(randomColor);
    let targetButton = $(".btn#" + randomColor)
    animateScreen(targetButton);
    playSound(randomColor);
    levelTitle.text("Level " + expectedSequence.length);
}

let expectedSequence = [];
let enteredSequence = [];
let gameState = {
    started: false,
    ended: false,
}

$(document).on("keydown", function(e) {
    if (!gameState.started) {
        if (e.key.toUpperCase() == "A") {
            gameState.started = true;
            proceedToNextLevel();
            return;
        }
    } else if (gameState.ended) {
        window.location.reload();
    }
});

buttons.on("click", function(e) {
    if (gameState.started && !gameState.ended) {
        let color = $(this).attr("id");
        enteredSequence.push(color);
        if (expectedSequence[enteredSequence.length - 1] !== color) {
            // we failed
            animateScreen($(this), false);
            playSound(null, false);
            levelTitle.text("Game Over, Press Any Key to Restart");
            gameState.ended = true;
            return;
        }
        animateScreen($(this));
        playSound(color);
        if (expectedSequence.length === enteredSequence.length) {
            enteredSequence = [];
            setTimeout(function() {
                proceedToNextLevel();
            }, 500);
        }
    }
});