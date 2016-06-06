#Rating
	<p class="blocks-section">
		A rating-control, created with radio-buttons and CSS.<br />
		In the tracking-example, a <em>data-productid</em>-attribute need to be added to the (wrapper-) form of the rating-control.
	</p>
	

##Structure



##Tracking
Tracking Example, requires "Generic GTM" */</em>
document.querySelector(".rating").addEventListener("change", function(e) { 
	try { window._gtmEV("Click", "Rating", this.dataset.productid, e.target.value);} catch(err){}
}, false);	
