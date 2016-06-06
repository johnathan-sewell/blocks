/**
* @function addAccessKeys
* @description Adds <u>-elements around a text-selection, based on the elements' accesskey-attribute.
*/ 
(function addAccessKeys() {
	var
	/**	@type {NodeList} */
	aLbl = document.querySelectorAll("[accesskey]"), n = aLbl.length;
	while (n--) aLbl[n].innerHTML = setAccessKey(aLbl[n].innerText, aLbl[n].getAttribute("accesskey"));

	/**
	* @function setAccessKey
	* @description RegExp to find accesskey-text in a text-string
	* @param {string} sLabel
	* @param {string} sAccKey
	*/ 
	function setAccessKey(sLabel, sAccKey) {
		return sLabel.replace(new RegExp("("+sAccKey+")", "i"), "<u>$1</u>");
	}
})();