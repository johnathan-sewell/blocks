#About Blocks!

**Blocks!** is a collection of small, stand-alone UI-components and HTML-patterns.

A *block!* must live up to the following criteria:

- It must validate. Check on [validator.w3.org](http://validator.w3.org) (or **Validity** in Chrome)
- It should contain [Structured Markup](http://schema.org), tested and verified at: [developers.google.com/structured-data/testing-tool](developers.google.com/structured-data/testing-tool)
- It must be **WACG 2.0 Compliant**. Test with [Accessibility Developer Tools](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb?utm_source=chrome-app-launcher-info-dialog) (Chrome) or aXe (Firefox)
- It should have a **mixin** and a default **theme-map** and proper [sassDOC](http://sassdoc.com/)-syntax for the mixin, map and variables
- It should have **Google Tag Manager** or other tracking enabled and, if using GTM, verified through GTM's Preview/Debug-panel
- If it contains **JavaScript**, it must be verified on [jshint.com](jshint.com) **and** have proper [jsDoc](https://github.com/jsdoc3/jsdoc)-syntax for documentation
- It should have a **readme.md** with basic instructions on how-to-use
- It should have a **HTML5 template** with micro-templating for backend-use