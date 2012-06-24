(function () {
    "use strict";

    var baseUrl = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&category=Music&uploader=partner&q=";
    var getSongs = function (artist, callback, error) {
        WinJS.xhr({ url: baseUrl+escape(artist), responseType: "json" }).done(
        function (request) {
            var obj = JSON.parse(request.response);
            if(!obj.data.items || obj.data.items.length == 0) {
                error();
                return;
            }

            var songs = [];
            var length = Math.min(2, obj.data.items.length);
            for (var i = 0; i < length; i++) {
                var song = obj.data.items[i];
                var songData = {
                    "url": song.player.default,
                    "thumbnail": song.thumbnail.sqDefault,
                    "title": song.title
                };
                songs.push(songData);
            }
            callback(songs);
        }, error);

    }

    WinJS.Namespace.define("Youtube", {
        getSongs: getSongs,
    });
})();