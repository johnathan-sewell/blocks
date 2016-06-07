#Transactions

To save e-Commerce transactions, push the following data to GTM’s dataLayer, replace the values in double brackets with your own values:

	dataLayer.push({
	  "event": "ev_Transaction",
	  "transactionId": {{TRANSACTION ID}},
	  "transactionTotal": {{TRANSACTION TOTAL}},
	  "transactionProducts": [{
	    "id": {{PRODUCT ID}},
	    "sku": {{PRODUCT SKU}},
	    "name": {{PRODUCT NAME}},
	    "category": {{PRODUCT CATEGORY}},
	    "price": {{PRODUCT PRICE}},
	    "quantity": {{PRODUCT QUANTITI}} //Numeric
	  }]
	});

It’s best to generate this from the back-end, and include it in a script-tag **BEFORE** the GTM-container is loaded.