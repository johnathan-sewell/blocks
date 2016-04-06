/**
*	radial.js
*	Animated Radial Progress-indicator
*	(c)	Copyright 2015 Mads Stoumann
*/
function radial(aCircles, oTextCounter) {
	var
	aSum = [],
	i,
	nCurVal,
	nLen = aCircles.length,
	nRadius = (90 * Math.PI) * 2,
	nStep,
	nVal = 0;
	
	for (i = 0; i < nLen; i++) {
		aCircles[i].style.strokeDashoffset = nRadius;
		aCircles[i].style.strokeDasharray = nRadius;
		nVal += aCircles[i].getAttribute("data-val")-0;
		aSum.push(nRadius - ((nRadius / 100) * nVal));
	}
	
	aSum.reverse();
	nStep = ((nRadius - ((nRadius / 100) * nVal)) / (100-nVal));
	
	function _animate() {
		nCurVal = oTextCounter.innerHTML-0;
		if (nCurVal < nVal) {
			nCurVal++;
			for (i = nLen; i--;) {
				if (aSum[i] <= (nRadius - (nCurVal * nStep) + nStep)) {
					aCircles[i].style.strokeDashoffset = nRadius - (nCurVal * nStep); 
				}
			}
			oTextCounter.innerHTML = nCurVal;
			window.requestAnimationFrame(_animate);
		} 
	}
	window.requestAnimationFrame(_animate);
}