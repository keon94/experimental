
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function alternateText(element) {
    var oldContent = element.textContent;
    var oldColor = element.style.color;
    var googleLinkElement = document.querySelector('li a')
    var origLink = googleLinkElement.getAttribute('href')
    while (true) {
        await sleep(1000);
        element.textContent = "Hello!";
        element.style.color = "red";
        document.querySelector('input[type="checkbox"]').classList.toggle("checkbox-style");
        googleLinkElement.removeAttribute('href');
        await sleep(1000);
        element.textContent = oldContent;
        heading.style.color = oldColor;
        googleLinkElement.setAttribute('href', origLink);
    }
}

alert("Hello (External)");

var heading = document.firstElementChild.lastElementChild.firstElementChild;

alternateText(heading);


