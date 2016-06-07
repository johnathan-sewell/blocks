#Search

To track search-terms on a specific search-page, first update the trigger *URL Search Page* with a unique pointer/value to your search-page.

In the container, the default value is:

	 "\/searchpage\/"

Which is an escaped string for: "/searchpage/", which means:

	http://yourdomain.com/searchpage/

##Terms
For each term you want to track, you need to create a variable for that specific term.

An example is provided in the variable *QK searchvalue:*

The value *searchvalue* points to the queryString-parameter *searchvalue*, as in:

	http://yourdomain.com/searchpage/?searchvalue=stoumann

The returned value of *QK searchvalue* will be: stoumann.

Repeat this for all the q´search-terms you want to track, and then open/edit the tag: *UA Search Terms*.

Click *Configure* and go to the section *Custom Dimensions*. 

Here you can add each of the search terms defined in your *QK*-variables.

**WARNING:** The indices used **must** be created and named in Universal Analytics first (be sure to match the index numbers with the correct dimensions).
**Please note** that the first index (1) cannot be used, if you plan to use the *Optimizely*-tag (see [optimizely.md](optimizely.md)).

For numeric data, such as pagenumbers and price-ranges, *Custom Metrics* should be used instead.

*Example:*

	http://yourdomain.com/searchpage/?searchvalue=iphone&page=1&priceMin=0&priceMax=2000&productCategory=phones

Would require two *Custom Dimensions:*

	searchvalue
	productCategory

As well as three *Custom Metrics:*

	page
	priceMin
	priceMax

So: A total of *five* *QK*-variables in GTM.