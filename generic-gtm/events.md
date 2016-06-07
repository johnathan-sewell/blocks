#Events

Tracking events with GTM's click-listener.

##Events with JavaScript
When the container is loaded, a custom function for pushing events to GTM is added to the **window-object**:

	window._gtmEV()

The function has the following parameters: **Action**, **Category**, **Label** and (Optional) **Event**-name. 

Please note, that if you're using a custom event-name, the generic listener won't work. You then have to create a specific listener for your event.

When using the function, wrap it in a try-catch-clause:

	try{window._gtmEV("ACTION", "CATEGORY", "LABEL");} catch(err){/* Error-handling */}

##Events with data-attributes
Another way to track events is by adding data-attributes to your HTML. 

This way is easier, if you're generating HTMl from a CMS-system like epiServer or Sitecore.

To enable tracking for an element, add this:

	data-gtm-event="true"

The **Action**, **Category** and **Label** are added like this:

	data-ua-eact="Action"		// If not present, "customEvent" will be used
	data-ua-ecat="Category"		// If not present, "noCategory" will be used.
	data-ua-elbl="Label"		// If not present, the element’s title or innerText will be used.

*Full example:*

	<div data-gtm-event="true" data-ua-eact="My Action" data-ua-ecat="My Category" data-ua-elbl="My Label">Click here!</div>

*Example, using default values for Action and Category:*

	<div data-gtm-event="true" data-ua-elbl="My Label">Click here!</div>

**NOTE:** An event-listener element in the HTML can max. have *one* childNode, as in:

	<a href="example.html" data-gtm-event="true" data-ua-elbl="My inner event" data-ua-ecat="My inner category">
	  <div>Inner link</div>
	</a>