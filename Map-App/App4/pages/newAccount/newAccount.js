// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/newAccount/newAccount.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            $('#newuser').submit(function (event) {
                event.preventDefault();
                $.ajax({
                    type: 'POST',
                    url: 'http://map-app-496.appspot.com/user',
                    data: $(this).serialize(),
                    dataType: 'json',
                    success: function (data) {
                        WinJS.Application.sessionState.token = data.token;
                        WinJS.Navigation.navigate('/pages/map/map.html');
                    },
                    error: function () {
                        document.getElementById('status').textContent = 'Failure';
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
