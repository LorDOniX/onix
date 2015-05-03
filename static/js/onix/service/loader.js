Onix.service("Loader", [
	"DOM",
function(
	DOM
) {
	// ------------------------ private ---------------------------------------
	
	/**
	 * Create Loader.
	 */
	this._create = function() {
		this._el = DOM.create({
			el: "div",
			"class": "loader"
		});

		// insert into the body on first position
		document.body.insertBefore(this._el, document.body.firstChild);
	};

	// ------------------------ public ----------------------------------------
	
	/**
	 * Loader init.
	 */
	this.init = function() {
		this._create();
	};

	/**
	 * Start loader.
	 */
	this.start = function() {
		this._el.classList.add("start");
	};

	/**
	 * End loader.
	 */
	this.end = function() {
		this._el.classList.remove("start");
		this._el.classList.add("end");

		setTimeout(function() {
			this._el.classList.remove("end");
			this._el.classList.add("hide");

			setTimeout(function() {
				this._el.classList.remove("hide");
			}.bind(this), 350);
		}.bind(this), 150);
	};
}]);
