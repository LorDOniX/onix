Ext.data.JsonP.$common({"tagname":"class","name":"$common","autodetected":{},"files":[{"filename":"onix-js-framework.js","href":"onix-js-framework.html#$common"}],"members":[{"name":"_chainPromisesInner","tagname":"method","owner":"$common","id":"method-_chainPromisesInner","meta":{"private":true}},{"name":"_cloneValue","tagname":"method","owner":"$common","id":"method-_cloneValue","meta":{"private":true}},{"name":"_compare","tagname":"method","owner":"$common","id":"method-_compare","meta":{"private":true}},{"name":"_objCopy","tagname":"method","owner":"$common","id":"method-_objCopy","meta":{"private":true}},{"name":"bindWithoutScope","tagname":"method","owner":"$common","id":"method-bindWithoutScope","meta":{}},{"name":"cancelEvents","tagname":"method","owner":"$common","id":"method-cancelEvents","meta":{}},{"name":"chainPromises","tagname":"method","owner":"$common","id":"method-chainPromises","meta":{}},{"name":"cloneValue","tagname":"method","owner":"$common","id":"method-cloneValue","meta":{}},{"name":"col","tagname":"method","owner":"$common","id":"method-col","meta":{}},{"name":"compareObjects","tagname":"method","owner":"$common","id":"method-compareObjects","meta":{}},{"name":"confirm","tagname":"method","owner":"$common","id":"method-confirm","meta":{}},{"name":"cssNameToJS","tagname":"method","owner":"$common","id":"method-cssNameToJS","meta":{}},{"name":"extend","tagname":"method","owner":"$common","id":"method-extend","meta":{}},{"name":"formatSize","tagname":"method","owner":"$common","id":"method-formatSize","meta":{}},{"name":"hexToD","tagname":"method","owner":"$common","id":"method-hexToD","meta":{}},{"name":"hexToRGB","tagname":"method","owner":"$common","id":"method-hexToRGB","meta":{}},{"name":"inherit","tagname":"method","owner":"$common","id":"method-inherit","meta":{}},{"name":"isElement","tagname":"method","owner":"$common","id":"method-isElement","meta":{}},{"name":"isObject","tagname":"method","owner":"$common","id":"method-isObject","meta":{}},{"name":"merge","tagname":"method","owner":"$common","id":"method-merge","meta":{}},{"name":"nodesForEach","tagname":"method","owner":"$common","id":"method-nodesForEach","meta":{}},{"name":"reverseForEach","tagname":"method","owner":"$common","id":"method-reverseForEach","meta":{}},{"name":"timeDuration","tagname":"method","owner":"$common","id":"method-timeDuration","meta":{}},{"name":"valueFromObject","tagname":"method","owner":"$common","id":"method-valueFromObject","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-common","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/onix-js-framework.html#$common' target='_blank'>onix-js-framework.js</a></div></pre><div class='doc-contents'><p>Commom functions used in whole application.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_chainPromisesInner' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-_chainPromisesInner' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-_chainPromisesInner' class='name expandable'>_chainPromisesInner</a>( <span class='pre'>opts, resolve, outArray, rejected</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Inner method for chaining promises. ...</div><div class='long'><p>Inner method for chaining promises.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>opts</span> : Object[]<div class='sub-desc'>\n<ul><li><span class='pre'>method</span> : String|Function<div class='sub-desc'><p>Function or method name inside scope</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>Scope for method function</p>\n</div></li><li><span class='pre'>args</span> : Array<div class='sub-desc'><p>Additional arguments for function</p>\n</div></li></ul></div></li><li><span class='pre'>resolve</span> : Function<div class='sub-desc'><p>Resolve callback for $promise</p>\n</div></li><li><span class='pre'>outArray</span> : Array<div class='sub-desc'><p>Array for output from all executed promises</p>\n</div></li><li><span class='pre'>rejected</span> : Number<div class='sub-desc'><p>Number of rejected promises</p>\n</div></li></ul></div></div></div><div id='method-_cloneValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-_cloneValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-_cloneValue' class='name expandable'>_cloneValue</a>( <span class='pre'>value, [lvl]</span> ) : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Clone value without references. ...</div><div class='long'><p>Clone value without references.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>Input value</p>\n</div></li><li><span class='pre'>lvl</span> : Number (optional)<div class='sub-desc'><p>Recursive threshold</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>cloned value</p>\n</div></li></ul></div></div></div><div id='method-_compare' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-_compare' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-_compare' class='name expandable'>_compare</a>( <span class='pre'>leftObj, rightObj, [path], [output]</span> ) : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Compare two objects - returns array of differences between left -> right object. ...</div><div class='long'><p>Compare two objects - returns array of differences between left -> right object.\nIf length is 0 -> there is no difference.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>leftObj</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>rightObj</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>path</span> : Array[String] (optional)<div class='sub-desc'><p>Object path</p>\n</div></li><li><span class='pre'>output</span> : Array[String] (optional)<div class='sub-desc'><p>All differences</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_objCopy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-_objCopy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-_objCopy' class='name expandable'>_objCopy</a>( <span class='pre'>dest, source</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Object copy, from source to dest. ...</div><div class='long'><p>Object copy, from source to dest.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dest</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>source</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-bindWithoutScope' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-bindWithoutScope' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-bindWithoutScope' class='name expandable'>bindWithoutScope</a>( <span class='pre'>cb</span> ) : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Bind function arguments without scope. ...</div><div class='long'><p>Bind function arguments without scope.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cb</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Function</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-cancelEvents' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-cancelEvents' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-cancelEvents' class='name expandable'>cancelEvents</a>( <span class='pre'>e</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Cancel event and his propagation. ...</div><div class='long'><p>Cancel event and his propagation.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-chainPromises' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-chainPromises' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-chainPromises' class='name expandable'>chainPromises</a>( <span class='pre'>opts</span> ) : $promise<span class=\"signature\"></span></div><div class='description'><div class='short'>Chaining multiple methods with promises, returns promise. ...</div><div class='long'><p>Chaining multiple methods with promises, returns promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>opts</span> : Object[]<div class='sub-desc'>\n<ul><li><span class='pre'>method</span> : String|Function<div class='sub-desc'><p>Function or method name inside scope</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>Scope for method function</p>\n</div></li><li><span class='pre'>args</span> : Array<div class='sub-desc'><p>Additional arguments for function</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'><p>Resolve with object { outArray: [promise outputs], rejected: 0..n count of rejected promise }</p>\n</div></li></ul></div></div></div><div id='method-cloneValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-cloneValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-cloneValue' class='name expandable'>cloneValue</a>( <span class='pre'>value</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Clone value without references. ...</div><div class='long'><p>Clone value without references.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>Input value</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>cloned value</p>\n</div></li></ul></div></div></div><div id='method-col' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-col' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-col' class='name expandable'>col</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Cover function for console.log, which allows to replace {0..n} occurences inside string. ...</div><div class='long'><p>Cover function for console.log, which allows to replace {0..n} occurences inside string.\nFirst argument is string, other arguments are for replace objects by key.</p>\n</div></div></div><div id='method-compareObjects' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-compareObjects' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-compareObjects' class='name expandable'>compareObjects</a>( <span class='pre'>leftObj, rightObj</span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Compare two objects - returns array of differences between left -> right object. ...</div><div class='long'><p>Compare two objects - returns array of differences between left -> right object.\nIf length is 0 -> there is no difference.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>leftObj</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>rightObj</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-confirm' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-confirm' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-confirm' class='name expandable'>confirm</a>( <span class='pre'>txt</span> ) : $promise<span class=\"signature\"></span></div><div class='description'><div class='short'>Confirm window, returns promise. ...</div><div class='long'><p>Confirm window, returns promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>txt</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-cssNameToJS' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-cssNameToJS' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-cssNameToJS' class='name expandable'>cssNameToJS</a>( <span class='pre'>value</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Converts css name to javascript style interpretation. ...</div><div class='long'><p>Converts css name to javascript style interpretation.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>\"z-index\" -> zIndex</p>\n</div></li></ul></div></div></div><div id='method-extend' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-extend' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-extend' class='name expandable'>extend</a>( <span class='pre'>dest, source</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Extend one object by other; from source to dest. ...</div><div class='long'><p>Extend one object by other; from source to dest.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dest</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>source</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-formatSize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-formatSize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-formatSize' class='name expandable'>formatSize</a>( <span class='pre'>size</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Format size in bytes. ...</div><div class='long'><p>Format size in bytes.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>size</span> : Number<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-hexToD' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-hexToD' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-hexToD' class='name expandable'>hexToD</a>( <span class='pre'>hex</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>HEX value to DEC. ...</div><div class='long'><p>HEX value to DEC.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>hex</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-hexToRGB' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-hexToRGB' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-hexToRGB' class='name expandable'>hexToRGB</a>( <span class='pre'>hexColor</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>HEX value to RGB. ...</div><div class='long'><p>HEX value to RGB.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>hexColor</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-inherit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-inherit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-inherit' class='name expandable'>inherit</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Inherit function with another function/s. ...</div><div class='long'><p>Inherit function with another function/s.\nFirst argument is source function, others are for inheritance.\nLast parameters have higher priority than the previous ones.</p>\n</div></div></div><div id='method-isElement' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-isElement' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-isElement' class='name expandable'>isElement</a>( <span class='pre'>val</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is value element? ...</div><div class='long'><p>Is value element?</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>val</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isObject' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-isObject' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-isObject' class='name expandable'>isObject</a>( <span class='pre'>item</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is item object? ...</div><div class='long'><p>Is item object?</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>item</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-merge' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-merge' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-merge' class='name expandable'>merge</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Merge multiple objects into the single one. ...</div><div class='long'><p>Merge multiple objects into the single one.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-nodesForEach' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-nodesForEach' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-nodesForEach' class='name expandable'>nodesForEach</a>( <span class='pre'>nodes, cb, scope</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Missing for each for Node array. ...</div><div class='long'><p>Missing for each for Node array.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>nodes</span> : Object[]<div class='sub-desc'>\n</div></li><li><span class='pre'>cb</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>scope</span> : Object|Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-reverseForEach' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-reverseForEach' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-reverseForEach' class='name expandable'>reverseForEach</a>( <span class='pre'>arr, cb, [scope]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Reverse for each. ...</div><div class='long'><p>Reverse for each.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>arr</span> : Array<div class='sub-desc'>\n</div></li><li><span class='pre'>cb</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>scope</span> : Function (optional)<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-timeDuration' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-timeDuration' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-timeDuration' class='name expandable'>timeDuration</a>( <span class='pre'>seconds</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Format time duration in secods. ...</div><div class='long'><p>Format time duration in secods.\nOutput in format: hours:minutes:seconds.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>seconds</span> : Number<div class='sub-desc'><p>Number of seconds</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-valueFromObject' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$common'>$common</span><br/><a href='source/onix-js-framework.html#$common-method-valueFromObject' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$common-method-valueFromObject' class='name expandable'>valueFromObject</a>( <span class='pre'>obj, path, [defValue]</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Get value from object using JSON path. ...</div><div class='long'><p>Get value from object using JSON path.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>path</span> : String<div class='sub-desc'><p>\"key.subkey.keyxy\", \"key.subkey.key[5].keyYZ\"</p>\n</div></li><li><span class='pre'>defValue</span> : Object (optional)<div class='sub-desc'><p>Default value if path does not exist</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>value from path|default value|null</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});