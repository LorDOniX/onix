Ext.data.JsonP.$common({"tagname":"class","name":"$common","autodetected":{},"files":[{"filename":"common.js","href":"common.html#$common"}],"members":[{"name":"_chainPromisesInner","tagname":"method","owner":"$common","id":"method-_chainPromisesInner","meta":{}},{"name":"_objCopy","tagname":"method","owner":"$common","id":"method-_objCopy","meta":{"private":true}},{"name":"bindWithoutScope","tagname":"method","owner":"$common","id":"method-bindWithoutScope","meta":{}},{"name":"chainPromises","tagname":"method","owner":"$common","id":"method-chainPromises","meta":{}},{"name":"col","tagname":"method","owner":"$common","id":"method-col","meta":{}},{"name":"confirm","tagname":"method","owner":"$common","id":"method-confirm","meta":{}},{"name":"doJobs","tagname":"method","owner":"$common","id":"method-doJobs","meta":{}},{"name":"extend","tagname":"method","owner":"$common","id":"method-extend","meta":{}},{"name":"getCookie","tagname":"method","owner":"$common","id":"method-getCookie","meta":{"private":true}},{"name":"hexToRGB","tagname":"method","owner":"$common","id":"method-hexToRGB","meta":{}},{"name":"humanLength","tagname":"method","owner":"$common","id":"method-humanLength","meta":{}},{"name":"hxToDe","tagname":"method","owner":"$common","id":"method-hxToDe","meta":{}},{"name":"isElement","tagname":"method","owner":"$common","id":"method-isElement","meta":{}},{"name":"isObject","tagname":"method","owner":"$common","id":"method-isObject","meta":{}},{"name":"merge","tagname":"method","owner":"$common","id":"method-merge","meta":{}},{"name":"nodesForEach","tagname":"method","owner":"$common","id":"method-nodesForEach","meta":{}},{"name":"reverseForEach","tagname":"method","owner":"$common","id":"method-reverseForEach","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-common","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/common.html#$common' target='_blank'>common.js</a></div></pre><div class='doc-contents'><p>Commom functions used in whole application.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_chainPromisesInner' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-_chainPromisesInner' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-_chainPromisesInner' class='name expandable'>_chainPromisesInner</a>( <span class='pre'>opts, promise, outArray</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Inner method for chaining promises. ...</div><div class='long'><p>Inner method for chaining promises.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>opts</span> : Object[]<div class='sub-desc'>\n<ul><li><span class='pre'>method</span> : String|Function<div class='sub-desc'><p>Function or method name inside scope</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>Scope for method function</p>\n</div></li><li><span class='pre'>args</span> : Array<div class='sub-desc'><p>Additional arguments for function</p>\n</div></li></ul></div></li><li><span class='pre'>promise</span> : promise<div class='sub-desc'><p>Done promise $q</p>\n</div></li><li><span class='pre'>outArray</span> : Array<div class='sub-desc'><p>Array for output from all executed promises</p>\n</div></li></ul></div></div></div><div id='method-_objCopy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-_objCopy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-_objCopy' class='name expandable'>_objCopy</a>( <span class='pre'>dest, source</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Object copy, from source to dest. ...</div><div class='long'><p>Object copy, from source to dest.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dest</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>source</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-bindWithoutScope' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-bindWithoutScope' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-bindWithoutScope' class='name expandable'>bindWithoutScope</a>( <span class='pre'>cb</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Bind function arguments without scope. ...</div><div class='long'><p>Bind function arguments without scope.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cb</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-chainPromises' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-chainPromises' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-chainPromises' class='name expandable'>chainPromises</a>( <span class='pre'>opts</span> ) : $q<span class=\"signature\"></span></div><div class='description'><div class='short'>Chaining multiple methods with promises, returns promise. ...</div><div class='long'><p>Chaining multiple methods with promises, returns promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>opts</span> : Object[]<div class='sub-desc'>\n<ul><li><span class='pre'>method</span> : String|Function<div class='sub-desc'><p>Function or method name inside scope</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>Scope for method function</p>\n</div></li><li><span class='pre'>args</span> : Array<div class='sub-desc'><p>Additional arguments for function</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-col' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-col' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-col' class='name expandable'>col</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Cover function for console.log, which allows to replace {0..n} occurences inside string. ...</div><div class='long'><p>Cover function for console.log, which allows to replace {0..n} occurences inside string.\nFirst argument is string, other arguments are for replace objects by key.</p>\n</div></div></div><div id='method-confirm' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-confirm' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-confirm' class='name expandable'>confirm</a>( <span class='pre'>txt</span> ) : $q<span class=\"signature\"></span></div><div class='description'><div class='short'>Confirm window, returns promise. ...</div><div class='long'><p>Confirm window, returns promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>txt</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-doJobs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-doJobs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-doJobs' class='name expandable'>doJobs</a>( <span class='pre'>jobsArray, count, taskDoneObj</span> ) : $q<span class=\"signature\"></span></div><div class='description'><div class='short'>Run jobs array with count for how many functions will be processed simultinously. ...</div><div class='long'><p>Run jobs array with count for how many functions will be processed simultinously.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>jobsArray</span> : Object[]<div class='sub-desc'><p>Array with jobs objects</p>\n<ul><li><span class='pre'>task</span> : Function<div class='sub-desc'><p>Job function</p>\n</div></li><li><span class='pre'>scope</span> : Function (optional)<div class='sub-desc'><p>Variable function scope</p>\n</div></li><li><span class='pre'>args</span> : Function (optional)<div class='sub-desc'><p>Add params to the function</p>\n</div></li></ul></div></li><li><span class='pre'>count</span> : Number<div class='sub-desc'><p>How many functions processed simultinously</p>\n</div></li><li><span class='pre'>taskDoneObj</span> : Object<div class='sub-desc'><p>Callback after one task have been done</p>\n<ul><li><span class='pre'>cb</span> : Object<div class='sub-desc'><p>Function</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>Function scope</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'><p>Callback after all jobs are done</p>\n</div></li></ul></div></div></div><div id='method-extend' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-extend' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-extend' class='name expandable'>extend</a>( <span class='pre'>dest, source</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Extend one object by other; from source to dest. ...</div><div class='long'><p>Extend one object by other; from source to dest.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dest</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>source</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getCookie' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-getCookie' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-getCookie' class='name expandable'>getCookie</a>( <span class='pre'>name</span> ) : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Get cookie by her name. ...</div><div class='long'><p>Get cookie by her name.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-hexToRGB' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-hexToRGB' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-hexToRGB' class='name expandable'>hexToRGB</a>( <span class='pre'>hexColor</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>HEX value to RGB. ...</div><div class='long'><p>HEX value to RGB.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>hexColor</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-humanLength' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-humanLength' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-humanLength' class='name expandable'>humanLength</a>( <span class='pre'>size</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Size to KB/MB. ...</div><div class='long'><p>Size to KB/MB.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>size</span> : Number<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-hxToDe' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-hxToDe' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-hxToDe' class='name expandable'>hxToDe</a>( <span class='pre'>hex</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>HEX value to DEC. ...</div><div class='long'><p>HEX value to DEC.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>hex</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isElement' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-isElement' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-isElement' class='name expandable'>isElement</a>( <span class='pre'>val</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is value element? ...</div><div class='long'><p>Is value element?</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>val</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isObject' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-isObject' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-isObject' class='name expandable'>isObject</a>( <span class='pre'>item</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is item object? ...</div><div class='long'><p>Is item object?</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>item</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-merge' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-merge' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-merge' class='name expandable'>merge</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Merge multiple objects into the single one. ...</div><div class='long'><p>Merge multiple objects into the single one.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-nodesForEach' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-nodesForEach' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-nodesForEach' class='name expandable'>nodesForEach</a>( <span class='pre'>nodes, cb, scope</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Missing for each for Node array. ...</div><div class='long'><p>Missing for each for Node array.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>nodes</span> : Object[]<div class='sub-desc'>\n</div></li><li><span class='pre'>cb</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>scope</span> : Object|Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-reverseForEach' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/common.html#$common-method-reverseForEach' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-reverseForEach' class='name expandable'>reverseForEach</a>( <span class='pre'>arr, cb, scope</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Reverse for each. ...</div><div class='long'><p>Reverse for each.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>arr</span> : Array<div class='sub-desc'>\n</div></li><li><span class='pre'>cb</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>scope</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});