// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/newCat/newCat.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            $('#newCat').submit(function (event) {
                event.preventDefault();
                $.ajax({
                    type: 'POST',
                    url: 'http://map-app-496.appspot.com/category/' + WinJS.Application.sessionState.token,
                    data: $(this).serialize(),
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        WinJS.Navigation.navigate(WinJS.Application.sessionState.origin);
                    },
                    error: function () {
                        var message = "Category could not be created";
                        Windows.UI.Popups.MessageDialog(message).showAsync();
                    },

                });
            });
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
