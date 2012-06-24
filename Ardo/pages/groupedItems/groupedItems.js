(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var list = new WinJS.Binding.List();

    ui.Pages.define("/pages/groupedItems/groupedItems.html", {

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            listView.itemDataSource = list.dataSource;
            listView.groupDataSource = null;
            listView.layout = new ui.GridLayout();
        },

        itemInvoked: function (args) {
            // If the page is not snapped, the user invoked an item.
            var artist = list.getAt(args.detail.itemIndex);
            nav.navigate("/pages/itemDetail/itemDetail.html", { artist: artist });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".groupeditemslist").winControl;
            listView.groupHeaderTemplate = element.querySelector(".headerTemplate");
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView.oniteminvoked = this.itemInvoked.bind(this);

            this.initializeLayout(listView, appView.value);
            listView.element.focus();

            //Lastfm.getEvents(function () { });
            $('form').submit(function () {
                var artist = $('#artist').val();
                while (list.pop()) { };
                Lastfm.getSimilarArtists(artist,
                    function (artists) {
                        artists.forEach(function (artist) {
                            artist.imgURL = "url('" + artist.img + "')";
                            list.push(artist);
                        });
                        list.notifyReload();
                        console.log(list);
                    });
                return false;
            });
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".groupeditemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    this.initializeLayout(listView, viewState);
                }
            }
        }
    });
})();
