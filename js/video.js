(function() {
	var aVideo = document.querySelectorAll(".video-poster");
	aVideo.forEach(function(oVideo, nIdx){
		aVideo[nIdx].addEventListener("click", playVideo, false);	
	});
	
	function playVideo() {
		var oVideo = this.parentNode.querySelector(".video-content");
		if (oVideo && oVideo.src) {
			oVideo.src += "&autoplay=1";
			this.classList.add("hide");
		}
	}
})();