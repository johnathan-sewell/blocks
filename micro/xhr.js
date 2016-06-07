
/**
* @file xhr.js
* version 0.4.4
* date: 26-02-2016
*/

/*
import { arrFromString, arrFromQuery, cloneObject, filterObject, getItem, getUriKey, mergeObj, setContent, setCycleIndex, setItem, setUriKey } from "evt.js";
import { assign, debounce, func } from "evt.js";
*/

/**	@namespace xhr */
var xhr = (function() {
	"use strict";

	var 
	/**	@type {Event} */
	eXhrFail,
	/**	@type {Event} */
	eXhrStart,
	/**	@type {Event} */
	eXhrStop;
	
	if ("CustomEvent" in window) {
		eXhrFail = new CustomEvent("xhr-fail", { detail: { "xhr-fail": true }});
		eXhrStart = new CustomEvent("xhr-start", { detail: { "xhr-start": true }});
		eXhrStop = new CustomEvent("xhr-stop", { detail: { "xhr-stop": true }});
	}

    /**
	* @function formatQuery
	* @description Converts a query in @-format to &-format
	* @memberof! xhr
	* @return {string}
	*/	
	var formatQuery = function(sQuery) {
		return (~sQuery.indexOf("@") ? "?" + sQuery.split("@").join("&").slice(1) : "");
	};

    /**
	* @function getJSON
	* @description Returns a promise with parsed JSON
	* @memberof! xhr
	
	* @param {string} sURI
    */
	var getJSON = function(sURI) {
		return raw(sURI).then(JSON.parse);
	};
	
    /**
	* @function listen
	* @description Listens for clicks on DOM Elements with a data-xhr attribute.
	* @memberof! xhr

    * @example
 	* xhr.listen();
    */
    var listen = function() {
		document.addEventListener("click", function(e) {
			var 
			/**	@type {Object} */
			oElm = e.target || e.srcElement;
			
			if (oElm.dataset.xhr) {
				e.preventDefault();
				e.stopPropagation();
				prepare(settingsFromUri(SPA, oElm.dataset.xhr));
			}
		}, false);
	};

    /**
	* @function noRender
	* @description Checks if URI contains "noRender". Removes it from URI and prevents hashChange.
	* @memberof! xhr
	
	* @param {string} [sURI]
	* @return {boolean}
	*/		
	var noRender = function(sURI) {
		var
		/**	@type {boolean} */
		bReturn = false;
		
		sURI = sURI || window.location.href;
		
		if (fn.getUriKey("noRender", "", sURI)) { 
			sURI = fn.setUriKey("noRender", "---", "", "", sURI);
			window.history["replaceState"](null, null, sURI);
			bReturn = true;
		}
		return bReturn;
	};

    /**
	* @function postForm
	* @description Posts a form (oForm) via xhr
	* @memberof! xhr
	
	* @param {Element} oForm
	* @param {string} sURI
	*/
	var postForm = function(oForm, sURI) {
		return raw(sURI, "POST", [["Content-type", "application/x-www-form-urlencoded"]], new FormData(oForm));
	};

    /**
	* @function postJSON
	* @description Posts JSON (oJSON) via xhr
	* @memberof! xhr
	
	* @param {Object} oJSON
	* @param {string} sURI
	*/
	var postJSON = function(oJSON, sURI) {
		return raw(sURI, "POST", [["Content-type", "application/json"]], JSON.stringify(oJSON));
	};
	
    /**
	* @function prepare
	* @description Initializes a xhr-request based on <em>oSettings</em>
	* @memberof! xhr
	
	* @param {Object} oSettings
	*/	
	var prepare = function(oSettings) {
		var
		/**	@type {Function} */
		fCallBack,
		/**	@type {Function} */
		fQuery;
		
		if (oSettings.callBack && oSettings.uri && oSettings.query) { 
			fCallBack = evt.func(oSettings.callBack);
			fQuery = evt.func(oSettings.formatQuery);
			oSettings.query = fQuery(oSettings.query);

			if (oSettings.query) {
				getJSON(oSettings.uri + oSettings.query).then(function(oJSON) { 
					setCache(oJSON, oSettings); 
					fCallBack(oJSON, oSettings);
					if ("CustomEvent" in window) window.dispatchEvent(xhr.eXhrStop);
				});
			}
			else {
				throw new TypeError("xhr.prepare(): Empty queryString");
			}
		}
	};

    /**
	* @function queryAll 
	* @description Try to find DOM element/s by either tagtype, id or class from *sSelector*
	* @memberof! xhr
	* @param {string} sSelector
	* @return {NodeList}
	*/	
	var queryAll = function(sSelector) {
		var
		/** @type {NodeList} */
		aNodeList = document.querySelectorAll(sSelector + ",#" + sSelector + ",." + sSelector);
		return (aNodeList.length === 0 ? null : aNodeList);
	};
		
    /**
	* @function raw
	* @description Raw XHR-request, returns a Promise
	* @memberof! xhr
	
    * @param {string} sURI URL to webservice
    * @param {string} [sType] GET, POST
    * @param {Array} [aHeaders] Array of (optional) headers to add to the request
    * @param {Object|string} [vData] For POST-requests, this will be the (JSON or Form)-object to post
    
    * @example
 	* xhr.raw("http://yourwebservice", "GET");
    */
    var raw = function(sURI, sType, aHeaders, vData) {
  		return new Promise(function(resolve, reject) {
   			var 
   			/** @type {number} */
   			i,
   			/** @type {Object} */
   			oRequest = new XMLHttpRequest();
   			oRequest.open((sType || "GET"), sURI);
   			
   			if (aHeaders) {
   				try {
   					for (i = 0; i < aHeaders.length; i++) oRequest.setRequestHeader(aHeaders[i][0], aHeaders[i][1]);
   				}
   				catch(err) {
   					if ("CustomEvent" in window) window.dispatchEvent(xhr.eXhrFail);
   					throw new Error(err);
   				}
   			}
   			
			oRequest.onload = function() {
      			if (oRequest.status == 200) {
        			resolve(oRequest.response);
      			}
      			else {
      				if ("CustomEvent" in window) window.dispatchEvent(xhr.eXhrFail);
        			reject(Error(oRequest.statusText));
      			}
    		};
    		
    		oRequest.onerror = function() {
    			if ("CustomEvent" in window) window.dispatchEvent(xhr.eXhrFail);
		    	reject(Error("Network Error"));
		    };
		    
    		oRequest.send(vData);
  		});
	};

    /**
	* @function renderAll
	* @description 
	* <pre>
	* For each key in the JSON-data, the function will try to find templates that either:
	* 1. Matches the prefix (oSettings.pfxTemplate) + the Object[key]
	* 2. Matches the [template]-key in the current Object[key]
	* 3. Matches the oSettings.template property
	* For each template iteration, the wrappers will be using a similar method UNLESS a data-wrapper attribute exists in the HTML template itself. 
	* Then this selector takes presedence.
	* </pre>
	* @memberof! xhr
	
	* @param {Object} oJSON
	* @param {Object} oSettings
	* @param {boolean} [bAssignEvt]
	*/	
	var renderAll = function(oJSON, oSettings, bAssignEvt) {
		bAssignEvt = bAssignEvt || false;
		var
		/**	@type {number} */
		i,
		/**	@type {number} */
		j,
		/**	@type {number} */
		nInsType,
		/**	@type {Object} */
		oKey,
		/**	@type {Object} */
		oTemplate,
		/**	@type {Object|string} */
		oTempWrapper,
		/**	@type {Object} */
		oWrapper;
		
		for (oKey in oJSON) { 
			if (oJSON.hasOwnProperty(oKey)) {
				nInsType = (oJSON["instype"] || oSettings.insType);
				oTemplate = queryAll(oSettings.pfxTemplate + oKey) || document.querySelectorAll(oJSON["template"] || oSettings.template);
				oWrapper = queryAll(oSettings.pfxWrapper + oKey) || document.querySelectorAll(oJSON["wrapper"] || oSettings.wrapper);
			
				if (oTemplate && oWrapper) { 
					for (i = 0; i < oTemplate.length; i++) {
						oTempWrapper = oTemplate[i].getAttribute("data-wrapper") && document.querySelectorAll(oTempWrapper) || oWrapper;
						for (j = 0; j < oTempWrapper.length; j++) {
							fn.render(oJSON[oKey], oTemplate[i], oWrapper[j], nInsType);
							if (bAssignEvt) evt.assign(oWrapper[j]);
						}
					}
				}
			}
		}
	};

    /**
	*	searchForm
	*	@param {Object} oForm
	*	@param {boolean} bUseHash
	*/
    var searchForm = function(oForm, bUseHash) {
    	bUseHash = bUseHash || false;
    	oForm.addEventListener("submit", function(e) { 
    		e.preventDefault();
	    	var 
	    	/**	@type {Object} */
	    	oSettings = settingsFromUri(SPA, oForm.getAttribute("data-xhr")),
    		/** @type {NodeList} */
	    	aFilters = oForm.querySelectorAll("[data-filter]"),
	    	/** @type {Object} */
	    	oParams = {},
	    	/** @type {number} */
	    	i = aFilters.length,
	    	/** @type {string} */
	    	sCurFilter;
	  		
	  		while (i--) { 
	    		if (aFilters[i].value) { 
	    			sCurFilter = aFilters[i].getAttribute("data-filter");
	    			if (!oParams[sCurFilter]) oParams[sCurFilter] = [];
	    			oParams[sCurFilter].push(aFilters[i].value);
	    		}
	    	}
	    	
	    	for (i in oParams) {
	    		if (oParams[i]) oSettings.query += "@" + i + "=" + oParams[i].join("");
	    	}
	    	// TODO: use hash if bUseHash
	    	prepare(oSettings);

    	}, false);
    };

    /** 
    * @function setCache 
    * @description Saves the JSON and Settings Objects in sessionStorage for cache optimizations 
    * @memberof! xhr
	
	* @param {Object} oJSON
	* @param {Object} oSettings
	*/	
	var setCache = function(oJSON, oSettings) {
		if (!oSettings.bUseCache) return false;
		var 
		/**	@type {Object|string} */
		oCache;
		try {
			oCache = JSON.stringify({json : oJSON, settings : oSettings});
			fn.setItem(oCache);
		}
		catch(err) { throw new Error("xhr.setCache(): Couldn't create oCache or access sessionStorage"); }
	};
	
    /**
	* @function settingsFromUri
	* @description Creates a (temporary) Settings-object for from values in the URL.
	* <pre>
	* callBack
	* insType
	* query
	* template
	* uri
	* wrapper
	* </pre>
	* @memberof! xhr

	* @param {Object} oGlobalSettings
	* @param {string} sURI A string in the required URI-format (not necessarily from window.location)
	
	* @example #!template=.product-detail&wrapper=.search-result&query=@id=1525@s=details&uri=../io.asp
	*/ 		
	var settingsFromUri = function(oGlobalSettings, sURI) {
		var 
		/**	@type {Object} */
		oKey,
		/**	@type {Object} */
		oSettings = {},
		/**	@type {string} */
		sKeyVal;

		for (oKey in oGlobalSettings) {
			if (oGlobalSettings.hasOwnProperty(oKey)) {
				sKeyVal = fn.getUriKey(oKey, "=", sURI);
				if (sKeyVal) sKeyVal = decodeURIComponent(sKeyVal);
				oSettings[oKey] = sKeyVal ? sKeyVal : oGlobalSettings[oKey];
			}
		}
		return oSettings;
	};

    /**
	* @function spa
	* @description Initializes a Single Page Application.
	* @memberof! xhr

	* @param {Object} oSettings An Object with one or more of these keys: bHashBang, callBack, elmList, hashInit, instype, query, template, uri, wrapper
	* @return {Object}
    * @example
 	* xhr.spa({uri:"http://mywebservice", callBack : myFunc});
	*/ 		
    var spa = function (oSettings) {
    	var
    	/**	@type {Object} */
    	oFunc,
    	/**	@type {string} */
		sHash = window.location.hash;
		
    	fn.mergeObj(SPA, oSettings);
		oFunc = spaRun; /* SPA.bUseSock ? spaSocket : spaRun; */
		window.addEventListener("hashchange", oFunc, false);

		if (!sHash || sHash.length < 2) {
			window.location.hash = SPA.hashInit;
		}
		else {
			oFunc();
		}
		return SPA;
	};


    /**
	* @function spaRun
	* @description Prepares a Settings-object for a spa, or loads it from cache
	* @memberof! xhr
	
	* @todo Check id noRender=true, remove norender from URL, replaceState. 
	*/
	var spaRun = function() {
		var
		/**	@type {boolean} */
		bNoRender = noRender(),
		/**	@type {?} */
		oCache = fn.getItem(),
		/**	@type {Object} */
		oSpaSettings;
		
		if (SPA.bUseCache && oCache) {
			oCache = JSON.parse(oCache);
			renderAll(oCache.json, oCache.settings);
		}
		else {
			if ("CustomEvent" in window) window.dispatchEvent(xhr.eXhrStart);
			oSpaSettings = settingsFromUri(SPA, window.location.hash);
			if (!bNoRender) prepare(oSpaSettings);
		}
	};
		
	/**
	* @function suggest
	* @description Initializes an autosuggest-control
	* @memberof! xhr
	
	* @param {Object} oExtSettings
	*/
    var suggest = function(oExtSettings) {
    	var 
    	/**	@type {Object} */
    	oSettings =
    	{
    		bSetValOnNav: true,
    		bSubFormEnt	: true,
    		bUseCache	: true,
    		jsonCount	: "count",
    		jsonFields	: ["name"],
    		jsonResult	: "result",
    		nMaxItems	: 100,
    		nMinChar	: 3,
			oInput		: "",
			oTemplate	: "",
			oWrapper	: "",
			sHideClass	: "hide",
			sInputName	: "",
			sURI		: ""
    	},
    	/**	@type {Object} */
    	me = suggest;
    	
    	fn.mergeObj(oSettings, oExtSettings);

    	/**
		* @function reset
		* @description Resets cache
		* @memberof! suggest
		*/
    	me.reset = function() {
    		me.cache = null;
    		me.searchpos = 0;
    	};
    	
    	/**	@type {*} */
    	me.cache = null;
    	
    	/**
		* @function close
		* @description Closes the suggest-popup
		* @memberof! suggest
		*/
    	me.close = function() { 
    		me.reset();
    		oSettings.oInput.innerHTML = ""; 
    		oSettings.oWrapper.classList.add(oSettings.sHideClass); 
    		me.index = -1;
    	};
    	
    	/**	@type {number} */
    	me.index = -1;
    	
    	/**	@type {number} */
    	me.searchpos = 0;

    	/**
		* @function navigate
		* @description Keyboard-navigation and selection for suggest-popup
		* @memberof! suggest
		
		* @param {boolean} bNext Direction. true = next. false = previous.
		* @param {Object} bSetValue 
		*/
    	me.navigate = function(bNext, bSetValue) { 
    		var
    		/**	@type {NodeList} */
    		aElm = document.getElementsByName(oSettings.sInputName),
    		/**	@type {number} */
    		i = aElm.length;
    		
    		me.index = fn.setCycleIndex(me.index, i, bNext);
    		if (aElm[me.index]) {
    			aElm[me.index].checked = true;
    			if (bSetValue) oSettings.oInput.value = aElm[me.index].value;
    		}
    		else {
    			while(i--) aElm[i].checked = false;
    		}
    	};
    	
    	/**
		* @function setFields
		* @description Updates one or more fields with selected value/s. Fields are specified in the data-fields attribute, separated by | (pipe). Values, in same order, are specified in the data-fields-value attribute.
		* @memberof! suggest
		
		* @param {boolean} [bReset] Resets fields
		*/
    	me.setFields = function(bReset) {
    		bReset = bReset || false;
    		var
    		/**	@type {Array} */
    		aElm,
    		/**	@type {Array|string} */
    		aFields,
    		/**	@type {Array|string} */
    		aValues,
    		/**	@type {number} */
    		i,
    		/**	@type {Object} */
    		oField = oSettings.oWrapper.querySelector("input:checked");
    		
    		if (oField) {
    			if (oSettings.bSetValOnNav) oSettings.oInput.value = oField.value;
    			aFields = fn.arrFromString(oField.getAttribute("data-fields"), "|");
    			aValues = fn.arrFromString(oField.getAttribute("data-fields-value"), "|");
    			
    			for (i = 0; i < aFields.length; i++) {
    				aElm = fn.arrFromQuery(aFields[i]);
    				aElm.forEach(function(O){O.value = (bReset ? "" : aValues[i]);});
    			}
    		}
    	};

    	/**
		* @function submit
		* @description Submits the asoociated form of oInput
		* @memberof! suggest
		*/    	
    	me.submit = function() {
    		var
    		/**	@type {Object} */
    		oForm;
    		
    		if (oSettings.bSubFormEnt) {
    			oForm = oSettings.oInput.form;
    			if (oForm) oForm.submit();
    		}
    	};
    	
    	oSettings.oInput["addEventListener"]("input", evt.debounce(function() {
    		var 
    		/**	@type {*} */
    		oClone,
    		/**	@type {*} */
    		oJSON;
    		
    		if (this.value.length >= oSettings.nMinChar) {
    			if (oSettings.bUseCache && me.cache) {
    				oClone = fn.cloneObject(me.cache);
    				oJSON = fn.filterObject(oClone[oSettings.jsonResult], oSettings.oInput.value, oSettings.jsonFields);
    				oClone[oSettings.jsonResult] = oJSON;
    				fn.render(oClone, oSettings.oTemplate, oSettings.oWrapper);
    				oSettings.oWrapper.classList.remove(oSettings.sHideClass);
    			}
    			else {
    				getJSON(oSettings.sURI+encodeURIComponent(this.value)).then(function(oJSON){
					if (oSettings.bUseCache && (oSettings.nMaxItems >= oJSON[oSettings.jsonCount]-0)) {
						me.cache = oJSON;
						me.searchpos = oSettings.oInput.value.length;
					}
    				fn.render(oJSON, oSettings.oTemplate, oSettings.oWrapper);}).then(oSettings.oWrapper.classList.remove(oSettings.sHideClass));
    			}
    		}
    	}, 150), false);
    	
    	oSettings.oInput["addEventListener"]("blur", function(e) { me.close(); }, false);
    	oSettings.oInput["addEventListener"]("keydown", function(e) {
			switch (e.keyCode) {
				case  8: if (oSettings.oInput.value.length <= me.searchpos) { me.reset(); } else if (oSettings.oInput.value.length <= oSettings.nMinChar) { me.close(); me.setFields(true); } break; /*Backspace*/
				case  9: me.close(); break; /*Tab*/
				case 13: e.preventDefault(); me.setFields(); me.close(); me.submit(); break; /*Enter*/
				case 27: me.close(); me.setFields(true); break; /*Esc*/
				case 38: me.navigate(false, oSettings.bSetValOnNav); break; /*Prev*/
				case 40: me.navigate(true, oSettings.bSetValOnNav); break; /*Next*/
			}
    	}, false);
    };

    /**
    * @function template
    * @description Version of John Resigs Micro-Template without "with"-block. Further info: jsperf.com/template-engines-performance-compiling-rendering
    * @memberof! xhr
    * @param {string} sTmpl Template-String
    * @param {string} sDataPrfx Data-Object-Prefix
    * @return {Function}
    */
    var template = function(sTmpl, sDataPrfx) {
        var F =
        "var p=[];" +
        "p.push('" +
        sTmpl.replace(/[\r\t\n]/g, " ")
        .replace(/'(?=[^!--]*-->)/g, "\t")
        .split("'").join("\\'")
        .split("\t").join("'")
        .replace(/<!--#(.+?)-->/g, "',$1,'")
        .replace(/&lt;!--#(.+?)--&gt;/g, "',$1,'")
        .split("<!--").join("');")
        .split("-->").join("p.push('") + "');return p.join('');";
        return new Function(sDataPrfx, F);
    };

    /**
    * updateURI
    * @param {string} sUriPar 
    * @param {string} sURI URI to update, defaults to window.locatoon.href
    */
    var updateURI = function(sUriPar, sURI) {
    	sURI = sURI || window.location.href;
    	var
    	/**	@type {Array} */
    	aUriKey,
    	/**	@type {Array} */
    	aUriPar = sUriPar.split("&"),
    	/**	@type {number} */
    	i;
    	
    	for (i = 0; i < aUriPar.length; i++) {
    		aUriKey = aUriPar[i].split("=");
    		sURI = fn.setUriKey(aUriKey[0], aUriKey[1], "", "", sURI);
    	}
    	window.location.href = sURI;
    };
       		
	/** @type {Object} */
	var SPA = {
		bUseCache : true,
		bUseSock : false,
    	callBack : "xhr.renderAll",
    	formatQuery : "xhr.formatQuery",
		hashInit : "", 
		insType : 0,
		noRender : false,
		pfxTemplate : "tmpl",
		pfxWrapper : "wrp",
		query : "",
		template : "", 
		uri : "", 
		wrapper : ""
	};
	
    /* Expose public functions */
    return {
    	eXhrFail	: eXhrFail,
    	eXhrStart	: eXhrStart,
    	eXhrStop	: eXhrStop,
		formatQuery	: formatQuery,
		getJSON		: getJSON,
		postForm	: postForm,
		postJSON	: postJSON,
		listen		: listen,
		raw			: raw,
		renderAll	: renderAll,
		searchForm	: searchForm,
		spa			: spa,
		suggest		: suggest,
		template	: template,
		updateURI	: updateURI
    };
})();
window["xhr"] = xhr;