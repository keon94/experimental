$("h1").css("color", "red");
$("h1").addClass("big-title margin-50");
$("h1").removeClass("big-title");
$("body > *").addClass("big-title");
$("h1").text("Bye");
$("h1").html("<em>Bye</em>");


let origState = {
    h1Text: $("h1").text(),
    h1Color: $("h1").css("color"),
    h1opacity: $("h1").css("opacity")
};

$("h1").on("click", function() {
    color = $("h1").css("color");
    if (color === origState.h1Color) {
        color = "purple";
    } else {
        color = origState.h1Color;
    }
    $("h1").css("color", color);
});

let keystrokes = [];
let h1 = $("h1");

$(document).on("keypress", function (e) {  
    const targetWord = "hi";
    const timeThresholdMilis = 2000;
    if (targetWord.indexOf(e.key) === -1) {
        keystrokes = [];
        return;
    }
    keystrokes.push([e.key, Date.now()]);
    keystrokes = keystrokes.filter((e) => Date.now() - e[1] < timeThresholdMilis);
    if (keystrokes.slice(-1*targetWord.length).map(x => x[0]).join("") === targetWord) {
        h1.text("Hi there!");
        h1.css("color", "green");
        h1.animate({opacity: 0.5}, 500);
        setTimeout(() => {
            h1.text(origState.h1Text);
            h1.css("color", origState.h1Color);
            h1.animate({opacity: origState.h1opacity}, 500)
        }, 500);
    }
});