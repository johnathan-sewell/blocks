/**
*	fastcheck_fn.js
*	Fast checkbox/radio-button-check for touch-devices, removing the 300ms delay
*	Executes functions in data-fn attributes
*	(c)	Copyright 2015 Mads Stoumann
*/
(function (bRunFunc) { 
"use strict";
if("onorientationchange" in window && "ontouchstart" in window) {
	document.body.addEventListener("touchstart", function(e) {
	  	var 
	  	oTarget = e.target,
	  	sTarget = oTarget.nodeName.toLowerCase();
		if (sTarget === "label") window.__activeElement = oTarget;
	}, false);
	
	document.body.addEventListener("touchend", function(e) {
	  	var 
	  	oInput,
	  	oTarget, 
	  	oTouch = e.changedTouches[0];
    	oTarget = document.elementFromPoint(oTouch.clientX, oTouch.clientY);
	
		if (oTarget === window.__activeElement) oInput = document.querySelector("#" + oTarget.getAttribute("for"));
		if (oInput) {
			if (oInput["type"] === "checkbox") {
				oInput.checked = !oInput.checked;
			}
			else if (oInput["type"] === "radio") {
				/* If a radio-button should be unselectable, add attribute: data-unselect="true" */
				oInput.getAttribute("data-unselect") ? oInput.checked = !oInput.checked : oInput.checked = true;
			}
			e.stopPropagation();
			e.preventDefault();
			if (bRunFunc) getFunc(oTarget), getFunc(oInput);
		}
	}, false);
	
	var getFunc = function(oElm) {
		var
		aFunc,
		aFuncPar,
		aParam,
		i,
		oFunc,
		sFunc = (oElm && oElm.getAttribute("data-fn")),
		sFuncPar;
		
		if (sFunc && !oElm.getAttribute("data-tp")) {
            aFunc = sFunc.split("+");
            sFuncPar = oElm.getAttribute("data-pr");
            aFuncPar = sFuncPar ? sFuncPar.split("+") : [];

            for (i = 0; i < aFunc.length; i++) {
                aParam = aFuncPar[i] ? aFuncPar[i].split("|") : [];
                aParam.push(oElm);
                oFunc = getScope(aFunc[i]);
                aParam.unshift(oElm);
                oFunc.apply(oElm, aParam);
            }
        }
	};
	
	var getScope = function (sFunc) {
		var
		aFunc = sFunc.split("."),
		i,
		oFunc = window[aFunc[0]],
		nLen = aFunc.length;
	
		if (nLen) for (i = 1; i < nLen; i++) oFunc = oFunc[aFunc[i]];
		if (typeof oFunc === "function") return oFunc;
	};
}
})(true);