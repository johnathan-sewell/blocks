(function() {
	var aSelect = document.querySelectorAll(".select");
	
	aSelect.forEach(function(oSelect, nIdx) {
		var
		oChecked = oSelect.querySelector(".select-panel .state:checked");
		if (oChecked) oChecked = oSelect.querySelector("[for=\"" + oChecked.id + "\"]");
		if (oChecked) setSelected(oSelect, oChecked.innerHTML);
		
		oSelect.addEventListener("click", function(e) {
			if (e.target.classList.contains("select-option")) setSelected(oSelect, e.target.innerText);
		}, false);
	});
	
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