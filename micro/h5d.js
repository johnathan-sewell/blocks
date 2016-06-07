
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