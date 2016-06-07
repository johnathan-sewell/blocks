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