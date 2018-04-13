// Leaflet map setup
var map = L.map('map', {
  center: [41.133004, -77.593477],
  zoom: 7
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

var cartoUserName = 'jefffrankl';
var sql = "SELECT the_geom, district_number, the_geom_webmercator FROM pacd_2011";
var format = "GeoJSON";

var url = "https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+sql;

$.ajax(url).done(function(data){
  L.geoJson(data, {
    style: {weight: 1, color: "#0B645E", fillOpacity: 0}
  }).addTo(map);
});
