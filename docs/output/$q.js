Ext.data.JsonP.$q({"tagname":"class","name":"$q","autodetected":{},"files":[{"filename":"q.js","href":"q.html#$q"}],"members":[{"name":"_STATES","tagname":"property","owner":"$q","id":"property-_STATES","meta":{"private":true}},{"name":"_chainPromisesInner","tagname":"method","owner":"$q","id":"method-_chainPromisesInner","meta":{"private":true}},{"name":"_isAlreadyFinished","tagname":"method","owner":"$q","id":"method-_isAlreadyFinished","meta":{"private":true}},{"name":"_resolveFuncs","tagname":"method","owner":"$q","id":"method-_resolveFuncs","meta":{"private":true}},{"name":"all","tagname":"method","owner":"$q","id":"method-all","meta":{}},{"name":"chainPromises","tagname":"method","owner":"$q","id":"method-chainPromises","meta":{}},{"name":"defer","tagname":"method","owner":"$q","id":"method-defer","meta":{}},{"name":"done","tagname":"method","owner":"$q","id":"method-done","meta":{"chainable":true}},{"name":"error","tagname":"method","owner":"$q","id":"method-error","meta":{"chainable":true}},{"name":"finally","tagname":"method","owner":"$q","id":"method-finally","meta":{"chainable":true}},{"name":"isPromise","tagname":"method","owner":"$q","id":"method-isPromise","meta":{}},{"name":"reject","tagname":"method","owner":"$q","id":"method-reject","meta":{}},{"name":"resolve","tagname":"method","owner":"$q","id":"method-resolve","meta":{}},{"name":"then","tagname":"method","owner":"$q","id":"method-then","meta":{"chainable":true}}],"alternateClassNames":[],"aliases":{},"id":"class-S-q","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/q.html#$q' target='_blank'>q.js</a></div></pre><div class='doc-contents'><p>Promise implementation which is similar to angular $q.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-_STATES' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-property-_STATES' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-property-_STATES' class='name expandable'>_STATES</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Promise states. ...</div><div class='long'><p>Promise states.</p>\n<p>Defaults to: <code>{IDLE: 0, RESOLVED: 1, REJECTED: 2}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_chainPromisesInner' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-_chainPromisesInner' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-_chainPromisesInner' class='name expandable'>_chainPromisesInner</a>( <span class='pre'>opts, promise, outArray</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Inner method for chaining promises. ...</div><div class='long'><p>Inner method for chaining promises.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>opts</span> : Object[]<div class='sub-desc'>\n<ul><li><span class='pre'>method</span> : String|Function<div class='sub-desc'><p>Function or method name inside scope</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>Scope for method function</p>\n</div></li><li><span class='pre'>args</span> : Array<div class='sub-desc'><p>Additional arguments for function</p>\n</div></li></ul></div></li><li><span class='pre'>promise</span> : $q<div class='sub-desc'><p>Done promise $q</p>\n</div></li><li><span class='pre'>outArray</span> : Array<div class='sub-desc'><p>Array for output from all executed promises</p>\n</div></li></ul></div></div></div><div id='method-_isAlreadyFinished' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-_isAlreadyFinished' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-_isAlreadyFinished' class='name expandable'>_isAlreadyFinished</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Is promise already finished? ...</div><div class='long'><p>Is promise already finished?</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_resolveFuncs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-_resolveFuncs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-_resolveFuncs' class='name expandable'>_resolveFuncs</a>( <span class='pre'>isError</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Resolve all functions. ...</div><div class='long'><p>Resolve all functions.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>isError</span> : Boolean<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-all' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-all' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-all' class='name expandable'>all</a>( <span class='pre'>promises</span> ) : $q<span class=\"signature\"></span></div><div class='description'><div class='short'>Resolve all promises in the array. ...</div><div class='long'><p>Resolve all promises in the array.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>promises</span> : $q[]<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-chainPromises' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-chainPromises' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-chainPromises' class='name expandable'>chainPromises</a>( <span class='pre'>opts</span> ) : $q<span class=\"signature\"></span></div><div class='description'><div class='short'>Chaining multiple methods with promises, returns promise. ...</div><div class='long'><p>Chaining multiple methods with promises, returns promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>opts</span> : Object[]<div class='sub-desc'>\n<ul><li><span class='pre'>method</span> : String|Function<div class='sub-desc'><p>Function or method name inside scope</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>Scope for method function</p>\n</div></li><li><span class='pre'>args</span> : Array<div class='sub-desc'><p>Additional arguments for function</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-defer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-defer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-defer' class='name expandable'>defer</a>( <span class='pre'></span> ) : $q<span class=\"signature\"></span></div><div class='description'><div class='short'>Deferable object of the promise. ...</div><div class='long'><p>Deferable object of the promise.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-done' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-done' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-done' class='name expandable'>done</a>( <span class='pre'>cbOk</span> ) : $q<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>After promise resolve call then cbOk. ...</div><div class='long'><p>After promise resolve call then cbOk.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cbOk</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-error' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-error' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-error' class='name expandable'>error</a>( <span class='pre'>cbError</span> ) : $q<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>After promise reject call then cbError. ...</div><div class='long'><p>After promise reject call then cbError.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cbError</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-finally' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-finally' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-finally' class='name expandable'>finally</a>( <span class='pre'>cb</span> ) : $q<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Finally for promise. ...</div><div class='long'><p>Finally for promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cb</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-isPromise' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-isPromise' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-isPromise' class='name expandable'>isPromise</a>( <span class='pre'>obj</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is object promise? ...</div><div class='long'><p>Is object promise?</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'><p>Tested object</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-reject' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-reject' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-reject' class='name expandable'>reject</a>( <span class='pre'>obj</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Reject promise using obj. ...</div><div class='long'><p>Reject promise using obj.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-resolve' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-resolve' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-resolve' class='name expandable'>resolve</a>( <span class='pre'>obj</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Resolve promise using obj. ...</div><div class='long'><p>Resolve promise using obj.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-then' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$q'>$q</span><br/><a href='source/q.html#$q-method-then' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$q-method-then' class='name expandable'>then</a>( <span class='pre'>[cbOk], [cbError]</span> ) : $q<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>After promise resolve/reject call then (okFn, errorFn). ...</div><div class='long'><p>After promise resolve/reject call then (okFn, errorFn).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cbOk</span> : Function (optional)<div class='sub-desc'>\n</div></li><li><span class='pre'>cbError</span> : Function (optional)<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});