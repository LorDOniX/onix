/**
 * Progress loader in the application.
 * 
 * @class $loader
 */
onix.factory("$loader", [
	"$dom",
function(
	$dom
) {
	var $loader = {
		/**
		 * Create loader.
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
		 * Loader init.
		 *
		 * @private
		 * @member $loader
		 */
		_init: function() {
			this._create();
		},

		/**
		 * Start loader.
		 *
		 * @member $loader
		 */
		start: function() {
			this._el.classList.add("start");
		},

		/**
		 * End loader.
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
		},

		/**
		 * Get spinner - DOM or object.
		 *
		 * @param {Boolean} [getObject] True for object DOM configuration for $dom; default HTML node
		 * @return {HTMLElement|Object}
		 * @member $loader
		 */
		getSpinner: function(getObject) {
			var children = [];

			for (var i = 1; i < 6; i++) {
				children.push({
					el: "div",
					"class": "rect" + i
				});
			}

			var domConf = {
				el: "div",
				"class": "spinner",
				child: children
			};

			return (getObject ? domConf : $dom.create(domConf));
		}
	};

	// loader init
	$loader._init();

	return $loader;
}]);
