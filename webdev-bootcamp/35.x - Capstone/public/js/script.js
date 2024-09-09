let selectedBoxes = new Set();

$(".form-check-input").on("click", function (e) {
    let listItem = $(this).parent().find("> .form-check-label");
    listItem.toggleClass("selected");
    if (listItem.hasClass("selected")) {
        selectedBoxes.add(listItem.text());
    } else {
        selectedBoxes.delete(listItem.text());
    }
    if (selectedBoxes.size > 0) {
        $(".delete-button").removeClass("disabled");
    } else {
        $(".delete-button").addClass("disabled");
    }

});

$(document).on("click", function (e) {
    if (e.target.id === "new-item") {
        $("#new-item").addClass("input-selected");
    } else {
        $("#new-item").removeClass("input-selected");
    }
})

$("#submit-form").on("submit", function (e) {
    let path = window.location.href
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: (path.endsWith('/work') ? '/work' : '') + "/submit",
        data: $(this).serialize(),
        success: function (response) {
            console.log(response);
            window.location.href = path;
        },
        error: function (error) {
            alert(error.responseText);
            window.location.href = path;
        }
    });
});

$(".delete-button").on("click", function (e) {
    let path = window.location.href
    $.ajax({
        type: "DELETE",
        url: $(this).attr('endpoint'),
        data: {
            items: Array.from(selectedBoxes),
        },
        success: function (response) {
            console.log(response);
            window.location.href = path;
        },
        error: function (error) {
            alert(error.responseText);
            window.location.href = path;
        }
    });
});
