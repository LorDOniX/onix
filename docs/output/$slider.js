Ext.data.JsonP.$slider({"tagname":"class","name":"$slider","autodetected":{},"files":[{"filename":"slider.js","href":"slider.html#$slider"}],"params":[{"tagname":"params","type":"HTMLElement","name":"parent","doc":"<p>Where is canvas appended</p>\n","html_type":"HTMLElement"},{"tagname":"params","type":"Object","name":"optsArg","optional":true,"doc":"<p>Configuration</p>\n","properties":[{"tagname":"params","type":"Number","name":"min","optional":true,"doc":"<p>Min value</p>\n","html_type":"Number"},{"tagname":"params","type":"Number","name":"max","optional":true,"doc":"<p>Max value</p>\n","html_type":"Number"},{"tagname":"params","type":"Number","name":"timeout","optional":true,"doc":"<p>Timeout for signal fire (keydown, move)</p>\n","html_type":"Number"}],"html_type":"Object"}],"members":[{"name":"_click","tagname":"method","owner":"$slider","id":"method-_click","meta":{"private":true}},{"name":"_create","tagname":"method","owner":"$slider","id":"method-_create","meta":{"private":true}},{"name":"_getPosFromValue","tagname":"method","owner":"$slider","id":"method-_getPosFromValue","meta":{"private":true}},{"name":"_keyUp","tagname":"method","owner":"$slider","id":"method-_keyUp","meta":{"private":true}},{"name":"_mouseDownCaret","tagname":"method","owner":"$slider","id":"method-_mouseDownCaret","meta":{"private":true}},{"name":"_mouseMoveLineHolder","tagname":"method","owner":"$slider","id":"method-_mouseMoveLineHolder","meta":{"private":true}},{"name":"_mouseUpDocument","tagname":"method","owner":"$slider","id":"method-_mouseUpDocument","meta":{"private":true}},{"name":"_sendSignal","tagname":"method","owner":"$slider","id":"method-_sendSignal","meta":{"private":true}},{"name":"_sendSignalInner","tagname":"method","owner":"$slider","id":"method-_sendSignalInner","meta":{"private":true}},{"name":"_setCaret","tagname":"method","owner":"$slider","id":"method-_setCaret","meta":{"private":true}},{"name":"_setValue","tagname":"method","owner":"$slider","id":"method-_setValue","meta":{"private":true}},{"name":"getValue","tagname":"method","owner":"$slider","id":"method-getValue","meta":{}},{"name":"rewriteOpts","tagname":"method","owner":"$slider","id":"method-rewriteOpts","meta":{}},{"name":"setValue","tagname":"method","owner":"$slider","id":"method-setValue","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-slider","short_doc":"Slider - slider with input for selecting numbers from the range. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/slider.html#$slider' target='_blank'>slider.js</a></div></pre><div class='doc-contents'><p>Slider - slider with input for selecting numbers from the range.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>parent</span> : HTMLElement<div class='sub-desc'><p>Where is canvas appended</p>\n</div></li><li><span class='pre'>optsArg</span> : Object (optional)<div class='sub-desc'><p>Configuration</p>\n<ul><li><span class='pre'>min</span> : Number (optional)<div class='sub-desc'><p>Min value</p>\n</div></li><li><span class='pre'>max</span> : Number (optional)<div class='sub-desc'><p>Max value</p>\n</div></li><li><span class='pre'>timeout</span> : Number (optional)<div class='sub-desc'><p>Timeout for signal fire (keydown, move)</p>\n</div></li></ul></div></li></ul></div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_click' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_click' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_click' class='name expandable'>_click</a>( <span class='pre'>e</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Click on tube event. ...</div><div class='long'><p>Click on tube event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_create' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_create' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_create' class='name expandable'>_create</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Create slider and his children. ...</div><div class='long'><p>Create slider and his children.</p>\n</div></div></div><div id='method-_getPosFromValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_getPosFromValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_getPosFromValue' class='name expandable'>_getPosFromValue</a>( <span class='pre'>value</span> ) : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Get value -> position convert. ...</div><div class='long'><p>Get value -> position convert.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Number<div class='sub-desc'><p>Value in the range --> [px] position for the caret.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_keyUp' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_keyUp' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_keyUp' class='name expandable'>_keyUp</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Key up event from the input. ...</div><div class='long'><p>Key up event from the input.</p>\n</div></div></div><div id='method-_mouseDownCaret' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_mouseDownCaret' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_mouseDownCaret' class='name expandable'>_mouseDownCaret</a>( <span class='pre'>e</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Click on the caret event, binds mouse up over the document. ...</div><div class='long'><p>Click on the caret event, binds mouse up over the document.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_mouseMoveLineHolder' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_mouseMoveLineHolder' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_mouseMoveLineHolder' class='name expandable'>_mouseMoveLineHolder</a>( <span class='pre'>e</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Mouse move event over line holder - only if was clicked on the caret. ...</div><div class='long'><p>Mouse move event over line holder - only if was clicked on the caret.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_mouseUpDocument' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_mouseUpDocument' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_mouseUpDocument' class='name expandable'>_mouseUpDocument</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Mouse up event over the document. ...</div><div class='long'><p>Mouse up event over the document.</p>\n</div></div></div><div id='method-_sendSignal' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_sendSignal' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_sendSignal' class='name expandable'>_sendSignal</a>( <span class='pre'>[withTimeout]</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Delayed sending of signal. ...</div><div class='long'><p>Delayed sending of signal.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>withTimeout</span> : Boolean (optional)<div class='sub-desc'><p>Send with timeout?</p>\n</div></li></ul></div></div></div><div id='method-_sendSignalInner' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_sendSignalInner' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_sendSignalInner' class='name expandable'>_sendSignalInner</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Delayed sending of signal - inner method. ...</div><div class='long'><p>Delayed sending of signal - inner method.</p>\n</div></div></div><div id='method-_setCaret' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_setCaret' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_setCaret' class='name expandable'>_setCaret</a>( <span class='pre'>posX</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Set caret position. ...</div><div class='long'><p>Set caret position.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>posX</span> : Number<div class='sub-desc'><p>Value [px] caret offset accord to the start</p>\n</div></li></ul></div></div></div><div id='method-_setValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-_setValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-_setValue' class='name expandable'>_setValue</a>( <span class='pre'>posX, [fromClick]</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Set value using caret position. ...</div><div class='long'><p>Set value using caret position. Fires signal \"change\".</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>posX</span> : Number<div class='sub-desc'><p>Value on the axe x</p>\n</div></li><li><span class='pre'>fromClick</span> : Boolean (optional)<div class='sub-desc'><p>It was called from click method?</p>\n</div></li></ul></div></div></div><div id='method-getValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-getValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-getValue' class='name expandable'>getValue</a>( <span class='pre'></span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Get slider value. ...</div><div class='long'><p>Get slider value.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rewriteOpts' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-rewriteOpts' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-rewriteOpts' class='name expandable'>rewriteOpts</a>( <span class='pre'>optsArg</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Overwrite configuration object. ...</div><div class='long'><p>Overwrite configuration object.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>optsArg</span> : Object<div class='sub-desc'><p>See constructor.</p>\n</div></li></ul></div></div></div><div id='method-setValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$slider'>$slider</span><br/><a href='source/slider.html#$slider-method-setValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$slider-method-setValue' class='name expandable'>setValue</a>( <span class='pre'>value</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Set slider value. ...</div><div class='long'><p>Set slider value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Number<div class='sub-desc'><p>New value</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>If there was error, it returns false</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});