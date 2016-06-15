/**
* @function foldoutVideo
* @description Adds hashchange-listener and enabled video-playback
*/ 
(function foldoutVideo(sLoadSrc){
	/*jshint bitwise: false*/
	
	/**
	* @function playVideo
	* @description Updates an iframe's src to include autoplay-functionality
	*/ 
	function playVideo(){
		var 
		/**	@type {Object} */
		oElm = document.getElementById(window.location.hash.substr(1)),
		/**	@type {Object} */
		oVideo;
		
		if (oElm && oElm.getAttribute("data-has-video")) {
			oVideo = oElm.querySelector("iframe");
			if (oVideo) {
				stopVideo();
				window["__video-playing"] = oVideo;
				oVideo.src = oVideo.getAttribute("data-src");
			}
		}
		else { stopVideo(); }
	}
	
	/**
	* @function stopVideo
	* @description Updates an iframe's src to a default page or empty string
	*/	
	function stopVideo(){
		if (window["__video-playing"]) {
			window["__video-playing"].src = (window["__video-playing"].getAttribute("data-load-src") || "");
			window["__video-playing"] = "";
		}	
	}
	
	var
	/**	@type {NodeList} */
	aFrames = document.getElementsByTagName("iframe"),
	/**	@type {number} */
	n = aFrames.length;
	
	while (n--) aFrames[n].setAttribute("data-load-src", aFrames[n].src);
	window.addEventListener("hashchange", playVideo, false);
	window["__video-playing"] = "";
	playVideo();
	
})();