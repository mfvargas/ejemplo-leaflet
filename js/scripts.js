// ** Configuración inicial del mapa **

// Creación de un mapa de Leaflet
var map = L.map("mapid");

// Centro del mapa y nivel inicial de acercamiento
var catedralSJ = L.latLng([9.9326673, -84.0787633]);
var zoomLevel = 8;

// Vista del mapa
map.setView(catedralSJ, zoomLevel);


// ** Capas **

// Capas de teselas
layer_tile_esri = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
layer_tile_osm = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);

// Capa WMS de provincias
var layer_wms_provincias = L.tileLayer.wms('http://geos.snitcr.go.cr/be/IGN_5/wms?', {
	layers: 'limiteprovincial_5k',
  format: 'image/png',
	transparent: true
}).addTo(map);

// Capa raster de temperatura
var layer_image_temperatura = L.imageOverlay("datos/bio1_cr.png", 
	[[11.2197734290000000, -85.9790724540000042], 
	[8.0364413690000003, -82.5540738239999996]], 
	{opacity:0.5}
).addTo(map);


// ** Marcadores **

// Marcador para la Catedral Metropolitana de San José
// Ubicación
var marker_catedralSJ = L.marker([9.9326673, -84.0787633], 
																{draggable:false, 
																opacity:1}).addTo(map);
// Popup																
marker_catedralSJ.bindPopup('<a href="https://es.wikipedia.org/wiki/Catedral_metropolitana_de_San_Jos%C3%A9">Catedral Metropolitana de San José</a>.<br>Catedral de estilo clásico y barroco. Templo principal de la arquidiócesis católica de San José.<br>Construída entre 1825 y 1827 y reconstruída en 1878.');
// Tooltip
marker_catedralSJ.bindTooltip("Catedral Metropolitana de San José");

// Marcador personalizado para la Catedral Metropolitana de San José
/* var marker_catedralSJ = L.marker([9.9326673, -84.0787633],
	{ icon: L.divIcon(
		{ html: '<i class="fas fa-church"></i>'}
	)}
).addTo(map);	 */


// ** Controles **

// Control de capas
// Conjunto de capas base
var maps_base = {
	"ESRI World Imagery": layer_tile_esri,
	"OpenStreetMap": layer_tile_osm
};
// Conjunto de capas overlay
var maps_overlay = {
	"Temperatura": layer_image_temperatura,	
  "Provincias": layer_wms_provincias
};
control_layers = L.control.layers(maps_base, 
								 maps_overlay, 
								 {position:'topright', 
								  collapsed:true}).addTo(map);	

// Control de escala
L.control.scale({imperial:false}).addTo(map);	


// ** Capas GeoJSON

// Capa de ASP
$.getJSON("datos/asp.geojson", function(geodata) {
  var layer_geojson_asp = L.geoJson(geodata, {
    style: function(feature) {
      return {
        'color': "#00ff00",
        'weight': 2,
        'fillOpacity': 0.0
      }
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Área protegida: " + feature.properties.nombre_asp + "<br>" +
											"Categoría: " + feature.properties.cat_manejo;
			layer.bindPopup(popupText);
		}			
  }).addTo(map);
	control_layers.addOverlay(layer_geojson_asp, 'Áreas protegidas');
});