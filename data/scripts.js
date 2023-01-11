var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    accessToken: 'pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    accessToken: 'pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw',
    tileSize: 512,
    zoomOffset: -1,
});

var map = L.map('map', {layers:[light, dark]}).fitWorld();

var popup = L.popup()
    .setLatLng([0,0])
    .setContent("Once you grant permission, this page will obtain your location in order to show it on the map. Location information will not be stored by the webpage. Click the location arrow in the top left to see your location on the map.")
    .openOn(map);

function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

        if (radius <= 100) {
            L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
        }
        else{
            L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
        } //this adds a circle to the map centered at the lat and long returned by the locate function. Its radius is set to the var radius defined above.

    var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
    var sunrise = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
    var sunset = times.sunset.getHours() + ':' + times.sunrise.getMinutes();

    var currentTime = new Date().getHours() + ':' + times.sunrise.getMinutes();
        if (sunrise < currentTime && currentTime < sunset){
        map.removeLayer(dark);
        map.addLayer(light);
        }
        else {
        map.removeLayer(light);
        map.addLayer(dark);
        } 
    }
map.on('locationfound', onLocationFound); //this is the event listener

function onLocationError(e) {
    alert(e.message);
  } 
  map.on('locationerror', onLocationError);  

var lc = L.control.locate({
    onclick: popup,
    position: 'topleft',  // set the location of the control
    strings: {
    title: "Go to my location."
    },
    locateOptions: {setView:true, maxZoom:16,}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
  })
.addTo(map);

var baseMaps = {
    "Light": light,
    "Dark": dark,
};
var layerControl = L.control.layers(baseMaps).addTo(map);

//Geolocation Center Map Based on Location
//map.locate({setView: true, maxZoom: 16,});



