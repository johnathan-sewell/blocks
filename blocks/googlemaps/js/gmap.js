/**
* @file gmap.js
* version 0.9.2
* date: 2016-05-11
*/

/* jshint bitwise: false */
/* jshint -W054 */ /* Function form of eval */
/* globals google, MarkerClusterer */

/**	@namespace gmap */
var gmap = (function() {
	
	/**
	* @function addOption
	* @description Creates a single option for a select-box
	* @memberof! gmap
	* @param {Object} oSelect
	* @param {string} sText
	* @param {string} sValue
	*/ 		
	var addOption = function(oSelect, sText, sValue) {
		var
		/**	@type {Object} */
		oOpt = document.createElement("option");
		oOpt.text = sText;
		oOpt.value = sValue;
		oSelect.options.add(oOpt);
	};
		
	/**
	* @function buildJSON
	* @description Returns a new JSON-object based on (another) JSON-objects key/val
	* @memberof! gmap
	* @param {Array} aJSON
	* @param {Object} oKey
	*/ 	
	var buildJSON = function(aJSON, oKey) {
		var
		/**	@type {Array} */
		aTmp =[],
		/**	@type {number} */
		i,
		/**	@type {Object} */
		oJSON = {};
		
		for (i = 0; i < aJSON.length; i++) aTmp.push(byString(aJSON[i], oKey).trim());
		
		aTmp.sort();
		
		for (i = 0; i < aTmp.length; i++) oJSON[aTmp[i]] = aTmp[i];
		return oJSON;
	};
	
	/**
	* @function byString
	* @description Returns a key from a JSON-object based on a string
	* @memberof! gmap
	* @param {Object} oObj	
	* @param {string} sKey
	*/ 	
	var byString = function(oObj, sKey) {
		sKey = sKey.replace(/\[(\w+)\]/g, ".$1");
		sKey = sKey.replace(/^\./, "");
		
		var 
		/**	@type {Array} */
		aKeys = sKey.split("."),
		/**	@type {number} */
		i,
		/**	@type {number} */
		nLen = aKeys.length,
		/**	@type {Object} */
		oKey;
		
		for (i = 0; i < nLen; ++i) {
			oKey = aKeys[i];
			if (oKey in oObj) {
				oObj = oObj[oKey];
			}
			else {
				return;
			}
		}
		return oObj;
	};
	
	/**
	* @function createOptions
	* @description Creates options for filter-dropdowns
	* @memberof! gmap
	* @param {Object} oSelect
	* @param {Object} oJSON
	*/ 	
	var createOptions = function(oSelect, oJSON) {
		var 
		/**	@type {Object} */
		O; 

		if (oSelect.getAttribute("data-first-option")) addOption(oSelect, oSelect.getAttribute("data-first-option"), "0");

		for (O in oJSON) {
			if (oJSON.hasOwnProperty(O)) addOption(oSelect, oJSON[O], oJSON[O]);
		}
	};

    /**
	* @function debounce
	* @description Debounces events, waits for nDelay to fire
	* @memberof! gmap
    * @param {Function} oFunc Function to run every nDelay
    * @param {number} nDelay Timer, in milliseconds
    */	
	var debounce = function(oFunc, nDelay) {
		var 
		/** @type {null|number|undefined} */
		nTimer = null;
		return function () {
			var 
			/**	@type {Arguments} */
			aArgs = arguments,
			/**	@type {Object} */
			oScope = this;
			clearTimeout(nTimer);
			nTimer = setTimeout(function() { oFunc.apply(oScope, aArgs); }, nDelay);
		};
	};
	
	/**
	* @function gmap
	* @description Creates a single Google Map-instance, assigns functions
	* @memberof! gmap
	* @param {Object} oMap
	* @param {Object} oMapJSON
	* @param {Object} oConfig
	* @param {Object} oTemplate
	*/ 	
	var gmap = function(oMap, oMapJSON, oConfig, oTemplate) {
		var
		/**	@type {Array} */
		aFilters = oMap.querySelectorAll(".google-map-filter"),
		/**	@type {Array} */
		aMarkers = [],
		/**	@type {boolean} */
		bIsSelect,
		/**	@type {number} */
		nLen = aFilters.length,
		/**	@type {Object} */
		oClusterer = null,
		/**	@type {Object} */
		oFilter,
		/**	@type {Object} */
		oMapContent = oMap.querySelector(".google-map-content"),
		/**	@type {Object} */
		oMapError = oMap.querySelector(".google-map-error"),
		/**	@type {Object} */
		oPopup = new google.maps.InfoWindow(),
		/**	@type {Object} */
		oRanking = {},
		/**	@type {string} */
		sEvtType,
		/**	@type {string} */
		sTemplate = (oTemplate ? oTemplate.innerHTML : "");
		
		if (oMapContent && oMapJSON && oConfig) {
			oMap = new google.maps.Map(oMapContent, oConfig.Google);
			
			while(nLen--) {
				oFilter = aFilters[nLen];
				bIsSelect = oFilter.tagName.toLowerCase() === "select";
				sEvtType = (bIsSelect ? "change" : "keyup");
				oFilter.addEventListener(sEvtType, (oFilter.getAttribute("data-search-type") == "geocode" ? geoSearch : debounce(jsonSearch, 250)), false);
				if (bIsSelect) createOptions(oFilter, buildJSON(oMapJSON.data, oFilter.getAttribute("data-json-key")));
			}
		
			google.maps.event.addDomListener(oMap, "idle", function() {
				oMap.getCenter();
			});

			google.maps.event.addDomListener(window, "resize", function() {
				oMap.setCenter(oMap.getCenter());
			});
			
			if (oConfig.Custom.bGeo) {
				setMarkersFromUserLocation();
			} else if (oConfig.Custom.markerInitial) {
				setMarkers("", oConfig.Custom.jsonMarkerName, true, null, true);
			}
		}

		/**
		* @function addMarker
		* @description Creates a single map-marker
		* @memberof! gmap
		* @param {Object} oLatLong
		* @param {string} sValue
		* @param {string} sContent
		* @param {number} nIconIndex
		*/ 	
		function addMarker(oLatLong, sName, sContent, nIconIndex) {
			var
			/**	@type {Object} */
			oMarker;
			
			if (oConfig.Custom.icons) {
				if (oConfig.Custom.icons)
				oMarker = new google.maps.Marker({
					map: oMap,
					position: oLatLong,
					icon: oConfig.Custom.icons[nIconIndex]
				});
			}
			else {
				oMarker = new google.maps.Marker({
					map: oMap,
					position: oLatLong
				});
			}
			
			aMarkers.push(oMarker);
			
			if (sContent) {
	            google.maps.event.addListener(oMarker, "click", function() {
	            	sContent = sContent.replace(/data-tmp-/g,"");
					oPopup.setContent(sContent);
					oPopup.open(oMap, this);
					oMap.panTo(this.getPosition());
					if (oConfig.Custom.markerZoom) oMap.setZoom(oConfig.Google.maxZoom);
					try { window._gtmEV("Marker", "Google Maps", sName); } catch(err) {}
				});
	        }
		}
		
		/**
		* @function clearMarkers
		* @description Deletes all markers
		* @memberof! gmap
		*/ 	
		function clearMarkers() {
	  		var
	  		/**	@type {number} */
	  		i;
	  		
			for (i = 0; i < aMarkers.length; i++) aMarkers[i].setMap(null);
			
			aMarkers = [];
			oRanking = {};
			
			if (oClusterer) oClusterer.clearMarkers();
		}
		
		/**
		* @function geoSearch
		* @description Executes a geocoder-search
		* @memberof! gmap
		* @param {string} sValue
		*/ 	
		function geoSearch() {
			var
			/**	@type {boolean} */
			bFitBoundsToMarkers = (this.getAttribute("data-fit-bounds") == "true" ? true: false),
			/**	@type {Object} */
			geocoder = new google.maps.Geocoder(),
			/**	@type {string} */
			sKey = this.getAttribute("data-json-key"),
			/**	@type {string} */
			sValue = this.value;
			
			if (sValue) {		
				geocoder.geocode({"address": sValue}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK && status != google.maps.GeocoderStatus.ZERO_RESULTS) {
						if (results && results[0] && results[0].formatted_address) {
							oMap.fitBounds(results[0].geometry.bounds);
							setMarkers(sValue, sKey, bFitBoundsToMarkers);
						}
		        	} else {
						console.error("Geocode was not successful for the following reason: " + status);
		        	}
		  		});
	  			if (this.getAttribute("data-reset") == "true") this.value = oConfig.Custom.sReset;
	  		}
		}

		/**
		* @function jsonSearch
		* @description Searches oMapJSON.[this.dataset.jsonKey] for this.value
		* @memberof! gmap
		*/ 	
		function jsonSearch() {
			setMarkers(this.value, this.getAttribute("data-json-key"), true, this); 
			if (this.getAttribute("data-reset") == "true") this.value = (this.tagName.toLowerCase() == "select" ? oConfig.Custom.sReset : "");
		}

		/**
		* @function setError
		* @description Sets the error text if no match
		* @memberof! gmap
		* @param {string} sValue
		*/		
		function setError(sValue) {
			if (oMapError) oMapError.innerHTML	= sValue;
		}

		/**
		* @function setMarkers
		* @description Creates markers
		* @memberof! gmap
		* @param {string} sValue
		* @param {string} sKey
		* @param {boolean} bFitBoundsToMarkers
		* @param {Object} [oReferrer]
		* @param {boolean} [bSetAllMarkers]
		*/ 	
		function setMarkers(sValue, sKey, bFitBoundsToMarkers, oReferrer, bSetAllMarkers) {
			bSetAllMarkers = bSetAllMarkers || false;
			var
			/**	@type {Array} */ 
			aKeys = sKey.split("|"),
			/**	@type {Array} */ 
			aRanking = (oReferrer ? oReferrer.getAttribute("data-ranking") && oReferrer.getAttribute("data-ranking").split("|") : []),
			/**	@type {boolean} */
			bAddMarker = false,
			/**	@type {number} */
			i,
			/**	@type {number} */
			j,
			/**	@type {number} */
			nIconIndex,
			/**	@type {number} */
			nLen = oMapJSON.data.length,
			/**	@type {number} */
			nRanking,
			/**	@type {Object} */
			oBounds = new google.maps.LatLngBounds(),
			/**	@type {Object} */
			oDistance,
			/**	@type {Object} */
			oLatLong,
			/**	@type {string} */
			sContent,
			/**	@type {string} */
			sLat,
			/**	@type {string} */
			sLng,
			/**	@type {string} */
			sName,
			/**	@type {string} */
			sTmp;

			try { window._gtmEV("Filter", "Google Maps", sValue); } catch(err) {}
			clearMarkers();
				
			if (sValue == oConfig.Custom.sReset) {
				bSetAllMarkers = true;
				bFitBoundsToMarkers = true;
			}
			
			for (i = 0; i < nLen; i++) {
				if (bSetAllMarkers) {
					setMarker(true, oMapJSON.data[i]);
				}
				else {
					for (j = 0; j < aKeys.length; j++) {
						nRanking = (aRanking && aRanking[j] ? aRanking[j] : 0);
						sTmp = byString(oMapJSON.data[i], aKeys[j]).trim();
					
						if (oReferrer) {
							/* JSON Contains */
							if (oReferrer.getAttribute("data-search-type") == "json-contains") {
								setMarker(~sTmp.toLowerCase().indexOf(sValue.toLowerCase()), oMapJSON.data[i], nRanking);
							}
							/* JSON Equals */
							else {
								setMarker((sTmp == sValue), oMapJSON.data[i], nRanking);
							}
						}
						else { 
							/* Geocoder */
							setMarker((sTmp == sValue), oMapJSON.data[i], 0);
						}
					}
				}
			}
		
			/**
			* @function setMarker
			* @description Add a single marker
			* @memberof! gmap
			* @param {boolean} bSetMarker
			* @param {Object} oJSON
			* @param {number} [nRanking]
			*/ 	
			function setMarker(bSetMarker, oJSON, nRanking) {
				if (bSetMarker) { 
					sName = byString(oJSON, oConfig.Custom.jsonMarkerName);
					if (oRanking.hasOwnProperty(sName)) {
						/* Marker Exists, don't render, but update ranking */
						oRanking[sName] = oRanking[sName] + (nRanking-0);
						return;
					}
					else {
						oRanking[sName] = (nRanking-0) || 0;
					}
					
					bAddMarker = true;
					nIconIndex = byString(oJSON, oConfig.Custom.iconArrayKey)-0;
					if (!nIconIndex) nIconIndex = 0;
					sLat = byString(oJSON, oConfig.Custom.jsonLatitude);
					sLng = byString(oJSON, oConfig.Custom.jsonLongitude);
					sLat = parseFloat(sLat-0);
					sLng = parseFloat(sLng-0);
					if (isNaN(sLat)||isNaN(sLng)) return false;
					
					oLatLong = new google.maps.LatLng(Number(sLat), Number(sLng));
					try { sContent = template(sTemplate, "data")(oJSON); } catch(err) { console.log(err); }
					oBounds.extend(oLatLong);
					addMarker(oLatLong, sName, sContent, nIconIndex);
				}
			}

			if (bAddMarker && bFitBoundsToMarkers) {
				oMap.fitBounds(oBounds);
				setError("");
			}
			else {
				if (oConfig.Custom.jsonDistance > 0) {
					/* No Results, use optional Geocoder-search, if oConfig.Custom.jsonDistance is greater than 0 */
					var 
					/**	@type {Object} */
					geocoder = new google.maps.Geocoder();
					geocoder.geocode({"address": sValue}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK && status != google.maps.GeocoderStatus.ZERO_RESULTS) {
							if (results && results[0] && results[0].formatted_address) {
								for (i = 0; i < nLen; i++) {
									sLat = byString(oMapJSON.data[i], oConfig.Custom.jsonLatitude);
									sLng = byString(oMapJSON.data[i], oConfig.Custom.jsonLongitude);
									oLatLong = new google.maps.LatLng(Number(sLat), Number(sLng));		
									oDistance = google.maps.geometry.spherical.computeDistanceBetween(results[0].geometry.location, oLatLong);

									if (oDistance < oConfig.Custom.jsonDistance) {
										setMarker(true, oMapJSON.data[i]);
									}
								}
								if (bAddMarker)	oMap.fitBounds(oBounds);
							}
			        	} else {
							setError(oConfig.Custom.jsonErrorPrefix + "<em>" + sValue + "</em>" +oConfig.Custom.jsonErrorSuffix);
			        	}
			  		});
					setError(oConfig.Custom.jsonErrorPrefix + "<em>" + sValue + "</em>" +oConfig.Custom.jsonErrorSuffix);
				}
			}
			
			if (oConfig.Custom.markerClusterer && ("MarkerClusterer" in window)) {
				oClusterer = new MarkerClusterer(oMap, aMarkers, oConfig.Clusterer);
				google.maps.event.addListener(oClusterer, "clusterclick", function(cluster) {
					try { window._gtmEV("Cluster", "Google Maps", cluster.getMarkers().length); } catch(err) {}
	            });
			}
		}
		
		/**
		* @function setMarkersFromUserLocation
		* @description Creates markers from user location
		* @memberof! gmap
		*/ 	
		function setMarkersFromUserLocation() {
			var 
			/**	@type {number} */
			i,
			/**	@type {number} */
			nIconIndex,
			/**	@type {number} */
			nLen = oMapJSON.data.length,
			/**	@type {Object} */
			oBounds,
			/**	@type {Object} */
			oDistance,
			/**	@type {Object} */
			oJSON,
			/**	@type {Object} */
			oLatLong,
			/**	@type {Object} */
			oLoc,
			/**	@type {string} */
			sContent,
			/**	@type {string} */
			sLat,
			/**	@type {string} */
			sLng,
			/**	@type {string} */
			sName;
			
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					function(position) {
						oBounds = new google.maps.LatLngBounds();
						oLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						
						for (i = 0; i < nLen; i++) {
							oJSON = oMapJSON.data[i];
							nIconIndex = byString(oJSON, oConfig.Custom.iconArrayKey)-0;
							if (!nIconIndex) nIconIndex = 0;
							sLat = byString(oJSON, oConfig.Custom.jsonLatitude);
							sLng = byString(oJSON, oConfig.Custom.jsonLongitude);
							sName = byString(oJSON, oConfig.Custom.jsonMarkerName);
							oLatLong = new google.maps.LatLng(Number(sLat), Number(sLng));		
							oDistance = google.maps.geometry.spherical.computeDistanceBetween(oLoc, oLatLong);

							if (oDistance < oConfig.Custom.jsonDistance) {	
								try { sContent = template(sTemplate, "data")(oJSON); } catch(err) { console.log(err); }
								oBounds.extend(oLatLong);
								addMarker(oLatLong, sName, sContent, nIconIndex);
							}
						}
						oMap.fitBounds(oBounds);
						if (oConfig.Custom.markerClusterer && ("MarkerClusterer" in window)) {
							oClusterer = new MarkerClusterer(oMap, aMarkers, oConfig.Clusterer);
							google.maps.event.addListener(oClusterer, "clusterclick", function(cluster) {
							try { window._gtmEV("Cluster", "Google Maps", cluster.getMarkers().length); } catch(err) {}
			            });
					}
					}, 
					function() {
						setMarkers("", oConfig.Custom.jsonMarkerName, true, null, true);
					}
				);
			}
		}
	};
	
	/**
    * @function template
    * @description Version of John Resigs Micro-Template without "with"-block. Further info: jsperf.com/template-engines-performance-compiling-rendering
    * @memberof! xhr
    * @param {string} sTmpl Template-String
    * @param {string} sDataPrfx Data-Object-Prefix
    * @return {Function}
    */
    var template = function(sTmpl, sDataPrfx) {
    	/**	@type {Function} */
        var F =
        "var p=[];" +
        "p.push('" +
        sTmpl.replace(/[\r\t\n]/g, " ")
        .replace(/'(?=[^!--]*-->)/g, "\t")
        .split("'").join("\\'")
        .split("\t").join("'")
        .replace(/<!--#(.+?)-->/g, "',$1,'")
        .replace(/&lt;!--#(.+?)--&gt;/g, "',$1,'")
        .split("<!--").join("');")
        .split("-->").join("p.push('") + "');return p.join('');";
        return new Function(sDataPrfx, F);
    };

	/* Public Functions */
	
	/**
	* @function init
	* @description Initializes Google Map-instances
	* @memberof! gmap
	*/ 	
	var init = function() {
		var
		/**	@type {NodeList} */
		aMaps = document.querySelectorAll(".google-map"),
		/**	@type {number} */
		nLen = aMaps.length,
		oConfig = {
			Custom : {
				bGeo: false,
				iconArrayKey: "",
				jsonDistance: 0,
				jsonErrorPrefix: "",
				jsonErrorSuffix: "",
				jsonLatitude: "geo.latitude", 
				jsonLongitude: "geo.longitude",
				jsonMarkerName: "name",
				markerClusterer: true,
				markerInitial: true,
				markerZoom: false,
				sReset: "0"
			}
		},
		oCurConfig;
		
		while (nLen--) {
			oCurConfig = window[aMaps[nLen].getAttribute("data-config")] ? window[aMaps[nLen].getAttribute("data-config")]() : oConfig;
			gmap(aMaps[nLen], window[aMaps[nLen].getAttribute("data-json")], oCurConfig, document.getElementById(aMaps[nLen].getAttribute("data-template")));
		}
	};
	
	/**
	* @function svgCircle
	* @description Returns a SVG-circle in nSize and with color set in sFill
	* @memberof! gmap
	* @param {number} nSize
	* @param {string} sFill
	*/ 	
	var svgCircle = function(nSize, sFill) {
		if ("btoa" in window) return ("data:image/svg+xml;base64,"+window.btoa("<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"" + nSize + "\" viewBox=\"0 0 " + nSize + " " + nSize + "\" width=\"" + nSize + "\"><circle cx=\"" + (nSize / 2) + "\" cy=\"" + (nSize / 2) + "\" r=\"" + (nSize / 2) + "\" fill=\"" + sFill + "\"/></svg>"));
	};
		
	return {
		init		: init,
		svgCircle	: svgCircle
	};
})();