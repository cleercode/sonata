(function () {
    "use strict";

    var key = "b25b959554ed76058ac220b7b2e0a026";

    var getSimilarArtists = function (artist, callback, error) {
        var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + escape(artist) + "&api_key=" + key + "&format=json";
        WinJS.xhr({ url: url, responseType: "json" })
            .done(function complete(result) {
                var obj = JSON.parse(result.response);
                var similarArtists = []
                if (obj.similarArtists && obj.similarArtists.artist) {
                    obj.similarartists.artist.forEach(function (artist) {
                        for (var i = artist.image.length - 1; i >= 0; i--) {
                            if (artist.image[i]["#text"] != "") {
                                similarArtists.push({
                                    "img": artist.image[i]["#text"],
                                    "name": artist.name,
                                    "score": artist.match,
                                    "mbid": artist.mbid,
                                });
                                break;
                            }
                        }
                    });
                }
                callback(similarArtists);
            }, error);
    };

    var getArtistInfo = function(mbid, callback, error) {
        var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=" + mbid + "&api_key=" + key + "&format=json";
        WinJS.xhr({ url: url, responseType: "json" })
            .done(function complete(result) {
                var obj = JSON.parse(result.response);
                callback({
                    "bio": obj.artist.bio.content,
                    "summary": obj.artist.bio.summary,
                    "name": obj.artist.name,
                });
            }, error);
    }

    var getEvents = function (callback, error) {
        var geoloc = window.navigator.geolocation;
        geoloc.getCurrentPosition(
            function (pos) {
                var long = pos.longitude;
                var lat = pos.latitude;

                var url = ("http://ws.audioscrobbler.com/2.0/?method=geo.getevents"+
                    "&long=" + long + 
                    "&lat=" + lat + 
                    "&distance=" + 100 + 
                    "&limit=" + 100 + 
                    "&api_key=" + key + "&format=json");
                WinJS.xhr({ url: url, responseType: "json" })
                    .done(function complete(result) {
                        var obj = JSON.parse(result.response);
                        callback(obj);
                    }, error);
            }, error);

    };

    WinJS.Namespace.define("Lastfm", {
        getSimilarArtists: getSimilarArtists,
        getEvents: getEvents,
        getArtistInfo: getArtistInfo,
    });
})();