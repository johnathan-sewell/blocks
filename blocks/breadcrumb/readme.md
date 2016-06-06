#Breadcrumb
Two patterns for generating *breadcrumbs*, using either *data-vocabulary* or *schema.org*-syntax.

##Structure
**Using data-vocabulary.org/Breadcrumb:**

	<nav itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="breadcrumb">
		<div class="breadcrumb-inner">
			<a href="http://www.example.com" itemprop="url">
				<span itemprop="title">Home</span>
			</a>
			<span itemprop="child" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
				<a href="http://www.example.com/products" itemprop="url">
					<span itemprop="title">Products and services</span>
				</a>
				<span itemprop="child" itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
					<a href="http://www.example.com/products/item" itemprop="url">
						<span itemprop="title">Browse our complete range</span>
					</a>
				</span>
			</span>
		</div>
	</nav>

**Using schema.org/BreadcrumbList:**
	
	<nav itemscope itemtype="http://schema.org/BreadcrumbList" class="breadcrumb">
		<div class="breadcrumb-inner">
			<span itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
				<a itemprop="item" href="https://example.com"><span itemprop="name">Home</span></a>
				<meta itemprop="position" content="1" />
			</span>
			<span itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
				<a itemprop="item" href="https://example.com/products"><span itemprop="name">Products</span></a>
				<meta itemprop="position" content="2" />
			</span>
			<span itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
				<a itemprop="item" href="https://example.com/products/item"><span itemprop="name">Item</span></a>
				<meta itemprop="position" content="3" />
			</span>
		</div>
	</nav>

##Tracking
Use regular PageView-tracking.