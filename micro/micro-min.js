/* global Promise */
/* jshint bitwise: false */
/* jshint -W054 */ /* Function form of eval */
/* jshint -W069	*/ /* Dot Notation */
/* jshint -W083	*/ /* Functions Within Loop	*/

/**
* @file evt.js
* version 0.1.8
* date: 26-02-2016
*/

/**	@namespace */
var evt = {
	/**
	* @function add
	* @description Assigns the same function to multiple events
	* @memberof! evt
	
	* @param {Object} oElm DOM Element to assign events to
	* @param {string} sEvents List of events, separated by space
	* @param {Function} fnObj Function to bind to events
	* @param {boolean} [bUseCapture]

 	* @example
 	* evt.add(document.querySelector("#myid"), "mousemove touchmove", function(){...});
 	*/
	add : function(oElm, sEvents, fnObj, bUseCapture) {
		bUseCapture = bUseCapture || false;
		var
		/**	@type {Array} */
		aEvents = sEvents.split(" "),
		/**	@type {number} */
		i = aEvents.length;
		while (i--) {
			if ("addEventListener" in window) {
				oElm.addEventListener(aEvents[i], fnObj, bUseCapture);
			}
			else {
				oElm.attachEvent("on" + aEvents[i], fnObj);
			}
		}
	},

	/**
	* @function assign
	* @description Assign events from data-fn (and data-tp) attributes
	* <pre>
	* Example:
	* &lt;button data-fn="showGreeting" data-tp="load" data-pr="Hello world"&gt;
	* </pre>
	* @memberof! evt

	* @param {Object} [oParent]
	
 	* @example
 	* evt.assign();
 	* evt.assign(document.querySelector("#parentID"));
	*/
	assign : function(oParent) {
		oParent = oParent || document;
	    var
	    /**	@type {NodeList} */
		oNodes = oParent.querySelectorAll("[data-fn]"),
		/**	@type {number} */
		i = oNodes.length,
		/**	@type {string} */
		sEvtType;

        while (i--) {
            sEvtType = oNodes[i].dataset["tp"] || "click";
            if (sEvtType === "load") {
            	evt.run.call(oNodes[i], 0);
                continue;
            }
        	oNodes[i].addEventListener(sEvtType, function(e) { evt.run.call(e.target, null); }, false);
        }
	},
    
    /**
	* @function debounce
	* @description Debounces events, waits for nDelay to fire
	* @memberof! evt

    * @param {Function} oFunc Function to run every nDelay
    * @param {number} nDelay Timer, in milliseconds

 	* @example
 	* evt.debounce(xhr.suggest(...), 250);
    */
	debounce : function(oFunc, nDelay) {
		var 
		/** @type {null|number|undefined} */
		nTimer = null;
		return function () {
			var 
			/**	@type {Arguments} */
			aArgs = arguments,
			/**	@type {Object} */
			oScope = this;
			clearTimeout(nTimer);
			nTimer = setTimeout(function() { oFunc.apply(oScope, aArgs); }, nDelay);
		};
	},

	/**
	* @function fire
	* @description Fires an event added with addEventListener manually
	* @memberof! evt
	
	* @this {Object}
	* @param {string} sEvent
	
	* @example
 	* evt.fire("myEvent");
	*/	
	fire : function(sEvent) {
		if ("createEvent" in document) {
    		var 
    		/**	@type {Event} */
    		oEvent = document.createEvent("HTMLEvents");
    		oEvent.initEvent(sEvent, false, true);
    		this.dispatchEvent(oEvent);
		}
		else {
			this.fireEvent("on" + sEvent);
		}
	},

    /**
	* @function func
	* @description Returns a function from a string
	* @memberof! evt    

	* @param {string} sFunc
	
	* @example
 	* evt.func("xhr.myCustomFunc");
	*/
    func : function(sFunc) {
        var
		/**	@type {Array} 	*/
		aFunc = sFunc.split("."),
		/**	@type {number} */
		i,
		/**	@type {Object} */
		oFunc = window[aFunc[0]],
		/**	@type {number} */
		nLen = aFunc.length;

        if (nLen) for (i = 1; i < nLen; i++) oFunc = oFunc[aFunc[i]];        
        return (typeof oFunc === "function") ? oFunc : null;
    },

    /**
	* @function listen
	* @description Sets up a global event-listener, listening for elements with data-fn attributes
	* @memberof! evt
	
	* @param {Object} [oParent]
    */
    listen : function(oParent) {
    	oParent = oParent || document;
		evt.add(oParent, "click change", function(e) {
			e.preventDefault();
			var
			/**	@type {Object} */
			oElm = e.target || e.srcElement,
			/**	@type {string} */
			sFunc = oElm && oElm.getAttribute("data-fn");
			
			if (sFunc) evt.run.call(oElm, undefined);
		}, false);
    },
    
    /**
	* @function run
	* @description Wrapper-function for function/s defined in data-fn attribute. Parameters are read from data-pr attribute.
	* @memberof! evt

    * @this {Object}
    
    * @example
 	* evt.run(document.querySelector("#myID"));
    */
	run : function() {
		if (this.dataset.fn) {
			var 
			/**	@type {Array} */
			aFunc = fn["arrFromString"](this.dataset.fn, "|"),
			/**	@type {Array} */
			aParam = this.dataset.pr && fn["arrFromString"](this.dataset.pr, "|"),
			/**	@type {number} */
			i = aFunc.length,
			/**	@type {?} */
			oFunc;
			
			while (i--) {
				oFunc = evt.func(aFunc[i]);
				if (oFunc) oFunc.apply(this, aParam ? aParam[i].split("+") : "");
			}
		}
	},
    
	/**
	* @function throttle
	* @description Throttles multiple events, fires the events every threshhold (250ms)
	* @memberof! evt
	*	
	* @param {Function} fn Function to run every threshhold
	* @param {number} [threshhold] Timer
	* @param {Object} [scope] Scope of function
	
	* @example
 	* evt.throttle(onscroll, 250, window);
	*/
	throttle : function(fn, threshhold, scope) {
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
};
window["evt"] = evt;

/**
* @file fn.js
* version 0.2.3
* date: 01-02-2016
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
	}
};
window["fn"] = fn;

/**
* @file frm.js
* version 0.3.0
* date: 08-04-2016
*/

/**	@namespace */
var frm = (function () {
    "use strict";

	var 
	/**	@type {Object} */
	Settings = {};
	Settings["formId"] = "";
	Settings["groupName"] = "grp_fs";
	Settings["formAutofill"] = ".form-nav-autofill";
	Settings["formProgress"] = ".form-nav-progress";
	Settings["formReset"] = ".form-nav-reset";
	Settings["hide"] = "hide";
	Settings["nav-next"] = ".form-nav-next";
	Settings["nav-prev"] = ".form-nav-prev";
	Settings["useCache"] = true;
	
	/**	@type {Object} */
	Settings["gtm"] = {};
	Settings["gtm"]["action"] = "action";
	Settings["gtm"]["autofill"] = "autofill";
	Settings["gtm"]["autofill-error"] = "autofill-error";
	Settings["gtm"]["category"] = "forms";
	Settings["gtm"]["clear"] = "clear";
	Settings["gtm"]["field-error"] = "field-error";
	Settings["gtm"]["progress"] = "progress";
	Settings["gtm"]["step"] = "step";
	Settings["gtm"]["submit"] = "submit";

	/**
	* @function fireTrigger
	* @description Evaluates and fires trigger/s
	* @memberof! frm

	* @param {Object} oField
	*/ 	
    var fireTrigger = function(oField) {
    	var
    	/** @type {Array} */
    	aAction,
    	/** @type {Array} */
    	aActionParam,
		/** @type {Array} */
    	aActionList,
    	/** @type {Array} */
    	aActionListParam,
    	/** @type {Array} */
		aTrigger,
		/** @type {Array} */
		aTriggerParam,
		/** @type {Array} */
		aTriggerList,
		/** @type {Array} */
		aTriggerListParam,
		/** @type {boolean} */
		bRunAction,
		/** @type {number} */
		i,
		/** @type {number} */
		j;
					
		if (oField && oField.dataset["tg"] && oField.dataset["ac"]) {
			aActionList = oField.dataset["ac"].split("|");
			aTriggerList = oField.dataset["tg"].split("|");
			
			if (oField.dataset["tgp"]) aTriggerListParam = oField.dataset["tgp"].split("|");
			if (oField.dataset["acp"]) aActionListParam = oField.dataset["acp"].split("|");
			i = aTriggerList.length;
		
			/* Loop Triggers */
			while (i--) {
				aTrigger = aTriggerList[i].split("+"); 
				aTriggerParam = aTriggerListParam ? aTriggerListParam[i].split("+") : [];
				
				/* Multiple Triggers */	
				for (j = 0; j < aTrigger.length; j++) {
					bRunAction = runTrigger(oField, aTrigger[j], aTriggerParam[j]);
					if (!bRunAction) break;
				}
				
				/* If all Triggers are true, run Action */
				if (bRunAction) { 
					aAction = aActionList[i].split("+"); 
					aActionParam = aActionListParam ? aActionListParam[i].split("+") : [];
					
					/* Multiple actions */	
					for (j = 0; j < aAction.length; j++) {
						runAction(oField, aAction[j], aActionParam[j]);
					}
				}
			}
		}
    };

	/**
	* runAction
	* @param {Object} oField
	* @param {string} sAction
	* @param {Array} aParam
	*/
	var runAction = function(oField, sAction, aParam) {
		var
		/** @type {NodeList|Array|null} aElements */
		aElements,
		/** @type {number} i */
		i,
		/** @type {number} j */
		j;
		
		aParam = (aParam && aParam.length) ? aParam["split"](",") : [];		
		aElements = (aParam[0] !== "this") ? (document.querySelectorAll(aParam[0]) || [oField]) : [oField];	

		/* Get variables */
		if (aParam) {
			aParam.shift();
			for (i = 0; i < aParam.length; i++) aParam[i] = getVariable(aParam[i]);
		}
					
		if (aElements) {
			if (Settings["gtm"]["action"]) fn.gtmEvent(Settings["gtm"]["action"], Settings["gtm"]["category"], "a" + sAction, 1);
			for (j = 0; j < aElements.length; j++) {
				if (Actions[sAction]) Actions[sAction].apply(aElements[j], aParam); 
			}
		}
	};
	
	/**
	* runTrigger
	* @param {Object} oField
	* @param {string} sTrigger
	* @param {Array} aParam
	* @return {boolean}
	*/
	var runTrigger = function(oField, sTrigger, aParam) {
		var
		/** @type {NodeList|Array|null} aElements */
		aElements,
		/** @type {boolean} bRunAction */
		bRunTrigger,
		/** @type {number} i */
		i,
		/** @type {number} j */
		j;
				
		aParam = (aParam && aParam.length) ? aParam["split"](",") : [];	
		aElements = (aParam[0] !== "this") ? (document.querySelectorAll(aParam[0]) || [oField]) : [oField];
		
		/* Get variables */
		if (aParam) {
			aParam.shift();
			for (i = 0; i < aParam.length; i++) aParam[i] = getVariable(aParam[i]);
		}
				
		if (aElements) {
			for (j = 0; j < aElements.length; j++) {
				bRunTrigger = Triggers[sTrigger] && Triggers[sTrigger].apply(aElements[j], aParam);
				if (!bRunTrigger) break;
			}
		}
		return bRunTrigger;
	};

	/**
	* getVariable : Returns the value of a variable, ie. string "{{v1}}" will return v1-function from variables object: V.
	* @param {string} sVar
	* @return {*}
	*/
	var getVariable = function(sVar) {
		return sVar.replace(/{{([^{}]*)}}/g, function(a, b) {
			return V[b] ? V[b]() : a;
		});
	};
	
	
	var edit = function(oSettings) {
		var
		nLen,
		oElm,
		oForm = oSettings.formId;
		oForm.classList.add("form-edit");
		nLen = oForm.elements.length;
		
		while(nLen--) { oForm.elements[nLen].setAttribute("disabled", "disabled");}
		
		oForm.addEventListener("click", function(evt) {
			oElm = evt.target;	
			while (oElm.tagName && oElm.tagName.toLowerCase()!=="li") {
				oElm = oElm.parentNode;
			}
			if (oElm) console.log(oElm), oElm.classList.add("selected");
		}, false);
	};
	
    /**
	* init
	* @param {Object} oSettings
	*/
	var init = function(oSettings) {
		var 
		/** @type {NodeList} */
		aNext,
		/** @type {number} */
		nLen,
		/** @type {Object} */
		oAutofill,
		/** @type {Object} */
		oForm,
		/** @type {Object} */
		oProgress,
		/** @type {Object} */
		oProperty,
		/** @type {Object} */
		oReset;
		
		if (oSettings) {
			for (oProperty in oSettings) {
				if (oSettings.hasOwnProperty(oProperty)) Settings[oProperty] = oSettings[oProperty];
			}
		}
		
		if (Settings["formId"]) {
			oForm = Settings["formId"];
			Settings["gtm"]["category"] = Settings["gtm"]["category"] + ":" + (oForm.title||oForm.id);
			if (Settings["useCache"]) loadFormData(oForm); // TODO: Load from XHR
			
			/* Autocomplete */
			oAutofill = oForm.querySelector(Settings["formAutofill"]);
			
			if (oAutofill && oForm["requestAutocomplete"]) {
				oAutofill.parentNode.classList.remove(Settings["hide"]);
				oAutofill.addEventListener("click", function(){
					oForm["requestAutocomplete"]();
				});
				
				oForm.addEventListener("autocomplete", function(){
      				var
      				oActive,
      				sAutoFill = this.dataset["autofill"];
      				if(Settings["gtm"]["autofill"]) fn.gtmEvent(Settings["gtm"]["autofill"], Settings["gtm"]["category"], (oForm.title || oForm.id), 1);
      				
      				if (sAutoFill) {
		  				if (sAutoFill === "submit") {
		  					this.submit();
		  				}
		  				else {
		  					oActive = document.getElementById(sAutoFill);
		  					if (oActive) {
		  						oActive.checked = true;
		  						setProgress(oProgress, oActive);
		  					}
		  				}
		  			}
      			});
      			
      			oForm.addEventListener("autocompleteerror", function(evt) {
					oAutofill.parentNode.classList.add(Settings["hide"]);
					if(Settings["gtm"]["autofill-error"]) fn.gtmEvent(Settings["gtm"]["autofill-error"], Settings["gtm"]["category"], evt.reason, 0);
				});
			}
			
      		oProgress = oForm.querySelector(Settings["formProgress"]);
      		
      		/* Reset and sessionStorage */
      		oReset = oForm.querySelector(Settings["formReset"]);
      		if (oReset) {
				oReset.addEventListener("click", function(evt) {
					clearFormData(oForm);	
					if(Settings["gtm"]["clear"]) fn.gtmEvent(Settings["gtm"]["clear"], Settings["gtm"]["category"], (oForm.title || oForm.id), 1);
				});
			}
      		
      		/* Form Step handler */
      		aNext = oForm.querySelectorAll(Settings["nav-next"]);
      		if (aNext) {
      			nLen = aNext.length;
      			while(nLen--) {
      				aNext[nLen].addEventListener("click", function(evt){
      					evt.preventDefault();
      					validateFormStep(oForm, this.dataset.active, this.htmlFor);
      				}, false);
      			}
      		}
      		
      		/* Form Change */
			oForm.addEventListener("change", function(evt) {
				var
				/** @type {boolean} bValidField */
				bValidField = true,
				/** @type {Object} oField */
				oField = evt.target,
				/** @type {Object} oLabel */
				oLabel = oField ? oForm.querySelector("[for=\"" + oField.id + "\"]") : "";
				
				if (oLabel && oLabel.dataset["valid"] === "false") {
					bValidField = validateField(this, oField, oLabel);
					if (bValidField) oLabel.dataset["valid"] = "true";
				}
				
				fireTrigger(oField);
				
				if (oField.dataset["progress"] && oProgress) setProgress(oProgress, oField);
				if (Settings["useCache"]) saveFormData(oForm, oField);
			});
	
			/* Form Submit */
			oForm.addEventListener("submit", function(evt) {
				evt.preventDefault();
				var 
				/** @type {Object} oActive */
				oActive = oForm.querySelector("[name=\"" + Settings["groupName"] + "\"]:checked");
				validateFormStep(oForm, oActive.id, oActive.dataset["next"]);
			});
		}
	};
	
	/**
	* clearFormData
	* @param {Object} oForm
	*/
	var clearFormData = function(oForm) {
		fn.remItem(oForm.dataset["instanceid"]);
	};

	/* TODO: "eventDimension": Settings["formId"].dataset["instanceid"] */

	/**
	* loadFormData
	* @param {Object} oForm
	*/
	var loadFormData = function(oForm) {
		var
		/** @type {Object} oField */
		oField,
		/** @type {*} oJSON */
		oJSON,
		/** @type {string} sStorageID */
		sStorageID = oForm.dataset["instanceid"];
		
		oJSON = sStorageID ? JSON.parse(sessionStorage.getItem(sStorageID)) : "";
		if (oJSON) {
			for (oField in oJSON) {
				if (oJSON.hasOwnProperty(oField)) {
					// TODO: determine "checked"
					//if (oForm.elements[oField].type === "checkbox") {
					//	oForm.elements[oField].checked = (oJSON[oField]["value"] === "on" ? true : false);
					//}
					//else {
						oForm.elements[oField].value = oJSON[oField]["value"];
					//}
				}
			}
		}
	};

	
	/**
	* saveFormData
	* @param {Object} oForm
	* @param {Object} oField
	*/
	var saveFormData = function(oForm, oField) {
		var
		/** @type {*} oJSON */
		oJSON,
		/** @type {string} sStorageID */
		sStorageID = oForm.dataset["instanceid"];
		
		oJSON = JSON.parse(sessionStorage.getItem(sStorageID)) || {};
		
		// TODO : set checked / unchecked
		oJSON[oField.id] = 
		{
			"name": oField.name,
			"value": oField.value
		};
		sessionStorage.setItem(sStorageID, JSON.stringify(oJSON));
	};

	/**
	* setProgress
	* @param {Object} oProgress
	* @param {Object} oActive
	*/	
	var setProgress = function(oProgress, oActive) {
		oProgress.setAttribute("value", oActive.dataset["progress"]);	
		if(Settings["gtm"]["progress"]) fn.gtmEvent(Settings["gtm"]["progress"], Settings["gtm"]["category"], oProgress.value, 1);
	};
	
	/**
	* validateField
	* @param {Object} oForm
	* @param {Object} oField
	* @param {Object} [oLabel]
	*/
	var validateField = function(oForm, oField, oLabel) {
		if (typeof oField.willValidate !== "undefined") oField.checkValidity();
	    
	    if (!oField.validity.valid) {
			if(Settings["gtm"]["field-error"]) fn.gtmEvent(Settings["gtm"]["field-error"], Settings["gtm"]["category"], (oField.name || oField.id) + (oField.value ? ": " + oField.value : ""), 0);
			oLabel = oLabel ? oLabel : oForm.querySelector("[for=\"" + oField.id + "\"]");
			if (oLabel) oLabel.dataset["valid"] = "false";
		}
		return oField.validity.valid;
	};
	
	/**
	* validateFieldset
	* @param {Object} oForm
	* @param {Object} oFieldset
	*/
	var validateFieldset = function(oForm, oFieldset) {
		while (oFieldset.nodeName !== "FIELDSET") oFieldset = oFieldset.parentNode;
		if (!oFieldset) return false;
	  
		var
		/** @type {NodeList} aElements */
		aElements = oFieldset.querySelectorAll("input, select, textarea"),
		/** @type {boolean} bValid */
		bValid = true,
		/** @type {boolean} bFieldValid */
		bFieldValid,
		/** @type {number} i */
		i, 
		/** @type {number} nLen */
		nLen = aElements.length,
		/** @type {Object} oLegend */
		oLegend = oFieldset.querySelector("legend"); 
	  
		for (i = nLen; i--;) {
			bFieldValid = validateField(oForm, aElements[i]);
			if (!bFieldValid) bValid = false;
		}
		if (bValid && Settings["gtm"]["step"]) fn.gtmEvent(Settings["gtm"]["step"], Settings["gtm"]["category"], (oLegend ? oLegend.innerHTML : "noFieldsetName"), 1);
		return bValid;
	};

	/**
	* validateFormStep
	* @param {Object} oForm
	* @param {String} sActive
	* @param {String} sNext
	*/	
	var validateFormStep = function(oForm, sActive, sNext) {
		var
		/** @type {boolean} bValidFieldset */
		bValidFieldset,
		/** @type {Object} oActive */
		oActive = oForm.querySelector("[data-for=\"" + sActive + "\"]"),
		/** @type {Object} oNext */
		oNext = document.getElementById(sNext);
		
		bValidFieldset = validateFieldset(oForm, oActive);
      	
      	if (bValidFieldset) {
      		oNext.checked = true;
			//if (oProgress) setProgress(oProgress, oActive);				
      	}
	};

/*======= 
 ACTIONS 
=======*/

	/** @type {Object} */
	var Actions = {

		/**
		*	runTrigger
		*	@this {Element}
		*/			
		a1: {
			func: function(){ fireTrigger(this); },
			name: "Fire trigger",
			param: "element"
		},
		
		/**
		*	addClass
		*	@param {string}	value
		*	@this {Element}
		*/	
		a2: {
			func: function(value){ this.classList.add(value); },
			name: "Add class",
			param: "element,value"
		},
		
		/**
		*	removeClass
		*	@param {string}	v
		*	@this {Element}
		*/		
		a3: {
			func: function(v){ this.classList.remove(v); },
			name: "Remove class",
			param: "element,value"
		},
		
		/**
		*	toggleClass
		*	@param {string}	v
		*	@this {Element}
		*/	
		a4: {
			func: function(v){ this.classList.toggle(v); }, 
			name: "Toggle class",
			param: "element,value"
		},

		/**
		*	setChecked
		*	@this {Element}
		*/	
		a5: {
			func: function(){ this.checked = true; },
			name: "Set checked",
			param: "element"	
		},
		
		/**
		*	setUnChecked
		*	@this {Element}
		*/		
		a6: {
			func: function(){ this.checked = false; },
			name: "Set unchecked",
			param: "element"
		},

		/**
		*	setAttributeValue
		*	@param {string}	a
		*	@param {string}	v
		*	@this {Element}
		*/		
		a7: {
			func: function(a,v){ if(a && v) this[a] = v; },
			name: "Set attribute value",
			param: "element,attribute,value"
		},

		/**
		*	addNumber
		*	@param {string}	a
		*	@param {string}	v
		*	@this {Element}
		*/		
		a8: {
			func: function(a,v){ this[a] = (this[a]-0 + v); },
			name: "Add number",
			param: "element,attribute,value"
		},

		/**
		*	multiplyNumber
		*	@param {string}	a
		*	@param {string}	v
		*	@this {Element}
		*/		
		a9: {
			func: function(a,v){ this[a] = (this[a]-0 * v); },
			name: "Multiply Number",
			param: "element,attribute,value"
		},
		
		/**
		*	subtractNumber
		*	@param {string}	a
		*	@param {string}	v
		*	@this {Element}
		*/		
		a10: {
			func: function(a,v){ this[a] = (this[a]-0 - v); },
			name: "Subtract Number",
			param: "element,attribute,value"
		},

		/**
		*	setText
		*	@param {string}	v
		*	@this {Element}
		*/	
		a11: {
			func: function(v){ this.innerText = v; },
			name: "Set text",
			param: "element,,value"
		},

		/**
		*	setInnerHTML
		*	@param {string}	v
		*	@this {Element}
		*/	
		a12: {
			func: function(v){ this.innerHTML = v; },
			name: "Set innerHTML",
			param: "element,value"
		},

		/**
		*	setOuterHTML
		*	@param {string}	v
		*	@this {Element}
		*/	
		a13: {
			func: function(v){ this.outerHTML = v; },
			name: "Set outerHTML",
			param: "element,value"
		},

		/**
		*	addAttribute
		*	@param {string}	a
		*	@param {string}	v
		*	@this {Element}
		*/		
		a14: {
			func: function(a,v){ this.setAttribute(a,v); },
			name: "Add attribute",
			param: "element,attribute,value"
		},

		/**
		*	removeAttribute
		*	@param {string}	v
		*	@this {Element}
		*/	
		a15: {
			func: function(v){ this.removeAttribute(v); },
			name: "Remove attribute",
			param: "element,value"
		},
		
		/**
		*	toggleAttribute
		*	@param {string}	a
		*	@param {string}	v
		*	@this {Element}
		*/	
		a16: {
			func: function(a,v){ if(this.hasAttribute(a)){ this.removeAttribute(a); }else{ this.setAttribute(a,v);} },
			name: "Toggle Attribute",
			param: "element,attribute,value"
		},
		
		/**
		*	setOptionText
		*	@param {string}	v
		*	@this {Element}
		*/	
		a17: {
			func: function(v){ for(var i=0;i<this.options.length;i++)if(this.options[i].text===v){this.selectedIndex=i;break;}},
			name: "Set Option-Text",
			param: "element,value"
		},

		/**
		*	setValue
		*	@param {string}	v
		*	@this {Element}
		*/		
		a18: {
			func: function(v){ if(v) this.value = v; },
			name: "Set value",
			param: "element,value"
		}
	}
	
/*======== 
 TRIGGERS 
========*/

	/** @type {Object} */
	var Triggers = {
		
		t1: {
			/**
			*	runAction : For cases where you want an action to fire without conditions.
			*	@return	{Boolean}
			*/
			func: function(){ return true; },
			name: "Run action",
			param: ""
		},
		
		t2: {
			/**
			*	equals
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? (this[a] == v) : false; },
			name: "equals",
			param: "element|this,attribute|value;value"
		},
		
		t3: {
			/**
			*	doesNotEqual
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? (this[a] != v) : false; },
			name: "does not equal",
			param: "element,attribute;value"
		},
		
		t4: {
			/**
			*	containsText
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? (this[a].indexOf(v) > -1) : false; },
			name: "contains text",
			param: "element,attribute;value"
		},
		
		t5: {
			/**
			*	doesNotContainText
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? (this[a].indexOf(v) === -1) : false; },
			name: "does not contain text",
			param: "element|this,attribute|value;value"
		},

		t6: {
			/**
			*	startsWith
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/	
			func: function(a,v){ return (a && v) ? ((this[a].slice(1, v.length)) == v) : false; },
			name: "starts with",
			param: "element,attribute;value"
		},

		t7: { 
			/**
			*	doesNotStartWith
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? ((this[a].slice(1, v.length)) != v) : false; },
			name: "does not start with",
			param: "element,attribute,value"
		},

		t8: {
			/**
			*	endsWith
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(a,v){ return (a && v) ? ((this[a].slice((this.value.length-v.length), v.length)) == v) : false; },
			name: "ends with",
			param: "element,attribute,value"
		},

		t9: {
			/**
			*	doesNotEndWith
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? ((this[a].slice((this.value.length-v.length), v.length)) != v) : false; },
			name: "does not end with",
			param: "element,attribute,value"
		},
		
		t10: {
			/**
			*	matchesRegEx
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? (new RegExp(v, "gi").test(this[a])) : false; },
			name: "matches regEx",
			param: "element,attribute,value"
		},

		t11: {
			/**
			*	doesNotMatchRegEx
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? (new RegExp("^"+v, "gi").test(this[a])) : false; },
			name: "does not match regEx",
			param: "element,attribute,value"
		},
		

		t12: {
			/**
			*	lessThan
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(a,v){ return (a && v) ? (this[a]-0 < v) : false; },
			name: "less than",
			param: "element,attribute,value"
		},

		t13: {
			/**
			*	lessThanOrEqual
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(a,v){ return (a && v) ? (this[a]-0 <= v) : false; },
			name: "less than or equal",
			param: "element,attribute,value"
		},

		t14: {
			/**
			*	greaterThan
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function(a,v){ return (a && v) ? (this[a]-0 > v) : false; },
			name: "greater than",
			param: "element,attribute,value"
		},

		t15: {
			/**
			*	greterThanOrEqual
			*	@param {string}	a
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/
			func: function (a,v){ return (a && v) ? (this[a]-0 >= v) : false; },
			name: "greater than or equal",
			param: "element,attribute,value"
		},

		t16: {
			/**
			*	isEmpty
			*	@param {string}	a
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(a){ return a ? (!this[a].length) : false; },
			name: "is empty",
			param: "element,attribute,value"
		},

		t17: {
			/**
			*	isNotEmpty
			*	@param {string}	a
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(a){ return a ? (this[a].length > 0) : false; },
			name: "is not empty",
			param: "element,attribute,value"
		},

		t18: {
			/**
			*	isChecked
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(){ return this.checked; },
			name: "is checked",
			param: "element"
		},

		t19: {
			/**
			*	isNotChecked
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(){ return !this.checked; },
			name: "is not checked",
			param: "element"
		},

		t20: {
			/**
			*	doesNotContainText
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(v){ return v ? this.classList.contains(v) : false; },
			name: "does not contain text",
			param: "element,attribute,value"
		},

		t21: {
			/**
			*	doesNotHaveClass
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/	
			func: function(v){ return v ? !this.classList.contains(v) : false; },
			name: "does not have class",
			param: "element,value"
		},

		t22: {
			/**
			*	hasAttribute
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(v){ return v ? this.hasAttribute(v) : false; },
			name: "has attribute",
			param: "element,value"
		},

		t23: {
			/**
			*	doesNotHaveAttribute
			*	@param {string}	v
			*	@this {Element}
			*	@return	{Boolean}
			*/		
			func: function(v){ return v ? !this.hasAttribute(v) : false; },
			name: "does not have attribute",
			param: "element,value"
		}
	};
/*========= 
 VARIABLES 
=========*/

	/** @type {Object} D */
	var D = new Date();
	
	/** @type {Object} V */
	var V = {};
	
	/**
	*	day
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/		
	V["v1"] = function(d){ d=d?d:D; return d.toString(); };

	/**
	*	daysInMonth
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/		
	V["v2"] = function(d){ d=d?d:D; return new Date(d.getUTCFullYear(), d.getMonth()+1, 0).getDate().toString(); };
	
	/**
	*	formattedDate
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/		
	V["v3"] = function(d){ d=d?d:D; return fn.padNumber(d.getDate()) + "-" + fn.padNumber(d.getMonth()+1) + "-" + d.getUTCFullYear(); };

	/**
	*	month
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/		
	V["v4"] = function(d){ d=d?d:D; return (d.getMonth()+1).toString(); };
	
	/**
	*	time
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/		
	V["v5"] = function(d){ d=d?d:D; return d.getHours() + ":" + d.getMinutes(); };

	/**
	*	timestamp
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/			
	V["v6"] = function(d){ d=d?d:D; return V["v3"](d) + " " + V["v5"](d); };

	/**
	*	week
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/			
	V["v7"] = function(d){ 
		d=d?d:D; 
		d = new Date(d);
	    d.setHours(0, 0, 0);
	    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1) / 7);	
	};

	/**
	*	year
	*	@param {Object}	[d] Date 
	*	@return	{string}
	*/				
	V["v8"] = function(d){ d=d?d:D; return d.getUTCFullYear().toString(); };
	
	/**
	*	url
	*	@return	{string}
	*/				
	V["v9"] = function(){ return window.location.href; };

	/**
	*	hash
	*	@return	{string}
	*/				
	V["v10"] = function(){ return window.location.hash; };
	
	/**
	*	optionText
	*	@param {Object}	o
	*	@return	{string}
	*/			
	V["v11"] = function(o){ return o.options[o.selectedIndex].text; };

	/**
	*	optionValue
	*	@param {Object}	o
	*	@return	{string}
	*/				
	V["v12"] = function(o){ return o.options[o.selectedIndex].value; };
	
	/*	Expose public functions */
    return {
    	Actions: Actions,
    	Triggers: Triggers,
    	edit: edit,
        init: init
    };
})();
window["frm"] = frm;

/**
* @file js
* version 1.2.3
*/

/* jshint -W069	*/ /* Dot Notation */

/**	@namespace */
var h5d = (function () {
	"use strict"; 
  	
  	var
	/** @type {Object} */
	atrGlobal =
	{
		accesskey: "",
		class: "",
		contenteditable: ["contenteditable"],
		contextmenu: "",
		dir: ["ltr", "rtl", "auto"],
		draggable: ["true", "false"],
		dropzone: ["copy", "move", "link"],
		hidden: "",
		id: "",
		inert: ["inert"],
		itemid: "",
		itemprop: "",
		itemref: "",
		itemscope: "",
		itemtype: "",
		lang: "",
		role: "",
		spellcheck: ["default", "false", "true"],
		style: "",
		tabindex: 0,
		title: "",
		translate: ["yes", "no"]
	},
  
	/** @type {Object} */
	atrOther =
	{
		accept: "",
		"accept-charset": "",
		action: "",
		allowfullscreen: ["true"],
		alt: "",
		async: ["async"],
		autocomplete: ["additional-name", "address-level1", "address-level2", "address-level3", "address-level4", "address-line1", "address-line2", "address-line3", "bday", "bday-day", "bday-month", "bday-year", "cc-additional-name", "cc-csc", "cc-exp", "cc-exp-month", "cc-exp-year", "cc-family-name", "cc-given-name", "cc-name", "cc-number", "cc-type", "country", "country-name", "current-password", "email", "family-name", "given-name", "honorific-prefix", "honorific-suffix", "impp", "language", "name", "new-password", "nickname", "organization", "organization-title", "photo", "postal-code", "sex", "street-address", "tel", "tel-area-code", "tel-country-code", "tel-extension", "tel-local", "tel-local-prefix", "tel-local-suffix", "tel-national", "transaction-amount", "transaction-currency", "url", "username"],
		"autocomplete-prefix" : ["billing", "home", "mobile", "shipping", "work"],
		autocomplete_form: ["on", "off"],
		autofocus: ["autofocus"],
		autoplay: ["autoplay"],
		autosave: ["autosave"],
		buffered: "",
		challenge: "",
		charset: ["US-ASCII", "ISO-8859-1", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "ISO-8859-10", "Shift_JIS", "EUC-JP", "ISO-2022-KR", "EUC-KR", "ISO-2022-JP", "ISO-2022-JP-2", "ISO-8859-6-E", "ISO-8859-6-I", "ISO-8859-8-E", "ISO-8859-8-I", "GB2312", "Big5", "KOI8-R"],
		checked: ["true"],
		cite: "",
		color: "",
		cols: 0,
		colspan: 0,
		command: "",
		compact: ["compact"],
		content: "",
		controls: ["controls"],
		coords: "",
		crossorigin: ["anonymous", "use-credentials"],
		datetime: "",
		default: "",
		defer: ["defer"],
		disabled: ["disabled"],
		download: "",
		enctype: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
		for: "",
		form: "",
		formaction: "",
		formenctype: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
		formmethod: ["get", "post"],
		formnovalidate: ["formnovalidate"],
		formtarget: ["_self", "_blank", "_parent", "_top"],
		headers: "",
		height: 0,
		high: 0,
		href: "",
		hreflang: "",
		"http-equiv": ["content-type", "default-style", "refresh"],
		icon: "",
		inputmode: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana-name", "kana", "katakana", "numeric", "tel", "email", "url"], 
		ismap: ["ismap"],
		keytype: ["rsa", "dsa", "ec"],
		kind: ["captions", "chapters", "descriptions", "metadata", "subtitles"],
		label: "",
		list: "",
		loop: ["loop"],
		low: 0,
		manifest: "",
		max: 0,
		maxlength: 0,
		media: "",
		method: ["get", "post"],
		min: 0,
		multiple: ["multiple"],  
		muted: ["muted"],
		name: "",
		nameMeta : ["application-name", "author", "description", "generator", "keywords"],
		novalidate: ["novalidate"],
		nowrap: ["no", "yes"],
		open: ["open"],
		optimum: 0,
		pattern: "",
		ping: "", 
		placeholder: "",
		played: "",
		poster: "",
		preload: ["auto", "metadata", "none"],
		radiogroup: "",
		readonly: ["readonly"],
		rel: "",
		results: 0,
		required: ["required"],
		reversed: ["reversed"],
		rows: 0,
		rowspan: 0,
		sandbox: ["allow-same-origin", "allow-top-navigation", "allow-forms", "allow-forms"],
		scope: ["col", "colgroup", "row", "rowgroup"],
		scoped: ["scoped"],
		seamless: ["seamless"],
		selected: ["selected"],
		selectionDirection: ["backward", "forward", "none"],
		selectionEnd: 0,
		selectionStart: 0, 
		shape: ["circle", "default", "poly", "rect"],
		size: 0,
		sizes: "",
		span: 0,
		src: "",
		srcdoc: "",
		srclang: "",
		start: 0,
		step: 0,
		target: ["_self", "_blank", "_parent", "_top"],
		type: "",
		type_button: ["button", "reset", "sumbit"],
		type_command: ["checkbox", "command", "radio"],
		type_input: ["button", "checkbox", "color", "date", "datetime", "email", "file", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"],
		type_link: ["alternate", "archives", "author", "bookmark", "external", "first", "help", "icon", "index", "last", "license", "next", "nofollow", "noreferrer", "pingback", "prefetch", "prev", "search", "stylesheet", "sidebar", "tag", "up"],
		type_list: ["a", "A", "i", "I", "1"],
		type_menu: ["context", "toolbar", "list"],
		type_script: ["text/javascript", "text/ecmascript", "application/javascript", "application/ecmascript"],
		usemap: "",
		value: "",
		value_num: 0,
		value_list: 0,
		volume: 0,
		width: 0,
		wrap: ["hard", "soft"],
		xmlns: ""
	},

	/** @type {Object} */
	cntTypes =  
	{
		e: "Embedded",
		f: "Flow",
		h: "Heading",
		i: "Interactive",
		m: "Metadata",
		p: "Phrasing",
		s: "Sectioning"
	},
  
	/** @type {Object} */
	evtGlobal =
	{
		onabort: "",
		onblur: "",
		oncancel: "",
		oncanplay: "",
		oncanplaythrough: "",
		onchange: "",
		onclick: "",
		onclose: "",
		oncontextmenu: "",
		oncuechange: "",
		ondblclick: "",
		ondrag: "",
		ondragend: "",
		ondragenter: "",
		ondragexit: "",
		ondragleave: "",
		ondragover: "",
		ondragstart: "",
		ondrop: "",
		ondurationchange: "",
		onemptied: "",
		onended: "",
		onerror: "",
		onfocus: "",
		oninput: "",
		oninvalid: "",
		onkeydown: "",
		onkeypress: "",
		onkeyup: "",
		onload: "",
		onloadeddata: "",
		onloadedmetadata: "",
		onloadstart: "",
		onmousedown: "",
		onmouseenter: "",
		onmouseleave: "",
		onmousemove: "",
		onmouseout: "",
		onmouseover: "",
		onmouseup: "",
		onmousewheel: "",
		onpause: "",
		onplay: "",
		onplaying: "",
		onprogress: "",
		onratechange: "",
		onreset: "",
		onresize: "",
		onscroll: "",
		onseeked: "",
		onseeking: "",
		onselect: "",
		onshow: "",
		onsort: "",
		onstalled: "",
		onsubmit: "",
		onsuspend: "",
		ontimeupdate: "",
		ontoggle: "",
		onvolumechange: "",
		onwaiting: ""
	},
	
	/** @type {Object} */
	evtOther = {
		onformchange: "", 
		onforminput: "",
		onreadystatechange: "",
		onafterprint: "", 
		onbeforeprint: "", 
		onbeforeunload: "", 
		onhaschange: "", 
		onmessage: "", 
		onoffline: "", 
		ononline: "", 
		onpagehide: "", 
		onpageshow: "", 
		onpopstate: "", 
		onredo: "", 
		onstorage: "", 
		onundo: "", 
		onunload: ""
	},

	/** @type {Object} */
	waiRolesGlobalStates =
	[
		"aria-atomic", 
		"aria-busy", 
		"aria-controls", 
		"aria-describedby", 
		"aria-disabled", 
		"aria-dropeffect", 
		"aria-flowto", 
		"aria-grabbed", 
		"aria-haspopup", 
		"aria-hidden", 
		"aria-invalid", 
		"aria-label", 
		"aria-labelledby", 
		"aria-live", 
		"aria-owns", 
		"aria-relevant"
	],
  
	/** @type {Object} */
	waiRoles = 
  	{
		/* Abstract */
	    command:
	    {
	    },
	    composite:
	    {
			a: ["aria-activedescendant#"]
	    },
	    input:
	    {
	    },
	    landmark:
	    {
			a: ["aria-expanded"]
	    },
	    range:
	    {
			a: ["aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"]
	    },
	    roletype:
	    {
	    },
	    section:
	    {
			a: ["aria-expanded#"]
	    },
	    sectionhead:
	    {
			a: ["aria-expanded#"]
	    },
	    select:
	    {
			a: ["aria-activedescendant", "aria-expanded"]
	    },
	    structure:
	    {
	    },
	    widget:
	    {
	    },
	    window:
	    {
	    },
    
		/* Landmark */
		application:
		{
			a: ["aria-expanded"]
		},
		banner:
		{
			a: ["aria-expanded"]
		},
		complementary:
		{
			a: ["aria-expanded"]
		},
		contentinfo:
		{
			a: ["aria-expanded"]
		},
		form:
		{
			a: ["aria-expanded"]
		},
		main:
		{
			a: ["aria-expanded"]
		},
		navigation:
		{
			a: ["aria-expanded"]
		},
		search:
		{
			a: ["aria-expanded"]
		},

		/* Strucure */
		article:
		{
			a: ["aria-expanded"]
		},
		columnheader:
		{
			a: ["aria-sort#", "aria-expanded", "aria-readonly", "aria-required", "aria-selected"]
		},
		definition:
		{
			a: ["aria-expanded"]
		},
		directory:
		{
			a: ["aria-expanded"]
		},
		document:
		{
			a: ["aria-expanded#"]
		},
		group:
		{
			a: ["aria-activedescendant#", "aria-expanded"]
		},
		heading:
		{
			a: ["aria-level#", "aria-expanded"]
		},
		img:
		{
			a: ["aria-expanded"]
		},
		list:
		{
			a: ["aria-expanded"]
		},
		listitem:
		{
			a: ["aria-level#", "aria-posinset#", "aria-setsize#", "aria-expanded"]
		},
		math:
		{
			a: ["aria-expanded"]
		},
		note:
		{
			a: ["aria-expanded"]
		},
		presentation:
		{
		},
		region:
		{
			a: ["aria-expanded"]
		},
		row:
		{
			a: ["aria-level", "aria-selected", "aria-activedescendant", "aria-expanded"]
		},
		rowgroup: 
		{
			a: ["aria-activedescendant", "aria-expanded"]
		},
		rowheader:
		{
			a: ["aria-sort#", "aria-expanded", "aria-readonly", "aria-required", "aria-selected"]
		},
		separator:
		{
			a: ["aria-expanded#", "aria-orientation#"]
		},
		toolbar:
		{
			a: ["aria-activedescendant", "aria-expanded"]
		},

		/* UI Widget */
		combobox:
    	{
			a: ["aria-expanded*", "aria-autocomplete#", "aria-required#", "aria-activedescendant"]
		},
		grid:
		{
			a: ["aria-level#", "aria-multiselectable#", "aria-readonly#", "aria-activedescendant", "aria-expanded"]
		},
		listbox:
		{
			a: ["aria-multiselectable#", "aria-required#", "aria-activedescendant", "aria-expanded"]
		},
		menu:
		{
			a: ["aria-activedescendant", "aria-expanded"]
		},
		menubar:
		{
			a: ["aria-activedescendant", "aria-expanded"]
		},
		radiogroup:
		{
			a: ["aria-required#", "aria-activedescendant", "aria-expanded"]
		},
		tablist:
		{
			a: ["aria-level#", "aria-activedescendant", "aria-expanded"]
		},
		tree:
		{
			a: ["aria-multiselectable#", "aria-required#", "aria-activedescendant", "aria-expanded"]
		},
		treegrid:
		{
			a: ["aria-activedescendant", "aria-expanded", "aria-level", "aria-multiselectable", "aria-readonly", "aria-required"]
		},

		/* Widget */
		alert:
		{
			a: ["aria-expanded"]
		},
		alertdialog:
		{
			a: ["aria-expanded"]
		},
		button:
		{
			a: ["aria-expanded#", "aria-pressed#"]
		},
		checkbox:
		{
			a: ["aria-checked*"]
		},
		dialog:
		{
			a: ["aria-expanded"]
		},
		gridcell:
		{
			a: ["aria-readonly#", "aria-required#", "aria-selected#", "aria-expanded"]
		},
		link:
		{
			a: ["aria-expanded#"]
		},
		log:
		{
			a: ["aria-expanded"]
		},
		marquee:
		{
			a: ["aria-expanded"]
		},
		menuitem:
		{
		},
		menuitemcheckbox:
		{
			a: ["aria-checked*"]
		},
		menuitemradio:
		{
			a: ["araia-checked*", "aria-posinset", "aria-selected", "aria-setsize"]
		},
		option:
		{
			a: ["aria-checked#", "aria-posinset#", "aria-selected#", "aria-setsize#", "aria-expanded"]
		},
		progressbar:
		{
			a: ["aria-relevant", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"]
		},
		radio:
		{
			a: ["aria-checked*", "aria-posinset", "aria-selected", "aria-setsize"]
		},
		scrollbar:
		{
			a: ["aria-controls*", "aria-orientation*", "aria-valuemax*", "aria-valuemin*", "aria-valuenow*", "aria-valuetext"]
		},
		slider:
		{
			a: ["aria-valuemax*", "aria-valuemin*", "aria-valuenow*", "aria-orientation#", "aria-valuetext"]
		},
		spinbutton:
		{
			a: ["aria-valuemax*", "aria-valuemin*", "aria-valuenow*", "aria-orientation#", "aria-valuetext"]
		},
		status:
		{
			a: ["aria-expanded"]
		},
		tab:
		{
			a: ["aria-selected#", "aria-expanded"]
		},
		tabpanel:
		{
			a: ["aria-expanded"]
		},
		textbox:
		{
			a: ["aria-activedescendant#", "aria-autocomplete#", "aria-multiline#", "aria-readonly#", "aria-required#"]
		},
		timer:
		{
			a: ["aria-expanded"]
		},
		tooltip:
		{
			a: ["aria-expanded"]
		},
		treeitem:
		{
			a: ["aria-describedby", "aria-checked", "aria-expanded", "aria-posinset", "aria-selected", "aria-setsize"]
		} 
	},
  
	/** @type {Object} */
	waiStates = 
	{
		"aria-activedescendant": "",
		"aria-atomic": ["true", "false*"],
		"aria-autocomplete": ["inline", "list", "both", "none*"],
		"aria-busy": ["true", "false*"],
		"aria-checked": ["true", "false", "mixed", "undefined*"],
		"aria-controls": "",
		"aria-describedby": "",
		"aria-disabled": ["true", "false*"],
		"aria-dropeffect": ["copy", "move", "link", "execute", "popup", "none*"],
		"aria-expanded": ["true", "false", "undefined*"],
		"aria-flowto": "",
		"aria-grabbed": ["true", "false", "undefined*"],
		"aria-haspopup": ["true", "false*"],
		"aria-hidden": ["true", "false*"],
		"aria-invalid": ["grammar", "false*", "spelling", "true"],
		"aria-label": "",
		"aria-labelledby": "",
		"aria-level": 0,
		"aria-live": ["off*", "polite", "assertive"],
		"aria-multiline": ["true", "false*"],
		"aria-multiselectable": ["true", "false*"],
		"aria-orientation": ["vertical", "horizontal*"],
		"aria-owns": "",
		"aria-posinset": 0,
		"aria-pressed": ["true", "false", "mixed", "undefined*"],
		"aria-readonly": ["true", "false*"],
		"aria-relevant": ["additions", "removals", "text", "all", "additions text*"],
		"aria-required": ["true", "false*"],
		"aria-selected": ["true", "false", "mixed", "undefined*"],
		"aria-setsize": 0,
		"aria-sort": ["ascending", "descending", "none*", "other"],
		"aria-valuemax": 0,
		"aria-valuemin": 0,
		"aria-valuenow": 0,
		"aria-valuetext": ""
	},

/***********************************
	ELEMENTS
	a : Array of {atrOther}-keys.
	c : Content Types
	e : Array of events, that are not in Keyboard- or Mouse-events
	s : Self-Closing Tag (Boolean, omit if false [default])
	w : Array of waiRoles-keys
***********************************/

	/** @type {Object} */
	htmlTags =
	{ 
    
	    a: 
	    {
			a: ["download", "href", "hreflang", "media", "ping", "rel", "target", "type"],
			c: ["f", "i", "p"],
			w: ["link"]
	    },
  
	    abbr: 
	    {
	    	c: ["f", "p"]
	    },
    
		address: 
		{
			c: ["f"]
		},
		
		area: 
		{
			a: ["alt", "coords", "download", "href", "hreflang", "media", "rel", "shape", "target", "type"],
			c: ["f", "p"],
			s: true
		},
		
		article:
		{ 
			c: ["f", "s"],
			w: ["article", "application", "document", "main"]
		},
		
		aside: 
		{
			c: ["f", "s"]
		},
		
		audio: 
		{
			a: ["autoplay", "buffered", "controls", "loop", "muted", "played", "preload", "src", "volume"],
			c: ["e", "f", "i", "p"]
		},
		
		b: 
		{
			c: ["f", "p"],
			s: true
		},
		
		base: 
		{
			a: ["href", "target"],
			c: ["m"],
			s: true
		},
		
		bdi: 
		{
			c: ["f", "p"]
		},
		
		bdo: 
		{
			c: ["f", "p"]
		},
		
		blockquote: 
		{
			a: ["cite"],
			c: ["f"],
		},
		
		body: 
		{
			e: ["onreadystatechange", "onafterprint", "onbeforeprint", "onbeforeunload", "onhaschange", "onmessage", "onoffline", "ononline", "onpagehide", "onpageshow", "onpopstate", "onredo", "onstorage", "onundo", "onunload"]
		},
		
		br: 
		{
			c: ["f", "p"],
			s: true
		},
		
		button: 
		{
			a: ["autofocus", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "type_button", "value"],
			c: ["f", "i", "p"],
			w: ["button"]
		},
		
		canvas: 
		{
			a: ["height", "width"],
			c: ["e", "f", "p"]
		},
		
		caption: 
		{
		},
		
		cite: 
		{
			c: ["f", "p"]
		},
		
		code: 
		{
			c: ["f", "p"]
		},
		
		col: 
		{
			a: ["span"],
			s: true
		},
		
		colgroup: 
		{
			a: ["span"]
		},
		
		command: 
		{
			a: ["checked", "disabled", "icon", "label", "radiogroup", "type_command"],
			s: true,
			w: ["command"]
		},
		
		content: 
		{
		},
		
		data: 
		{
			a: ["value"],
			c: ["f", "p"]
		},
		
		datalist: 
		{
			c: ["f", "p"]
		},
		
		dd: 
		{
			a: ["nowrap"]
		},
		
		decorator: 
		{
		},
		
		del: 
		{
			a: ["cite", "datetime"],
			c: ["f", "p"]
		},
		
		details: 
		{
			a: ["open"],
			c: ["f", "i"],
		},
		
		dfn: 
		{
			c: ["f", "p"]
		},
		
		dialog: 
		{
			a: ["open"],
			c: ["f"]
		},
		
		div: 
		{
			c: ["f"]
		},
		
		dl: 
		{
			a: ["compact"],
			c: ["f"]
		},
		
		dt: 
		{
		},
		
		element: 
		{
		},
		
		em: 
		{
			c: ["f", "p"]
		},
		
		embed: 
		{
			a: ["height", "src", "type", "width"],
			c: ["e", "f", "i", "p"],
			s: true
		},
		
		fieldset: 
		{
			a: ["disabled", "form", "name"],
			c: ["f"],
			w: ["group"]
		},
		
		figcaption: 
		{
		},
		
		figure: 
		{
			c: ["f"]
		},
		
		footer: 
		{
			c: ["f"],
		},
		
		form: 
		{
			a: ["accept-charset", "action", "autocomplete_form", "enctype", "method", "name", "novalidate", "target"],
			c: ["f"],
			e: ["onformchange", "onforminput"],
			w: ["form"]
		},
		
		h1: 
		{
			c: ["f", "h"],
			w: ["heading"]
		},
		
		h2: 
		{
			c: ["f", "h"],
			w: ["heading"]
		},
		
		h3: 
		{
			c: ["f", "h"],
			w: ["heading"]    
		},
		
		h4: 
		{
			c: ["f", "h"],
			w: ["heading"]  
		},
		
		h5: 
		{
			c: ["f", "h"],
			w: ["heading"]    
		},
		
		h6: 
		{
			c: ["f", "h"],
			w: ["heading"]    
		},
		
		head: 
		{
		},
		
		header: 
		{
			c: ["f"]
		},
		
		hr: 
		{
			a: ["color"],
			c: ["f"],
			s: true,
			w: ["separator"]
		},
		
		html: 
		{
			a: ["manifest"]
		},
		
		i: 
		{
			c: ["f", "p"],
		},
		
		iframe: 
		{
			a: ["allowfullscreen", "height", "name", "sandbox", "seamless", "src", "srcdoc", "width"],
			c: ["e", "f", "i", "p"],
			w: ["region"]
		},
		
		img: 
		{
			a: ["alt", "crossorigin", "height", "ismap", "src", "usemap", "width"],
			c: ["e", "f", "i", "p"],
			s: true,
			w: ["img"]
		},
		
		input: 
		{
			a: ["autofocus", "autosave", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "inputmode", "name", "selectionDirection", "type_input"],
			c: ["f", "i", "p"],
			e: ["onformchange", "onforminput"],
			s: true,
			
			type: 
			{
				button: 
				{
				}, 
			
				checkbox: 
				{
					a: ["checked", "required", "value"],
					w: ["checkbox"]
				},
				
				color: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "required", "value"]
				},
				
				date: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "readonly", "required", "step", "value"]
				},
				
				datetime: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "max", "min", "readonly", "required", "step", "value"]
				},
				
				email: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "multiple", "pattern", "placeholder", "readonly", "required", "size", "value"],
				},
				
				file: 
				{
					a: ["accept", "multiple", "required", "value"]
				},
				
				image: 
				{
					a: ["height", "src", "width", "value"]
				},
				
				month: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "readonly", "required", "value_num"]  
				},
				
				number: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "max", "min", "readonly", "required", "step", "value_num"]
				},
				
				password: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "maxlength", "readonly", "required", "size", "value"]
				},
				
				radio: 
				{
					a: ["checked", "required", "value"],
					w: ["radio"]
				},
				
				range: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "max", "min", "required", "step", "value_num"]
				},
				
				reset: 
				{
				},
				
				search: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "pattern", "placeholder", "readonly", "required", "results", "size", "value"]
				},
				
				submit: 
				{
				},
				
				tel: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "pattern", "placeholder", "readonly", "required", "size", "value"]
				},
				
				text: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "pattern", "placeholder", "readonly", "required", "size", "value"]      
				},
				
				time: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "readonly", "required", "value"] 
				},
				
				url: 
				{
					a: ["autocomplete", "autocomplete-prefix", "list", "pattern", "placeholder", "readonly", "required", "size", "value"]
				},
				
				week: 
				{
					a: ["autocomplete", "autocomplete-prefix", "readonly", "required", "value_num"] 
				}
			}
		},
		
		ins: 
		{
			a: ["cite", "datetime"],
			c: ["f", "p"]
		},
		
		kbd: 
		{
			c: ["f", "p"]
		},
		
		keygen: 
		{
			a: ["autofocus", "challenge", "disabled", "form", "keytype", "name"],
			c: ["f", "i", "p"],
			s: true
		},
		
		label: 
		{
			a: ["for", "form"],
			c: ["f", "i", "p"]
		},
		
		legend: 
		{
		},
		
		li: 
		{
			a: ["type_list", "value_list"],
			w: ["listitem"]
		},
		
		link: 
		{
			a: ["crossorigin", "href", "hreflang", "media", "rel", "sizes", "type_link"],
			c: ["f", "m", "p"],
			s: true
		},
		
		main: 
		{
			c: ["f"]
		},
		
		map: 
		{
			a: ["name"],
			c: ["f", "p"]
		},
		
		mark: 
		{
			c: ["f", "p"]
		},
		
		math: 
		{
			a: ["xmlns"],
			c: ["e", "f", "p"]
		},
		
		
		menu: 
		{
		a: ["label", "type_menu"],
		c: ["f"],
		w: ["menu"]
		},
		
		menuitem: 
		{
			a: ["checked", "command", "default", "disabled", "icon", "label", "radiogroup", "type_command"]
		},
		
		meta: 
		{
			a: ["charset", "content", "http-equiv", "namemeta"],
			c: ["f", "m", "p"],
			s: true
		},
		
		meter: 
		{
			a: ["form", "high", "low", "max", "min", "optimum", "value_num"],
			c: ["f", "p"]
		},
		
		nav: 
		{
			c: ["f", "s"]
		},
		
		noscript: 
		{
			c: ["f", "m", "p"]
		},
		
		object: 
		{
			a: ["form", "height", "name", "type", "usemap", "width"],
			c: ["e", "f", "i", "p"]
		},
		
		ol: 
		{
			a: ["compact", "reversed", "start", "type_list"],
			c: ["f"],
			w: ["list"]
		},
		
		optgroup: 
		{
			a: ["disabled", "label"]
		},
		
		option: 
		{
			a: ["disabled", "label", "selected", "value"]
		},
		
		output: 
		{
			a: ["for", "form", "name"],
			c: ["f", "p"]
		},
		
		p: 
		{
			c: ["f"]
		},
		
		param: 
		{
			a: ["name", "value"],
			s: true
		},
		
		pre: 
		{
			c: ["f"]
		},
		
		progress: 
		{
			a: ["max", "value_num"],
			c: ["f", "p"]
		},
		
		q: 
		{
			a: ["cite"],
			c: ["f", "p"]
		},
		
		rp: 
		{
		},
		
		rt: 
		{
		},
		
		ruby: 
		{
			c: ["f", "p"]
		},
		
		s: 
		{
			c: ["f", "p"]
		},
		
		samp: 
		{
			c: ["f", "p"]
		},
		
		script: 
		{
			a: ["async", "crossorigin", "defer", "src", "type_script"],
			c: ["f", "m", "p"]
		},
		
		section: 
		{
			c: ["f", "s"],
			w: ["region", " alert", " alertdialog", " application", " contentinfo", " dialog", " document", " log", " main", " marquee", " presentation", " search", " status"]
		},
				
		select: 
		{
			a: ["autofocus", "disabled", "form", "multiple", "name", "required", "size"],
			c: ["f", "i", "p"],
			w: ["combobox", "listbox"]
		},
		
		shadow: 
		{
		},
		
		small: 
		{
			c: ["f", "p"]
		},
		
		source: 
		{
			a: ["media", "source", "type"],
			s: true
		},
		
		span: 
		{
			c: ["f", "p"]
		},
		
		strong: 
		{
			c: ["f", "p"]
		},
		
		style: 
		{
			a: ["disabled", "media", "scoped", "title", "type"],
			c: ["f", "m"]
		},
		
		sub: 
		{
			c: ["f", "p"]
		},
		
		summary: 
		{
		},
		
		sup: 
		{
			c: ["f", "p"]
		},
		
		svg: 
		{
			c: ["e", "f", "p"],
			a: ["height", "width", "xmlns"]
		},
		
		table: 
		{
			c: ["f"],
			w: ["grid"]
		},
		
		tbody: 
		{
			w: ["rowgroup"]
		},
		
		td: 
		{
			a: ["colspan", "headers", "rowspan"],
			w: ["gridcell"]
		},
		
		template: 
		{
			a: ["content"],
			c: ["f", "m", "p"]
		},
		
		textarea: 
		{
			a: ["autofocus", "cols", "disabled", "form", "maxlength", "name", "placeholder", "readonly", "required", "rows", "selectionDirection", "selectionEnd", "selectionStart", "wrap"],
			c: ["f", "i", "p"],
			w: ["textbox"]
		},
		
		tfoot: 
		{
			w: ["rowgroup"]
		},
		
		th: 
		{
			a: ["colspan", "header", "rowspan", "scope"],
			w: ["columnheader", "rowheader"]
		},
		
		thead: 
		{
			w: ["rowgroup"]
		},
		
		time: 
		{
			a: ["datetime"],
			c: ["f", "p"]
		},
		
		title: 
		{
			c: ["m"]
		},
		
		tr: 
		{
			w: ["row"]
		},
		
		track: 
		{
			a: ["default", "kind", "label", "src", "srclang"],
			s: true
		},
		
		u: 
		{
			c: ["f", "p"]
		},
		
		ul: 
		{
			c: ["f"],
			w: ["list"]
		},
		
		var: 
		{
			c: ["f", "p"]
		},
		
		video: 
		{
			a: ["autoplay", "buffered", "controls", "crossorigin", "height", "loop", "muted", "played", "poster", "preload", "src", "width"],
			c: ["e", "f", "i", "p"]
		},
		
		wbr: 
		{
			c: ["f", "p"],
			s: true  
		}
	};

    /**
    * @function info
    * @description Returns an Object with [oElm's] Attributes, Events, Wai-Aria-Roles etc.
    * @memberof! h5d
    
    * @param {Object} oElm
    * @return {Object}
    */
	var info = function(oElm) {
		var
		/** @type {string} */
		sTag = oElm.tagName.toLowerCase(),
		/** @type {Array} */
		aAtrElem = htmlTags[sTag]["a"] ? getObjectValues(htmlTags[sTag].a, atrOther, oElm) : [],
		/** @type {Array} */
		aAtrGlbl = getObjectValues(0, atrGlobal, oElm),
		/** @type {Array} */
		aAtrType = (sTag === "input" ? getObjectValues(htmlTags[sTag].type[oElm.type].a, atrOther, oElm) : []),
		/** @type {Array} */
		aDataSet = [],
		/** @type {Array} */
		aEvntElem = htmlTags[sTag]["e"] ? getObjectValues(htmlTags[sTag].e, evtOther, oElm) : [],
		/** @type {number} */
		i;
		
		if (oElm.dataset) {
			for (i in oElm.dataset) {
				if (oElm.dataset.hasOwnProperty(i)) { 
					aDataSet.push(["data-" + i, "", oElm.dataset[i]]); 
				}
			}
		}
		
		return {
			Attributes: aAtrElem.concat(aAtrGlbl).concat(aAtrType).sort(),
			ContentTypes : htmlTags[sTag]["c"] ? getObjectValues(htmlTags[sTag].c, cntTypes, oElm).sort() : [],
			DataSet : aDataSet.sort(),
			Events : aEvntElem.concat(getObjectValues(0, evtGlobal, oElm)).sort(),
			SelfClosing : (htmlTags[sTag]["s"] || false),
			TagName : sTag,
			WaiAria : getWaiAriaStates(htmlTags[sTag]["w"], oElm)
		};
	};

    /**
    * @function getObjectValues
    * @description Returns an Array with lookup-values from oObj/oElm
    * @memberof! h5d
    
    * @param {Array} aKeys
    * @param {Object} oObj
    * @param {Object} oElm
    * @return {Array}
    */
	var getObjectValues = function(aKeys, oObj, oElm) {
		var 
		/** @type {Array} */
		aResult = [],
		/** @type {number} */
		i = aKeys.length,
		/** @type {Object} */
		oKey,
		/** @type {string} */
		sKey;
		
		if (i) {
			while (i--) {
				if (oObj.hasOwnProperty(aKeys[i])) {
					sKey = aKeys[i].split("_")[0];
					aResult.push([sKey, oObj[aKeys[i]], (oElm.getAttribute(sKey)||"")]);
				} 
			}
		}
		else {
			for (oKey in oObj) {
				if (oObj.hasOwnProperty(oKey)) { 
					aResult.push([oKey, oObj[oKey], (oElm.getAttribute(oKey)||"")]);
				}
			}
		}
		return aResult;
	};

	/**
	* getWaiAriaStates
	* @description Helper-function for building Wai-Aria states and roles
    * @memberof! h5d
    
	* @param {Array} [aRoleID]
	* @param {Object} [oElm]
	* @return {Array}
	*/  
	var getWaiAriaStates = function(aRoleID, oElm) {
		var 
		/** @type {Array} */
		aTmp,
		/** @type {number} */
		i,
		/** @type {Object} */
		oWai = {};
		
		oWai["global"] = setStates(waiRolesGlobalStates, oElm);
		
		if (aRoleID) {
			for (i = aRoleID.length; i--;) {	
				aTmp = waiRoles[aRoleID[i]]; 
				if (aTmp && aTmp.hasOwnProperty("a")) oWai[aRoleID[i]] = setStates(aTmp.a, oElm);
			}
		}

		/**
		* setStates
		* @memberof! getWaiAriaStates
	    
		* @param {Array} aState
		* @param {Object} [oElm]
		* @return {Array}
		*/  
		function setStates(aState, oElm) {
			var
			/** @type {Array} */
			aResult = [],
			/** @type {number} */
			i,
			/** @type {string} */
			sName,
			/** @type {string} */
			sType;
			
			for (i = aState.length; i--;) {
				sName = aState[i];
				sType = sName.slice(-1);
		
				if (sType === "*" || sType === "#") {
					sName = sName.slice(0, -1);
					sType = (sType === "*" ? "aria-required" : "aria-supported");
				} 
				else {
					sType = "";
				}
				aResult.push([sName, waiStates[sName], (oElm && oElm.getAttribute(sName) || ""), sType]);
			}
			aResult.sort();
			return aResult;
		}

		return oWai;
	};
	
	/* Expose Public Function/s */
	return {
		info : info,
		htmlTags : htmlTags
    };
})();
window["h5d"] = h5d;

