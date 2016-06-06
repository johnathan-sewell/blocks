#Table

	<p class="blocks-section">
		Tabs, controlled by radio-buttons.<br />
		Accesskeys-decoration set by the <em>setaccesskeys.js</em>-script. Use accesskey-attribute on associated labels for this functionality.<br />
		Deep-linkable by using <em>settabs.js</em> and the URI-structure: <em>#tabs=</em> + <em>tab-id</em>, ie. <strong>#tabs=id4</strong><br /><br />
		To deep-link to several tab-controls on the same page, use hyphen "-" as seperator for the tabs, ie. <strong>#tabs=id4-id7</strong><br />
		<a href="#tabs=id4-id7" onclick="location.reload();">Try on this page</a>
	</p>

<pre><code><em>To add tracking via "Generic GTM", add this block to "CU Global":</em>	
window._gtmAL(".tabs-label", "tabClick", "Clicks");
</code></pre>
&nbsp;<br />

##Structure


##Tracking