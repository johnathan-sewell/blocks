#Google Tag Manager Start Package

This is a start-package for new GTM-enabled websites. 

If you fill out your UA-code and domain hostname (see how under "Install"), a lot of things will be tracked automatically:

- Page Views and Virtual Page Views (Fragments)
- External links (Exit-links / Outbound)
- Downloadable files 
- Form submits. To enhance forms-tracking, see **[forms.md](forms.md)**
- Element clicks / position
- Mail links
- Phone links
- Ecommerce and Enhanced Ecommerce Events

And with a few settings, these will be tracked as well:

- Search Terms
- Facebook Events
- YouTube tracking + events
- AdBlocker detection
- Visual Website Optimizer


By adding *data-attributes* to your HTML or using a provided JavaScript-function, you can easily add event-tracking, see **[events.md](events.md)**

For tracking Ecommerce-transactions see **[transactions.md](transactions.md)**

For tracking search-terms, see **[search.md](search.md)**

For adding/tracking social events, see **[social.md](social.md)**

##Install
- Download the json-file from this project.
- If you haven't done so already, create a new *Container* on [tagmanager.google.com](http://tagmanager.google.com), and follow the steps and documentation on how to implement it on your site.
- Go to *Admin* and click on *Import Container* and follow the steps (overwrite).
- Click on *Variables* and select *LT UA Code*. Set the values to your *Universal Analytics*-code/s (begins with UA-). If you don't have various environments, change the variable type to "Constant".
- Click on *Triggers* and select *EV Click Outbound*. Replace *yourdomain.com* with your actual domain-hostname.
- Open the variable *CN Site Hostname* and fill out your domain (as in the step above).
- *Publish* and then *Preview* your Container, and verify on your site that data is coming in.