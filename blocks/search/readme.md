#Search panel, with optional toggler

##Structure

###Toggle Input
Should be placed as a direct descendant to the &lt;body&gt;-tag.

	<input type="checkbox" id="toggle-search" class="state" />
	
###Toggle Label
Can be placed anywhere
	
	<label for="toggle-search" class="search-toggle">
		<svg class="search-toggle-svg"><use xlink:href="../../svg/icons.svg#ico_search"></use></svg>
	</label>
	
###Search Form

	<form itemscope itemtype="http://schema.org/WebSite" class="search">
		<meta itemprop="url" content="http://www.yousite.com/"/>
		<div itemprop="potentialAction" itemscope itemtype="http://schema.org/SearchAction" class="search-fieldset">
			<meta itemprop="target" content="http://www.yousite.com/search?q={search_term}"/>
			<input itemprop="query-input" type="search" name="search_term" placeholder="Search" required class="search-input" autofocus />
			<button type="submit" class="search-submit">
				<svg class="search-submit-svg"><use xlink:href="../../svg/icons.svg#ico_search"></use></svg>
			</button>
		</div>
	</form>


###Replacements

	<meta itemprop="url" content="http://www.yousite.com/"/>

Replace **www.yousite.com** with your actual site-url.

	<meta itemprop="target" content="http://www.yousite.com/search?q={search_term}"/>

Replace **www.yousite.com/search?q=** with your actual site-search parameters, leave the value **{search_term}**.

##Example
See above

##Tracking
Use *Google Analytics'* default search-tracking:

- Go to *Admin*
- Choose selected *View*
- Click on *View Settings*
- Enable *Site Search Tracking*

If your default search-paramter is *not* **q**, update the value as well.

##Files

- index.html
	- Markup-template 
- search.scss
	- Sass mixin, including default theme-object 
- search.js 
	- Small script for autofocus 