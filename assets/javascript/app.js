var items = ["beach", "clouds", "comet", "ice", "lake", "lava", "geyser", "moon", "night", "northern lights", "sunrise", "sunset", "tornado"];

$("#add-nature").on("click", function(event) {
  event.preventDefault();

  // Grab the text the user types into the input field
  var userInput = $("#user-input").val().trim();
  // Clear textbox
  $("#user-input").val('')

  // Add the new item into the items array
  if (userInput !== '' && items.indexOf(userInput) === -1) {
    items.push(userInput.toLowerCase());
  }

  renderButtons();
});

// Calling the renderButtons function to display the initial list of items
renderButtons();

$(document).on("click", "button", function() {
  var item = $(this).data("item");
  console.log("item: ", item);
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    item + "&api_key=dc6zaTOxFJmzC&limit=10";

  $.ajax({
      url: queryURL,
      method: "GET"
    })
    .done(function(response) {
      var results = response.data;
      console.log("results: ", results);

      if (results.length === 0) {
        alert("No GIFs found!!");
        items.pop();
        $('button[data-item="' + item + '"]').remove();
      }

      // Clear gifs display area
      $("#gifs-appear-here").empty();

      for (var i = 0; i < results.length; i++) {
        if (results[i].rating !== 'r' && results[i].rating !== 'pg-13') {
          var gifDiv = $("<div class='item m-2 mb-3'>");
          var rating = results[i].rating;
          var p = $("<p>").text("Rating: " + rating);
          var itemImage = $("<img>");

          itemImage.attr("src", results[i].images.fixed_height_small_still.url);
          itemImage.attr("data-still", results[i].images.fixed_height_small_still.url);
          itemImage.attr("data-animate", results[i].images.fixed_height_small.url);
          itemImage.attr("data-state", "still");
          itemImage.addClass("gif");

          gifDiv.append(p);
          gifDiv.append(itemImage);

          $("#gifs-appear-here").prepend(gifDiv);
        }
      }
    });
});

$(document).on("click", ".gif", function() {
  var state = $(this).attr("data-state");

  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
  }
});



function renderButtons() {
  // Delete the content inside the buttonsview div prior to adding new item
  $("#buttons-view").empty();

  // Loop through the array of items, then generate buttons for each item
  for (var i = 0; i < items.length; i++) {
    var btn = $("<button>");
    btn.addClass("btn btn-sm btn-green");
    btn.attr("data-item", items[i]);
    btn.text(items[i]);
    $("#buttons-view").append(btn);
  }
}
