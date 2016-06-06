/*
	The name of the config-function must match the name of the value in the "data-config"-attribute.
	It returns 3 configuration Objects: Clusterer, Custom and Google.
	For the "Custom"-Object, a number of properties are required:
	
	- jsonLatitude: Position in JSON-Object of latitude-key
	- jsonLongitude: Position in JSON-Object of longitude-key
	- jsonMarkerName: Position in JSON-Object of name / marker-name
	- markerClusterer: Boolean, use MarkerClusterer
	- markerInitial: Boolean, Set initial markers
	- markerZoom: Boolean, zoomToMax on marker-click
	
	All other attributes (and objects) are optional.
*/

function mapConfig() { 
	return {
		
		/* Marker Clusterer Options */
		Clusterer: {
			gridSize: 50,
			styles: [
				{
					textColor: "white",
					url: gmap.svgCircle(30, "#848d94"),
					height: 30,
					width: 30
				},
				{
					textColor: "white",
					url: gmap.svgCircle(40, "#b99667"),
					height: 40,
					width: 40
				},
				{
					textColor: "white",
					url: gmap.svgCircle(50, "#b99667"),
					height: 50,
					width: 50
				}
			]
		},
		
		/* Required Custom Options */
		Custom : {
			
			iconArrayKey: "",
			
			/* Custom (SVG-) icons. If combined with iconArrayKey, different isons can be used based on index */
			icons: [ /* viewPort 0 0 48 48 */
			
				{ 	/* Map Pin With Hole */
				    path: "M9,18.6c0-8.3,6.7-15,15-15s15,6.7,15,15c0,11.1-15,25.7-15,25.7S9,29.7,9,18.6z M24,11.1c-4.1,0-7.5,3.4-7.5,7.5c0,4.1,3.4,7.5,7.5,7.5s7.5-3.4,7.5-7.5C31.5,14.5,28.1,11.1,24,11.1z",
				    fillColor: "#b99667",
				    fillOpacity: 1,
				    scale: 0.75,
				    strokeColor: "#fff",
				    strokeOpacity: 0.75,
				    strokeWeight: 1,
					anchor: new google.maps.Point(27, 45)
				},

				{	/* Map Pin */
				    path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
				    fillColor: "#00CCBB",
				    fillOpacity: 1,
				    scale: 0.75,
				    strokeColor: "#fff",
				    strokeOpacity: 0.75,
				    strokeWeight: 1,
					anchor: new google.maps.Point(27, 45)
				},
								
				{	/* Square Pin */
				    path: "M22-48h-44v43h16l6 5 6-5h16z",
				    fillColor: "#00CCBB",
				    fillOpacity: 1,
				    scale: 0.75,
				    strokeColor: "#fff",
				    strokeOpacity: 0.75,
				    strokeWeight: 1,
					anchor: new google.maps.Point(27, 45)
				},
				
				{	/* Route */
				    path: "M24-28.3c-.2-13.3-7.9-18.5-8.3-18.7l-1.2-.8-1.2.8c-2 1.4-4.1 2-6.1 2-3.4 0-5.8-1.9-5.9-1.9l-1.3-1.1-1.3 1.1c-.1.1-2.5 1.9-5.9 1.9-2.1 0-4.1-.7-6.1-2l-1.2-.8-1.2.8c-.8.6-8 5.9-8.2 18.7-.2 1.1 2.9 22.2 23.9 28.3 22.9-6.7 24.1-26.9 24-28.3z",
				    fillColor: "#00CCBB",
				    fillOpacity: 1,
				    scale: 0.75,
				    strokeColor: "#fff",
				    strokeOpacity: 0.75,
				    strokeWeight: 1,
					anchor: new google.maps.Point(27, 45)
				},
				
				{	/* Shield */
				    path: "M18.8-31.8c.3-3.4 1.3-6.6 3.2-9.5l-7-6.7c-2.2 1.8-4.8 2.8-7.6 3-2.6.2-5.1-.2-7.5-1.4-2.4 1.1-4.9 1.6-7.5 1.4-2.7-.2-5.1-1.1-7.3-2.7l-7.1 6.7c1.7 2.9 2.7 6 2.9 9.2.1 1.5-.3 3.5-1.3 6.1-.5 1.5-.9 2.7-1.2 3.8-.2 1-.4 1.9-.5 2.5 0 2.8.8 5.3 2.5 7.5 1.3 1.6 3.5 3.4 6.5 5.4 3.3 1.6 5.8 2.6 7.6 3.1.5.2 1 .4 1.5.7l1.5.6c1.2.7 2 1.4 2.4 2.1.5-.8 1.3-1.5 2.4-2.1.7-.3 1.3-.5 1.9-.8.5-.2.9-.4 1.1-.5.4-.1.9-.3 1.5-.6.6-.2 1.3-.5 2.2-.8 1.7-.6 3-1.1 3.8-1.6 2.9-2 5.1-3.8 6.4-5.3 1.7-2.2 2.6-4.8 2.5-7.6-.1-1.3-.7-3.3-1.7-6.1-.9-2.8-1.3-4.9-1.2-6.4z",
				    fillColor: "#00CCBB",
				    fillOpacity: 1,
				    scale: 0.75,
				    strokeColor: "#fff",
				    strokeOpacity: 0.75,
				    strokeWeight: 1,
				    anchor: new google.maps.Point(27, 45)
				}

			],
			
			/* Use User geo-location */
			bGeo : true,
			
			/*Fallback Geocoder-search distance in meters */
			jsonDistance: 10000,
			jsonErrorPrefix: "No match: ",
			jsonErrorSuffix: ".",
			
			/* Geo-Keys in oMapJSON */
			jsonLatitude: "geo.latitude", 
			jsonLongitude: "geo.longitude",
			
			/* For tracking, JSON-Key for name of Map-Marker */
			jsonMarkerName: "name",
			
			/* Show Clusterer Markers? */
			markerClusterer: true,
			
			/* Set initial markers? */
			markerInitial: true,
			
			/* Zoom in on marker-click */
			markerZoom: false,
			
			/* Reset string */
			sReset: "0"
		},
			
		/* Google Maps Options */		
		Google : {
			backgroundColor: "#f1efe8",
			center: new google.maps.LatLng(56,10.4),
			disableDefaultUI: true,
			draggable: true,
			maxZoom: 16,
			minZoom: 2,
			panControl: false,
			rotateControl: false,
			scaleControl: false,
			scrollwheel: false,
			zoom: 2,
			zoomControl: true,
			zoomControlOptions: {
		    	style: google.maps.ZoomControlStyle.LARGE,
		    	position: google.maps.ControlPosition.TOP_RIGHT
			},
			styles: [
				{
					"featureType": "administrative",
					"stylers": [
			        	{"visibility": "off"}
		    		]
				},
				{
				    "featureType": "landscape",
				    "stylers": [
				        {"lightness": -30},
				        {"saturation": -80},
				        {"color": "#222222"}
				    ]
				},
				{
				    "featureType": "poi", /* Point-Of-Interest */
				    "stylers": [
				        {"visibility": "off"}
				    ]
				},
				{
				    "featureType": "road",
				    "elementType": "geometry",
				    "stylers": [
				        {"visibility": "simplified"}
				    ]
				},
				{
				    "featureType": "road",
				    "elementType": "geometry.fill",
				    "stylers": [
				        {"color": "#4a4f53"}
				    ]
				},
				{
				    "featureType": "road",
				    "elementType": "labels",
				    "stylers": [
				        {"visibility": "off"}
				    ]
				},
				{
				    "featureType": "transit",
				    "stylers": [
				        {"visibility": "off"}
				    ]
				},
				{
				    "featureType": "water",
				    "stylers": [
				        {"visibility": "simplified"},
				        {"lightness": "100"},
				        {"saturation": "100"},
				        {"color": "#E6DFD6"}
				    ]
				},
				{
				    "featureType": "water",
				    "elementType": "geometry.fill",
				    "stylers": [
				        {"color": "#E6DFD6"}
				    ]
				}
			]
		}
	};
}