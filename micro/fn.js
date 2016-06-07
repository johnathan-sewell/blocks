
/**
* @file fn.js
* version 0.2.5
* date: 30-05-2016
*/

/**	@type {Array}	*/
var dataLayer = window.dataLayer || [];

/**	@namespace */
var fn = {
	/**
	* @function addMark
	* @description Finds value of sInput in sValue, adds &lt;mark&gt;-tags
	* @memberof! fn

	* @param {string} sInput
	* @param {string} sValue
	* @return {string}
	
	* @example
 	* fn.addMark("The Amazing Spider-Man", "Spider-Man");
	*/ 
	addMark : function(sInput, sValue) {
		return sValue.replace(RegExp(fn.regExpEscape(sInput), "gi"), "<mark>$&</mark>");	
	},

	/**
	* @function arrFromObject
	* @description Returns an array from arguments or a NodeList
	* @memberof! fn

    * @param {?} aNodeList
    * @return {Array}
    */
	arrFromObject : function (aNodeList) {
		return aNodeList ? [].slice.apply(aNodeList) : [];
	},
	
    /**
	* @function arrFromQuery
	* @description Returns an array from a QuerySelector/NodeList
	* @memberof! fn

    * @param {string} sSelector
    * @param {Object} [oParent] Optional Parent-selector
    * @this {Object}
    * @return {Array}
    */	
	arrFromQuery : function(sSelector, oParent) {
		oParent = oParent || document;
		var
		/**	@type {NodeList} */
		oNodeList = oParent.querySelectorAll(sSelector);
		return this.arrFromObject(oNodeList);
	},

    /**
	* @function arrFromString
	* @description Returns an array from a string and custom delimiter
	* @memberof! fn

    * @param {string|null} sString
    * @param {string} sDelimiter
    * @return {Array|string}
    */
	arrFromString : function(sString, sDelimiter) {
		return (sString && sString.split(sDelimiter)) || [];
	},

	/**
	* @function byString
	* @description Returns a (sub-)key from a JSON-object based on a string
	* @memberof! gmap
	*/ 	
	byString : function(oObj, sKey) {
		sKey = sKey.replace(/\[(\w+)\]/g, ".$1");
		sKey = sKey.replace(/^\./, "");
		var 
		aKeys = sKey.split("."),
		i,
		nLen = aKeys.length,
		oKey;
		
		for (i = 0; i < nLen; ++i) {
			oKey = aKeys[i];
			if (oKey in oObj) {
				oObj = oObj[oKey];
			} 
			else {
				return;
			}
		}
		return oObj;
	},
	
	/**
	* @function cloneObject
	* @description Returns a clone of an Object
	* @memberof! fn
	
	* @param {*} oObj
	* @return {Object}
	*/
	cloneObject : function(oObj) {
		var 
		/** @type {Object} */
		O,
		/** @type {Object} */
		oTarget = {};
		
		for (O in oObj) {
			if (oObj.hasOwnProperty(O)) {
				oTarget[O] = oObj[O];
			}
		}
		return oTarget;
	},

	/**
	* @function compose
	* @description Executes functions defined in arguments, parses output as input to next function
	* @memberof! fn

	* @return {Function}
	*/
	compose : function() {
  		var 
  		/**	@type {Arguments} */
  		args = fn.arrFromObject(arguments).reverse(),
  		/**	@type {number} */
  		i;

		return function(result) {
			for (i = args.length - 1; i > -1; i--) {
				result = args[i].call(this, result);
			}
			return result;
		};
	},
	
	/**
	* @function cookieGet
	* @description
	* @memberof! fn
	
	* @param {string} sName
	* @return {string}
	*/
	cookieGet: function(sName) {
		var
		/** @type {string} */
		sCookie = "; " + document.cookie,
		/** @type {Array} */
		aParts = sCookie.split("; " + sName + "="),
		/** @type {string} */
		sReturn = "";
		if (aParts.length == 2) sReturn = aParts.pop().split(";").shift();
		return sReturn;
	},

	/**
	* @function cookieRem
	* @description
	* @memberof! fn
	
	* @param {string} sName
	*/
	cookieRem: function(sName) {
		document.cookie = sName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
	},

	/**
	* @function cookieSet
	* @description
	* @memberof! fn
	
	* @param {string} sName
	* @param {string} sValue
	* @param {boolean} [bSession]
	*/
	cookieSet: function(sName, sValue, bSession) {
		bSession = bSession || false;
		var
		/** @type {Object} */
		oDate = new Date();
		oDate.setFullYear(oDate.getFullYear() + 1);
		document.cookie = sName + "=" + sValue + ";path=/; " + (bSession ? "expires=" + oDate.toGMTString() : "");
	},
	
	/**
	* @function findKeyVal
	* @description Looks up a key in an Object, returns the value or Object
	* @memberof! fn

	* @param {Object} oObj Object to look in
	* @param {string} sKey
	* @return {*}
	*/
	findKeyVal : function(oObj, sKey) {
		var
		/** @type {boolean} */
  		bFound = false,
  		/** @type {Object} */
  		oKey,
  		/** @type {*} */
  		oReturn;
  		
        for (oKey in oObj) {
            if (oObj.hasOwnProperty(oKey)) {
				if (oKey == sKey) {
            		bFound = true;
            		oReturn = oObj[oKey];
            		break;
            	}

                if (typeof oObj[oKey] == "object") {
            		if (bFound) break;
                	oReturn = fn.findKeyVal(oObj[oKey], sKey);
                } 
            }
        }
        return oReturn;
	},

	/**
	* @function findObject
	* @description Returns an Object where multiple keys matches specified values
	* @memberof! fn

	* @param {?} oObj Object to look in
	* @param {Array} aKeyVal Array of keys
	* @return {Object}
	*/
	findObject : function(oObj, aKeyVal) {
		var
		/** @type {boolean} */
		bFound = false,
		/** @type {number} */
		i,
		/** @type {number} */
		nLen = aKeyVal.length,
		/** @type {Object} */
		oKey;
		
		for (oKey in oObj) {
			if (oObj.hasOwnProperty(oKey)) {
				for (i = nLen; i--;) {
					bFound = oObj[oKey][aKeyVal[i][0]] == aKeyVal[i][1];
					if (!bFound) break;
				}
				if (bFound) return oObj[oKey];
			}
		}
		return null;
	},

	/**
	* @function filterObject
	* @description Returns an Object where multiple keys matches specified values
	* @memberof! fn

	* @param {Array} aObj Object to search in
	* @param {string} sTerm Search term string
	* @param {Array} [aKeys] Optional (Object) keys to search in
	* @return {Object}
	*/
	filterObject : function(aObj, sTerm, aKeys) {
		sTerm = sTerm.toLowerCase();
		return aObj.filter(function(oObj) {
			return Object.keys(oObj).some(function(oKey) {
				if (oObj[oKey].length > 0) {
					if (aKeys.length) {
						if (~aKeys.indexOf(oKey)) return(~oObj[oKey].toLowerCase().indexOf(sTerm)); 
					} else return(~oObj[oKey].toLowerCase().indexOf(sTerm));
				}
			});
		});
	},
	
	/**
	* @function getItem
	* @description Returns the value from a sessionStorage key
	* @memberof! fn

	* @param {string} [sKey]
	* @param {number} [nType] Storage-type: 1|undefined = sessionStorage, 2 = localStorage, 3 + 4 = cookie
	* @return {?}
	*/
	getItem : function(sKey, nType) {
		sKey = sKey || window.location.href;
		nType = nType || 1;
		switch (nType) {
			case 1: return window.sessionStorage.getItem(sKey);
			case 2: return window.localStorage.getItem(sKey);
			case 3: case 4: return fn.cookieGet(sKey);
		}
	},

	/**
	* @function getUriKey
	* @description Returns the value of a URI (Query) key
	* @memberof! fn

	* @param {string} sKey
	* @param {string} sKeySeparator
	* @param {string} [sURI]
	* @return {string}
	*/  
	getUriKey : function(sKey, sKeySeparator, sURI) {
		sURI = sURI	|| window.location.href;
		sKeySeparator = sKeySeparator || "=";
		sKey = sKey && sKey.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var	
		/** @type {string} */
		sRgx = "[\\!#?&]" + sKey + sKeySeparator + "([^&#]*)",
		/**	@type {Array} */
		aResults = new RegExp(sRgx).exec(sURI);
		return aResults	===	null ? "" : decodeURIComponent(aResults[1]);
	},

	/**
	* @function gtmEvent
	* @description Pushes an event-Object to (GTM's) dataLayer
	* @memberof! fn

	* @param {string} sAction
	* @param {string} sCategory
	* @param {string} sLabel
	* @param {number} nValue
	* @param {string} [sEvent]
	* @param {Array} [aDim] Custom Dimensions. Must be an array of arrays like [[5, "TheFifthDimension], [6, "TheSixthDimension]]
	* @param {Array} [aMet] Custom Metrics. Must be an array of arrays like [[5, "TheFifthMetric], [6, "TheSixthMetric]]
	*/ 
	gtmEvent : function(sAction, sCategory, sLabel, nValue, sEvent, aDim, aMet) {
		sEvent = sEvent || "GTM_Event";
		
		var
		/** @type {number} */
		i,
		/** @type {Object} */
		oEvent = {
			"eventAction"   : sAction,
			"eventCategory" : sCategory,
			"eventLabel"    : sLabel,
			"eventValue"    : nValue,
			"event" 		: sEvent
		};
		
		i = aDim ? aDim.length : 0;
		while (i--) oEvent["dimension" + aDim[i][0]] = aDim[i][1];
		
		i = aMet ? aMet.length : 0;
		while (i--) oEvent["metric" + aMet[i][0]] = aMet[i][1];
		
		dataLayer.push(oEvent);
	},
	
	/**
	* @function isArray
	* @description Checks, if an object is of the type "Array".
	* @memberof! fn
	
	* @param {Object} oArr Array to check
	* @return {boolean} True if array, False if not
	*/
	isArray : function(oArr) {
		if (typeof Array.isArray === "function") {
			return Array.isArray(oArr);
		} 
		else {
			return Object.prototype.toString.call(oArr) === "[object Array]";
		}
	},
	
	/**
	* @function mergeObj
	* @description Merges o1 with key/value from o2, optionally only appending inexisting keys (bNoOverwite)
	* @memberof! fn

	* @param {Object} o1 Object to merge in new values
	* @param {Object} o2 Object to get new values from
	* @param {boolean} [bNoOverWrite] If true, existing object properties will not be overwritten. Only new properties will be added.
	*/  
	mergeObj : function(o1, o2, bNoOverWrite) {
		var 
		/**	@type {Object}	*/
		oKey;
		if (o1 && o2) {
			for (oKey in o2) {
				if (o2.hasOwnProperty(oKey) && (bNoOverWrite ? !o1[oKey] : true)) o1[oKey] = o2[oKey];
			}
		}
	},

	/**
	* @function moustache
	* @description Replaces {{moustache}}-syntax in sTemplate with values from oView
	* @memberof! fn

	* @param {string} sTemplate Template/HTML-string
	* @param {Object} oView View/JSON-Object
	*/
	moustache : function(sTemplate, oView) {
		return sTemplate.replace(/{{([^{}]*)}}/g, function (a, b) {
			var
			/** @type {Array} */
			aProp = b.split("."),
			/** @type {number} */
			i,
			/** @type {Object} */
			oTmp = oView,
			/** @type {number} */
			nLen = aProp.length;
			
			for (i = 0; oTmp && i <= nLen; i++) {
				if (oTmp[aProp[i]]) oTmp = oTmp[aProp[i]];
			}
			return oTmp;
		});
	},

	/**
	* @function nodeToJSON
	* @description Outputs JSON from a domTree (oElm)
	* @memberof! fn

	* @param {Object} oElm
	* @return {string}
	*/	
	nodeToJSON : function(oElm) {
		var
		/** @type {string} */
		sOut = "[\n";
		
		fn.walkTheDOM(oElm, function (node) {
    		if (node.nodeType === 1) {
        		sOut += "{\n\"tag\":\"" + node.tagName.toLowerCase() + "\"," + attrToJSON(node, "atr") + "\n},\n";
    		}
		});
	    
	    /**
		* @function attrToJSON
		* @description Returns the attributes of a DOM-element as JSON
		* @memberof! fn

		* @param {Object} oElm
		* @param {string} sKey
		* @return {string}
		*/		
		function attrToJSON(oElm, sKey) {
			var
			/** @type {Array} */
			aAttr = Array.prototype.slice.call(oElm.attributes),
			/** @type {string} */
			sTmp = "\n\"" + sKey + "\":\n{\n";
			
			aAttr.forEach(function(oAttr, nIdx, aAttr) {
				sTmp += "\t\"" + oAttr.name.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); }) + "\": \"" + oAttr.value + "\"";
				if (nIdx !== aAttr.length-1) sTmp += ",\n";
			});
			
			return sTmp + "}";
		}
		
		return sOut.replace(/,\s*$/, "") + "\n]";
	},

    /**
	* @function padNumber
	* @description Pads a number < 9 with 0
	* @memberof! fn

	* @param {number} n Number
	* @return {string}
	*/	
	padNumber : function(n) {
		return n < 10 ? "0" + n : n.toString();
	},
  
    /**
	* @function randomID
	* @description Generates a UID
	* @memberof! fn

	* @param {string} [sPfx] Optional prefix to randomID
	* @param {number} [nLen] Optional length of randomID. Defaults to prefix + 4.
	* @return {string}
	*/
	randomID : function(sPfx, nLen) {
		sPfx = sPfx || "";
		nLen = nLen || 4;
    	return sPfx + (65536*(1+Math.random())).toString(16).slice(0, nLen);
  	},
  	
	/**
	* regExpEscape
	* @param {string} s
	* @return {string}
	*/  
	regExpEscape : function(s) {
		return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
	},

	/**
	* @function remItem
	* @description Removes a storage key
	* @memberof! fn

	* @param {string} [sKey]
	* @param {number} [nType] Storage-type: 1|undefined = sessionStorage, 2 = localStorage, 3 + 4 = cookie.
	*/
	remItem : function(sKey, nType)	{
		sKey = sKey	|| window.location.href;
		nType = nType || 1;
		switch (nType) {
			case 1: sessionStorage.removeItem(sKey); break;
			case 2: localStorage.removeItem(sKey); break;
			case 3: case 4: fn.cookieRem(sKey); break;
		}
	},

    /**
	* @function render
	* @description Renders a template from a JSON-string
	* @memberof! fn

	* @param {*} oJSON JSON Object
	* @param {Object} oTemplate DOM Template Element
	* @param {Object} oWrapper DOM Wrapper Element
	* @param {number} [nInsType]

    * @example
 	* fn.render(data, document.querySelector("#mytemplate"), document.querySelector("#mywrapper"));

	*/ 	
    render : function(oJSON, oTemplate, oWrapper, nInsType) {
    	nInsType = nInsType || 0;
		var
		/**	@type {string} */
		sContent;
		try {
			sContent = fn.template(oTemplate.innerHTML, "data")(oJSON);
			if (sContent) {
				sContent = sContent.replace(/data-bool=\"([^\"]*)\"/g,"$1").replace(/data-tmp-/g,"");
				fn.setContent.apply(oWrapper, [nInsType, sContent]);
			}
		}
		catch(err) { throw new Error("render(): Invalid template or JSON data."); }
    },
		
	/**
	* @function scrollToElm
	* @description Animated scroll to oElm
	* @memberof! fn

	* @param {Object} oElm
	* @param {boolean} bDirTop
	* @param {number} nDest
	* @param {number} nDuration
	* @param {Function} [fnEasing]
	*/	
	scrollToElm : function(oElm, bDirTop, nDest, nDuration, fnEasing) {
		oElm = (oElm ? oElm : document.documentElement.scrollTop ? document.documentElement : document.body);
    	fnEasing = fnEasing || function(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; };
    	var
    	/**	@type {number} */
   		nStart = Date.now(),
   		/**	@type {number} */
    	nFrom = bDirTop ? oElm.scrollTop : oElm.scrollLeft;
    	
    	if (nFrom === nDest) return;
    	
    	function _min(a, b) { return a < b ? a : b; }

    	function _scroll() {
    		var
    		/**	@type {number} */
	        nCurTime = Date.now(),
	        /**	@type {number} */
	        nTime = _min(1, ((nCurTime - nStart) / nDuration)),
	        /**	@type {number} */
	        nEasedTime = fnEasing(nTime);

    		if (bDirTop) {
    			oElm.scrollTop = (nEasedTime * (nDest - nFrom)) + nFrom;
    		}
    		else {
    			oElm.scrollLeft = (nEasedTime * (nDest - nFrom)) + nFrom;
    		}

    		if (nTime < 1) requestAnimationFrame(_scroll);
    	}
    	window.requestAnimationFrame(_scroll);
	},

    /**
	* @function setContent
	* @description Sets the content of a DOM element
	* @memberof! fn

    * @param {number} nInsType Insert type: 0: overwrite, 1: Prepend, 2: Append, 3: Insert before, 4: Insert after, 5: Outer HTML
    * @param {string} sCnt Content to insert
    * @this {Object}
    */
	setContent : function(nInsType, sCnt) {
		switch (nInsType)	{
			case 1: /* Prepend */
				this.innerHTML = (sCnt + this.innerHTML); break;
			case 2: /* Append */
				this.innerHTML = (this.innerHTML + sCnt); break;
			case 3: /* Insert Before */
				this.outerHTML = (sCnt + this.outerHTML); break;
			case 4: /* Insert After */
				this.outerHTML = (this.outerHTML + sCnt); break;
			case 5: /* Outer HTML */
				this.outerHTML = sCnt; break;
			default: /* Overwrite */
				this.innerHTML = sCnt; break;
		}
	},
	
    /**
	* @function setCycleIndex
	* @description Cycles an index, in negative or positive direction
	* @memberof! fn

    * @param {number} nCur Current index value
    * @param {number} nLen Length of index
    * @param {boolean} bNext Returns next index if true, othwerwise previous
    * @param {number} [nStartOffSet] Optional start offset
    * @return {number}
    */
	setCycleIndex : function(nCur, nLen, bNext, nStartOffSet) {
		nStartOffSet = nStartOffSet || 0;
		return 	bNext ? (nCur < nLen - 1 ? nCur+1 : nStartOffSet) : (nCur > nStartOffSet ? nCur-1 : nLen-1);
	},
	
	/**
	* @function setItem
	* @description Adds a key/value pair to sessionStorage
	* @memberof! fn

	* @param {string} sVal
	* @param {string} [sKey]
	* @param {number} [nType] Storage-type: 1|undefined = sessionStorage, 2 = localStorage, 3 = cookie (persistent), 4 = cookie (session).
	*/
	setItem : function(sVal, sKey, nType) {
		sKey = sKey	|| window.location.href;
		nType = nType || 1;
		switch (nType) {
			case 1: window.sessionStorage.setItem(sKey, sVal); break;
			case 2: window.localStorage.setItem(sKey, sVal); break;
			case 3: fn.cookieSet(sKey, sVal, false); break;
			case 4: fn.cookieSet(sKey, sVal, true); break;
		}
	},  	

	/**
	* 
	* @function setUriKey
	* @description Sets the value of a URI (Query) key
	* @memberof! fn

	* @param {string} sKey
	* @param {?} sVal
	* @param {string} [sKeySeparator] Defaults to "="
	* @param {string} [sRemove] Defaults to "---"
	* @param {string} [sURI] Defaults to window.location.href
	* @return {string}
	
	* @example
 	* fn.setUriKey("page", "5"); fn.setUriKey("page", "---");
	*/
	setUriKey : function(sKey, sVal, sKeySeparator, sRemove, sURI) {
		sURI = sURI || window.location.href;
		sKeySeparator = sKeySeparator || "=";
		sRemove = sRemove || "---";
		var	
		/**	@type {?} */
		oRgx = new RegExp("([!&@])" + sKey + sKeySeparator + ".*?(@|&|$)", "i"),
		/**	@type {string}	*/
		sSep = "&"; /* sURI.indexOf("!") !== -1	? "&" :	"!"; */
		
		/* Remove key/val from URI */
		if (sVal === sRemove) return sURI.replace(oRgx, "$2");
		
		/* Update URI */
		if (sURI.match(oRgx)) {
			return sURI.replace(oRgx, "$1" + sKey + sKeySeparator + sVal + "$2");
		}
		else {
			return sURI + sSep + sKey + sKeySeparator + sVal;
		}
	},

    /**
    * @function template
    * @description Version of John Resigs Micro-Template without "with"-block. Further info: jsperf.com/template-engines-performance-compiling-rendering
    * @memberof! fn
    * @param {string} sTmpl Template-String
    * @param {string} sDataPrfx Data-Object-Prefix
    * @return {Function}
    */
    template : function(sTmpl, sDataPrfx) {
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
    },
    
	/**
	* 
	* @function tglRadio
	* @description Toggle the checked-state of a single radio-button
	* @memberof! fn	
	* @this {Object}
	
	* @param {Event} [evt]
	*/
	tglRadio : function(evt) {
		evt.preventDefault();
		var	
		/** @type {Object} */
		oParent = document.getElementById(this.htmlFor);
		if (oParent) oParent.checked = !oParent.checked;
	},

	/**
	* 
	* @function tglRadioButtons
	* @description Allows radiobuttons to be unchecked/unselected
	* @memberof! fn	
	
	* @param {NodeList} oNodeList Labels for input-type "radio"
	*/
	tglRadioButtons : function(oNodeList) {
		var	
		/** @type {number} */
		i = oNodeList.length;
	
		while (i--) { 
			oNodeList[i].addEventListener("click", fn.tglRadio, false);
		}
	},
	
	/**
	* 
	* @function walkTheDOM
	* @description Walks the DOM from a starting element (node)
	* @memberof! fn	
	
	* @param {Object} node
	* @param {Function} func
	*/	
	walkTheDOM : function(node, func) {
		func(node);
		node = node.firstChild;
		while (node) {
			fn.walkTheDOM(node, func);
			node = node.nextSibling;
		}
	}
};
window["fn"] = fn;