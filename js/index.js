var map;
var directionsService;
var directionsDisplay;
var marker;
var markerOfIcon;
var infoWindow;

function initMap() {
	var centerLoc = {lat: 10.314707, lng: 123.886189};
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: centerLoc
	});

	infoWindow = new google.maps.InfoWindow({map: map});

	navigator.geolocation.watchPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('This is your location.');
        map.setCenter(pos);

        var scope = new google.maps.Circle({
		    center: pos,
		    radius: 5000,
		    strokeColor: "#00FF80",
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: "#E6FFE6",
		    fillOpacity: 0.4
		  });
		  scope.setMap(map);
        marker = new google.maps.Marker({
		  position: pos,
		  map: map,
		});

		var service = new google.maps.places.PlacesService(map);
	    service.nearbySearch({
	      location: marker.getPosition(),
	      radius: 5000,
	      type: ['restaurant']
	    }, callback);
      });
}

function callback(results, status) {
if (status === google.maps.places.PlacesServiceStatus.OK) {
  for (var i = 0; i < results.length; i++) {
    createMarker(results[i]);
  }
}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var markerOfIcon = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location,
	   icon: "img/flag.png"
	});

	//console.log(place);

	 var contents  =  '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<img src="'+place.icon+'" style="align:center;height:300px;width:300px;">' +
      '<h3>'+place.name+'</h3>'+
      '<h6>'+place.vicinity+'</h6>'+
      '<div id="bodyContent">'+
      '<div class="panel panel-success">'+
		  '<div class="panel-heading">'+
		    '<h3 class="panel-title">Restaurant Info</h3>'+
		  '</div>'+
		  '<div class="panel-body">'+
		    '<ul class="list-group">'+
			  '<li class="list-group-item">'+
			    '<span class="badge">'+place.rating+' Stars</span>'+
			    'Rating : '+
			  '</li>'+
			'</ul>'+
		  '</div>'+
		'</div>'+
      '</div>'+
      '</div>';

	google.maps.event.addListener(markerOfIcon, 'click', function() {
	  infoWindow.setContent(contents);
	  infoWindow.open(map, this);
	});
}

function calculateAndDisplayRoute(directionsService, directionsDisplay,latitude,longitude) {
	var orgn = marker.getPosition();
	var dest = new google.maps.LatLng(latitude, longitude);
	directionsService.route({
	  origin: orgn,
	  destination: dest,
	  travelMode: 'DRIVING'
	}, function(response, status) {
	  if (status === 'OK') {
	    directionsDisplay.setDirections(response);
	  } else {
	    window.alert('Directions request failed due to ' + status);
	  }
	});
}
function direction(latitude,longitude){
	//alert(latitude);
	//console.log(longitude);
    //directionDisplay.setMap(null);
    directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(map);
	calculateAndDisplayRoute(directionsService, directionsDisplay,latitude,longitude);
}
