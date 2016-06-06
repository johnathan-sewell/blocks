/**
* @function xrayHelper
* @description Adds touch- and mouse-logic to an X-Ray-control
*/ 

(function xrayHelper(){
	/*jshint -W069 */
	var 
	/**	@type {NodeList} */
	aXray = document.querySelectorAll(".xray"), 
	/**	@type {number} */
	i, 
	/**	@type {number} */
	nLen = aXray.length;
	
	for (i = 0; i < nLen; i++) {
		aXray[i].addEventListener("mousemove", xrayPos, false);
		aXray[i].addEventListener("touchmove", xrayPos, false);
		setElm(aXray[i]);
	}
	
	window.addEventListener("resize", resize, false);

	/**
	* @function resize
	* @description Recalculate positions on resize
	*/ 		
	function resize() {
		for (i = 0; i < nLen; i++) setElm(aXray[i]);
	}

	/**
	* @function setElm
	* @description Initialize, calc positions
	* @param {Object} O
	*/ 	
	function setElm(O) {
		O["__bounds"] = O.getBoundingClientRect();
		O["__divider"] = O.querySelector(".xray-divider");
		O["__front"] = O.querySelector(".xray-front");
	}

	/**
	* @function xrayPos
	* @description Sets image and divider positions
	* @param {Event} e
	*/ 	
	function xrayPos(e) {
		var 
		/**	@type {number} */
		posX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
		if (posX > this.__bounds.left && (posX - this.__bounds.left) <= (this.offsetWidth - this.__divider.offsetWidth)) {
			this.__divider.style.left = (posX - this.__bounds.left) / (this.offsetWidth / 100) + "%";
			this.__front.style.width = (posX - this.__bounds.left) / (this.offsetWidth / 100) + "%";
		}
	}
})();