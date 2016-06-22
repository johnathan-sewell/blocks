(function() {
	var 
	aSelect = document.querySelectorAll(".select"),
	n = aSelect.length,
	oChecked;
	
	while (n--) {
		oChecked = aSelect[n].querySelector(".select-panel .state:checked");
		if (oChecked) oChecked = aSelect[n].querySelector("[for=\"" + oChecked.id + "\"]");
		if (oChecked) setSelected(aSelect[n], oChecked.innerHTML);
		
		aSelect[n].addEventListener("click", function(e) {
			if (e.target.classList.contains("select-option")) setSelected(this, e.target.innerText);
		}, false);
	}
	
	function setSelected(oSelect, sOptionText) {
		var 
		oCheck = oSelect.querySelector("[type=\"checkbox\"]"),
		oOption = oSelect.querySelector(".select-label-option");
		if (oCheck && oOption) {
			oOption.innerText = sOptionText;
			oCheck.checked = false;
		}	
	}
})();