Ext.data.JsonP.$select({"tagname":"class","name":"$select","autodetected":{},"files":[{"filename":"select.js","href":"select.html#$select"}],"params":[{"tagname":"params","type":"HTMLElement","name":"el","doc":"<p>Where element has class \"dropdown\"</p>\n","html_type":"HTMLElement"},{"tagname":"params","type":"Object","name":"opts","doc":"\n","properties":[{"tagname":"params","type":"Boolean","name":"addCaption","doc":"<p>Add caption to select</p>\n","html_type":"Boolean"}],"html_type":"Object"}],"owner":"$select","members":[{"name":"_bind","tagname":"method","owner":"$select","id":"method-_bind","meta":{"private":true}},{"name":"_bindCaption","tagname":"method","owner":"$select","id":"method-_bindCaption","meta":{"private":true}},{"name":"_bindChoices","tagname":"method","owner":"$select","id":"method-_bindChoices","meta":{"private":true}},{"name":"_captionClick","tagname":"method","owner":"$select","id":"method-_captionClick","meta":{"private":true}},{"name":"_choiceClick","tagname":"method","owner":"$select","id":"method-_choiceClick","meta":{"private":true}},{"name":"rebindChoices","tagname":"method","owner":"$select","id":"method-rebindChoices","meta":{}},{"name":"selectOption","tagname":"method","owner":"$select","id":"method-selectOption","meta":{}},{"name":"setAddCaption","tagname":"method","owner":"$select","id":"method-setAddCaption","meta":{}},{"name":"unbindChoices","tagname":"method","owner":"$select","id":"method-unbindChoices","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-select","short_doc":"Main class for select. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/select.html#$select' target='_blank'>select.js</a></div></pre><div class='doc-contents'><p>Main class for select.\nDI: $common, $event;</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : HTMLElement<div class='sub-desc'><p>Where element has class \"dropdown\"</p>\n</div></li><li><span class='pre'>opts</span> : Object<div class='sub-desc'>\n<ul><li><span class='pre'>addCaption</span> : Boolean<div class='sub-desc'><p>Add caption to select</p>\n</div></li></ul></div></li></ul></div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_bind' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-_bind' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-_bind' class='name expandable'>_bind</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Bind clicks on the select. ...</div><div class='long'><p>Bind clicks on the select.</p>\n</div></div></div><div id='method-_bindCaption' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-_bindCaption' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-_bindCaption' class='name expandable'>_bindCaption</a>( <span class='pre'>el</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Bind caption el. ...</div><div class='long'><p>Bind caption el.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : HTMLElement<div class='sub-desc'><p>Where element has class \"dropdown\"</p>\n</div></li></ul></div></div></div><div id='method-_bindChoices' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-_bindChoices' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-_bindChoices' class='name expandable'>_bindChoices</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Bind choices els. ...</div><div class='long'><p>Bind choices els.</p>\n</div></div></div><div id='method-_captionClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-_captionClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-_captionClick' class='name expandable'>_captionClick</a>( <span class='pre'>e, scope</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Click on caption ...</div><div class='long'><p>Click on caption</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_choiceClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-_choiceClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-_choiceClick' class='name expandable'>_choiceClick</a>( <span class='pre'>e, scope</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Click on option ...</div><div class='long'><p>Click on option</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rebindChoices' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-rebindChoices' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-rebindChoices' class='name expandable'>rebindChoices</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Rebind choices. ...</div><div class='long'><p>Rebind choices.</p>\n</div></div></div><div id='method-selectOption' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-selectOption' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-selectOption' class='name expandable'>selectOption</a>( <span class='pre'>ind</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Select option. ...</div><div class='long'><p>Select option.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ind</span> : Number<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setAddCaption' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-setAddCaption' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-setAddCaption' class='name expandable'>setAddCaption</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Set add caption. ...</div><div class='long'><p>Set add caption.</p>\n</div></div></div><div id='method-unbindChoices' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$select'>$select</span><br/><a href='source/select.html#$select-method-unbindChoices' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$select-method-unbindChoices' class='name expandable'>unbindChoices</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Unbind choices. ...</div><div class='long'><p>Unbind choices.</p>\n</div></div></div></div></div></div></div>","meta":{}});