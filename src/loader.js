/**
 * @class $loader
 *
 * Progress loader in the application
 */
onix.factory("$loader", [
	"$dom",
function(
	$dom
) {
	var $loader = {
		/**
		 * Create loader
		 *
		 * @private
		 * @member $loader
		 */
		_create: function() {
			this._el = $dom.create({
				el: "div",
				"class": "loader"
			});

			// insert into the body on first position
			document.body.insertBefore(this._el, document.body.firstChild);
		},
		
		/**
		 * Loader init
		 *
		 * @private
		 * @member $loader
		 */
		_init: function() {
			this._create();
		},

		/**
		 * Start loader
		 *
		 * @member $loader
		 */
		start: function() {
			this._el.classList.add("start");
		},

		/**
		 * End loader
		 *
		 * @member $loader
		 */
		end: function() {
			this._el.classList.remove("start");
			this._el.classList.add("end");

			setTimeout(function() {
				this._el.classList.remove("end");
				this._el.classList.add("hide");

				setTimeout(function() {
					this._el.classList.remove("hide");
				}.bind(this), 350);
			}.bind(this), 150);
		}
	};

	// loader init
	$loader._init();

	return $loader;
}]);
