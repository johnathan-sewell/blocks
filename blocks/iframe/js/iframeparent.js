/**
* @function iframeParent
* @description Adds resize-event handler and postMessage-handler for iframe
* @author Mads Stoumann
* @param {Object} oFrame The iframe to communicate with
*/ 
(function iframeParent(oFrame){
	/*jslint browser: true*/
	"use strict";
	
	/**	@type {boolean} */
	var bRunning = false;

	/**
	* @function resize
	* @description Use requestAnimationFrame to throttle resize-events
	*/		
	function resize(){ 
		if (!bRunning) {
			bRunning = true;
			/* Use requestanimationFrame if supported, fallback to setTimeout */
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(postMsg);
			}
			else {
				setTimeout(postMsg, 66);
			}
		}
	}

	/**
	* @function postMsg
	* @description Posts a message to the iframe
	*/		
	function postMsg(){
		oFrame.contentWindow.postMessage(1, "*");
		bRunning = false;
	}
	
	window.addEventListener("resize", resize, false);
	window.addEventListener("message", function(e) {
		/* Sets the height of the iframe, based on return event-data */
		if (oFrame && e.data && (e.data-0) > 1) oFrame.style.height = (e.data-0) + "px";
	}, false);
	
})(document.querySelector("iframe"));