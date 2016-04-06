(function() {
	var
	oLbl = document.querySelectorAll("[accesskey]"), n = oLbl.length;
	while (n--) oLbl[n].innerHTML = setAccessKey(oLbl[n].innerHTML, oLbl[n].getAttribute("accesskey"));

	function setAccessKey(sLabel, sAccKey) {
		return sLabel.replace(new RegExp("("+sAccKey+")", "i"), "<u>$1</u>")
	}
})();