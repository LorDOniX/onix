menuModule = onix.module("menu");

menuModule.service("MainMenu", [
	"$features",
function(
	$features
) {
	this.PAGES = {
		HOME: {
			name: "Home page",
			url: "/"
		},
		MINIMAL: {
			name: "Minimal",
			url: "/minimal"
		},
		ANONYMIZER: {
			name: "Anonymizer",
			url: "/anonymizer"
		},
		CROPPER: {
			name: "Crop",
			url: "/crop"
		},
		UTILS: {
			name: "Utils",
			url: "/utils"
		},
		TEST: {
			name: "Test",
			url: "/test"
		},
		DOCS: {
			name: "Documentation",
			url: "/docs"
		}
	};

	this._createFromObj = function(config) {
		var el = document.createElement(config.el);

		Object.keys(config).forEach(function(key) {
			var value;

			switch (key) {
				case "el":
					break;

				case "child":
					value = config.child;

					if (!Array.isArray(value)) {
						value = [value];
					}
					
					value.forEach(function(child) {
						el.appendChild(this._createFromObj(child));
					}, this);
					break;

				case "class":
					value = config["class"];

					if (typeof value === "string") {
						el.classList.add(value);
					}
					else if (Array.isArray(value)) {
						value.forEach(function(item) {
							el.classList.add(item);
						});
					}
					break;

				default:
					el[key] = config[key];
			}
		}, this);

		return el;
	};

	this.create = function(activePage) {
		var pagesLi = [];

		// pages order
		[
			this.PAGES.HOME,
			this.PAGES.MINIMAL,
			this.PAGES.ANONYMIZER,
			this.PAGES.CROPPER,
			this.PAGES.UTILS,
			this.PAGES.TEST,
			this.PAGES.DOCS
		]
		.forEach(function(page, ind) {
			var pageObj = {
				el: "li",
				child: [{
					el: "a",
					href: page.url,
					innerHTML: page.name
				}]
			};

			if ((!activePage && !ind) || (page == activePage)) {
				pageObj["class"] = "active";
				pageObj.child[0].href = "javascript:void(0)";
			}

			pagesLi.push(pageObj);
		});

		var menuEl = this._createFromObj({
			el: "div",
			"class": ["navbar", "navbar-default"],
			child: [{
				el: "div",
				"class": "container",
				child: [{
					el: "div",
					"class": "navbar-header",
					child: [{
						el: "a",
						"class": "navbar-brand",
						href: "/",
						innerHTML: "Onix test website"
					}]
				}, {
					el: "div",
					"class": ["navbar-collapse", "collapse"],
					id: "navbar",
					child: [{
						el: "ul",
						"class": ["nav", "navbar-nav"],
						child: pagesLi
					}]
				}]
			}]
		});

		document.body.insertBefore(menuEl, document.body.firstChild);

		// old browsers menu fix
		var hasMediaQuery = $features ? $features.MEDIA_QUERY : "matchMedia" in window && "matches" in window.matchMedia("(min-width: 500px)");
		
		if (!hasMediaQuery) {
			document.body.classList.add("no-media-query");
		}
	};
}]);
