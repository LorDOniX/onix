Ext.data.JsonP.$popupManager({"tagname":"class","name":"$popupManager","autodetected":{},"files":[{"filename":"onix-js-framework.js","href":"onix-js-framework.html#$popupManager"}],"members":[{"name":"","tagname":"property","owner":"$popupManager","id":"property-","meta":{}},{"name":"POSITIONS","tagname":"property","owner":"$popupManager","id":"static-property-POSITIONS","meta":{"static":true}},{"name":"_keyDown","tagname":"method","owner":"$popupManager","id":"method-_keyDown","meta":{"private":true}},{"name":"_register","tagname":"method","owner":"$popupManager","id":"method-_register","meta":{"private":true}},{"name":"_resize","tagname":"method","owner":"$popupManager","id":"method-_resize","meta":{"private":true}},{"name":"alert","tagname":"method","owner":"$popupManager","id":"method-alert","meta":{}},{"name":"captureResize","tagname":"method","owner":"$popupManager","id":"method-captureResize","meta":{}},{"name":"create","tagname":"method","owner":"$popupManager","id":"method-create","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-popupManager","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/onix-js-framework.html#$popupManager' target='_blank'>onix-js-framework.js</a></div></pre><div class='doc-contents'><p>Cover class for manage $popup - esc bindings, window resize events.</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance properties</h3><div id='property-' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-property-' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-property-' class='name expandable'></a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>File: reload-server.js</p>\n</div><div class='long'><p>File: reload-server.js</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static properties</h3><div id='static-property-POSITIONS' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-static-property-POSITIONS' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-static-property-POSITIONS' class='name expandable'>POSITIONS</a> : Object<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'><p>$popup available positions.</p>\n</div><div class='long'><p>$popup available positions.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_keyDown' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-method-_keyDown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-method-_keyDown' class='name expandable'>_keyDown</a>( <span class='pre'>e</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Keydown - ESC for $popup close. ...</div><div class='long'><p>Keydown - ESC for $popup close.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_register' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-method-_register' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-method-_register' class='name expandable'>_register</a>( <span class='pre'>inst</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Unregister $popup. ...</div><div class='long'><p>Unregister $popup. If there is no $popup, unbind keydown.\nThis method is automatically called after $popup window is closed.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>inst</span> : $popup<div class='sub-desc'><p>Instance of the new $popup</p>\n</div></li></ul></div></div></div><div id='method-_resize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-method-_resize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-method-_resize' class='name expandable'>_resize</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Resize event for all $popups. ...</div><div class='long'><p>Resize event for all $popups.</p>\n</div></div></div><div id='method-alert' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-method-alert' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-method-alert' class='name expandable'>alert</a>( <span class='pre'>msg</span> ) : $popup<span class=\"signature\"></span></div><div class='description'><div class='short'>Alert message - not draggable. ...</div><div class='long'><p>Alert message - not draggable.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>msg</span> : String<div class='sub-desc'><p>Alert message</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>$popup</span><div class='sub-desc'><p>instance of the $popup</p>\n</div></li></ul></div></div></div><div id='method-captureResize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-method-captureResize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-method-captureResize' class='name expandable'>captureResize</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Capture resize event for all $popup windows. ...</div><div class='long'><p>Capture resize event for all $popup windows.</p>\n</div></div></div><div id='method-create' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$popupManager'>$popupManager</span><br/><a href='source/onix-js-framework.html#$popupManager-method-create' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$popupManager-method-create' class='name expandable'>create</a>( <span class='pre'>[opts]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Create $popup window. ...</div><div class='long'><p>Create $popup window.\nSignals:\npopup-close - popup is closed</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>opts</span> : Object (optional)<div class='sub-desc'><p>Configuration</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});