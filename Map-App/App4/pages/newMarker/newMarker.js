// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/newMarker/newMarker.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            WinJS.Application.onbackclick = function (evt) {
                WinJS.Navigation.navigate('/pages/newMarker/newMarker.html');
                return true;
            }

            $.ajax({
                type: 'GET',
                url: 'http://map-app-496.appspot.com/category/' + WinJS.Application.sessionState.token,
                data: $(this).serialize(),
                dataType: 'json',
                success: function (data) {
                    for (var x in data) {
                        var T = document.createElement("OPTION");
                        T.setAttribute("value", x);
                        T.appendChild(document.createTextNode(data[x].name));
                        document.getElementById('catList').appendChild(T);
                    }
                },
                error: function () {
                    var message = "You will need to add a category";
                    Windows.UI.Popups.MessageDialog(message).showAsync();
                },
            });
            document.getElementById('lat').value = WinJS.Application.sessionState.latlng.lat;
            document.getElementById('lon').value = WinJS.Application.sessionState.latlng.lng;
            $('#newMarker').submit(function (event) {
                event.preventDefault();
                $.ajax({
                    type: 'POST',
                    url: 'http://map-app-496.appspot.com/marker/' + WinJS.Application.sessionState.token,
                    data: $(this).serialize(),
                    dataType: 'json',
                    success: function (data) {
                        WinJS.Navigation.navigate('/pages/map/map.html');
                    },
                    error: function () {
                        var message = "Marker could not be created";
                        Windows.UI.Popups.MessageDialog(message).showAsync();
                    },

                });
                
            });
            document.getElementById('newCategory').onclick = function () {
                WinJS.Application.sessionState.origin = '/pages/newMarker/newMarker.html';
                WinJS.Navigation.navigate('/pages/newCat/newCat.html');
            }




        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();
