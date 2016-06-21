/**
 * Browser features.
 * 
 * @class $features
 */
onix.service("$features", function() {
	// ------------------------ public ----------------------------------------

	/**
	 * FileReader is available.
	 *
	 * @member $features
	 * @type {Boolean}
	 */
	this.FILE_READER = "FileReader" in window;

	/**
	 * Canvas is available.
	 *
	 * @member $features
	 * @type {Boolean}
	 */
	this.CANVAS = !!document.createElement("canvas").getContext;
	
});
