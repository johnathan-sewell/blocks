#Google Maps
Please note, that *Google Maps* are **not** WACG 2.0 A or AA-compliant.

##Configurable files

- gmap_data.js *Contains the oMapJSON-data, replace with own data.*
- gmap_config.js *Contains configuration-object, replace as you like but make sure these values are updated to be correct:*
	- jsonLatitude *Pointer to latitude-info in JSON-object*
	- jsonLongitude *Pointer to longitude-info in JSON-object*
	- jsonMarkerName *Pointer to marker-name in JSON-object*

##Other files

- gmap.js *Main JavaScript*
- gmap_cluster.js *JavaScript for Marker-clustering* 
 
##Configuration
The main configuration is done in data-attributes:

- **data-json** *Name on main JSON-object with map-data*
- **data-config** *Name of config-function, returns config-object*
- **data-template** *ID of template to use for markers*


**Example:**

	<div class="google-map" data-json="oMapJSON" data-config="mapConfig" data-template="google-map-marker">
		<div class="google-map-content"></div>
	</div>

Any form-input with the class "google-map-filter" can contain these custom data-attributes:


- **data-first-option** *Text to show in the first (selected) option*
- **data-fit-bounds** *Set to true if map-bounds should be set to the generated markers*
- **data-json-key** *Key in oMapJSON-Object where the value is for building the filter*
- **data-reset** *Reset filter-value after search has completed*
- **data-search-type** *Can be any of the following:*

	- json-contains
	- json-equals
	- geocode*)

*) Use Google geocoder-search.

In the maps-script, replace the API-key:

	https://maps.googleapis.com/maps/api/js?key=<em>AIzaSyBJUbHZoSsc5D-XFU7QWY3dKpC4eX3H48w</em>&libraries=geometry&callback=gmap.init

###Example JSON &mdash; Array of Objects:**

	var oMapJSON = {
	"data": [{
		{
			"type": 0,
			"name": "Mads Stoumann",
			"description": "Front-End Developer at Valtech",
			"telephone": "20701433",
			"address": {
				"streetAddress": "Marievej 8",
				"addressLocality": "Solr&oslash;d Strand",
				"postalCode": "2680",
				"addressCountry": "Denmark"
			},
			"geo": {
				"latitude": "55.521237",
				"longitude": "12.211004000000003"
		},
		...
		]}
	}

###Template
The marker-popups are defined in a template, using html-comments as placeholders for actual data from the JSON-data. The JSON-data object will always be called "data", so prefix like this:

	<template id="google-map-marker">
		<article class="google-map-marker">
			<strong><!--#data.name--></strong>
			<div><!--#data.address.streetAddress--></div>
			<div><!--#data.address.postalCode--> <!--#data.address.addressLocality--></div>
		</article>			
	</template>

**Complete example:**

	<div class="google-map" data-json="oMapJSON" data-config="mapConfig" data-template="google-map-marker">
		<div class="google-map-filter-wrapper">
			<label for="gmap-filter1" class="google-map-filter-label">Select city:</label>
			<select id="gmap-filter1" class="google-map-filter" data-json-key="address.addressLocality" data-first-option="Choose below" data-fit-bounds="true" data-search-type="json-equals"></select>
			
			<label for="gmap-filter2" class="google-map-filter-label">Select country:</label>
			<select id="gmap-filter2" class="google-map-filter" data-json-key="address.addressCountry" data-first-option="Choose below"  data-search-type="geocode"></select>
			
			<label for="gmap-filter3" class="google-map-filter-label">Search address:</label>
			<input id="gmap-filter3" type="text" class="google-map-filter" data-json-key="address.streetAddress" data-fit-bounds="true" data-search-type="json-contains" />
		</div>
		<div class="google-map-content" tabindex="-1"></div>
	</div>