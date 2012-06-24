(function () {
    "use strict";

    var key = "b25b959554ed76058ac220b7b2e0a026";

    var getSimilarArtists = function (artist, callback, error) {
        var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + escape(artist) + "&api_key=" + key + "&format=json";
        WinJS.xhr({ url: url, responseType: "json" })
            .done(function complete(result) {
                var obj = JSON.parse(result.response);
                var similarArtists = []
                obj.similarartists.artist.forEach(function (artist) {
                    for (var i = artist.image.length-1; i >= 0; i--) {
                        if (artist.image[i]["#text"] != "") {
                            similarArtists.push({
                                "img": artist.image[i]["#text"],
                                "name": artist.name,
                                "score": artist.match
                            });
                            break;
                        }
                    }
                });
                callback(similarArtists);
            }, error);
    };

    WinJS.Namespace.define("Lastfm", {
        getSimilarArtists: getSimilarArtists,
    });
})();