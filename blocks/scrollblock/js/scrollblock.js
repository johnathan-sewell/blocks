/**
* @function scrollHelper
* @description Adds scroll-animations to scroll-block
*/ 

(function scrollHelper(){
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
		oElm = (oElm ? oElm : document.documentElement.scrollTop ? document.documentElement : document.body);
    	fnEasing = fnEasing || function(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; };
    	var
    	/**	@type {number} */
   		nStart = Date.now(),
   		/**	@type {number} */
    	nFrom = bDirTop ? oElm.scrollTop : oElm.scrollLeft;
    	
    	if (nFrom === nDest) return;
    	function _min(a, b) { return a < b ? a : b; }

    	function _scroll() {
    		var
    		/**	@type {number} */
	        nCurTime = Date.now(),
	        /**	@type {number} */
	        nTime = _min(1, ((nCurTime - nStart) / nDuration)),
	        /**	@type {number} */
	        nEasedTime = fnEasing(nTime);

    		if (bDirTop) {
    			oElm.scrollTop = (nEasedTime * (nDest - nFrom)) + nFrom;
    		}
    		else {
    			oElm.scrollLeft = (nEasedTime * (nDest - nFrom)) + nFrom;
    		}

    		if (nTime < 1) requestAnimationFrame(_scroll);
    	}
    	window.requestAnimationFrame(_scroll);
	}

	/**
	* @function setScroll
	* @description Set scroll-position
	*/				
	function setScroll() {
		var
		/**	@type {boolean} */
		bDir = (this.classList.contains("scrollblock-prev") ? 0 : 1),
		/**	@type {Object} */
		oScroll = this.parentNode.querySelector(".scrollblock-inner");
		
		if (oScroll) {
			if (bDir) {
				scrollToElm(oScroll, false, oScroll.scrollLeft + this.parentNode.offsetWidth, 1000);
			}
			else {
				scrollToElm(oScroll, false, oScroll.scrollLeft - this.parentNode.offsetWidth, 1000);
			}
		}
	}
	
	var
	/**	@type {NodeList} */
	aScroll = document.querySelectorAll(".scrollblock-next, .scrollblock-prev"), 
	/**	@type {number} */
	n = aScroll.length;
	while (n--) aScroll[n].addEventListener("click", setScroll, false);
})();		