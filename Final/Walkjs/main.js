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

/* Given a lat and a long, we should create a marker, store it
 *  somewhere, and add it to the map
 */


// get and parse the farmers market Locations
var walkable = 'https://raw.githubusercontent.com/huilingh/OST4GIS-week12/master/Final/geojson/Walkable_Access_Healthy_Food.geojson'

var myStyle = function(feature) {
  switch (feature.properties.ACCESS_) {
           case 'No Access': return {color: "#c03838", weight: 0, fillOpacity: 0.75};
           case 'Low Access':   return {color: "#efbb47", weight: 0, fillOpacity: 0.75};
           case 'Moderate Access': return {color: "#a0c96d", weight: 0, fillOpacity: 0.75};
           case 'High Access': return {color: "#7ab356", weight: 0, fillOpacity: 0.75};
       }
};


$.ajax(walkable).then(function(walkable){
  parsedWalk = JSON.parse(walkable);
  walkmap = L.geoJson(parsedWalk, {
    style: myStyle,
  }).addTo(map);

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
