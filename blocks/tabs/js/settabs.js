(function() {
	/* If using micro.js or fn.js, use getUriKey-function from there */
	var getUriKey = function(sKey, sKeySeparator, sURI) {
		sURI = sURI	|| window.location.href;
		sKeySeparator = sKeySeparator || "=";
		sKey = sKey && sKey.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var	
		sRgx = "[\\!#?&]" + sKey + sKeySeparator + "([^&#]*)",
		aResults = new RegExp(sRgx).exec(sURI);
		return aResults	===	null ? "" : decodeURIComponent(aResults[1]);
	};
	var
	aTabs = getUriKey("tabs", "=", location.hash), n = 0;
	if (aTabs) aTabs = aTabs.split("-"), n = aTabs.length;
	for (;n--;) document.getElementById(aTabs[n]).checked = true;
})();