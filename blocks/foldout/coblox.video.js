/**
* @preserve coblox.video.js
* (c) Copyright 2015 Mads Stoumann
* Version: 1.0.0 (30-01-2015)
*/

/** @type {Object} CX */
var CX = CX ? CX : {};
CX.Video = 
{
/**
* addScript --- Appends a new script to head-section..
* @param {string} sSrc
*/
  addScript : function(sSrc) {
    var
    /** @type {Object} oScript */
    oScript = document.createElement("script"),
    /** @type {Object} oTag */
    oTag = document.getElementsByTagName("script")[0];
    oScript.src = sSrc;
    oTag.parentNode.insertBefore(oScript, oTag);
  },
/**
* cleanPrefix --- Removes chars from beginning of a string.
* @param {string} sStr
* @param {number} numOfChars
*/
  cleanPrefix : function(sStr, numOfChars) {
    return sStr.slice(numOfChars);
  },
/**
* hashChange --- Goes to the element defined in hash. If the element is a video, additional code is triggered.
*/
  hashChange : function() {
    var 
    /** @type {NodeList} aLink */
    aLink,
    /** @type {boolean} bIOS */
    bIOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent ),
    /** @type {Object} foLink */
    foLink = document.getElementById(window.location.hash.slice(1)),
    /** @type {Object} oVideo */
    oVideo,
    /** @type {string} playFunc */
    playFunc,
    /** @type {string} pauseFunc */
    pauseFunc,
    /** @type {string} sErr */
    sErr = "ERROR: Video could not be loaded. ",
    /** @type {string} sVidID */
    sVidID = foLink && foLink.getAttribute("data-video-id"),
    /** @type {string} sVidPrefix */
    sVidPrefix,
    /** @type {string} sVidProv */
    sVidProv;
    
    aLink = document.querySelectorAll("a.selected")[0]; if(aLink) aLink.classList.remove("selected");
    document.querySelectorAll("[href=\"#" + window.location.hash.slice(1) + "\"]" )[0].classList.add("selected");
    
    //If a video is currently playing, pause it.
    if (CX.Video.list.playing.videoid) {
      CX.Video.list[CX.Video.list.playing.provider].videos[CX.Video.list.playing.videoid][CX.Video.list[CX.Video.list.playing.provider].pauseFunc]();
      CX.Video.list.playing.videoid = ""; //Reset videoid for currrently playing
    }
    // If element is a video
    if (sVidID) { 
      try {
        sVidProv = foLink.getAttribute("data-video-provider");
        sVidPrefix = CX.Video.list[sVidProv].prefix;
        playFunc = CX.Video.list[sVidProv].playFunc;
        pauseFunc = CX.Video.list[sVidProv].pauseFunc;
        sVidID = sVidPrefix + sVidID;
        oVideo = CX.Video.list[sVidProv].videos[sVidID];
        
        // If the video-object exists, and it has a play-function. Not enabled for iOS, as iOS prevents auto-play.
        if (!bIOS && oVideo && !CX.Video.isEmpty(oVideo) && playFunc) {
          oVideo[playFunc]();
        }
        
        // Set currently playing video to active video
        CX.Video.list.playing.provider = sVidProv;
        CX.Video.list.playing.videoid = sVidID;
    }
      catch(err){ 
        console.log(sErr + err);
      }
    }
  },
/**
* init --- Initializes fold-out blocks, runs additional code if the block is a video.
*/    
  init : function() {
    var 
    /** @type {NodeList} aVideos */
    aVideos = document.querySelectorAll("[data-video-provider]"),
    /** @type {boolean} bIntURL */
    bIntURL = document.referrer.split("/")[2] === window.location.hostname,
    /** @type {boolean} bWideScreen */
    bWideScreen,
    /** @type {number} i */
    i,
    /** @type {number} iHeight */
    iHeight,
    /** @type {number} l */
    l = aVideos.length,
    /** @type {number} oTimer */
    oTimer,
    /** @type {Object} oVideo */
    oVideo,
    /** @type {string} sVidID */
    sVidID,
    /** @type {string} sVidPrefix */
    sVidPrefix,
    /** @type {string} sVidProv */
    sVidProv;
    
    for (i = l; i--;) {
      sVidProv = aVideos[i].getAttribute("data-video-provider");
      // Load provider-API, if it exists 
      if (!CX.Video.list[sVidProv].loaded && CX.Video.list[sVidProv].script) {
        CX.Video.addScript(CX.Video.list[sVidProv].script);
        CX.Video.list[sVidProv].loaded = true;
      }
      
      // Create tag/wrapper for video
      oVideo = document.createElement(CX.Video.list[sVidProv].embedTag);
      sVidPrefix = CX.Video.list[sVidProv].prefix;
      sVidID = aVideos[i].getAttribute("data-video-id");
      oVideo.id = sVidPrefix + sVidID;
      if (CX.Video.list[sVidProv].embedTag === "iframe") oVideo.src = CX.Video.list[sVidProv].embedPrefix + sVidID + CX.Video.list[sVidProv].embedSuffix;
      oVideo.style.width = "100%";
  		aVideos[i].appendChild(oVideo);
  		
  		//Calculate height based on format (bWideScreen) and calculated width
  		bWideScreen = Boolean(aVideos[i].getAttribute("data-video-widescreen"));
  		iHeight = oVideo.offsetWidth;
      oVideo.style.height = (bWideScreen ? ((iHeight / 16) * 9) : ((iHeight / 4) * 3)) + "px";
      
      //Create video-object under provider. Additional functionality will be added to these objects from the load[Provider]-functions.
      CX.Video.list[sVidProv].videos[oVideo.id] = {};
    }
    
    CX.Video.loadVimeo();
    
    // Load YouKu
    oTimer = setInterval(function() {
      if (typeof window.YKU == "object") {
        CX.Video.loadYouKu();
        clearInterval(oTimer);
      }
    }, 500); 
    
    // Hide fold-out info-blocks if referrer is external
    if (!bIntURL) {
      //document.body.classList.add("external"); 
    } else if (window.location.hash.length > 1) {
      CX.Video.hashChange();
    }
  },
