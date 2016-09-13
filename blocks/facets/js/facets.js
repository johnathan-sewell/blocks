/**
* @function facetHelper
* @description Resets facets, adds/removes class to Facet-reset-button
*/
(function facetHelper(){
	"use strict";
	var
	/**	@type {NodeList} */
	aStates = document.getElementsByName("facet"),
	/**	@type {number} */
	i,
	/**	@type {number} */
	n = aStates.length,
	/**	@type {Object} */
	oReset = document.getElementById("facet-reset");
	
	for (i = 0; i < n; i++) aStates[i].addEventListener("click", checkFacets, false);
	oReset.addEventListener("click", checkFacets, false);

	/**
	* @function checkFacets
	* @description Checks if any facet is selected
	*/ 	
	function checkFacets() {
		var 
		/**	@type {boolean} */
		b = false;
		if (this !== oReset) {
			for (i = 0; i < n; i++) if (aStates[i].checked) b = true;
		}
		oReset.classList.toggle("facet-reset", !b);
	}
})();