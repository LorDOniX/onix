/**
 * Date operations.
 * 
 * @class $date
 */
onix.service("$date", function() {
	/**
	 * Parse EN date to CS format.
	 * year-month-day -> day. month. year
	 * 2016-06-31 -> 31. 6. 2016
	 * 
	 * @param {String} enDate
	 * @return {String}
	 * @member $date
	 */
	this.dateENtoCS = function(enDate) {
		enDate = enDate || "";

		var parts = enDate.split("-");

		if (parts.length == 3) {
			// delete first 0
			return [parts[2].replace(/^0/, ""), parts[1].replace(/^0/, ""), parts[0]].join(". ");
		}
		else return "";
	};

	/**
	 * Parse CS date to EN format.
	 * day. month. year -> year-month-day
	 * 31. 6. 2016 -> 2016-06-31
	 * 
	 * @param {String} csDate
	 * @return {String}
	 * @member $date
	 */
	this.dateCStoEN = function(csDate) {
		// day. month. year 31. 12. 2015
		csDate = csDate || "";

		var parts = csDate.split(".");

		if (parts.length == 3) {
			var year = parts[2].trim();
			var month = parts[1].trim();
			var date = parts[0].trim();

			// add 0 from left
			date = date.length == 1 ? "0" + date : date;
			month = month.length == 1 ? "0" + month : month;

			return [year, month, date].join("-");
		}
		else return "";
	};


	/**
	 * Is string contains CS date format?
	 * 
	 * @param  {String} csDate
	 * @return {Boolean}
	 * @member $date
	 */
	this.isCSdate = function(csDate) {
		csDate = csDate || "";

		return !!(csDate.match(/([1-9]|[1-3][0-9])\.[ ]*([1-9]|1[0-2])\.[ ]*[1-9][0-9]{3}/));
	};
});