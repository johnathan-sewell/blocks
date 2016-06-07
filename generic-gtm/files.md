#Downloadable files
Downloadable files are automatically tracked, but you can define the label in UA by providing extra markup. 

The list of trackable filetypes are in the Trigger *EV Click Downloadable*:

	^.*\.(7z|aac|arc|arj|asf|asx|avi|bin|csv|doc|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|msi|msp|pdf|phps|png|ppt|qtm?|ra(m|r)?|sea|sit|tar|tgz|torrent|txt|wav|wma|wmv|wpd|xls|xml|z|zip)$


Event:

- **Action**: downloadFile
- **Category**: File URL
- **Label**: data-ua-elbl, title or link text

*Examples:*

	<a href="test.pdf" data-ua-elbl="Campaign PDF">pdf here</a>
	<a href="test.pdf" title="Campaign PDF">pdf here</a>
	<a href="test.pdf">pdf here</a> 	// Label in UA will be “pdf here”