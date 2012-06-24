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

            Lastfm.getArtistInfo(artist.mbid, function (result) {
                console.log(result);
                element.querySelector("article .item-content").innerHTML = result.bio;
            });
            element.querySelector(".titlearea .pagetitle").textContent = artist.name;
            element.querySelector("article .item-image").style.backgroundImage = artist.imgURL;
            element.querySelector("article .item-image").alt = artist.score;
            element.querySelector(".content").focus();
        }
    });
})();
