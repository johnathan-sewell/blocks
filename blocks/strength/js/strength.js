/**
* @function loadStrength
* @description Adds strength-meters to password-inputs
*/
(function loadStrength(){
	var
	/**	@type {NodeList} */
	aMeters = document.querySelectorAll("[data-meter=\"true\"]"),
	/**	@type {number} */
	n = aMeters.length;
	
	while (n--) aMeters[n].querySelector("[type=\"password\"]").addEventListener("input", checkStrength, false);
	
	/**
	* @function checkStrength
	* @description Checks the strength of a password
	*/ 	
	function checkStrength() {
		var
		/**	@type {Array} */
		aScore = this.getAttribute("data-meter-strength").split(","),
		/**	@type {number} */
		nScore = 0,
		/**	@type {Object} */
		oMeter = this.parentNode.querySelector(".form-meter"),
		/**	@type {Object} */
		oMeterText = this.parentNode.querySelector(".form-meter-text"),
		/**	@type {string} */
		sMeterText = this.getAttribute("data-meter-text"),
		/**	@type {string} */
		sValue = this.value;
		
		if (oMeter && oMeterText && sValue) {
			if (sValue.length > 6) nScore++;
			if ((sValue.match(/[a-z]/)) && (sValue.match(/[A-Z]/))) nScore++;	
			if (sValue.match(/\d+/)) nScore++;
			if (sValue.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) nScore++;
			oMeter.value = nScore;
			oMeterText.innerText = nScore ? aScore[nScore-1] + (nScore < 4 ? ": " + sMeterText : "") : "";
		}
	}
})();