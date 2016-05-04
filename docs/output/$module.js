Ext.data.JsonP.$module({"tagname":"class","name":"$module","autodetected":{},"files":[{"filename":"onix.js","href":"onix.html#$module"}],"members":[{"name":"CONST","tagname":"property","owner":"$module","id":"property-CONST","meta":{"private":true}},{"name":"_configs","tagname":"property","owner":"$module","id":"property-_configs","meta":{"private":true}},{"name":"_dependencies","tagname":"property","owner":"$module","id":"property-_dependencies","meta":{"private":true}},{"name":"_name","tagname":"property","owner":"$module","id":"property-_name","meta":{"private":true}},{"name":"_objects","tagname":"property","owner":"$module","id":"property-_objects","meta":{"private":true}},{"name":"_runs","tagname":"property","owner":"$module","id":"property-_runs","meta":{"private":true}},{"name":"parseParam","tagname":"property","owner":"$module","id":"property-parseParam","meta":{}},{"name":"config","tagname":"method","owner":"$module","id":"method-config","meta":{"chainable":true}},{"name":"constant","tagname":"method","owner":"$module","id":"method-constant","meta":{"chainable":true}},{"name":"factory","tagname":"method","owner":"$module","id":"method-factory","meta":{"chainable":true}},{"name":"filter","tagname":"method","owner":"$module","id":"method-filter","meta":{"chainable":true}},{"name":"getConfigs","tagname":"method","owner":"$module","id":"method-getConfigs","meta":{}},{"name":"getDependencies","tagname":"method","owner":"$module","id":"method-getDependencies","meta":{}},{"name":"getFilterName","tagname":"method","owner":"$module","id":"method-getFilterName","meta":{}},{"name":"getName","tagname":"method","owner":"$module","id":"method-getName","meta":{}},{"name":"getObjects","tagname":"method","owner":"$module","id":"method-getObjects","meta":{}},{"name":"getRuns","tagname":"method","owner":"$module","id":"method-getRuns","meta":{}},{"name":"provider","tagname":"method","owner":"$module","id":"method-provider","meta":{"chainable":true}},{"name":"run","tagname":"method","owner":"$module","id":"method-run","meta":{"chainable":true}},{"name":"service","tagname":"method","owner":"$module","id":"method-service","meta":{"chainable":true}},{"name":"value","tagname":"method","owner":"$module","id":"method-value","meta":{"chainable":true}}],"alternateClassNames":[],"aliases":{},"id":"class-S-module","short_doc":"Module object - handles one module object with services, factories etc. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/onix.html#$module' target='_blank'>onix.js</a></div></pre><div class='doc-contents'><p>Module object - handles one module object with services, factories etc.\nThis object cannot be used in dependency injection!</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-CONST' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-property-CONST' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-property-CONST' class='name expandable'>CONST</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'><p>Module constants.</p>\n</div><div class='long'><p>Module constants.</p>\n</div></div></div><div id='property-_configs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-property-_configs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-property-_configs' class='name expandable'>_configs</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>All config objects. ...</div><div class='long'><p>All config objects.</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-_dependencies' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-property-_dependencies' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-property-_dependencies' class='name expandable'>_dependencies</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'><p>Module dependencies.</p>\n</div><div class='long'><p>Module dependencies.</p>\n</div></div></div><div id='property-_name' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-property-_name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-property-_name' class='name expandable'>_name</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'><p>Module name.</p>\n</div><div class='long'><p>Module name.</p>\n</div></div></div><div id='property-_objects' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-property-_objects' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-property-_objects' class='name expandable'>_objects</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>All objects. ...</div><div class='long'><p>All objects.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='property-_runs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-property-_runs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-property-_runs' class='name expandable'>_runs</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>All run objects. ...</div><div class='long'><p>All run objects.</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-parseParam' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-property-parseParam' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-property-parseParam' class='name expandable'>parseParam</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Parse parameters. ...</div><div class='long'><p>Parse parameters. From param parse function and dependencies.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>param</span> : Array|Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Parse object</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-config' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-config' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-config' class='name expandable'>config</a>( <span class='pre'>param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add a new config. ...</div><div class='long'><p>Add a new config.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>param</span> : Array|Function<div class='sub-desc'><p>With DI</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-constant' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-constant' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-constant' class='name expandable'>constant</a>( <span class='pre'>name, param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add new constant. ...</div><div class='long'><p>Add new constant.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>param</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-factory' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-factory' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-factory' class='name expandable'>factory</a>( <span class='pre'>name, param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add factory to the application. ...</div><div class='long'><p>Add factory to the application.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>param</span> : Function|Array<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-filter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-filter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-filter' class='name expandable'>filter</a>( <span class='pre'>name, param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add filter to the application. ...</div><div class='long'><p>Add filter to the application.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>param</span> : Function|Array<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-getConfigs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-getConfigs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-getConfigs' class='name expandable'>getConfigs</a>( <span class='pre'></span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get module configs. ...</div><div class='long'><p>Get module configs.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getDependencies' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-getDependencies' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-getDependencies' class='name expandable'>getDependencies</a>( <span class='pre'></span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get dependencies. ...</div><div class='long'><p>Get dependencies.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getFilterName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-getFilterName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-getFilterName' class='name expandable'>getFilterName</a>( <span class='pre'>name</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Get filter name. ...</div><div class='long'><p>Get filter name.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-getName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-getName' class='name expandable'>getName</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Get module name. ...</div><div class='long'><p>Get module name.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getObjects' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-getObjects' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-getObjects' class='name expandable'>getObjects</a>( <span class='pre'></span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get module objects. ...</div><div class='long'><p>Get module objects.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getRuns' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-getRuns' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-getRuns' class='name expandable'>getRuns</a>( <span class='pre'></span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get module runs. ...</div><div class='long'><p>Get module runs.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-provider' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-provider' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-provider' class='name expandable'>provider</a>( <span class='pre'>name, param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add provider to the application. ...</div><div class='long'><p>Add provider to the application.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>param</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-run' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-run' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-run' class='name expandable'>run</a>( <span class='pre'>param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add a new run. ...</div><div class='long'><p>Add a new run.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>param</span> : Array|Function<div class='sub-desc'><p>With DI</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-service' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-service' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-service' class='name expandable'>service</a>( <span class='pre'>name, param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add service to the application. ...</div><div class='long'><p>Add service to the application.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>param</span> : Function|Array<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-value' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$module'>$module</span><br/><a href='source/onix.html#$module-method-value' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$module-method-value' class='name expandable'>value</a>( <span class='pre'>name, param</span> ) : $module<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Add a new value. ...</div><div class='long'><p>Add a new value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>param</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});