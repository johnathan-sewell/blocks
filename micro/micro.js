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