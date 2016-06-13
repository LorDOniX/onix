Ext.data.JsonP.$promise({"tagname":"class","name":"$promise","autodetected":{},"files":[{"filename":"promise.js","href":"promise.html#$promise"}],"members":[{"name":"_STATES","tagname":"property","owner":"$promise","id":"property-_STATES","meta":{"private":true}},{"name":"_isAlreadyFinished","tagname":"method","owner":"$promise","id":"method-_isAlreadyFinished","meta":{"private":true}},{"name":"_reject","tagname":"method","owner":"$promise","id":"method-_reject","meta":{"private":true}},{"name":"_resolve","tagname":"method","owner":"$promise","id":"method-_resolve","meta":{"private":true}},{"name":"_resolveFuncs","tagname":"method","owner":"$promise","id":"method-_resolveFuncs","meta":{"private":true}},{"name":"catch","tagname":"method","owner":"$promise","id":"method-catch","meta":{"chainable":true}},{"name":"then","tagname":"method","owner":"$promise","id":"method-then","meta":{"chainable":true}},{"name":"_multiplePromises","tagname":"method","owner":"$promise","id":"static-method-_multiplePromises","meta":{"private":true,"static":true}},{"name":"all","tagname":"method","owner":"$promise","id":"static-method-all","meta":{"static":true}},{"name":"race","tagname":"method","owner":"$promise","id":"static-method-race","meta":{"static":true}},{"name":"reject","tagname":"method","owner":"$promise","id":"static-method-reject","meta":{"static":true}},{"name":"resolve","tagname":"method","owner":"$promise","id":"static-method-resolve","meta":{"static":true}}],"alternateClassNames":[],"aliases":{},"id":"class-S-promise","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/promise.html#$promise' target='_blank'>promise.js</a></div></pre><div class='doc-contents'><p>ES6 promise implementation.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-_STATES' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-property-_STATES' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-property-_STATES' class='name expandable'>_STATES</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Promise states. ...</div><div class='long'><p>Promise states.</p>\n<p>Defaults to: <code>{IDLE: 0, RESOLVED: 1, REJECTED: 2}</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-_isAlreadyFinished' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-method-_isAlreadyFinished' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-method-_isAlreadyFinished' class='name expandable'>_isAlreadyFinished</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Is promise already finished? ...</div><div class='long'><p>Is promise already finished?</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_reject' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-method-_reject' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-method-_reject' class='name expandable'>_reject</a>( <span class='pre'>obj</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Reject promise using obj. ...</div><div class='long'><p>Reject promise using obj.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_resolve' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-method-_resolve' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-method-_resolve' class='name expandable'>_resolve</a>( <span class='pre'>obj</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Resolve promise using obj. ...</div><div class='long'><p>Resolve promise using obj.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_resolveFuncs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-method-_resolveFuncs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-method-_resolveFuncs' class='name expandable'>_resolveFuncs</a>( <span class='pre'>isCatch</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Resolve all functions. ...</div><div class='long'><p>Resolve all functions.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>isCatch</span> : Boolean<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-catch' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-method-catch' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-method-catch' class='name expandable'>catch</a>( <span class='pre'>rejectCb</span> ) : $promise<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>After promise reject call then rejectCb. ...</div><div class='long'><p>After promise reject call then rejectCb.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rejectCb</span> : Function<div class='sub-desc'><p>Reject function</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-then' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-method-then' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-method-then' class='name expandable'>then</a>( <span class='pre'>[resolveCb], [rejectCb]</span> ) : $promise<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>After promise resolve/reject call then (okFn, errorFn). ...</div><div class='long'><p>After promise resolve/reject call then (okFn, errorFn).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>resolveCb</span> : Function (optional)<div class='sub-desc'><p>Resolve function</p>\n</div></li><li><span class='pre'>rejectCb</span> : Function (optional)<div class='sub-desc'><p>Reject function</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-_multiplePromises' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-static-method-_multiplePromises' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-static-method-_multiplePromises' class='name expandable'>_multiplePromises</a>( <span class='pre'>promises, isRace</span> ) : Boolean<span class=\"signature\"><span class='private' >private</span><span class='static' >static</span></span></div><div class='description'><div class='short'>Resolve multiple promises. ...</div><div class='long'><p>Resolve multiple promises.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>promises</span> : $promise[]<div class='sub-desc'>\n</div></li><li><span class='pre'>isRace</span> : Boolean<div class='sub-desc'><p>Is race?</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='static-method-all' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-static-method-all' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-static-method-all' class='name expandable'>all</a>( <span class='pre'>promises</span> ) : $promise<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Resolve all promises in the array. ...</div><div class='long'><p>Resolve all promises in the array.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>promises</span> : $promise[]<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='static-method-race' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-static-method-race' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-static-method-race' class='name expandable'>race</a>( <span class='pre'>promises</span> ) : $promise<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Race all promises in the array - first one resolves promise. ...</div><div class='long'><p>Race all promises in the array - first one resolves promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>promises</span> : $promise[]<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'><p>With the value from the first resolved promise.</p>\n</div></li></ul></div></div></div><div id='static-method-reject' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-static-method-reject' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-static-method-reject' class='name expandable'>reject</a>( <span class='pre'>[obj]</span> ) : $promise<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Reject promise with variable object. ...</div><div class='long'><p>Reject promise with variable object.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object (optional)<div class='sub-desc'><p>Rejected object</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='static-method-resolve' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$promise'>$promise</span><br/><a href='source/promise.html#$promise-static-method-resolve' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$promise-static-method-resolve' class='name expandable'>resolve</a>( <span class='pre'>[obj]</span> ) : $promise<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Resolve promise with variable object. ...</div><div class='long'><p>Resolve promise with variable object.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object (optional)<div class='sub-desc'><p>Resolved object</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});