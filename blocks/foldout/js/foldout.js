/**
* @function foldout
* @description Adds hashchange-listener, replace history state, auto video-playback
*/ 
(function foldout(){
	/*jshint bitwise: false*/

	/**
	* @function handleState
	* @description Handles history state
	* @param {Object} oLink
	*/		
	function handleState(oLink) {
		var 
		/**	@type {Object} */
		oElm = document.getElementById(window.location.hash.substr(1)),
		/**	@type {Object} */
		oVideo;
		
		if (oElm) {
			oElm.classList.remove("foldout-block-target");
			if (window["__video-playing"]) {
				window["__video-playing"].contentWindow.location.replace(window["__video-playing"].getAttribute("data-load-src") || "");
				window["__video-playing"] = "";
			}
		}
	
		if (oLink && ~oLink.href.indexOf("#")) oElm = document.getElementById(oLink.href.split("#")[1]);
		
		if (oElm) {
			oElm.classList.add("foldout-block-target");	
			var nDest = oElm.getBoundingClientRect().top;
			if (nDest) scrollToElm(null, true, nDest, 1000);
			
			if (oElm.getAttribute("data-has-video")) {
				oVideo = oElm.querySelector("iframe");
				if (oVideo) {
					window["__video-playing"] = oVideo;
					oVideo.contentWindow.location.replace(oVideo.getAttribute("data-src"));
				}
			}
		}
		window.history.replaceState({}, "", (oLink ? oLink.href : (window.location.hash || "#")));
	}

	/**
	* @function scrollToElm
	* @description Animated scroll to oElm

	* @param {Object} oElm
	* @param {boolean} bDirTop
	* @param {number} nDest
	* @param {number} nDuration
	* @param {Function} [fnEasing]
	*/	
	function scrollToElm(oElm, bDirTop, nDest, nDuration, fnEasing) {
    	fnEasing = fnEasing || function(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; };
    	var
    	/**	@type {number} */
   		nStart = Date.now(),
   		/**	@type {number} */
    	nFrom;
    	
    	if (oElm) {
    		nFrom = (bDirTop ? oElm.scrollTop : oElm.scrollLeft);
    	}
    	else {
    		nFrom = (bDirTop ? (document.body.scrollTop || (document.documentElement && document.documentElement.scrollTop)) : (document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft)));
    	}
    	
    	if (nFrom === nDest) return;
    	function _min(a, b) { return a < b ? a : b; }

    	function _scroll() {
    		var
    		/**	@type {number} */
	        nCurTime = Date.now(),
	        /**	@type {number} */
	        nTime = _min(1, ((nCurTime - nStart) / nDuration)),
	        /**	@type {number} */
	        nEasedTime = fnEasing(nTime),
	        /**	@type {number} */
	        nScroll = (nEasedTime * (nDest - nFrom)) + nFrom;
			
    		if (bDirTop) {
    			if (oElm) {
    				oElm.scrollTop = nScroll;
    			}
    			else {
    				document.body.scrollTop = nScroll;
    				document.documentElement.scrollTop = nScroll;
    			}
    		}
    		else {
    			if (oElm) {
    				oElm.scrollLeft = nScroll;
    			}
    			else {
     				document.body.scrollLeft = nScroll;
    				document.documentElement.scrollLeft = nScroll;   				
    			}
    		}
    		if (nTime < 1) requestAnimationFrame(_scroll);
    	}
    	window.requestAnimationFrame(_scroll);
	}

	var
	/**	@type {NodeList} */
	aFrames = document.getElementsByTagName("iframe"),
	/**	@type {NodeList} */
	aLinks = document.getElementsByTagName("a"),
	/**	@type {number} */
	l = aLinks.length,
	/**	@type {number} */
	n = aFrames.length;
	
	while (n--) aFrames[n].setAttribute("data-load-src", aFrames[n].src);
	while (l--) aLinks[l].addEventListener("click", function(event) { event.preventDefault(); handleState(this); }, false);
	window["__video-playing"] = "";
	handleState();
})();