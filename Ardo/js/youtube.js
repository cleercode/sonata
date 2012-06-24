(function () {
    "use strict";

    var baseUrl = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&category=Music&uploader=partner&q=";
    var getSongs = function (artist, callback, error) {
        WinJS.xhr({ url: baseUrl+escape(artist), responseType: "blob" }).done(
        function (request) {
            var obj = JSON.parse(request.response);
            if(!obj.items || obj.items.length == 0) {
                error();
                return;
            }

            var song = obj.items[0];
            var songData = {
                "url": song.player.default,
                "thumbnail": (song.thumbnail.hqDefault ?
                    song.thumbnail.hqDefault : song.thumbnail.sqDefault),
                "title": song.title
            };
            callback(songData);
        }, error);

    }

    WinJS.Namespace.define("Youtube", {
        getSongs: getSongs,
    });
})();