/**
* @function scrollHelper
* @description Adds scroll-animations to scroll-block
*/ 
(function navScroll(sNavInner, sFixed, sSection, sLinkClass, sSummary, sSummaryOpen, sContent){
	"use strict";
	
	/**
	* @function calcPos
	* @description Calculate element positions
	*/	
	function calcPos(){
		var
		/**	@type {Array} */
		aSections = document.querySelectorAll(sSection),
		/**	@type {number} */
		i,
		/**	@type {number} */
		nNavWidth = oContent.getBoundingClientRect().width,
		/**	@type {number} */
		nPosTop	= document.body.scrollTop || document.documentElement.scrollTop,
		/**	@type {Object} */
		oRect;
		
		aScroll = [];
		nNavWidth = (nNavWidth / 75) * 25;
		nLen = aSections.length;
		
		oInner.style.width = (window.innerWidth > 640) ? nNavWidth + "px" : "100%";
		
		for (i = 0; i < nLen; i++) {
			oRect = aSections[i].getBoundingClientRect();
			aScroll.push({
				"elm": aSections[i],
				"arr": {top: (oRect.top + nPosTop), bottom: (oRect.bottom + nPosTop)},
				"lnk": document.querySelector("[href=\"#" + aSections[i].id + "\"]")
			});
		}
	}

	/**
	* @function setPos
	* @description Set element positions
	*/		
	function setPos(){
		var 
		/**	@type {boolean} */
		bIsVisible = false,
		/**	@type {number} */
		i,
		/**	@type {number} */
		nPosTop	= (document.body.scrollTop || document.documentElement.scrollTop);
		oInner.classList.toggle(sFixed, (nPosTop >= aScroll[0].arr.top));
	
		for (i = 0; i < nLen; i++) {
			aScroll[i].lnk.classList.remove(sLinkClass);
			bIsVisible = (aScroll[i].arr.bottom >= nPosTop) && (aScroll[i].arr.top <= nPosTop);
			if (bIsVisible) aScroll[i].lnk.classList.add(sLinkClass);
		}
	}
	
	/**
	* @function throttle
	* @description Throttles multiple events, fires the events every threshhold (250ms)
	* @param {Function} fn Function to run every threshhold
	* @param {number} [threshhold] Timer
	* @param {Object} [scope] Scope of function
	*/
	function throttle(fn, threshhold, scope) {
		threshhold = typeof threshhold !== "undefined" ? threshhold : 250;
	  	var 
	  	/**	@type {number} */
	  	last, 
	  	/**	@type {number} */
	  	deferTimer;
	  	return function () {
	    	var 
	    	/**	@type {Object} */
	    	context = scope || this,
			/**	@type {number} */
			now = +new Date(),
			/**	@type {Arguments} */
	        args = arguments;
	    	if (last && now < last + threshhold) {
	    		clearTimeout(deferTimer);
	      		deferTimer = setTimeout(function () {
	       			last = now;
	        		fn.apply(context, args);
	      		}, threshhold);
	    	} 
	    	else {
	      		last = now;
	      		fn.apply(context, args);
	    	}
	  	};
	}
	
	window.addEventListener("hashchange", function(){
		oSummary.click();
	}, false);
	
	window.addEventListener("resize", throttle(function() {
		calcPos();
		setPos();	
	}, 150));
	
	window.addEventListener("scroll", throttle(function() {
		setPos();	
	}, 150));
	
	var
	/**	@type {Array} */
	aScroll = [],
	/**	@type {number} */
	nLen = 0,
	/**	@type {Object} */
	oContent = document.querySelector(sContent),
	/**	@type {Object} */
	oInner = document.querySelector(sNavInner),
	/**	@type {Object} */
	oSummary = document.querySelector(sSummary);
	
	oSummary.addEventListener("click", function(){ this.classList.toggle(sSummaryOpen); }, false);
	
	calcPos();
	setPos();
	
})(".navlink__inner", "navlink__inner--fixed", ".navlink__section", "navlink__link--active", ".navlink__summary", "navlink__summary--open", ".navlink__content");