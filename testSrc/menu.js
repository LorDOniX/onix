import * as $features from "features";

const PAGES = [
	{
		id: "home",
		name: "Home page",
		url: "/"
	},
	{
		id: "anonymizer",
		name: "Anonymizer",
		url: "/anonymizer"
	},
	{
		id: "crop",
		name: "Crop",
		url: "/crop"
	},
	{
		id: "utils",
		name: "Utils",
		url: "/utils"
	},
	{
		id: "test",
		name: "Test",
		url: "/test"
	},
	{
		id: "docs",
		name: "Documentation",
		url: "/docs"
	}
];

export default class Menu {
	constructor(activePage) {
		this._create(activePage);
	}

	_create(activePage) {
		let pagesLi = [];

		PAGES.forEach((page, ind) => {
			let pageObj = {
				el: "li",
				child: [{
					el: "a",
					href: page.url,
					innerHTML: page.name
				}]
			};

			if ((!activePage && !ind) || (page.id == activePage)) {
				pageObj["class"] = "active";
				pageObj.child[0].href = "javascript:void(0)";
			}

			pagesLi.push(pageObj);
		});

		let menuEl = this._createFromObj({
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
		let hasMediaQuery = $features ? $features.MEDIA_QUERY : "matchMedia" in window && "matches" in window.matchMedia("(min-width: 500px)");
		
		if (!hasMediaQuery) {
			document.body.classList.add("no-media-query");
		}
	}

	_createFromObj(config) {
		let el = document.createElement(config.el);

		Object.keys(config).forEach(key => {
			let value;

			switch (key) {
				case "el":
					break;

				case "child":
					value = config.child;

					if (!Array.isArray(value)) {
						value = [value];
					}
					
					value.forEach(child => {
						el.appendChild(this._createFromObj(child));
					}, this);
					break;

				case "class":
					value = config["class"];

					if (typeof value === "string") {
						el.classList.add(value);
					}
					else if (Array.isArray(value)) {
						value.forEach(item => {
							el.classList.add(item);
						});
					}
					break;

				default:
					el[key] = config[key];
			}
		});

		return el;
	}
}
