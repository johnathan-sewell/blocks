/**
* @function foldoutVideo
* @description Adds hashchange-listener and enabled video-playback
*/ 
(function foldoutVideo(){
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
			window["__video-playing"].src = "";
			window["__video-playing"] = "";
		}	
	}
	
	var
	/**	@type {NodeList} */
	aFrames = document.getElementsByTagName("iframe"),
	/**	@type {number} */
	n = aFrames.length;
	
	while (n--) {
		if (~aFrames[n].src.indexOf("ooyala")) aFrames[n].setAttribute("data-src", aFrames[n].src + "&options[autoplay]=true");
		if (~aFrames[n].src.indexOf("vimeo")) aFrames[n].setAttribute("data-src", aFrames[n].src + "?autoplay=1");
		if (~aFrames[n].src.indexOf("youku")) aFrames[n].setAttribute("data-src", aFrames[n].src + "&autoplay=1");
		if (~aFrames[n].src.indexOf("youtube")) aFrames[n].setAttribute("data-src", aFrames[n].src + "&autoplay=1");
	}
	window.addEventListener("hashchange", playVideo, false);
	window["__video-playing"] = "";
	playVideo();
})();