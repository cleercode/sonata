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
            element.querySelector("article .item-image").style.backgroundImage = artist.imgURL;
            element.querySelector("article .item-image").alt = artist.score;
            element.querySelector(".content").focus();

            Lastfm.getArtistInfo(artist.mbid, function (result) {
                element.querySelector("article .item-content").innerHTML = result.bio.replace(/User-contributed text.+/g, '');
            });

            Youtube.getSongs(artist.name, function (result) {
                console.log(result);
            });
        }
    });
})();
