Onix.service("Common", function() {
	// ------------------------ public ----------------------------------------
	
	/**
	 * Missing for each for Node array.
	 * @param  {NodeArray} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function}   scope
	 */
	this.nodesForEach = function(nodes, cb, scope) {
		cb = cb || function() {};
		
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				cb.apply(scope || cb, [nodes[i], i]);
			}
		}
	};
});
