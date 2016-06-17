/**
* @function listDrag
* @description Adds drag-functionality to a list
*/ 

(function listDrag(){
	/*jshint -W069 */
	/*jshint -W083 */
	var
	/**	@type {NodeList} */
	aDrag = document.querySelectorAll("[data-draggable=\"true\"]"), 
	/**	@type {number} */
	n = aDrag.length, 
	/**	@type {Object} */
	oDrag;
	
	while (n--) {
		aDrag[n].addEventListener("mousedown", setItem, false);
		aDrag[n].addEventListener("touchstart", setItem, false);
		aDrag[n].addEventListener("mousemove", function(e){throttle(moveItem(e),500);}, false);
		aDrag[n].addEventListener("touchmove", function(e){throttle(moveItem(e),500);}, false);
		aDrag[n].addEventListener("mouseleave", dropItem, false);
		aDrag[n].addEventListener("mouseup", dropItem, false);
		aDrag[n].addEventListener("touchend", dropItem, false);
	}

	/**
	* @function setItem
	* @description Sets variable oDrag to current element
	* @param {Event} e
	*/
	function setItem(e) {
		oDrag = e.target;
		if (oDrag) oDrag.classList.add("drag");
	}

	/**
	* @function dropItem
	* @description Inserts oDrag at drop-position
	*/
	function dropItem() {
		this.parentNode.mousemove = null;
		if (oDrag) {
			oDrag.classList.remove("drag");
			oDrag = null;
		}
	}

	/**
	* @function isBefore
	* @description Detect element position
	* @param {Object} a
	* @param {Object} b
	*/	
	function isBefore(a, b) {
		/**	@type {Object} */
		var oCur;
		for (oCur = a; oCur; oCur = oCur.previousSibling) {
			if (oCur === b) { 
	    		return true;
			}
		}
		return false;		
	}

	/**
	* @function moveItem
	* @description Moves oDrag
	* @param {Event} e
	*/	
	function moveItem(e) {
		var
		/**	@type {Object} */
		oDestination;
		
		e.preventDefault();
				
		if (oDrag) {
			e = getEvent(e);
			oDestination = document.elementFromPoint(e.clientX, e.clientY);
			
			if (oDestination && (oDrag.parentNode === oDestination.parentNode)) {
				if (isBefore(oDrag, oDestination)) {
					oDestination.parentNode.insertBefore(oDrag, oDestination);
				}
				else {
					oDestination.parentNode.insertBefore(oDrag, oDestination.nextSibling);
				}
			}
		}
	}

	/**
	* @function getEvent
	* @description Returns the event or event.touches[0]
	* @param {Event} e
	* @returns {Event}
	*/	
	function getEvent(e) {
		return (e["touches"] && e.touches[0] ? e.touches[0] : e);
	}
	
	/**
	* @function throttle
	* @description Throttles multiple events, fires the events every threshhold (250ms)
	* @param {Function} fn Function to run every threshhold
	* @param {number} [threshhold] Timer
	* @param {Object} [scope] Scope of function
	*/	
	function throttle(fn, threshhold, scope) {
		threshhold = typeof threshhold !== "undefined" ? threshhold : 250;
	  	var 
	  	/**	@type {number} */
	  	last, 
	  	/**	@type {number} */
	  	deferTimer;
	  	return function () {
	    	var 
	    	/**	@type {Object} */
	    	context = scope || this,
			/**	@type {number} */
			now = +new Date(),
			/**	@type {Arguments} */
	        args = arguments;
	    	if (last && now < last + threshhold) {
	    		clearTimeout(deferTimer);
	      		deferTimer = setTimeout(function () {
	       			last = now;
	        		fn.apply(context, args);
	      		}, threshhold);
	    	} 
	    	else {
	      		last = now;
	      		fn.apply(context, args);
	    	}
	  	};
	}
})();