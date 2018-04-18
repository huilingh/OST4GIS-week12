var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 17,
  ext: 'png'
}).addTo(map);


var orilat;
var orilng;

var state = {
  position: {
    marker: null,
    updated: null
  }
};

/* We'll use underscore's `once` function to make sure this only happens
 *  one time even if weupdate the position later
 */
var goToOrigin = _.once(function(lat, lng) {
  map.flyTo([lat, lng], 14);
  // console.log(lat,lng);
});


/* Given a lat and a long, we should create a marker, store it
 *  somewhere, and add it to the map
 */
var updatePosition = function(lat, lng, updated) {
  if (state.position.marker) { map.removeLayer(state.position.marker); }
  state.position.marker = L.circleMarker([lat, lng], {color: "blue"});
  state.position.updated = updated;
  state.position.marker.addTo(map);
  goToOrigin(lat, lng);
  // console.log(lat,lng);
  // var origin = [lat,lng];
};

$(document).ready(function() {
  /* This 'if' check allows us to safely ask for the user's current position */
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      updatePosition(position.coords.latitude, position.coords.longitude, position.timestamp);
      orilat = position.coords.latitude;
      orilng = position.coords.longitude;
      console.log(orilat, orilng)
    });
  } else {
    alert("Unable to access geolocation API!");
  }


  /* Every time a key is lifted while typing in the #dest input, disable
   * the #calculate button if no text is in the input
   */
  $('#dest').keyup(function(e) {
    if ($('#dest').val().length === 0) {
      $('#calculate').attr('disabled', true);
    } else {
      $('#calculate').attr('disabled', false);
    }
  });

  // click handler for the "calculate" button (probably you want to do something with this)
  $("#calculate").click(function(e) {
    var dest = $('#dest').val();
    // console.log(dest);
    var parsedDest = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ dest + '.json?limit=1&access_token=pk.eyJ1IjoiaHVpbGluZ2giLCJhIjoiY2pmOW9vcDFvMjlrNzJ4cDQ2NXBwbGxuaiJ9.dCVDcHLb63hLrTilZTl1vQ'

    $.ajax(parsedDest).then(function(input){
      console.log(input);
      destlat = input.features[0].geometry.coordinates[1];
      destlng = input.features[0].geometry.coordinates[0];

      var Route = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
      orilng + ',' + orilat + ';' + destlng + ',' + destlat +
      '?access_token=pk.eyJ1IjoiaHVpbGluZ2giLCJhIjoiY2pmOW9vcDFvMjlrNzJ4cDQ2NXBwbGxuaiJ9.dCVDcHLb63hLrTilZTl1vQ'
      $.ajax(Route).then(function(route){
        console.log(route);
        var string = route.routes[0].geometry;
        console.log(string);
        var decodelatlngs = decode(string);
        var latlngs = _.map(decodelatlngs, function(data) {return [data[0]*10, data[1]*10]});
        console.log(latlngs);
        var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
      })
    })
  });

});



turf.lineString(decode(route))
