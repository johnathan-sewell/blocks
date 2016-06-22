/**
* @file color.js
* version 4.0.0
* date: 21-06-2016
*/

/**	@namespace xhr */
var color = (function() {
	"use strict";
	
	var	
	MIN_RGB = 0,
	MAX_RGB = 255,
	MAX_HUE = 359,
	MAX_HSB = 100,
	WSC_HEX = "000000,000033,000066,000099,0000CC,0000FF,330000,330033,330066,330099,3300CC,3300FF,660000,660033,660066,660099,6600CC,6600FF,990000,990033,990066,990099,9900CC,9900FF,CC0000,CC0033,CC0066,CC0099,CC00CC,CC00FF,FF0000,FF0033,FF0066,FF0099,FF00CC,FF00FF,003300,003333,003366,003399,0033CC,0033FF,333300,333333,333366,333399,3333CC,3333FF,663300,663333,663366,663399,6633CC,6633FF,993300,993333,993366,993399,9933CC,9933FF,CC3300,CC3333,CC3366,CC3399,CC33CC,CC33FF,FF3300,FF3333,FF3366,FF3399,FF33CC,FF33FF,006600,006633,006666,006699,0066CC,0066FF,336600,336633,336666,336699,3366CC,3366FF,666600,666633,666666,666699,6666CC,6666FF,996600,996633,996666,996699,9966CC,9966FF,CC6600,CC6633,CC6666,CC6699,CC66CC,CC66FF,FF6600,FF6633,FF6666,FF6699,FF66CC,FF66FF,009900,009933,009966,009999,0099CC,0099FF,339900,339933,339966,339999,3399CC,3399FF,669900,669933,669966,669999,6699CC,6699FF,999900,999933,999966,999999,9999CC,9999FF,CC9900,CC9933,CC9966,CC9999,CC99CC,CC99FF,FF9900,FF9933,FF9966,FF9999,FF99CC,FF99FF,00CC00,00CC33,00CC66,00CC99,00CCCC,00CCFF,33CC00,33CC33,33CC66,33CC99,33CCCC,33CCFF,66CC00,66CC33,66CC66,66CC99,66CCCC,66CCFF,99CC00,99CC33,99CC66,99CC99,99CCCC,99CCFF,CCCC00,CCCC33,CCCC66,CCCC99,CCCCCC,CCCCFF,FFCC00,FFCC33,FFCC66,FFCC99,FFCCCC,FFCCFF,00FF00,00FF33,00FF66,00FF99,00FFCC,00FFFF,33FF00,33FF33,33FF66,33FF99,33FFCC,33FFFF,66FF00,66FF33,66FF66,66FF99,66FFCC,66FFFF,99FF00,99FF33,99FF66,99FF99,99FFCC,99FFFF,CCFF00,CCFF33,CCFF66,CCFF99,CCFFCC,CCFFFF,FFFF00,FFFF33,FFFF66,FFFF99,FFFFCC,FFFFFF",
	X11_HEX = "F0F8FF,FAEBD7,00FFFF,7FFFD4,F0FFFF,F5F5DC,FFE4C4,000000,FFEBCD,0000FF,8A2BE2,A52A2A,DEB887,5F9EA0,7FFF00,D2691E,FF7F50,6495ED,FFF8DC,DC143C,00FFFF,00008B,008B8B,B8860B,A9A9A9,006400,BDB76B,8B008B,556B2F,FF8C00,9932CC,8B0000,E9967A,8FBC8F,483D8B,2F4F4F,00CED1,9400D3,FF1493,00BFFF,696969,1E90FF,B22222,FFFAF0,228B22,FF00FF,DCDCDC,F8F8FF,FFD700,DAA520,808080,008000,ADFF2F,F0FFF0,FF69B4,CD5C5C,4B0082,FFFFF0,F0E68C,E6E6FA,FFF0F5,7CFC00,FFFACD,ADD8E6,F08080,E0FFFF,FAFAD2,D3D3D3,90EE90,FFB6C1,FFA07A,20B2AA,87CEFA,778899,B0C4DE,FFFFE0,00FF00,32CD32,FAF0E6,FF00FF,800000,66CDAA,0000CD,BA55D3,9370D8,3CB371,7B68EE,00FA9A,48D1CC,C71585,191970,F5FFFA,FFE4E1,FFE4B5,FFDEAD,000080,FDF5E6,808000,6B8E23,FFA500,FF4500,DA70D6,EEE8AA,98FB98,AFEEEE,D87093,FFEFD5,FFDAB9,CD853F,FFC0CB,DDA0DD,B0E0E6,800080,FF0000,BC8F8F,4169E1,8B4513,FA8072,F4A460,2E8B57,FFF5EE,A0522D,C0C0C0,87CEEB,6A5ACD,708090,FFFAFA,00FF7F,4682B4,D2B48C,008080,D8BFD8,FF6347,40E0D0,EE82EE,F5DEB3,FFFFFF,F5F5F5,FFFF00,9ACD32",
	X11_STR = "aliceblue,antiquewhite,aqua,aquamarine,azure,beige,bisque,black,blanchedalmond,blue,blueviolet,brown,burlywood,cadetblue,chartreuse,chocolate,coral,cornflowerblue,cornsilk,crimson,cyan,darkblue,darkcyan,darkgoldenrod,darkgray,darkgreen,darkkhaki,darkmagenta,darkolivegreen,darkorange,darkorchid,darkred,darksalmon,darkseagreen,darkslateblue,darkslategray,darkturquoise,darkviolet,deeppink,deepskyblue,dimgray,dodgerblue,firebrick,floralwhite,forestgreen,fuchsia,gainsboro,ghostwhite,gold,goldenrod,gray,green,greenyellow,honeydew,hotpink,indianred,indigo,ivory,khaki,lavender,lavenderblush,lawngreen,lemonchiffon,lightblue,lightcoral,lightcyan,lightgoldenrodyellow,lightgrey,lightgreen,lightpink,lightsalmon,lightseagreen,lightskyblue,lightslategray,lightsteelblue,lightyellow,lime,limegreen,linen,magenta,maroon,mediumaquamarine,mediumblue,mediumorchid,mediumpurple,mediumseagreen,mediumslateblue,mediumspringgreen,mediumturquoise,mediumvioletred,midnightblue,mintcream,mistyrose,moccasin,navajowhite,navy,oldlace,olive,olivedrab,orange,orangered,orchid,palegoldenrod,palegreen,paleturquoise,palevioletred,papayawhip,peachpuff,peru,pink,plum,powderblue,purple,red,rosybrown,royalblue,saddlebrown,salmon,sandybrown,seagreen,seashell,sienna,silver,skyblue,slateblue,slategray,snow,springgreen,steelblue,tan,teal,thistle,tomato,turquoise,violet,wheat,white,whitesmoke,yellow,yellowgreen";

	/**
	* @function changeHue
	* @description TEXT
	* @memberof! color
	* @param {number} nHue
	* @param {number} nAmount
	* @return {number}
	*/
	var changeHue = function(nHue, nAmount) {
		var
		/** @type {number} */ 
		nVal;
		if (!nHue) nHue = MAX_HUE;
		nVal = nHue + nAmount;
		if (nVal >= MAX_HUE) nVal = (nVal - MAX_HUE);
		return nVal;
	};

	/**
	* @function changeSaturation
	* @param {number} nSat
	* @param {number} nAmount
	* @return {number}
	*/
	var changeSaturation = function(nSat, nAmount) {
		var
		/** @type {number} */ 
		nVal;
		nVal = nSat + nAmount;
		if (nVal >= MAX_HSB) nVal = MAX_HSB;
		return nVal;
	};

	/**
	* shadeColor
	* @param {string} R
	* @param {string} G
	* @param {string} B
	* @param {number} nShade
	* @return {Array}
	*/
	var shadeColor = function(R, G, B, nShade) {
	nShade = (nShade/100);
		return [Math.floor(nShade*R), Math.floor(nShade*G), Math.floor(nShade*B)];
	};

	/**
	* tintColor
	* @param {string} R
	* @param {string} G
	* @param {string} B
	* @param {number} nTint
	* @return {Array}
	*/  
	var tintColor = function (R, G, B, nTint) {
		nTint = (nTint/100);
		return [Math.floor((nTint*R)+(255*(1-nTint))), Math.floor((nTint*G)+(255*(1-nTint))), Math.floor((nTint*B)+(255*(1-nTint)))];
	};

	/**
	* getBrightness
	* @param {string} sHexColor Color-string
	* @return {number}
	*/
	var getBrightness = function(sHexColor) {
		var 
		/** @type {Array} */ 
		aColor = hexToRGB(sHexColor);
		return parseInt(((aColor[0]*299)+(aColor[1]*587)+(aColor[2]*114))/1000);
	};

	/**
	* hexToRGB
	* @param {string} sColor Color-string
	* @return {Array}
	*/
	var hexToRGB = function(sColor) {
		var
		/** @type {number} */
		r = 0,
		/** @type {number} */
		g = 0,
		/** @type {number} */
		b = 0;
		if (sColor && sColor.length > 5) {
			sColor = sColor.charAt(0)==="#"? sColor.substring(1,7) : sColor;
			r = parseInt(sColor.substring(0,2), 16);
			g = parseInt(sColor.substring(2,4), 16);
			b = parseInt(sColor.substring(4,6), 16);
		}
		return[r, g, b];
	};

	/**
	* rgbToHEX
	* @return {string}
	* @param {number} r
	* @param {number} g
	* @param {number} b
	*/
	var rgbToHEX = function(r, g, b) {
		var
		/** @type {string} */
		sR = Math.round(r).toString(16),
		/** @type {string} */
		sG = Math.round(g).toString(16),
		/** @type {string} */
		sB = Math.round(b).toString(16);
		return "#" + (sR.length === 2 ? sR : "0" + sR) + (sG.length === 2 ? sG : "0" + sG) + (sB.length === 2 ? sB : "0" + sB);
	};

	/**
	* rgbToHSB
	* @return {Array}
	* @param {number} r
	* @param {number} g
	* @param {number} b
	*/
	var rgbToHSB = function (r, g, b) {
		var
		/** @type {number} */
		h = 0,
		/** @type {number} */
		s = 0,
		/** @type {number} */
		v = 0;
		r /= 255;
		g /= 255;
		b /= 255;
		s = Math.min(r, Math.min(g, b));
		v = Math.max(r, Math.max(g, b));
	
		if (s === v) return [0, 0, s];
		h = parseInt(60 * ((r === s ? 3 : b === s ? 1 : 5) - (r === s ? g - b : b === s ? r - g : b - r) / (v - s)), 10);
		s = parseInt((v - s) / v * 100, 10);
		v = parseInt(v * 100, 10);
		return [h, s, v];
	};

	/**
	* hsvToRGB
	* @return {Array}
	* @param {number} h
	* @param {number} s
	* @param {number} v
	*/
	var hsbToRGB = function(h, s, v) {
		var
		/** @type {number} */
		d,
		/** @type {number} */
		e,
		/** @type {number} */
		f;

		h = Math.max(0, Math.min(360, h));
		s = Math.max(0, Math.min(100, s));
		v = Math.max(0, Math.min(100, v));
		s /= 100;
		v /= 100;

		if (s === 0) {
			return d = s = v, [Math.round(d * 255), Math.round(s * 255), Math.round(v * 255)];
		}

		h /= 60;
		d = Math.floor(h);
		e = h - d;
		h = v * (1 - s);
		f = v * (1 - s * e);
		e = v * (1 - s * (1 - e));

		switch (d) {
			case 0:
				d = v;
				s = e;
				v = h;
				break;
			case 1:
				d = f;
				s = v;
				v = h;
				break;
			case 2:
				d = h;
				s = v;
				v = e;
				break;
			case 3:
				d = h;
				s = f;
				break;
			case 4:
				d = e;
				s = h;
				break;
			default:
				d = v;
				s = h;
				v = f;
		}
		return [Math.round(d * 255), Math.round(s * 255), Math.round(v * 255)];
	};

    /* Expose public functions */
    return {
    	changeHue: changeHue
    };
})();