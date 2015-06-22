// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/editMarker/editMarker.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            $.ajax({
                type: 'GET',
                url: 'http://map-app-496.appspot.com/marker/' + WinJS.Application.sessionState.token + '/' + WinJS.Application.sessionState.marker,
                data: $(this).serialize(),
                dataType: 'json',
                async: false,
                success: function (data) {
                    $.ajax({
                        type: 'GET',
                        url: 'http://map-app-496.appspot.com/category/' + WinJS.Application.sessionState.token,
                        data: $(this).serialize(),
                        dataType: 'json',
                        success: function (data2) {
                            for (var x in data2) {
                                var T = document.createElement("OPTION");
                                T.setAttribute("value", x);
                                if (x == data.category) {
                                    T.setAttribute('selected', true);
                                }
                                T.appendChild(document.createTextNode(data2[x].name));
                                document.getElementById('catList').appendChild(T);
                            }
                        },
                        error: function () {
                            var message = "failed to access user's markers";
                            Windows.UI.Popups.MessageDialog(message).showAsync();
                        },
                    });
                    document.getElementById('lat').value = data.lat;
                    document.getElementById('lon').value = data.lon;
                    document.getElementById('popup').value = data.popup;

                },
                error: function () {
                    var message = "Failed to edit marker";
                    Windows.UI.Popups.MessageDialog(message).showAsync();
                },

            });
            $('#editMarker').submit(function (event) {
                event.preventDefault();
                $.ajax({
                    type: 'PUT',
                    url: 'http://map-app-496.appspot.com/marker/' + WinJS.Application.sessionState.token + '/' + WinJS.Application.sessionState.marker,
                    data: $(this).serialize(),
                    dataType: 'json',
                    success: function (data) {
                        WinJS.Navigation.navigate('/pages/map/map.html');
                    },
                    error: function () {
                        var message = "Marker could not be edited";
                        Windows.UI.Popups.MessageDialog(message).showAsync();
                    },

                });

            });
            document.getElementById('newCategory').onclick = function () {
                WinJS.Application.sessionState.origin = '/pages/editMarker/editMarker.html';
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
