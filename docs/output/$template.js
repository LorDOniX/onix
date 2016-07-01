Ext.data.JsonP.$template({"tagname":"class","name":"$template","autodetected":{},"files":[{"filename":"onix-js-framework.js","href":"onix-js-framework.html#$template"}],"members":[{"name":"_CONST","tagname":"property","owner":"$template","id":"property-_CONST","meta":{"private":true}},{"name":"_RE","tagname":"property","owner":"$template","id":"property-_RE","meta":{"private":true}},{"name":"_cache","tagname":"property","owner":"$template","id":"property-_cache","meta":{"private":true}},{"name":"_bindEvent","tagname":"method","owner":"$template","id":"method-_bindEvent","meta":{"private":true}},{"name":"_getAttributes","tagname":"method","owner":"$template","id":"method-_getAttributes","meta":{"private":true}},{"name":"_init","tagname":"method","owner":"$template","id":"method-_init","meta":{"private":true}},{"name":"_parseArgs","tagname":"method","owner":"$template","id":"method-_parseArgs","meta":{"private":true}},{"name":"_parseFnName","tagname":"method","owner":"$template","id":"method-_parseFnName","meta":{"private":true}},{"name":"add","tagname":"method","owner":"$template","id":"method-add","meta":{}},{"name":"bindTemplate","tagname":"method","owner":"$template","id":"method-bindTemplate","meta":{}},{"name":"compile","tagname":"method","owner":"$template","id":"method-compile","meta":{}},{"name":"get","tagname":"method","owner":"$template","id":"method-get","meta":{}},{"name":"load","tagname":"method","owner":"$template","id":"method-load","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-template","short_doc":"Handle templates, binds events - syntax similar to moustache and angular template system. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/onix-js-framework.html#$template' target='_blank'>onix-js-framework.js</a></div></pre><div class='doc-contents'><p>Handle templates, binds events - syntax similar to moustache and angular template system.\n$myQuery is used for cache record.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-_CONST' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-property-_CONST' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-property-_CONST' class='name expandable'>_CONST</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Constants. ...</div><div class='long'><p>Constants.</p>\n<p>Defaults to: <code>{FILTER_DELIMETER: &quot;|&quot;, FILTER_PARAM_DELIMETER: &quot;:&quot;, TEMPLATE_SCRIPT_SELECTOR: &quot;script[type=&#39;text/template&#39;]&quot;}</code></p></div></div></div><div id='property-_RE' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-property-_RE' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-property-_RE' class='name expandable'>_RE</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Regular expressions for handle template variables. ...</div><div class='long'><p>Regular expressions for handle template variables.</p>\n<p>Defaults to: <code>{VARIABLE: /[$_a-zA-Z][$_a-zA-Z0-9]+/g, NUMBERS: /[-]?[0-9]+[.]?([0-9e]+)?/g, STRINGS: /[&quot;&#39;][^&quot;&#39;]+[&quot;&#39;]/g, JSONS: /[{][^}]+[}]/g, ALL: /[-]?[0-9]+[.]?([0-9e]+)?|[&quot;&#39;][^&quot;&#39;]+[&quot;&#39;]|[{][^}]+[}]|[$_a-zA-Z][$_a-zA-Z0-9]+/g}</code></p></div></div></div><div id='property-_cache' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-property-_cache' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-property-_cache' class='name expandable'>_cache</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Template cache. ...</div><div class='long'><p>Template cache.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_bindEvent' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-_bindEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-_bindEvent' class='name expandable'>_bindEvent</a>( <span class='pre'>el, attr, scope</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Bind one single event to the element. ...</div><div class='long'><p>Bind one single event to the element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : HTMLElement<div class='sub-desc'>\n</div></li><li><span class='pre'>attr</span> : Object<div class='sub-desc'><p>{ name, value }</p>\n</div></li><li><span class='pre'>scope</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_getAttributes' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-_getAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-_getAttributes' class='name expandable'>_getAttributes</a>( <span class='pre'>el</span> ) : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Get element prefixed attributes. ...</div><div class='long'><p>Get element prefixed attributes.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : HTMLElement<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_init' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-_init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-_init' class='name expandable'>_init</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Init - get all templates from the page. ...</div><div class='long'><p>Init - get all templates from the page. Uses 'text/template' script with template data.\nEach script has to have id and specifi type=\"text/template\".</p>\n</div></div></div><div id='method-_parseArgs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-_parseArgs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-_parseArgs' class='name expandable'>_parseArgs</a>( <span class='pre'>value, config</span> ) : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Parse arguments from the string -> makes array from them. ...</div><div class='long'><p>Parse arguments from the string -> makes array from them.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n<ul><li><span class='pre'>$event</span> : Object<div class='sub-desc'><p>Event object</p>\n</div></li><li><span class='pre'>$element</span> : Object<div class='sub-desc'><p>Reference to element</p>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_parseFnName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-_parseFnName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-_parseFnName' class='name expandable'>_parseFnName</a>( <span class='pre'>value</span> ) : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Parse a function name from the string. ...</div><div class='long'><p>Parse a function name from the string.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-add' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-add' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-add' class='name expandable'>add</a>( <span class='pre'>key, data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Add new item to the cache. ...</div><div class='long'><p>Add new item to the cache.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>data</span> : String<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-bindTemplate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-bindTemplate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-bindTemplate' class='name expandable'>bindTemplate</a>( <span class='pre'>root, scope, [addElsCb]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Bind all elements in the root element. ...</div><div class='long'><p>Bind all elements in the root element. Selectors all data-* and functions are binds against scope object.\nFor data-bind, scope has to have \"addEls\" function.\nSupports: click, change, keydown, bind.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>root</span> : HTMLElement<div class='sub-desc'><p>Root element</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>Scope which against will be binding used</p>\n</div></li><li><span class='pre'>addElsCb</span> : Function (optional)<div class='sub-desc'><p>Callback function with object with all data-bind objects</p>\n</div></li></ul></div></div></div><div id='method-compile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-compile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-compile' class='name expandable'>compile</a>( <span class='pre'>key, data</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Compile one template - replaces all ocurances of {{ xxx }} by model. ...</div><div class='long'><p>Compile one template - replaces all ocurances of {{ xxx }} by model.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Template key/name</p>\n</div></li><li><span class='pre'>data</span> : Object<div class='sub-desc'><p>Model</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-get' class='name expandable'>get</a>( <span class='pre'>key</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Get template from the cache. ...</div><div class='long'><p>Get template from the cache.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>Template key/name</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-load' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$template'>$template</span><br/><a href='source/onix-js-framework.html#$template-method-load' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$template-method-load' class='name expandable'>load</a>( <span class='pre'>key, path</span> ) : $promise<span class=\"signature\"></span></div><div class='description'><div class='short'>Load template from the path, returns promise after load. ...</div><div class='long'><p>Load template from the path, returns promise after load.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>path</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$promise</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});