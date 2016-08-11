Ext.data.JsonP.onix({"tagname":"class","name":"onix","autodetected":{},"files":[{"filename":"onix-js-framework.js","href":"onix-js-framework.html#onix"}],"members":[{"name":"element","tagname":"property","owner":"onix","id":"property-element","meta":{}},{"name":"info","tagname":"method","owner":"onix","id":"static-method-info","meta":{"static":true}},{"name":"match","tagname":"method","owner":"onix","id":"static-method-match","meta":{"static":true}},{"name":"module","tagname":"method","owner":"onix","id":"static-method-module","meta":{"static":true}},{"name":"noop","tagname":"method","owner":"onix","id":"static-method-noop","meta":{"static":true}}],"alternateClassNames":[],"aliases":{},"id":"class-onix","short_doc":"Main framework object, which is created like new module with name 'onix'. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/onix-js-framework.html#onix' target='_blank'>onix-js-framework.js</a></div></pre><div class='doc-contents'><p>Main framework object, which is created like new module with name 'onix'.\nModule has addtional functions.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-element' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='onix'>onix</span><br/><a href='source/onix-js-framework.html#onix-property-element' target='_blank' class='view-source'>view source</a></div><a href='#!/api/onix-property-element' class='name expandable'>element</a> : Function<span class=\"signature\"></span></div><div class='description'><div class='short'>Quick acces to myQuery and DOM manipulation. ...</div><div class='long'><p>Quick acces to myQuery and DOM manipulation.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : String|HTMLElement|Array<div class='sub-desc'>\n</div></li><li><span class='pre'>parent</span> : HTMLElement|$myQuery (optional)<div class='sub-desc'><p>Parent node</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$myQuery</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-info' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='onix'>onix</span><br/><a href='source/onix-js-framework.html#onix-static-method-info' target='_blank' class='view-source'>view source</a></div><a href='#!/api/onix-static-method-info' class='name expandable'>info</a>( <span class='pre'></span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Framework info. ...</div><div class='long'><p>Framework info.</p>\n\n<p>version: 2.8.8\ndate: 11. 8. 2016</p>\n</div></div></div><div id='static-method-match' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='onix'>onix</span><br/><a href='source/onix-js-framework.html#onix-static-method-match' target='_blank' class='view-source'>view source</a></div><a href='#!/api/onix-static-method-match' class='name expandable'>match</a>( <span class='pre'>txt, delimeter</span> ) : Array<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Split string with delimeter. ...</div><div class='long'><p>Split string with delimeter. Similar to string.split(), but keeps opening strings/brackets in the memory.\n\"5, {x:5, c: 6}, 'Roman, Peter'\".split(\",\") => [\"5\", \" {x:5\", \" c: 6}\", \" 'Roman\", \" Peter'\"]\nonix.split(\"5, {x:5, c: 6}, 'Roman, Peter'\", \",\") => [\"5\", \"{x:5, c: 6}\", \"'Roman, Peter\"]</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>txt</span> : String<div class='sub-desc'><p>Input string</p>\n</div></li><li><span class='pre'>delimeter</span> : String<div class='sub-desc'><p>one character splitter</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='static-method-module' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='onix'>onix</span><br/><a href='source/onix-js-framework.html#onix-static-method-module' target='_blank' class='view-source'>view source</a></div><a href='#!/api/onix-static-method-module' class='name expandable'>module</a>( <span class='pre'>name, [dependencies]</span> ) : $module<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Add a new module to the application. ...</div><div class='long'><p>Add a new module to the application.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Module name</p>\n</div></li><li><span class='pre'>dependencies</span> : Array (optional)<div class='sub-desc'><p>Module dependencies</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$module</span><div class='sub-desc'><p>Created module</p>\n</div></li></ul></div></div></div><div id='static-method-noop' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='onix'>onix</span><br/><a href='source/onix-js-framework.html#onix-static-method-noop' target='_blank' class='view-source'>view source</a></div><a href='#!/api/onix-static-method-noop' class='name expandable'>noop</a>( <span class='pre'></span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Empty function. ...</div><div class='long'><p>Empty function.</p>\n</div></div></div></div></div></div></div>","meta":{}});