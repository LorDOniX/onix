onix.factory("$select", [
	"$common",
	"$event",
function(
	$common,
	$event
) {
	/**
	 * Main class for select.
	 * DI: $common, $event;
	 *
	 * @class $select
	 * @param {HTMLElement} el Where element has class "dropdown"
	 * @param {Object} opts
	 * @param {Boolean} opts.addCaption Add caption to select
	 * @member $select
	 */
	var $select = function(el, opts) {
		// extend our class
		$common.extend(this, $event);

		this._opts = {
			addCaption: false
		};

		for (var key in opts) {
			this._opts[key] = opts[key];
		}

		this._const = {
			CAPTION_SEL: ".dropdown-toggle",
			OPTIONS_SEL: ".dropdown-menu a",
			CARET_SEL: ".caret",
			OPEN_DROPDOWN_SEL: ".dropdown.open",
			OPEN_CLASS: "open",
			ACTIVE_CLASS: "active"
		};

		this._el = el;

		this._optinsRef = [];
		this._captionEl = null;
		this.captionTextEl = null;

		this._binds = {
			captionClick: $common.bindWithoutScope(this._captionClick, this),
			choiceClick: $common.bindWithoutScope(this._choiceClick, this)
		};

		this._bind();
	};

	/**
	 * Bind clicks on the select.
	 *
	 * @member $select
	 * @private
	 */
	$select.prototype._bind = function() {
		this._bindCaption();
		this._bindChoices();
	};

	/**
	 * Bind caption el.
	 * 
	 * @param {HTMLElement} el Where element has class "dropdown"
	 * @member $select
	 * @private
	 */
	$select.prototype._bindCaption = function() {
		var captionEl = this._el.querySelector(this._const.CAPTION_SEL);

		if (captionEl) {
			// click on the caption
			captionEl.addEventListener("click", this._binds.captionClick);

			// insert span placeholder for caption
			if (this._opts.addCaption) {
				var caretEl = captionEl.querySelector(this._const.CARET_SEL);

				if (caretEl) {
					var captionTextEl = Framework.DOM.create({
						el: "span",
						"class": "add-caption"
					});

					captionEl.insertBefore(captionTextEl, caretEl);

					this._captionTextEl = captionTextEl;
				}
			}
		}

		this._captionEl = captionEl;
	};

	/**
	 * Click on caption
	 * 
	 * @param  {Event} e 
	 * @param  {Object} scope
	 * @member $select
	 * @private
	 */
	$select.prototype._captionClick = function(e, scope) {
		var con = scope._const;

		e.stopPropagation();

		var isOpen = scope._el.classList.contains(con.OPEN_CLASS);

		var removeAllOpened = function() {
			// remove all
			onix.element(con.OPEN_DROPDOWN_SEL).forEach(function(item) {
				item.classList.remove("open");
			});
		};

		var clickFn = function() {
			removeAllOpened();
			window.removeEventListener("click", clickFn);
		};

		removeAllOpened();

		if (isOpen) {
			// outside click
			window.removeEventListener("click", clickFn);
		}
		else {
			// outside click
			window.addEventListener("click", clickFn);

			scope._el.classList.add(con.OPEN_CLASS);
		}
	};

	/**
	 * Bind choices els.
	 *
	 * @member $select
	 * @private
	 */
	$select.prototype._bindChoices = function() {
		onix.element(this._const.OPTIONS_SEL, this._el).forEach(function(option) {
			option.addEventListener("click", this._binds.choiceClick);

			// event ref
			this._optinsRef.push({
				el: option,
				event: "click",
				fn: this._binds.choiceClick
			});
		}, this);
	};

	/**
	 * Click on option
	 * 
	 * @param  {Event} e 
	 * @param  {Object} scope
	 * @member $select
	 * @private
	 */
	$select.prototype._choiceClick = function(e, scope) {
		var con = scope._const;

		e.stopPropagation();

		if (!this.parentNode.classList.contains(con.ACTIVE_CLASS)) {
			// remove previously selected
			var active = this.parentNode.parentNode.querySelector("." + con.ACTIVE_CLASS);
			
			if (active) {
				active.classList.remove(con.ACTIVE_CLASS);
			}

			// add to the current
			this.parentNode.classList.add(con.ACTIVE_CLASS);

			scope._el.classList.remove(con.OPEN_CLASS);

			if (scope._opts.addCaption && scope._captionTextEl) {
				scope._captionTextEl.innerHTML = this.innerHTML;
			}

			// trigger click
			var value = this.getAttribute("data-value") || "";
			scope.trigger("change", value);
		}
	};

	/**
	 * Unbind choices.
	 *
	 * @member $select
	 */
	$select.prototype.unbindChoices = function() {
		if (this._optinsRef.length) {
			this._optinsRef.forEach(function(option) {
				option.el.removeEventListener(option.event, option.fn);
			});

			this._optinsRef = [];
		}
	};

	/**
	 * Rebind choices.
	 *
	 * @member $select
	 */
	$select.prototype.rebindChoices = function() {
		this.unbindChoices();
		this._bindChoices();
	};

	/**
	 * Select option.
	 * 
	 * @param {Number} ind
	 * @member $select
	 */
	$select.prototype.selectOption = function(ind) {
		if (typeof ind === "undefined") {
			ind = 0;
		}

		var optionsCount = this._optinsRef.length;

		if (optionsCount > 0 && ind >= 0 && ind < optionsCount) {
			var el = this._optinsRef[ind].el;
			var parent = this._optinsRef[ind].el.parentNode;

			if (!parent.classList.contains(this._const.ACTIVE_CLASS)) {
				parent.classList.add(this._const.ACTIVE_CLASS);

				if (this._opts.addCaption && this._captionTextEl) {
					this._captionTextEl.innerHTML = el.innerHTML;
				}

				// trigger click
				var value = el.getAttribute("data-value") || "";
				this.trigger("change", value);
			}
		}
	};

	/**
	 * Set add caption.
	 *
	 * @member $select
	 */
	$select.prototype.setAddCaption = function() {
		if (!this._opts.addCaption) return;

		this._optinsRef.every(function(item) {
			var parent = item.el.parentNode;

			if (parent.classList.contains(this._const.ACTIVE_CLASS)) {
				this._captionTextEl.innerHTML = item.el.innerHTML;
				return false;
			}
			else return true;
		}, this);
	};

	return $select;
}]);
