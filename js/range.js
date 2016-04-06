(function (){
	function setRange() {
		var 
		sColorBg = window.getComputedStyle(this, null).getPropertyValue("background-color"),
		sColorVal = window.getComputedStyle(this, null).getPropertyValue("color");	
		this.style.backgroundImage = linGradient(this.value, sColorBg, sColorVal);
	}

	function linGradient(nVal, sColorBg, sColorVal) {
		return "linear-gradient(to right, " + sColorVal + " 0%, " + sColorVal + " " + nVal + "%, " + sColorBg + " " + nVal + "%, " + sColorBg + " 100%)"	
	}

	var 
	aSliders = document.querySelectorAll(".form-range"),
	i = aSliders.length;
	
	while (i--) {
		setRange.call(aSliders[i]); /* Set initial value */
		aSliders[i].addEventListener("input", function() { this.setAttribute("value", this.value); setRange.call(this); }, false);
	}
})()