(function rangeHelper(){
	/*jshint loopfunc: true */
	var 
	aSliders = document.querySelectorAll("input[type=range]"),
	i,
	n = aSliders.length;
	
	function linGradient(nVal, sColorBg, sColorVal) {
		return "linear-gradient(to right, " + sColorVal + " 0%, " + sColorVal + " " + nVal + "%, " + sColorBg + " " + nVal + "%, " + sColorBg + " 100%)";
	}
	
	function setRange() {
		var 
		sColorBg = window.getComputedStyle(this, null).getPropertyValue("background-color"),
		sColorVal = window.getComputedStyle(this, null).getPropertyValue("color");	
		this.style.backgroundImage = linGradient(this.value, sColorBg, sColorVal);
	}
	
	/* Internet Explorer */
	if (window.ActiveXObject || "ActiveXObject" in window) { 
		for (i = 0; i < n; i++) {
			aSliders[i].style.height = "auto";
			aSliders[i].style.background = "none";
		}
	}
	else
	{
		for (i = 0; i < n; i++) {
			setRange.call(aSliders[i]);
			aSliders[i].addEventListener("input", function() { this.setAttribute("value", this.value); setRange.call(this); });
		}
	}
})();