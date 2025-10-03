
function updateDiceImages(p1Dice, p2Dice) {
    document.querySelector(".p1.die").setAttribute("src", "../images/dice" + p1Dice + ".png");
    document.querySelector(".p2.die").setAttribute("src", "../images/dice" + p2Dice + ".png");
}

function updatePageTitle(p1Dice, p2Dice) {
    var pageTitle = "Draw!";
    if (p1Dice > p2Dice) {
        pageTitle = "🚩 Player 1 Wins!";
    } else if (p1Dice < p2Dice) {
        pageTitle = "Player 2 Wins! 🚩";
    }
    document.querySelector("button").textContent = pageTitle;
}

var p1Dice = Math.floor(Math.random()*6)+1;
var p2Dice = Math.floor(Math.random()*6)+1;

updateDiceImages(p1Dice, p2Dice);

updatePageTitle(p1Dice, p2Dice);

document.querySelector("button").onclick = () => window.location.reload();