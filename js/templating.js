/**
*	templating.js
*	(c)	Copyright 2015 Mads Stoumann
*/

function moustache(sTemplate, oView) {
	return sTemplate.replace(/{{([^{}]*)}}/g, function (a, b) {
		var
		aProp = b.split("."),
		i,
		oTmp = oView,
		nLen = aProp.length;
		
		for (i = 1; oTmp && i < nLen; i++) oTmp = oTmp[aProp[i]];
		return oTmp;
	});
}