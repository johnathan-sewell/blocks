/**
* @function socialShare
* @description Adds tracking and completes social-urls with current location
*/ 

(function socialShare(){
	var 
	/**	@type {NodeList} */
	aSoc = document.querySelectorAll("[data-social-action]"), 
	/**	@type {number} */
	i = aSoc.length;
	
	while (i--) {
		aSoc[i].href = aSoc[i].href + window.location;
		aSoc[i].addEventListener("click", shareLink, false);
	}
	
	/**
	* @function shareLink
	* @description Pushes sharing info to GTM's dataLayer
	*/ 	
	function shareLink() {
		try {
			dataLayer.push({
				"event": "socialInt", 
				"socialNetwork": this.title, 
				"socialAction": this.getAttribute("data-social-action"), 
				"socialTarget": window.location
			});
		}
		catch(err) {}	
	}
})();