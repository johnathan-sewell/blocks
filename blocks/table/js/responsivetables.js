(function() {
	var 
	aHead,
	aRows,
	aTables = document.querySelectorAll(".table"), 
	i,
	j,
	n = aTables.length,
	nColLen,
	nRowLen;
	
	while (n--) {
		aHead = aTables[n].tHead.querySelectorAll("th"),
		aRows = aTables[n].tBodies[0].querySelectorAll("tr"),
		nColLen = aHead.length,
		nRowLen = aRows.length;

		for (i = nRowLen; i--;) {
			for (j = nColLen; j--;) {
    			aRows[i].cells[j].setAttribute("data-th", aHead[j].innerHTML);
			}
		}
	}
})();