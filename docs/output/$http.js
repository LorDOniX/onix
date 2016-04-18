Ext.data.JsonP.$http({"tagname":"class","name":"$http","autodetected":{},"files":[{"filename":"http.js","href":"http.html#$http"}],"members":[{"name":"METHOD","tagname":"property","owner":"$http","id":"property-METHOD","meta":{}},{"name":"POST_TYPES","tagname":"property","owner":"$http","id":"property-POST_TYPES","meta":{}},{"name":"_preparePostData","tagname":"method","owner":"$http","id":"method-_preparePostData","meta":{"private":true}},{"name":"_updateURL","tagname":"method","owner":"$http","id":"method-_updateURL","meta":{"private":true}},{"name":"createRequest","tagname":"method","owner":"$http","id":"method-createRequest","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-http","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/http.html#$http' target='_blank'>http.js</a></div></pre><div class='doc-contents'><p>XMLHttpRequest cover class.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-METHOD' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$http'>$http</span><br/><a href='source/http.html#$http-property-METHOD' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$http-property-METHOD' class='name expandable'>METHOD</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Http methods. ...</div><div class='long'><p>Http methods.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>POST</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>GET</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>DELETE</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>PATCH</span> : String<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='property-POST_TYPES' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$http'>$http</span><br/><a href='source/http.html#$http-property-POST_TYPES' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$http-property-POST_TYPES' class='name expandable'>POST_TYPES</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Request types ...</div><div class='long'><p>Request types</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>JSON</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>FORM_DATA</span> : Number<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_preparePostData' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$http'>$http</span><br/><a href='source/http.html#$http-method-_preparePostData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$http-method-_preparePostData' class='name expandable'>_preparePostData</a>( <span class='pre'>data</span> ) : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects\nPrepare post data ...</div><div class='long'><p>https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects\nPrepare post data</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object|Array<div class='sub-desc'><p>{ name, value }</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_updateURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$http'>$http</span><br/><a href='source/http.html#$http-method-_updateURL' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$http-method-_updateURL' class='name expandable'>_updateURL</a>( <span class='pre'>url, data</span> ) : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Update URL using get data. ...</div><div class='long'><p>Update URL using get data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>data</span> : Array<div class='sub-desc'><p>{ name, value }</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createRequest' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$http'>$http</span><br/><a href='source/http.html#$http-method-createRequest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$http-method-createRequest' class='name expandable'>createRequest</a>( <span class='pre'>config</span> ) : $q<span class=\"signature\"></span></div><div class='description'><div class='short'>Create new XHR request, returns promise. ...</div><div class='long'><p>Create new XHR request, returns promise.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n<ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>method</span> : String (optional)<div class='sub-desc'><p>Method from <a href=\"#!/api/$http-property-METHOD\" rel=\"$http-property-METHOD\" class=\"docClass\">$http.METHOD</a></p>\n</div></li><li><span class='pre'>postType</span> : String (optional)<div class='sub-desc'><p>Post type from <a href=\"#!/api/$http-property-POST_TYPES\" rel=\"$http-property-POST_TYPES\" class=\"docClass\">$http.POST_TYPES</a></p>\n</div></li><li><span class='pre'>getData</span> : Array (optional)<div class='sub-desc'><p>Data, which will be send in the url (GET)</p>\n</div></li><li><span class='pre'>postData</span> : Object|FormData (optional)<div class='sub-desc'><p>Post data</p>\n</div></li><li><span class='pre'>headers</span> : Object (optional)<div class='sub-desc'><p>Additional headers</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$q</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});