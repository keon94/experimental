function makeSound(keyPressed) {
    // use switch statement to play different sounds
    // depending on the key pressed
    let audio = null;
    switch (keyPressed) {
        case "w":
            audio = new Audio("sounds/tom-1.mp3");
            break;
        case "a":
            audio = new Audio("sounds/tom-2.mp3");
            break;
        case "s":
            audio = new Audio("sounds/tom-3.mp3");
            break;
        case "d":
            audio = new Audio("sounds/tom-4.mp3");
            break;
        case "j":
            audio = new Audio("sounds/snare.mp3");
            break;
        case "k":
            audio = new Audio("sounds/crash.mp3");
            break;
        case "l":
            audio = new Audio("sounds/kick-bass.mp3");
            break;
        default:
            return;
    }
    audio.play();
}

function animateButton(keyPressed) {
    var activeButton = document.querySelector("." + keyPressed);
    activeButton.classList.add("pressed");
    setTimeout(function () {
        activeButton.classList.remove("pressed");
    }, 100);
}

const drumAudioCache = {
    'w': new Audio("sounds/tom-1.mp3"),
    'a': new Audio("sounds/tom-2.mp3"),
    's': new Audio("sounds/tom-3.mp3"),
    'd': new Audio("sounds/tom-4.mp3"),
    'j': new Audio("sounds/snare.mp3"),
    'k': new Audio("sounds/crash.mp3"),
    'l': new Audio("sounds/kick-bass.mp3")
};

document.querySelectorAll(".drum").forEach(e => {
    e.addEventListener("click", event => {
        //event.target is the same as e
        var audio = drumAudioCache[event.target.textContent];
        if (audio === undefined) {
            alert("No audio file for this key")
        } else {
            audio.play();
        }
        animateButton(event.target.textContent);
    });
});

document.addEventListener("keydown", event => {
    makeSound(event.key);
    animateButton(event.key);
});

