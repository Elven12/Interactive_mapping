var stations_add;

var carIcon = L.icon({
  iconUrl: 'lib/car-icon-png-4272.png',
  iconSize: [25, 30],
  iconAnchor: [12, 15],
});

var stationicon = L.icon({
  iconUrl: 'lib/ev_0003-1024-903229441.png',
  iconSize: [25, 30],
  iconAnchor: [12, 15],
});
var nearestIcon = L.icon({
  iconUrl: 'lib/marker.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
})

function onMapClick(e){
    point.clearLayers();
    var newMarker = L.marker(e.latlng,{icon: carIcon});

    point.addLayer(newMarker);

    var clickedPoint = turf.point([e.latlng.lng,e.latlng.lat],);
    var nearestPoint = turf.nearestPoint(clickedPoint,stations_add);

    var nearestMarker = L.marker([nearestPoint.geometry.coordinates[1], nearestPoint.geometry.coordinates[0]],{icon:nearestIcon});
    point.addLayer(nearestMarker);

}

var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
})

var dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png',
  api_key: '6dac02d5-9e3f-4650-afe2-807d8d18ee39'
});

var basemaps = {
  "Bright": osm,
  "Dark": dark
}

const map = L.map('map', {
  center: [49.246292, -123.12262],
  zoom: 13,
  layers: [osm]
});

var layerControl = L.control.layers(basemaps).addTo(map);

const point = L.layerGroup();
point.addTo(map)


$.getJSON("lib/electric-vehicle-charging-stations.geojson", function (data) {
  stations_add = data;
  L.geoJSON(data,{
    onEachFeature: function (feature, layer){
        layer.setIcon(stationicon);
        if (feature.properties && feature.properties.address){
            layer.on('mouseover', function(e){
                this.bindPopup(feature.properties.address).openPopup();
                //map.getCanvas().style.cursor = 'pointer';
            });
            layer.on('mouseout',function(e){+
                this.closePopup();

            });
        }
    }
  }).addTo(map)
});

map.on('click', onMapClick);