/**
* @file shop.js
* version 0.4.4
* date: 01-02-2016
*/

/**	@namespace shop */
var	shop = (function() {
	"use strict";

	/* Ecommerce Arrays */
	var
	/**	@type {Array} */ 
	/* Root Array / Product Details */
	A_EC = [["name"], ["id"], ["price", 1], ["brand"], ["category"], ["variant"]], 
	/**	@type {Array} */ 
	/* Product Click */
	A_EC_CLICK = A_EC.slice(0), 
	/**	@type {Array} */ 
	/* Product Impressions */
	A_EC_IMPR = A_EC.slice(0),
	/**	@type {Array} */ 
	/* Purchase */
	A_EC_TRANS = A_EC.slice(0);

	/* Init Ecommerce Arrays */
	A_EC_CLICK.push(["position"]);
	A_EC_IMPR.push(["list"], ["position"]);
	A_EC_TRANS.push(["quantity"], ["coupon"]);

	/**
	* @function add
	* @description Adds/Removes a product to/from the basket.
	* @memberof! shop

	* @param {string} sID
	* @param {string} sName
	* @param {number} nPrice
	* @param {number} nQnt
	*/
    var add = function(sID, sName, nPrice, nQnt) {
		nQnt = nQnt || 1;
		var
		/**	@type {Object} */ 
		oData;
		
		if (sID && sName) {
			oData = {"id": sID, "name" : sName, "price" : nPrice, "quantity" : nQnt, "modified" : true };
			
			if (nQnt == -1) {
				ecPushToDataLayer("Remove From Cart", [["products", [oData]]], "remove");
			}
			else {
				ecPushToDataLayer("Add To Cart", [["currencyCode", Settings.sCurCode],["products", [oData]]], "add");
			}
			
			basket(oData);
			this.classList.toggle("product-added", nQnt > 0);
		}
	};
    
	/**
	* @function basket
	* @description Adds or removes an item, renders the basket.
	* @memberof! shop
	
	* @param {Object} oData
	*/
    var basket = function(oData) {
		var
		/**	@type {?} */ 
		aBasket = loadBasket(),
		/**	@type {number} */
		nPos,
		/**	@type {Object} */ 
		oExists = fn.findObject(aBasket, [["id", oData.id]]);
		
		if (oData.quantity > 0) {
			if (oExists) {
				oExists.quantity += 1;
			}
			else {
				/* oData["name"] = encodeURIComponent(oData["name"]); */
				aBasket.push(oData);
				oExists = aBasket[aBasket.length-1];
			}
		}
		else {
			nPos = aBasket.indexOf(oExists);
			if (nPos > -1) aBasket.splice(nPos, 1);
		}

		xhr.render(aBasket, Settings.basketTemplate, Settings.basketWrapper);
		if (oExists) delete oExists["modified"]; 
		fn.setItem(JSON.stringify(aBasket), Settings.basketName, Settings.basketStorage);
	};

	/**
	* @function calcTotalExVat
	* @description Returns the price exclusing vat
	* @memberof! shop
	
	* @param {number} nNum Number *including* vat
	* @param {number} nVatRate
	* @return {number}
	*/
	var calcTotalExVat = function(nNum, nVatRate) {
		nVatRate = (100 + nVatRate) / 100;
		return (nNum / nVatRate).toFixed(2)-0;
	};

	/**
	* @function calcVatFromTotal
	* @description Returns the vat/tax of a price
	* @memberof! shop
	
	* @param {number} nNum Number *including* vat
	* @param {number} nVatRate
	* @return {number}
	*/
	var calcVatFromTotal = function(nNum, nVatRate) {
		nVatRate = (100 + nVatRate) / 100;
		return (nNum - (nNum / nVatRate)).toFixed(2)-0;
	};

	/**
	* @function checkout
	* @description A series of steps [nStep], funnelling a commerce checkout
	* @memberof! shop
	
	* @param {number} nStep
	* @param {string} sNextUri
	*/
    var checkout = function(nStep, sNextUri) {
		var
		/**	@type {Array} */
		aData = ecBasket();
		
		// TODO return step @uri use noRender and custom callBack to render step
		if (aData) ecPushToDataLayer("Checkout step " + nStep, [["actionField", {"step": nStep}],["products", aData]], "checkout", function(e){ console.log(nStep);});
	};

	/**
	* @function details
	* @description Pushes EC-Object to dataLayer with product-detail impression.
	* @memberof! shop
	
	* @param {string} sList
	* @param {string} sID
	* @param {string} sName
	*/
    var details = function(sList, sID, sName) {
    	var 
		aData = [{"id": sID, "name" : sName}],
		sLoc = this.getAttribute("href"); 
		ecPushToDataLayer("Product Click", [["actionField", sList],["products", aData]], "click", function(){ window.location.hash = sLoc; });
	};

	/**
	* @function ecBasket
	* @description Returns basket-content in EC-format
	* @memberof! shop
	* @return {Array}
	*/	
	var ecBasket = function() {
		var
		/**	@type {?} */
		aBasket = loadBasket(),
		/**	@type {Array} */
		aData = [],
		/**	@type {number} */
		i = aBasket.length;
		
		while (i--) aData.push(ecCreateObject(A_EC_TRANS, aBasket[i]));
		return aData;
	};
	
    /**
    * @function ecCreateObject
	* @description Creates an object for Enhanced Ecommerce
	* @memberof! shop
      
    * @param {Array} aKeys
    * @param {Object} oProduct
    */
	var ecCreateObject = function(aKeys, oProduct) {
		var 
		/**	@type {number} */
		i = aKeys.length, 
		/**	@type {Object} oObj */
		oObj = {};

		while (i--) oObj[aKeys[i][0]] = oProduct[aKeys[i][0]] || (aKeys[i][1] ? aKeys[i][1] : "");
    	return oObj;
	};

    /**
    * @function ecPushToDataLayer 
    * @description Push ecommerce object to GTM dataLayer
    * @memberof! shop
    
    * @param {string} sEvent Name of event action
    * @param {Array} aData Array of key/value pairs, inserted in main ecommerce object
    * @param {string} [sWrapper] Optional wrapper object
    * @param {Function} [fnCallBack] Optional callback-function
    */
	var ecPushToDataLayer = function(sEvent, aData, sWrapper, fnCallBack){
		var 
		/**	@type {number} */
		i = aData.length,
		/**	@type {Object} */
		oDataLayer = {
			"ecType" : sEvent,
			"event": "ecommerce"
		},
		/**	@type {Object} oTmp */
		oTmp = {},
		/**	@type {Object} */
		oWrp = {};

		while (i--) oTmp[aData[i][0]] = aData[i][1];
		
		if (sWrapper) oWrp[sWrapper] = oTmp;
		oDataLayer["ecommerce"] = sWrapper ? oWrp : oTmp;
		
		if (fnCallBack) oDataLayer["eventCallback"] = fnCallBack;
		if (Settings.bLogEC) console.log(oDataLayer);
		dataLayer.push(oDataLayer);
	};

	/**
	* @function init
	* @description Initializes shop
	* @memberof! shop

	* @param {Object} oSettings
	*/
	var	init = function(oSettings) {
		fn.mergeObj(Settings, oSettings);
		Settings = xhr.spa(Settings);
		
		var
		/**	@type {?} */ 
		aBasket = loadBasket();
		xhr.render(aBasket, Settings.basketTemplate, Settings.basketWrapper);
	};

	/**
	* @function loadBasket
	* @description Loads the Basket Object from Storage
	* @memberof! shop

	* @return {?}
	*/
	var loadBasket = function() {
		var
		/**	@type {?} */ 
		aBasket = fn.getItem(Settings.basketName, Settings.basketStorage); 
		aBasket = aBasket ? JSON.parse(aBasket) : [];
		return aBasket;
	};

    /**
    * @function purchase
	* @description Creates an Ecommerce Purchase
	* @memberof! shop    
    */
	var purchase = function() {
		var 
		/**	@type {Array} */
		aData = ecBasket(),
		/**	@type {number} */
		nTotal = Basket.total,
		/**	@type {Object} */
		oTransaction;
		
		if (aData) {
			oTransaction = {
				"id" : fn.randomID("T"),
	        	"affiliation": "Online SHOP!",
		        "revenue": nTotal,
		        "tax": calcVatFromTotal(nTotal, Settings.nVatRate),
		        "shipping": Basket.shipping,
		        "coupon": ""	
			};
			ecPushToDataLayer("Purchase", [["actionField", oTransaction],["products", aData]], "purchase");
		}
	};

	/**
	* @function render
	* @description Wrapper for xhr.renderAll, parse ecommerce-info
	* @memberof! shop

	* @param {Object} oJSON
	*/	
	var render = function(oJSON) {
		var
		/**	@type {Array} */
		aData = [],
		/**	@type {*} */
		aProducts,
		/**	@type {number} */
		i,
		/**	@type {Object} */
		oData,
		/**	@type {*} */
		sEcommerce;
		
		xhr.renderAll(oJSON, Settings);
		sEcommerce = fn.findKeyVal(oJSON, Settings.jsonEcomKey);
  		aProducts = fn.findKeyVal(oJSON, Settings.jsonProdKey);
  		
  		if (aProducts && aProducts.length) {
  			for (i = 0; i < aProducts.length; i++)	{
				oData =	aProducts[i];
				oData["position"] = (i + 1);
				
				switch (sEcommerce) {
					case "detail": aData.push(ecCreateObject(A_EC, oData));	break;
					default: aData.push(ecCreateObject(A_EC_IMPR, oData)); break;
				}
			}
  		}

  		switch(sEcommerce) {
  			case "detail": ecPushToDataLayer("Product Details", [["products", aData]], "detail"); break;
			default: ecPushToDataLayer("Product Impressions", [["currencyCode", Settings.sCurCode],["impressions", aData]]); break;
		}
  	};
  	
  	/**	@type {Object} */
  	var Basket = 
  	{
  		shipping : 0,
  		total : 0
  	};
  	
	/**	@type {Object} */
	var Settings =
	{
		basketName : "shop-basket",
		basketStorage : 1,
		basketTemplate : "",
		basketWrapper : "",
		bLogEC : true,
		calcShipping : "",
		callBack : "shop.render",
		jsonProdKey : "result",
		jsonEcomKey : "ecommerce",
		nVatRate : 25,
		sCurCode : "DKK"
	};

	/* Expose public functions */
	return {
		add: add,
		basket: basket,
		checkout : checkout,
		details: details,
		init: init,
		render : render
	};
})();
window["shop"] = shop;

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
/**
* @copyright Mads Stoumann 2016
* @license MIT License: tldrlegal.com/license/mit-license
* @version 0.3.0
*/

//@prepros-prepend evt.js
//@prepros-prepend fn.js
//@prepros-prepend frm.js
//@prepros-prepend h5d.js
//@prepros-prepend shop.js
//@prepros-prepend xhr.js

(function() {
	var
	INFO = {
		evt : {
			appVer : "0.1.8",
			appDate: "26-02-2016"	
		},
		
		fn : {
			appVer : "0.2.3",
			appDate: "01-02-2016"	
		},

		frm : {
			appVer : "0.2.0",
			appDate: "01-02-2016"	
		},

		h5d : {
			appVer : "1.2.3",
			appDate: "27-01-2016"	
		},
				
		shop : {
			appVer : "0.4.4",
			appDate: "01-02-2016"	
		},
		
		xhr : {
			appVer : "0.4.4",
			appDate: "26-02-2016"	
		}
	};
	
	/* Add global error-listener */
	window["onerror"] = function(sMsg, sURI, nLine, nCol, oError) {
		console.log(sMsg, sURI, nLine, nCol, oError.stack);
		return true;
	};
	
	/* Display App Info in Dev-console */
    if (window.console.table) { window.console.table(INFO,["appName", "appVer", "appDate"]); }
})();
