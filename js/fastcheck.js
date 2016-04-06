/**
*	fastcheck.js
*	Fast checkbox/radio-button-check for touch-devices, removing the 300ms delay
*	(c)	Copyright 2015 Mads Stoumann
*/
(function () {
"use strict";
if("onorientationchange" in window && "ontouchstart" in window) {
	document.body.addEventListener("touchstart", function(e) {
	  	var 
	  	oTarget = e.target,
	  	sTarget = oTarget.nodeName.toLowerCase();
		if (sTarget === "label") window.__activeElement = oTarget;
	}, false);
	
	document.body.addEventListener("touchend", function(e) {
	  	var 
	  	oInput,
	  	oTarget, 
	  	oTouch = e.changedTouches[0];
    	oTarget = document.elementFromPoint(oTouch.clientX, oTouch.clientY);
	
		if (oTarget === window.__activeElement) oInput = document.querySelector("#" + oTarget.getAttribute("for"));
		if (oInput) {
			if (oInput["type"] === "checkbox") {
				oInput.checked = !oInput.checked;
			}
			else if (oInput["type"] === "radio") {
				/* If a radio-button should be unselectable, add attribute: data-unselect="true" */
				oInput.getAttribute("data-unselect") ? oInput.checked = !oInput.checked : oInput.checked = true;
			}
			e.stopPropagation();
			e.preventDefault();
		}
	}, false);
}
})();