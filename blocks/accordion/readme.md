#Accordion  &mdash; Collapse
Accordion, with collapse-logic controlled by radio-buttons.

Accesskeys-decoration set by the *setaccesskeys.js*-script.
 
Use accesskey-attribute on associated labels for this functionality.

##Structure

	<section class="accordion" id="accordion1">
		<h2	class="accordion-header">
			Accordion header
		</h2>
		
		<div itemscope itemtype="http://schema.org/Question">
			<input type="radio" class="state" id="id1" name="grp_accordion" aria-hidden="true" />
			<label for="id1" class="accordion-label" itemprop="text" accesskey="n">
				<span class="accordion-label-inner">Question 1</span>
			</label>
			<div class="accordion-panel" itemprop="suggestedAnswer acceptedAnswer" itemscope itemtype="http://schema.org/Answer">
				<div class="accordion-panel-text" itemprop="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non cursus mi, accumsan rhoncus orci. Vestibulum et augue risus. Maecenas vulputate porta felis at dapibus. Sed et imperdiet ipsum, sagittis rhoncus purus.</div>
			</div>
		</div>
	
		<div itemscope itemtype="http://schema.org/Question">
			<input type="radio" class="state" id="id2" name="grp_accordion" aria-hidden="true" />
			<label for="id2" class="accordion-label" itemprop="text" accesskey="o">
				<span class="accordion-label-inner">Question 2</span>
			</label>
			<div class="accordion-panel" itemprop="suggestedAnswer acceptedAnswer" itemscope itemtype="http://schema.org/Answer">
				<div class="accordion-panel-text" itemprop="text">
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempor lobortis maximus. Suspendisse bibendum commodo tempor. Curabitur egestas diam ut mi ultrices, quis ultrices quam tincidunt. Mauris eget urna vel tortor aliquet tincidunt. Nam tristique nunc ante, nec congue dui sodales eget. Nam suscipit mauris a ipsum convallis, ut laoreet lacus sagittis. Mauris vitae nisl tristique, egestas arcu sed, bibendum orci. Integer ut magna et magna malesuada bibendum. Etiam viverra rhoncus urna, ut mattis odio accumsan et. Ut posuere vel nulla eu laoreet. Nulla ut turpis rutrum, ultrices mauris at, tempor elit. Nam mollis ac nisi eget bibendum.</p>
					<p>Etiam convallis, dolor in hendrerit elementum, purus urna iaculis mauris, vel rhoncus nisl tellus in est. Ut vestibulum varius quam, nec varius ex venenatis id. Suspendisse bibendum nisi eget lectus malesuada, vitae tincidunt orci congue. Aenean eget fermentum nunc. Vestibulum nisl purus, cursus mollis tincidunt et, lobortis dictum lectus. Suspendisse molestie urna ac libero dapibus efficitur. Nullam sodales, sapien id rhoncus tempus, sem lacus porttitor arcu, mollis porta metus risus vitae odio. Cras sed posuere purus, sed molestie mauris. Duis sagittis nisl tempus nulla gravida, vel semper sem aliquet. Praesent vitae purus risus. Mauris vel magna tincidunt, interdum erat sit amet, gravida mauris.</p>
					<p>Aliquam eu mattis metus, eget gravida neque. Mauris arcu urna, accumsan et sodales ac, dictum lacinia nunc. Quisque pretium augue eget turpis aliquet consequat. Cras at sapien scelerisque, ornare ante eu, scelerisque lorem. Aenean vel enim non leo imperdiet condimentum at ac lectus. Nullam tempus velit vitae magna pellentesque, eu ultrices turpis ultrices. Duis non felis vitae lectus sagittis pulvinar. Integer semper, odio quis molestie convallis, metus odio cursus enim, eu aliquet velit eros in nulla. Suspendisse non posuere mi. Proin laoreet, mauris non ultrices pulvinar, sapien dolor placerat dolor, sed tincidunt lacus mauris ac lectus. Integer congue vitae lectus eget porttitor. Nunc dui urna, ultrices auctor risus condimentum, tincidunt consequat massa.</p>
				</div>
			</div>
		</div>
	
		<div itemscope itemtype="http://schema.org/Question">
			<input type="radio" class="state" id="id3" name="grp_accordion" aria-hidden="true" checked />
			<label for="id3" class="accordion-label" itemprop="text" accesskey="i">
				<span class="accordion-label-inner">Question 3</span>
			</label>
			<div class="accordion-panel" itemprop="suggestedAnswer acceptedAnswer" itemscope itemtype="http://schema.org/Answer">
				<div class="accordion-panel-text" itemprop="text">Sed placerat sed urna ut euismod. Fusce interdum dignissim ex nec tincidunt. Nunc mollis enim dictum, viverra elit sit amet, bibendum nulla.</div>
			</div>
		</div>
	</section>


##Tracking
To add tracking via the *Generic GTM*-container, add this block to *CU Global*:

	window._gtmAL(".accordion-label", "accordionClick", "Clicks");