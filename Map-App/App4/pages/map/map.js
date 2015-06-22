// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/map/map.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            WinJS.Application.onbackclick = function (evt) {
                WinJS.Navigation.navigate('/pages/home/home.html');
                return true;
            }

            var map = new L.map('map', {
                maxZoom: 18,
                minZoom: 1,
                view: L.latLng(0,0)
            });

            drawMap(map);

            function findMe(map) {
                map.invalidateSize();
                var geolocator = new Windows.Devices.Geolocation.Geolocator();
                var finder = geolocator.getGeopositionAsync();
                finder.done(function (pos) {
                    var coord = pos.coordinate;
                    var leafletCoord = L.latLng(coord.point.position.latitude, coord.point.position.longitude);
                    map.setView(leafletCoord, 12);
                    map.invalidateSize();
                });
            }

            document.getElementById("Home").onclick = function () {
                findMe(map);
            };

            WinJS.Application.sessionState.markerSet = 0;
            document.getElementById("marker").onclick = function () {
                if (WinJS.Application.sessionState.markerSet == 0) {
                    document.getElementById("marker").textContent = "Cancel Placement";
                    WinJS.Application.sessionState.markerSet = 1;

                }
                else if (WinJS.Application.sessionState.markerSet == 1) {
                    document.getElementById("marker").textContent = "Place Marker";
                    WinJS.Application.sessionState.markerSet = 0;
                }
            };
            function placeMarker(e) {
                WinJS.Application.sessionState.coord = map.getCenter();
                WinJS.Application.sessionState.zoom = map.getZoom();
                if (WinJS.Application.sessionState.markerSet == 1) {
                    WinJS.Application.sessionState.latlng = e.latlng;
                    document.getElementById("marker").textContent = "Place Marker";
                    WinJS.Application.sessionState.markerSet = 0;
                    WinJS.Navigation.navigate('/pages/newMarker/newMarker.html');
                }
            }

            function drawMap(map) {
                var terrainView = L.tileLayer('http://{s}.tiles.mapbox.com/v3/mizen.j7bk7p1c/{z}/{x}/{y}.png', {
                    attribution: 'Map Data &copy; <a href="http://mapbox.com">Mapbox</a>' +
                    ' Imagery &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
                });

                terrainView.addTo(map);

                if (WinJS.Application.sessionState.coord) {
                    map.setView(WinJS.Application.sessionState.coord, WinJS.Application.sessionState.zoom);
                }
                else {
                    findMe(map);
                }


                L.control.scale().addTo(map);

                // get and display markers with layer control
                var layerControl = false;
                var layerlist = {};
                
                $.ajax({
                    type: 'GET',
                    url: 'http://map-app-496.appspot.com/category/' + WinJS.Application.sessionState.token,
                    data: $(this).serialize(),
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        for (var x in data) {
                            layerlist[x] = [];
                            layerlist[x].layer = new L.LayerGroup();
                            $.ajax({
                                type: 'GET',
                                url: 'http://map-app-496.appspot.com/catlist/' + WinJS.Application.sessionState.token + '/' + x,
                                data: $(this).serialize(),
                                async: false,
                                dataType: 'json',
                                success: function (data2) {
                                    for (var y in data2) {
                                        var marker = L.marker(L.latLng(data2[y].lat, data2[y].lon));
                                        marker.bindPopup(data2[y].popup + "<br><div class='buttonrow'><button class='popupEdit' value='" + y + "'> Edit </button>  <button class='popupDelete' value='" + y + "'> Remove </button></div>");
                                        layerlist[x].layer.addLayer(marker);
                                    }
                                },

                            });
                            ;
                            if (layerControl === false) {
                                layerControl = L.control.layers({}, {}, { collapsed: true });
                                layerControl.addTo(map);
                            }
                            layerControl.addOverlay(layerlist[x].layer.addTo(map), data[x].name);
                        }
                    },
                });
                map.on("click", placeMarker);
            }





            $('#map').on('click', '.popupDelete', function (e) {
                WinJS.Application.sessionState.coord = map.getCenter();
                WinJS.Application.sessionState.zoom = map.getZoom();
                $.ajax({
                    type: 'DELETE',
                    url: 'http://map-app-496.appspot.com/marker/' + WinJS.Application.sessionState.token + '/' + e.currentTarget.value,
                    data: $(this).serialize(),
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        map.remove();
                        map = new L.map('map');
                        drawMap(map);
                    },
                    error: function () {
                        var message = "Failed to remove marker " + e.currentTarget.value;
                        Windows.UI.Popups.MessageDialog(message).showAsync();
                    },

                });
            });
            $('#map').on('click', '.popupEdit', function (e) {
                WinJS.Application.sessionState.coord = map.getCenter();
                WinJS.Application.sessionState.zoom = map.getZoom();
                WinJS.Application.sessionState.marker = e.currentTarget.value;
                WinJS.Navigation.navigate('/pages/editMarker/editMarker.html');
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
