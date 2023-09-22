$("h1").css("color", "red");

$(".form-check-input").on("click", function (e) {
    let listItem = $(this).parent().find("> .form-check-label");
    listItem.toggleClass("selected");
});

$(document).on("click", function (e) {  
    if (e.target.id === "new-item") {
        $("#new-item").addClass("input-selected");
    } else {
        $("#new-item").removeClass("input-selected");
    }
})

$("#submit-form").on("submit", function (e) {
    var input = $(this).find('> #new-item')
    if (input.val === undefined) {
        alert("Empty input not allowed");
        e.preventDefault();
    } else {
        duplicateFound = false;
        $(".checkbox-item").each(function (i, e) {
            content = e.textContent.replace(`\n`, "").trim();
            if (input.val() === content) {
                duplicateFound = true;
            }
        });
        if (duplicateFound) {
            alert("Item already exists");
            e.preventDefault();
        }
    }
});
