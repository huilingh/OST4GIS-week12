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


// This chunck calculate the nearest location
// Convert Degress to Radians
function Deg2Rad(deg) {
  return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

function NearestLocation(latitude, longitude, locations) {
  var mindif = 99999;
  var closest;

  for (index = 0; index < locations.length; ++index) {
    var dif = PythagorasEquirectangular(latitude, longitude, locations[index][1], locations[index][2]);
    if (dif < mindif) {
      closest = index;
      mindif = dif;
    }
  }

  // echo the nearest city
  closestLocation = locations[closest];
  console.log(closestLocation);
}
// end of chunck



/* Given a lat and a long, we should create a marker, store it
 *  somewhere, and add it to the map
 */
var updatePosition = function(lat, lng, updated) {
  if (state.position.marker) { map.removeLayer(state.position.marker); }
  state.position.marker = L.circleMarker([lat, lng], {color: "blue"});
  state.position.updated = updated;
  state.position.marker.addTo(map);
  goToOrigin(lat, lng);
};


// get and parse the farmers market Locations
var market = 'https://raw.githubusercontent.com/huilingh/OST4GIS-week12/master/Final/geojson/Farmers_Markets.geojson'

$.ajax(market).then(function(market){
  parsedMarket = JSON.parse(market);
  allMarkets = L.geoJson(parsedMarket, {
    // style: myStyle,
    // filter: myFilter
  }).addTo(map);

  /* This 'if' check allows us to safely ask for the user's current position */
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      updatePosition(position.coords.latitude, position.coords.longitude, position.timestamp);
      orilat = position.coords.latitude;
      orilng = position.coords.longitude;
      console.log(orilat, orilng);

      marketlatlng = _.map(parsedMarket.features, function(data) {return [data.properties.NAME, data.geometry.coordinates[1], data.geometry.coordinates[0]]})

      // get closest farmers market
      NearestLocation(orilat, orilng, marketlatlng);
      destlat = closestLocation[1];
      destlng = closestLocation[2];

      // go to the nearest location by car
      $('#car').click(function(){
        var Route = 'https://api.mapbox.com/directions/v5/mapbox/driving/' +
        orilng + ',' + orilat + ';' + destlng + ',' + destlat +
        '?access_token=pk.eyJ1IjoiaHVpbGluZ2giLCJhIjoiY2pmOW9vcDFvMjlrNzJ4cDQ2NXBwbGxuaiJ9.dCVDcHLb63hLrTilZTl1vQ'

        $.ajax(Route).then(function(route) {
          console.log(route);
          var string = route.routes[0].geometry;
          var decodelatlngs = decode(string);
          var latlngs = _.map(decodelatlngs, function(data) {return [data[0]*10, data[1]*10]});
          console.log(latlngs);
          drivingpath = L.polyline(latlngs, {color: 'red'}).addTo(map);
        })
      })

      // go to the nearest location by walking
      $('#walk').click(function(){
        var Route = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
        orilng + ',' + orilat + ';' + destlng + ',' + destlat +
        '?access_token=pk.eyJ1IjoiaHVpbGluZ2giLCJhIjoiY2pmOW9vcDFvMjlrNzJ4cDQ2NXBwbGxuaiJ9.dCVDcHLb63hLrTilZTl1vQ'

        $.ajax(Route).then(function(route) {
          console.log(route);
          var string = route.routes[0].geometry;
          var decodelatlngs = decode(string);
          var latlngs = _.map(decodelatlngs, function(data) {return [data[0]*10, data[1]*10]});
          console.log(latlngs);
          walkingpath = L.polyline(latlngs, {color: 'red'}).addTo(map);
        })
      })

    });
  }

  else {
    alert("Unable to access geolocation API!");
  }

})


  // $("#calculate").click(function(e) {
  //   var dest = // nearest farmers market
  //   console.log(dest);
  //
  //     var Route = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
  //     orilng + ',' + orilat + ';' + destlng + ',' + destlat +
  //     '?access_token=pk.eyJ1IjoiaHVpbGluZ2giLCJhIjoiY2pmOW9vcDFvMjlrNzJ4cDQ2NXBwbGxuaiJ9.dCVDcHLb63hLrTilZTl1vQ'
  //     $.ajax(Route).then(function(route){
  //       console.log(route);
  //       var string = route.routes[0].geometry;
  //       console.log(string);
  //       var decodelatlngs = decode(string);
  //       var latlngs = _.map(decodelatlngs, function(data) {return [data[0]*10, data[1]*10]});
  //       console.log(latlngs);
  //       var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
  //     })
  // });
