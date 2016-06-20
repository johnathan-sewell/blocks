/* FN Delayed Modal : Unminified */

function runTimeOut(oElm) {
	setTimeout(function() { oElm.checked = true; }, oElm.getAttribute("data-delay-time")-0);
}

var oModal = document.querySelector(".delayed-modal"), oTmp;
if (oModal && oModal.innerHTML) {
	oTmp = document.createElement("div");
	document.body.appendChild(oTmp);
	oTmp.outerHTML = oModal.innerHTML;

	var
	aDelay = document.querySelectorAll("[data-delay-key]"),
	aURL,
	i = aDelay.length,
	nExp,
	nVst,
	oDate,
	oElm,
	oJSON,
	sKey,
	sNme,
	sTmp;
			
	while (i--) {
		oDate = new Date();
		oElm = aDelay[i];
		nExp = oElm.getAttribute("data-delay-expires")-0;
		nVst = oElm.getAttribute("data-delay-visits")-0;
		sKey = oElm.getAttribute("data-delay-key");
		sNme = oElm.getAttribute("data-delay-name") || document.title;
		
		sTmp = localStorage.getItem(sKey);
		if (sTmp) oJSON = JSON.parse(sTmp);
		
		if ((typeof oJSON === "object") && (oJSON !== null)) {
			if (Date.parse(oJSON.expires) <= oDate) {
				delete localStorage[sKey];
				continue;
			}
			if (oJSON.shown === false && (oJSON.urls.length >= nVst)) {
				oJSON.shown = true;
				try { window._gtmEV("Shown", "Modal" , sNme); } catch(err){}
				runTimeOut(oElm);
			}
			else {
				if (!~oJSON.urls.indexOf(document.location.href)) {
					oJSON.urls.push(document.location.href);
				}
			}
		}
		else {
			aURL = [];
			aURL.push(document.location.href);
			oDate.setDate(oDate.getDate() + nExp);
			oJSON = 
			{
				shown: false,
				expires: oDate,
				urls: aURL
			};
		}
		localStorage.setItem(sKey, JSON.stringify(oJSON));
		oJSON = null;
	}
}