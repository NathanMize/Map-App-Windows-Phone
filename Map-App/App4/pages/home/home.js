(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            WinJS.Application.sessionState = {};
            $('#login').submit(function (event) {
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
                        var message = "username and/or password not found";
                        Windows.UI.Popups.MessageDialog(message).showAsync();
                    },
                });
            });
            document.getElementById('newlogin').onclick = function () {
                WinJS.Navigation.navigate('/pages/newAccount/newAccount.html');
            }
        }
    });
})();
