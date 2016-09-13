/**
* @function imageMap
* @description Adds click-handlers to a-tags in imageMap-Object
* @param {string} sSelector
* @param {string} sClass
*/
(function imageMap(sSelector, sCls) {
	/*jslint browser: true*/
	
	var 
	/**	@type {NodeList} */
	aIMLinks = document.querySelectorAll(sSelector), 
	/**	@type {number} */
	n = aIMLinks.length,
	/**	@type {Object} */
	oElm;
	
	// Init
	while (n--) aIMLinks[n].addEventListener("click", setActive, false);
	
	if (document.location.hash) {
		oElm = document.querySelector("[*|href=\"" + document.location.hash + "\"]");
		if (oElm) setActive.call(oElm);
	}
	
	/**
	* @function setActive
	* @description Adds class to selected link
	*/
	function setActive() { 
		/* Fix for macOS and iOS */ 
		window.location.hash = this.getAttribute("xlink:href");
		remActive(this.parentNode);
		this.classList.add(sCls); 
	}

	/**
	* @function remActive
	* @description Removes selected-classes from links
	* @param {Object} oElm Parent-Object
	*/	
	function remActive(oElm) { 
		var 
		/**	@type {Object} */
		oAct = oElm.querySelector("." + sCls); 
		if (oAct) oAct.classList.remove(sCls); 
	}	
}) (".imagemap > svg a", "imagemap__link--selected");