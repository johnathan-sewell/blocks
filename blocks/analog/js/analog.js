function analogClock(oElm) {
	var
	colHours    = "#000",
	colMinutes  = "#000",
	colSeconds  = "#ff0000",
	colDividers = "#000",
	endColor    = "#8c8c8c",
	endTiCol    = "transparent",
	endTime     = "0",
	i,
	iRadius,
	iTimeZone   = "0",
	labelColor  = "#000",
	labelFont   = "Segoe UI",
	lEndPos,
	lStartPos,
	oCanvas     = document.createElement("canvas"),
	oColor,
	oImg        = new Image(),
	size        = oElm.offsetWidth,
	sLbl        = "Valtech",
	startColor  = "#d2d2d2",
	startTiCol  = "#008040",
	startTime   = "0",
	strokeStyle = "#d8d8d8",
	strokeWidth = (oElm.offsetWidth / 30);


	oElm.innerHTML = "";
	iRadius = size / 2;
	iTimeZone = parseInt(iTimeZone, 10) || 0;
	oCanvas.setAttribute("height", size);
	oCanvas.setAttribute("width", size);
	oElm.appendChild(oCanvas);
	oCanvas = oCanvas.getContext('2d');

	oColor = oCanvas.createLinearGradient(0, 0, size, size);
	oColor.addColorStop(0, startColor);
	oColor.addColorStop(1, endColor);

	oCanvas.beginPath();
	oCanvas.arc(iRadius, iRadius, iRadius - (strokeWidth / 2) - 1, 0, Math.PI * 2);
	oCanvas.closePath();
	oCanvas.fillStyle = oColor;
	oCanvas.fill();
	oCanvas.lineWidth = strokeWidth;
	oCanvas.strokeStyle = strokeStyle;
	oCanvas.stroke();

	if (startTime) {
		oColor = oCanvas.createRadialGradient(iRadius, iRadius, 15, iRadius, iRadius, 100);
		oColor.addColorStop(0, startTiCol);
		oColor.addColorStop(1, endTiCol);
		oCanvas.beginPath();
		oCanvas.moveTo(iRadius, iRadius);
		endTime = (endTime < 3) ? (11 - endTime) : (endTime - 3);
		startTime = (startTime < 3) ? (11 - startTime) : (startTime - 3);
		lStartPos = (2/12)*startTime*Math.PI;
		lEndPos = (2/12)*endTime*Math.PI;
		oCanvas.arc(iRadius, iRadius, iRadius - (strokeWidth / 2) - 1, lStartPos, lEndPos, false);
		oCanvas.closePath();
		oCanvas.fillStyle = oColor;
		oCanvas.fill();
	}

	if (sLbl) {
		oCanvas.font = (size / 10) + "px " + labelFont;
		oCanvas.textAlign = "center";
		oCanvas.fillStyle = labelColor;
		oCanvas.fillText(sLbl, iRadius, iRadius - (iRadius / 3), size);
	}

	oCanvas.lineWidth = 1;
	oCanvas.strokeStyle = colDividers;

	for (i = 0; i < 12; i++) {
		oCanvas.beginPath();
		oCanvas.moveTo(iRadius + Math.round((iRadius - (size / 10) - (strokeWidth * 2)) * Math.cos(30 * i * Math.PI / 180)), iRadius + Math.round((iRadius - (size / 10) - (strokeWidth * 2)) * Math.sin(30 * i * Math.PI / 180)));
		oCanvas.lineTo(iRadius + Math.round((iRadius - strokeWidth * 1.5) * Math.cos(30 * i * Math.PI / 180)), iRadius + Math.round((iRadius - strokeWidth * 1.5) * Math.sin(30 * i * Math.PI / 180)));
		oCanvas.stroke();
	}

	oImg.src = oCanvas.canvas.toDataURL();
	oCanvas.lineCap = "round";
	oCanvas.translate(iRadius, iRadius);

	/*=====================================*/
	function d2r(d){
	/*=====================================*/
	  return (Math.PI / 180) * d;
	}

	/*=====================================*/
	function drawHandle(l, w, s, a) {
	/*=====================================*/
	  oCanvas.save();
	  oCanvas.rotate(a);
	  oCanvas.beginPath();
	  oCanvas.moveTo(0, 0);
	  oCanvas.lineTo(0, -(iRadius + l));
	  oCanvas.lineWidth = w;
	  oCanvas.strokeStyle = s;
	  oCanvas.stroke();
	  oCanvas.restore();
	}

	/*=====================================*/
	function setClock() {
	/*=====================================*/
	  var a = new Date(),
	  h = a.getHours() + iTimeZone + a.getMinutes() / 60,
	  m = a.getMinutes() + a.getSeconds() / 60,
	  s = a.getSeconds();
	  oCanvas.drawImage(oImg, iRadius * -1, iRadius * -1, size, size);
	  drawHandle(-15 - strokeWidth, 3, colMinutes, d2r(m * 6));
	  drawHandle(-30 - strokeWidth, 4, colHours, d2r((h * 360 / 12) % 360));
	  drawHandle(-3 - strokeWidth, 1, colSeconds, d2r(s * 6));
	  oCanvas.beginPath();
	  oCanvas.arc(0, 0, iRadius / 15, 0, Math.PI * 2);
	  oCanvas.closePath();
	  oCanvas.fill();
	}

	setClock();
	setInterval(setClock, 1000);
	  
}