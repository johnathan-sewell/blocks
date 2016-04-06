/**
*	rotate.js
*	Auto-rotates child-elements of a given parent
*	(c)	Copyright 2016 Mads Stoumann
*/
function rotate(oParent) {
	var 
	aElm = oParent.children,
	nLen = aElm.length,
	nTime = oParent.getAttribute("data-interval")-0 || 4000,
	sClass = oParent.getAttribute("data-animate-class") || "rotate-js-inner";
			
	function animate(aElm, nLen, nPos, sClass) {
		var
		i,
		nCur = (nPos + 1) % nLen;
		for (i = 0; i < nLen; i++) {
			aElm[nPos].classList.remove(sClass);
			aElm[nCur].classList.add(sClass);
		}
		setTimeout(function() { animate(aElm, nLen, nCur, sClass); }, nTime);
	}
	if (nLen) animate(aElm, nLen, nLen-1, sClass);
}