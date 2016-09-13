/**
* @function coverFlow
* @description Adds coverflow to images within nav, inspired by CodePen by Hjörtur Elvar Hilmarsson
* @param {Object} oWrapper Navigation element, containing images
* @param {string} sImgSelector CSS-selector for images within wrapper
* @param {string} sNextSelector CSS-selector for "Next"-element within wrapper
* @param {string} sPrevSelector CSS-selector for "Prev"-element within wrapper
* @param {string} sActiveCls CSS-selector for active image
* @param {string} sHideCls Class for hiding navigation-items
* @param {number} nZndx Offset z-index
*/
(function coverFlow(oWrapper, sImgSelector, sNextSelector, sPrevSelector, sActiveCls, sHideCls, nZndx) {
	"use strict";
	
    var
    /**	@type {Array} */
    aImg = Array.prototype.slice.call(oWrapper.querySelectorAll(sImgSelector)),
    /**	@type {number} */
    i,
    /**	@type {number} */
    nDst = 85, /* Touch distance when swiping */
    /**	@type {number} */
    nLen = aImg.length,
    /**	@type {number} */
    nCur = Math.floor(nLen / 2),
    /**	@type {number} */
    nPosX,
    /**	@type {Object} */
    oNext = oWrapper.querySelector(sNextSelector),
    /**	@type {Object} */
    oPrev = oWrapper.querySelector(sPrevSelector),
    
    /**	@type {number} */
    OFFSET = 70,
    /**	@type {number} */
    ROTATION = 45;

	/**
	* @function gotoImg
	* @description Selects an image by click
	*/	
	function gotoImg(bLeft) {
		nCur = this.getAttribute("data-index")-0;
		render(nCur);
	}

	/**
	* @function move
	* @description Moves either left or right
	* @param {boolean} bleft Direction
	*/	
	function move(bLeft) {
		if (bLeft) {
			nCur--;
			if (nCur < 0) nCur = 0;
			render(nCur);
		}
		else {
			nCur++;
			if (nCur >= nLen) nCur = (nLen - 1);
			render(nCur);
		}
	}
	
	/**
	* @function render
	* @description Sets active slide, calculates transforms of all
	* @param {number} nIdx Active slide
	*/		
	function render(nIdx) {
		for(i = 0; i < nLen; i++) {
			var
			/**	@type {Object} */
			oElm = aImg[i].parentNode;
			aImg[i].classList.remove(sActiveCls);
			
			/* Before */
			if (i < nIdx) {
				oElm.style.transform = "translateX(-" + (OFFSET * (nIdx-i)) + "%) rotateY(" + ROTATION + "deg)";
				oElm.style.zIndex = nZndx + i;  
			} 
			
			/* Active */
			if (i === nIdx) {
				oElm.style.transform = "rotateY(0deg) translateZ(140px)";
				oElm.style.zIndex = nZndx + nLen;
				aImg[i].classList.add(sActiveCls);
			}
			
			/* After */
			if (i > nIdx) {
				oElm.style.transform = "translateX(" + (OFFSET * (i-nIdx)) +"% ) rotateY(-" + ROTATION + "deg)";
				oElm.style.zIndex = nZndx + (nLen - i);
			}
		}
		oNext.classList.toggle(sHideCls, (nCur === (nLen -1)));
		oPrev.classList.toggle(sHideCls, (nCur === 0));		
	}

	/* Add eventListeners */

	for(i = 0; i < nLen; i++) {
		aImg[i].setAttribute("data-index", i);
		aImg[i].addEventListener("click", gotoImg, false);
	}
	
	oNext.addEventListener("click", function() { move(false); }, false);
	oPrev.addEventListener("click", function() { move(true); }, false);
	
	oWrapper.addEventListener("touchmove", function(e) {
		var 
		/**	@type {number} */
		nCurPos = e.changedTouches[0].pageX;
		if (nCurPos < (nPosX - nDst)) {
			nPosX = e.changedTouches[0].pageX;
			move(false);
		}
		if (nCurPos > (nPosX + nDst)) {
			nPosX = e.changedTouches[0].pageX;
			move(true);
		}
	}, false);

	oWrapper.addEventListener("touchstart", function(e) {
		nPosX = e.changedTouches[0].pageX;
	});

	/* Init */
	oNext.style.zIndex = nZndx + (nLen + 1);
	oPrev.style.zIndex = nZndx + (nLen + 1);
    render(nCur);

})(document.querySelector(".cflow"), ".cflow__image", ".cflow__next", ".cflow__prev", "cflow__image--active", "cflow--hide", 10);