/**
* isEmpty --- Checks if an object is empty / has no keys
* @param {?} O
* @return {boolean}
*/  
  isEmpty : function(O) {
    return Object.keys(O).length === 0;
  },
/**
* loadVimeo --- Adds custom play- and pasue functions to video-objects under the Vimeo-provider
*/
  loadVimeo : function() {
    var
    /** @type {Object} k */
    k;
    for (k in CX.Video.list.vimeo.videos) {
      if (CX.Video.list.vimeo.videos.hasOwnProperty(k)) {
  	    CX.Video.list.vimeo.videos[k].playVimeo = function() { CX.Video.postVimeoVal(document.getElementById(k.toString()), "play"); };
  	    CX.Video.list.vimeo.videos[k].pauseVimeo = function() { CX.Video.postVimeoVal(document.getElementById(k.toString()), "pause"); };
  	  }
  	}
  },
/**
* loadYouKu --- Creates YKU.Player-objects for all video-objects under the YouKu-provider.
*/
  loadYouKu : function() {
    var
    /** @type {Object} k */
    k;
    
    for (k in CX.Video.list.youku.videos) {
      if (CX.Video.list.youku.videos.hasOwnProperty(k)) {
  	    CX.Video.list.youku.videos[k] = new YKU.Player(k, { client_id: CX.Video.list.youku.client, vid: CX.Video.cleanPrefix(k,2) });
  	  }
  	}
  },
/**
* loadYouTube --- Creates YT.Player-objects for all video-objects under the YouTube-provider.
*/
  loadYouTube : function() {
    var
    /** @type {Object} k */
    k;
    for (k in CX.Video.list.youtube.videos) {
      if (CX.Video.list.youtube.videos.hasOwnProperty(k)) {
  	    CX.Video.list.youtube.videos[k] = new YT.Player(k, { videoId: CX.Video.cleanPrefix(k,2) });
  	  }
  	}
  },
/**
* postVimeoVal --- Posts an action to Vimeo's iframe-src.
* @param {Object} oFrame
* @param {string} action
* @param {string} [value]
*/    
  postVimeoVal : function(oFrame, action, value) {
		var
		/** @type {Object} oData */
		oData = { method: action },
		/** @type {Array} sURL */
		sURL = oFrame.src.split("?")[0];
		if (value) {
			oData.value = value;
		}
		if (sURL !== undefined) {
			oFrame.contentWindow.postMessage(JSON.stringify(oData), sURL);
		}
	},
/** @type {Object} video */
  list : {
    playing :
    {
      provider : "",
      videoid : ""
    },
    vimeo : 
    {
      embedPrefix: "http://player.vimeo.com/video/",
      embedSuffix: "?api=1",
      embedTag : "iframe",
      playFunc : "playVimeo",
      pauseFunc : "pauseVimeo",
      prefix : "vm",
      videos : {}
    },
    youku : 
    {
      client : "1e2ec16ba3ad918c",
      embedTag : "div",
      loaded : false,
      playFunc : "playVideo",
      pauseFunc : "pauseVideo",
      prefix : "yk",
      script : "//player.youku.com/jsapi",
      videos : {}
    },
    youtube : 
    {
      embedTag : "div",
      loaded : false,  
      playFunc : "playVideo",
      pauseFunc : "pauseVideo",
      prefix : "yt",
      script : "//www.youtube.com/iframe_api",
      videos : {}
    }
  }  
};
function onYouTubeIframeAPIReady() { CX.Video.loadYouTube(); }
window.onhashchange = function() { CX.Video.hashChange(); };
CX.Video.init();