(function () {
    "use strict";

    var key = "b25b959554ed76058ac220b7b2e0a026";

    var getSimilarArtists = function (artist, callback, error) {
        //app.lastfm.artist.getSimilar({
        //    artist: artist
        //},
        //{
        //    success: function (data) {
        //        var artists = data.similarartists.artist;
        //        for (var i = 1; i < artists.length; i++) {
        //            if (artists[i].image[1]['#text'] != "") app.setupImage(artists[i]);
        //        }
        //        $('#artists').fadeIn();
        //        loadingOff();
        //    },
        //    error: function (code, message) {
        //        alert('Unable to retrieve data from last.fm');
        //    }
        //});
        var artist = escape(artist);
        var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + artist + "&api_key=" + key + "&format=json";
        WinJS.xhr({ url: url, responseType: "json" })
            .done(function complete(result) {
                var obj = JSON.parse(result.response);
                var similarArtists = obj.similarartists.artist;
                callback(similarArtists);
                similarArtists.forEach(function (artist) {
                    var photo = artist.image[3]["#text"];
                    if (photo !== "") {
                        console.log(photo);
                    }
                });
            }, error);
    };

    WinJS.Namespace.define("Lastfm", {
        getSimilarArtists: getSimilarArtists,
    });
})();