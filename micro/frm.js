
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