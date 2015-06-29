/**
 * @class $loader
 * @description DI: $dom;
 */
onix.service("$loader", [
	"$dom",
function(
	$dom
) {
	/**
	 * Create $loader.
	 *
	 * @private
	 * @memberof $loader
	 */
	this._create = function() {
		this._el = $dom.create({
			el: "div",
			"class": "loader"
		});

		// insert into the body on first position
		document.body.insertBefore(this._el, document.body.firstChild);
	};
	
	/**
	 * Loader init.
	 *
	 * @public
	 * @memberof $loader
	 */
	this.init = function() {
		this._create();
	};

	/**
	 * Start loader.
	 *
	 * @public
	 * @memberof $loader
	 */
	this.start = function() {
		this._el.classList.add("start");
	};

	/**
	 * End loader.
	 *
	 * @public
	 * @memberof $loader
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
