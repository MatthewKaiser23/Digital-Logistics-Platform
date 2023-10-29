// create a map instance and set its center and zoom level
var map = L.map("map", {
  center: [-34.04178, 18.41708],
  zoom: 13,
  dragging: false,
  zoomControl: false,
  scrollWheelZoom: false,
});

// add a tile layer to the map
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// add a marker to the map
L.marker([-34.04178, 18.41708]).addTo(map); 
