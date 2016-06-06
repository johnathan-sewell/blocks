#Slider

	<p class="blocks-section">
		Uses the ImageGallery- and ImageObject-schemas. <br />
		Max. 10 images allowed.
	</p>

	<!-- HTML Version: 1.1.0 -->
	
	<!--Backend: 
		Count number of images (imgCount), add this value to the root-class, ie. "slider slider-5", where "5" is the value of imgCount.
		Use two loops, one for states + navigation, and one for the images themselves.
		
		The <input type="radio"> must have unique id's as well as a unique "name"-attribute per module-instance.
		The first label below an <input type="radio"> must have the input's id as it's for-attribute.
		For next-label for-attributes: #(id) + (i + 1 >= imgCount ? 1 : i + 1)"
		For prev-labels for-attributes:	#(id) + (i === 1 ? imgCount : i - 1)"
	-->