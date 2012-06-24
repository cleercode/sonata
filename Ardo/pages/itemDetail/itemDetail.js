(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            if (!options || !options.artist) {
                nav.navigate("/pages/groupedItems/groupedItems.html");
                return;
            }

            var artist = options.artist;
            element.querySelector(".titlearea .pagetitle").textContent = artist.name;
            element.querySelector("article .item-title").textContent = artist.mbid;
            element.querySelector("article .item-subtitle").textContent = artist.score;
            element.querySelector("article .item-image").src = artist.img;
            element.querySelector("article .item-image").alt = artist.score;
            element.querySelector("article .item-content").innerHTML = artist.name;
            element.querySelector(".content").focus();
        }
    });
})();
