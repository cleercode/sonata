// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }

        app.cache = new LastFMCache();
        app.lastfm = new LastFM({
            apiKey: '80a188b0bc2bbad47509ece49e5504c5',
            apiSecret: 'df1faefee53e9ae601255b0220bd5113',
            cache: app.cache
        });

        $('form').submit(function () {
            var artist = $('#artist').val();
            app.gatherArtists(artist);
            return false;
        });
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.gatherArtists = function (artist) {
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
        var key = "b25b959554ed76058ac220b7b2e0a026";
        var url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + artist + "&api_key=" + key + "&format=json";
        WinJS.xhr({ url: url, responseType: "json" })
            .done(function complete(result) {
                var obj = JSON.parse(result.response);
                var similarArtists = obj.similarartists.artist;
                similarArtists.forEach(function (artist) {
                    var photo = artist.image[3]["#text"];
                    if (photo !== "") {
                        console.log(photo);
                    }
                });
            });
    };

    app.setupImage = function (artist) {
        var imageurl = artist.image[1]['#text'];
        imageurl = imageurl.replace('\/64\/', '\/126s\/');
        var name = $('<span/>').addClass('name').text(artist.name).hide();
        var image = $('<li/>').css('background', 'url(' + imageurl + ')').append(name);

        var bio;

        image.mouseover(function () {
            if (!detail) {
                image.animate({
                    opacity: 1
                });
                name.slideDown();
            }
        });

        image.mouseout(function () {
            image.animate({
                opacity: 0.3
            });
            name.slideUp();
        });

        image.click(function () {
            if (!detail) {
                loadDetail(artist);
            } else {
                closeDetail();
            }
        });

        $('#artists').append(image);
    };

    //loadDetail = function (artist) {
    //    loadDetailInfo(artist);

    //    $('#detail-nav-info').click(function () {
    //        loadDetailInfo(artist);
    //    });
    //    $('#detail-nav-videos').click(function () {
    //        loadDetailVideos(artist);
    //    });
    //};

    //loadDetailInfo = function (artist) {
    //    loadingOn();
    //    lastfm.artist.getInfo({
    //        artist: artist.name
    //    },
    //    {
    //        success: function (data) {
    //            bio = data.artist.bio.summary;

    //            detail = true;
    //            $('#detail-photo').attr('src', artist.image[3]['#text']);
    //            $('#detail-name').text(artist.name);
    //            $('#detail-descrip').html(bio);
    //            $('#detail-links-lastfm').attr('href', 'http://' + artist.url);
    //            $('#detail-links-wikipedia').attr('href', 'http://en.wikipedia.org/w/index.php?title=Special:Search&search=' + artist.name);
    //            $('#detail-links-flickr').attr('href', 'http://www.flickr.com/search/?q=' + artist.name + ' concert&w=all');
    //            $('#detail-links-youtube').attr('href', 'http://www.youtube.com/results?search_query=' + artist.name + '&aq=f');
    //            $('#artists').animate({
    //                opacity: 0.5
    //            });
    //            $('#detail').fadeIn();
    //            loadingOff();
    //        },
    //        error: function (code, message) {
    //            alert('Unable to retrieve data from last.fm');
    //        }
    //    });
    //};

    //loadingOn = function () {
    //    $('#loading').fadeIn();
    //};

    //loadingOff = function () {
    //    $('#loading').fadeOut();
    //};


    app.start();
})();
