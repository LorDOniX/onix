Onix.factory("Select", [
	"API",
	"Events",
	"Common",
function(
	API,
	Events,
	Common
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Main class
	 * @param {NodeElement} el Where element has class "dropdown"
	 */
	var Select = function(el) {
		// extend our class
		API.extend(this, Events);

		this._CONST = {
			CAPTION_SEL: ".dropdown-toggle",
			OPTIONS_SEL: ".dropdown-menu a",
			OPEN_DROPDOWN_SEL: ".dropdown.open",
			OPEN_CLASS: "open",
			ACTIVE_CLASS: "active"
		};

		this._el = el;

		this._bind(el);
	};

	/**
	 * Bind clicks on the select.
	 * @param {NodeElement} el Where element has class "dropdown"
	 */
	Select.prototype._bind = function(el) {
		var captionEl = el.querySelector(this._CONST.CAPTION_SEL);
		var options = el.querySelectorAll(this._CONST.OPTIONS_SEL);
		var con = this._CONST;

		// click on the caption
		captionEl.addEventListener("click", function(e) {
			e.stopPropagation();

			var isOpen = el.classList.contains(con.OPEN_CLASS);

			var removeAllOpened = function() {
				// remove all
				var all = document.querySelectorAll(con.OPEN_DROPDOWN_SEL);
				Common.nodesForEach(all, function(item) {
					item.classList.remove("open");
				});
			};

			removeAllOpened();

			if (isOpen) {
				// outside click
				window.removeEventListener("click");
			}
			else {
				// outside click
				window.addEventListener("click", function(e) {
					removeAllOpened();
					window.removeEventListener("click");
				});

				el.classList.add(con.OPEN_CLASS);
			}
		});

		// options
		Common.nodesForEach(options, function(option) {
			option.addEventListener("click", API.bindWithoutScope(function(e, scope) {
				e.stopPropagation();

				if (!this.parentNode.classList.contains(con.ACTIVE_CLASS)) {
					// remove previously selected
					this.parentNode.parentNode.querySelector("." + con.ACTIVE_CLASS).classList.remove(con.ACTIVE_CLASS);

					// add to the current
					this.parentNode.classList.add(con.ACTIVE_CLASS);

					el.classList.remove(con.OPEN_CLASS);

					// trigger click
					var value = this.getAttribute("data-value") || "";
					scope.trigger("change", value);
				}
			}, this));
		}.bind(this));
	};

	// ------------------------ public ----------------------------------------

	return Select;
}]);
