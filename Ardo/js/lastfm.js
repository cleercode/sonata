(function () {
    "use strict";

    var key = "b25b959554ed76058ac220b7b2e0a026";

    var getSimilarArtists = function (artist, callback, error) {
        var similarArtistUrl = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + escape(artist) + "&api_key=" + key + "&format=json";
        var artistInfoUrl = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + escape(artist) + "&autocorrect=1&api_key=" + key + "&format=json";
        var similarArtists = []
        WinJS.xhr({ url: similarArtistUrl, responseType: "json" })
            .then(function(result) {
                var obj = JSON.parse(result.response);
                if (obj.similarartists && obj.similarartists.artist) {
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

                return WinJS.xhr({ url: artistInfoUrl, responseType: "json" });
            }, error)
            .done(function (result) {
                var obj = JSON.parse(result.response);
                var hasMBID = similarArtists.reduce(function (acc, val) {
                    return acc || (val.mbid == obj.artist.mbid);
                }, false);

                if (!hasMBID) {
                    for (var i = obj.artist.image.length - 1; i >= 0; i--) {
                        if (obj.artist.image[i]["#text"] != "") {
                            similarArtists.unshift({
                                "img": obj.artist.image[i]["#text"],
                                "name": obj.artist.name,
                                "score": 1,
                                "mbid": obj.artist.mbid,
                            });
                            break;
                        }
                    }
                }

                callback(similarArtists);

            });
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