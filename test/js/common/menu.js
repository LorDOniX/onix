menuModule = onix.module("menu");

menuModule.service("MainMenu", [
	"$dom",
function(
	$dom
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
		}
	};

	this.create = function(activePage) {
		var pagesLi = [];

		// pages order
		[this.PAGES.HOME, this.PAGES.MINIMAL, this.PAGES.ANONYMIZER, this.PAGES.CROPPER].forEach(function(page, ind) {
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

		var menuEl = $dom.create({
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
	};
}]);
