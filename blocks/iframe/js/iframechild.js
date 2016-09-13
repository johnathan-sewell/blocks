/**
* @function iframeChild
* @description Posts calaculated height to parent-page, when request-message is recieved
* @author Mads Stoumann
* @param {string} sURL The URL to communicate with, defaults to "*" (ALL)
*/
(function iframeChild(sURL) {
	/*jslint browser: true*/
    "use strict";
	
	/**	@type {number} */
	var nInit = 0 + (document.documentElement.scrollHeight - document.body.scrollHeight);

	/**
	* @function postHeight
	* @description Posts a message to the parent-page
	*/
	function postHeight() {
		parent.postMessage(document.body.scrollHeight + nInit, sURL);
	}
	
	window.addEventListener("message", postHeight, false);
	
	/* Send initial height, without waiting for a request */
	postHeight();
})("*");