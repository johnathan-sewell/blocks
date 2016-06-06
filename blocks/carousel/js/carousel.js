/**
*	carousel.js
*	Lightweight scroller for image-galleries / carousels
*	(c)	Copyright 2015 Mads Stoumann
*/

function carousel(oElm, aNav, oArrLeft, oArrRight, nSlideWidth) {
	var
	i,
	nCur = 0,
	nLen = aNav.length,
	nPosX,
	nWidth;
	
	function _init() {
		nWidth = oElm.offsetWidth;
		nWidth = (nWidth < nSlideWidth) ? nWidth: nSlideWidth;
		aNav[nCur].click();
	}
	
	function _nav(bDir) {
		if (bDir) {
			nCur--; if (nCur < 0) nCur = 0;
		}
		else {
			nCur++; if (nCur >= nLen) nCur = (nLen - 1);
		}
		aNav[nCur].click();
	}
	
	function _setSlide(panelID) {
		try { _scrollAnim(oElm, false, (nWidth * panelID), 400, oEasing.easeInOutQuad);	}
		catch(err){	oElm.scrollTo(nWidth * panelID, 0);	}
		nCur = panelID;
	}	
	
	/* Add Event Listeners */
	window.addEventListener("resize", _init, false);

	for (i = nLen; i--;) {
		aNav[i].addEventListener("click", function() { _setSlide(this.getAttribute("data-slide") - 0); });
		if (aNav[i].checked) nCur = i;
	}

	oArrLeft.addEventListener("click", function() { _nav(true); });
	oArrRight.addEventListener("click", function() { _nav(false); });

	oElm.addEventListener("touchstart", function(e) {
		nPosX = e.changedTouches[0].pageX;
	});

	oElm.addEventListener("touchend", function(e) {
		var nDist = e.changedTouches[0].pageX - nPosX;
		if (nDist < -50) _nav(false);
		if (nDist > 50) _nav(true);
	});
	_init();
}

/**
*	_scrollAnim
*/
var _scrollAnim = function (oElm, bDirTop, nDest, nDuration, fnEasing, fnCallBack) {
	oElm = (oElm ? oElm : document.documentElement.scrollTop ? document.documentElement : document.body);
	var
	nStart = Date.now(),
	nFrom = bDirTop ? oElm.scrollTop : oElm.scrollLeft;

	if (nFrom === nDest) return;
	function _min(a, b) { return a < b ? a : b; }

	function _scroll() {
		var
        nCurTime = Date.now(),
        nTime = _min(1, ((nCurTime - nStart) / nDuration)),
        nEasedTime = fnEasing(nTime);

		if (bDirTop) {
			oElm.scrollTop = (nEasedTime * (nDest - nFrom)) + nFrom;
		}
		else {
			oElm.scrollLeft = (nEasedTime * (nDest - nFrom)) + nFrom;
		}

		if (nTime < 1) {
			requestAnimationFrame(_scroll);
		}
		else {
			if (fnCallBack) fnCallBack();
		}
	}
	window.requestAnimationFrame(_scroll);
};

var oEasing = {
	/* Easing Equations from: gizma.com/easing/ + gist.github.com/gre/1650294 */
	easeInOutQuad: function (t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; }
};