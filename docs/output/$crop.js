Ext.data.JsonP.$crop({"tagname":"class","name":"$crop","autodetected":{},"files":[{"filename":"crop.js","href":"crop.html#$crop"}],"params":[{"tagname":"params","type":"Object","name":"options","optional":true,"doc":"<p>Configuration</p>\n","properties":[{"tagname":"params","type":"Number","name":"width","default":"250","optional":true,"doc":"<p>Crop width</p>\n","html_type":"Number"},{"tagname":"params","type":"Number","name":"height","default":"250","optional":true,"doc":"<p>Crop height</p>\n","html_type":"Number"},{"tagname":"params","type":"Number","name":"minWidth","default":"10","optional":true,"doc":"<p>Crop min width, always higher than 0!</p>\n","html_type":"Number"},{"tagname":"params","type":"Number","name":"minHeight","default":"10","optional":true,"doc":"<p>Crop min height, always higher than 0!</p>\n","html_type":"Number"},{"tagname":"params","type":"Number","name":"maxWidth","default":"Infinity","optional":true,"doc":"<p>Crop max width</p>\n","html_type":"Number"},{"tagname":"params","type":"Number","name":"maxHeight","default":"Infinity","optional":true,"doc":"<p>Crop max height</p>\n","html_type":"Number"},{"tagname":"params","type":"Boolean","name":"resizable","default":"true","optional":true,"doc":"<p>Crop can be resizabled by points</p>\n","html_type":"Boolean"},{"tagname":"params","type":"Number","name":"aspectRatio","default":"0","optional":true,"doc":"<p>Crop aspect ratio for width / height</p>\n","html_type":"Number"}],"html_type":"Object"}],"members":[{"name":"_alignPoints","tagname":"method","owner":"$crop","id":"method-_alignPoints","meta":{"private":true}},{"name":"_create","tagname":"method","owner":"$crop","id":"method-_create","meta":{"private":true}},{"name":"_getSize","tagname":"method","owner":"$crop","id":"method-_getSize","meta":{}},{"name":"_mouseDown","tagname":"method","owner":"$crop","id":"method-_mouseDown","meta":{"private":true}},{"name":"_mouseMove","tagname":"method","owner":"$crop","id":"method-_mouseMove","meta":{"private":true}},{"name":"_mouseUp","tagname":"method","owner":"$crop","id":"method-_mouseUp","meta":{"private":true}},{"name":"_redraw","tagname":"method","owner":"$crop","id":"method-_redraw","meta":{"private":true}},{"name":"_resizeTest","tagname":"method","owner":"$crop","id":"method-_resizeTest","meta":{}},{"name":"_setCenter","tagname":"method","owner":"$crop","id":"method-_setCenter","meta":{"private":true}},{"name":"backup","tagname":"method","owner":"$crop","id":"method-backup","meta":{}},{"name":"destroy","tagname":"method","owner":"$crop","id":"method-destroy","meta":{}},{"name":"fitToArea","tagname":"method","owner":"$crop","id":"method-fitToArea","meta":{}},{"name":"getAABB","tagname":"method","owner":"$crop","id":"method-getAABB","meta":{}},{"name":"getContainer","tagname":"method","owner":"$crop","id":"method-getContainer","meta":{}},{"name":"hide","tagname":"method","owner":"$crop","id":"method-hide","meta":{}},{"name":"isChanged","tagname":"method","owner":"$crop","id":"method-isChanged","meta":{}},{"name":"isVisible","tagname":"method","owner":"$crop","id":"method-isVisible","meta":{}},{"name":"restore","tagname":"method","owner":"$crop","id":"method-restore","meta":{}},{"name":"setCenter","tagname":"method","owner":"$crop","id":"method-setCenter","meta":{}},{"name":"setDim","tagname":"method","owner":"$crop","id":"method-setDim","meta":{}},{"name":"show","tagname":"method","owner":"$crop","id":"method-show","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-crop","short_doc":"Crop - this class is used for selection crop above the image/element. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/crop.html#$crop' target='_blank'>crop.js</a></div></pre><div class='doc-contents'><p>Crop - this class is used for selection crop above the image/element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object (optional)<div class='sub-desc'><p>Configuration</p>\n<ul><li><span class='pre'>width</span> : Number (optional)<div class='sub-desc'><p>Crop width</p>\n<p>Defaults to: <code>250</code></p></div></li><li><span class='pre'>height</span> : Number (optional)<div class='sub-desc'><p>Crop height</p>\n<p>Defaults to: <code>250</code></p></div></li><li><span class='pre'>minWidth</span> : Number (optional)<div class='sub-desc'><p>Crop min width, always higher than 0!</p>\n<p>Defaults to: <code>10</code></p></div></li><li><span class='pre'>minHeight</span> : Number (optional)<div class='sub-desc'><p>Crop min height, always higher than 0!</p>\n<p>Defaults to: <code>10</code></p></div></li><li><span class='pre'>maxWidth</span> : Number (optional)<div class='sub-desc'><p>Crop max width</p>\n<p>Defaults to: <code>Infinity</code></p></div></li><li><span class='pre'>maxHeight</span> : Number (optional)<div class='sub-desc'><p>Crop max height</p>\n<p>Defaults to: <code>Infinity</code></p></div></li><li><span class='pre'>resizable</span> : Boolean (optional)<div class='sub-desc'><p>Crop can be resizabled by points</p>\n<p>Defaults to: <code>true</code></p></div></li><li><span class='pre'>aspectRatio</span> : Number (optional)<div class='sub-desc'><p>Crop aspect ratio for width / height</p>\n<p>Defaults to: <code>0</code></p></div></li></ul></div></li></ul></div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_alignPoints' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_alignPoints' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_alignPoints' class='name expandable'>_alignPoints</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Align crop points inside his area. ...</div><div class='long'><p>Align crop points inside his area.</p>\n</div></div></div><div id='method-_create' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_create' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_create' class='name expandable'>_create</a>( <span class='pre'></span> ) : Element<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Create crop element. ...</div><div class='long'><p>Create crop element.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Element</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_getSize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_getSize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_getSize' class='name expandable'>_getSize</a>( <span class='pre'>[points]</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Get size of crop. ...</div><div class='long'><p>Get size of crop.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>points</span> : Object (optional)<div class='sub-desc'><p>Points object, default is used crop points.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_mouseDown' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_mouseDown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_mouseDown' class='name expandable'>_mouseDown</a>( <span class='pre'>e</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Mouse down - move/resize crop. ...</div><div class='long'><p>Mouse down - move/resize crop.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_mouseMove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_mouseMove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_mouseMove' class='name expandable'>_mouseMove</a>( <span class='pre'>e</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Mouse move - move/resize crop. ...</div><div class='long'><p>Mouse move - move/resize crop.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_mouseUp' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_mouseUp' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_mouseUp' class='name expandable'>_mouseUp</a>( <span class='pre'>e</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Mouse up - end of move/resize crop. ...</div><div class='long'><p>Mouse up - end of move/resize crop.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Event<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_redraw' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_redraw' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_redraw' class='name expandable'>_redraw</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Redraw crop - calculate all his points and set them in dom objects. ...</div><div class='long'><p>Redraw crop - calculate all his points and set them in dom objects.</p>\n</div></div></div><div id='method-_resizeTest' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_resizeTest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_resizeTest' class='name expandable'>_resizeTest</a>( <span class='pre'>diffX, diffY, group</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Resize test - if returns false, crop size is on the edge of the area. ...</div><div class='long'><p>Resize test - if returns false, crop size is on the edge of the area.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>diffX</span> : Number<div class='sub-desc'><p>Increment on axe X</p>\n</div></li><li><span class='pre'>diffY</span> : Number<div class='sub-desc'><p>Increment on axe Y</p>\n</div></li><li><span class='pre'>group</span> : Array[Object]<div class='sub-desc'><p>Selected group from mouse down</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>false - error</p>\n</div></li></ul></div></div></div><div id='method-_setCenter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-_setCenter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-_setCenter' class='name expandable'>_setCenter</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Set crop center above his area. ...</div><div class='long'><p>Set crop center above his area.</p>\n</div></div></div><div id='method-backup' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-backup' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-backup' class='name expandable'>backup</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Backup current crop state - his position and change state. ...</div><div class='long'><p>Backup current crop state - his position and change state.</p>\n</div></div></div><div id='method-destroy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Remove crop from DOM. ...</div><div class='long'><p>Remove crop from DOM.</p>\n</div></div></div><div id='method-fitToArea' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-fitToArea' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-fitToArea' class='name expandable'>fitToArea</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fit crop to whole area and center him on the screen. ...</div><div class='long'><p>Fit crop to whole area and center him on the screen.</p>\n</div></div></div><div id='method-getAABB' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-getAABB' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-getAABB' class='name expandable'>getAABB</a>( <span class='pre'>[scale]</span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get crop bounding box. ...</div><div class='long'><p>Get crop bounding box.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>scale</span> : Number (optional)<div class='sub-desc'><p>Recalculate all positions using scale constants, def. is 1</p>\n<p>Defaults to: <code>1</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'><p>[x1, y1, x2, y2] 2 points coordinates from top left corner</p>\n</div></li></ul></div></div></div><div id='method-getContainer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-getContainer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-getContainer' class='name expandable'>getContainer</a>( <span class='pre'></span> ) : HTMLElement<span class=\"signature\"></span></div><div class='description'><div class='short'>Get crop root el. ...</div><div class='long'><p>Get crop root el.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-hide' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-hide' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-hide' class='name expandable'>hide</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hide crop. ...</div><div class='long'><p>Hide crop.</p>\n</div></div></div><div id='method-isChanged' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-isChanged' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-isChanged' class='name expandable'>isChanged</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is crop changed? ...</div><div class='long'><p>Is crop changed?</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isVisible' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-isVisible' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-isVisible' class='name expandable'>isVisible</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is crop visible? ...</div><div class='long'><p>Is crop visible?</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-restore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-restore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-restore' class='name expandable'>restore</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Restore crop saved state - his position and change state. ...</div><div class='long'><p>Restore crop saved state - his position and change state.</p>\n</div></div></div><div id='method-setCenter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-setCenter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-setCenter' class='name expandable'>setCenter</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Set crop center above his area. ...</div><div class='long'><p>Set crop center above his area.</p>\n</div></div></div><div id='method-setDim' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-setDim' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-setDim' class='name expandable'>setDim</a>( <span class='pre'>[dim]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Set crop area dimensions. ...</div><div class='long'><p>Set crop area dimensions.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dim</span> : Object (optional)<div class='sub-desc'>\n<ul><li><span class='pre'>areaWidth</span> : Number (optional)<div class='sub-desc'><p>Area width</p>\n</div></li><li><span class='pre'>areaHeight</span> : Number (optional)<div class='sub-desc'><p>Area height</p>\n</div></li></ul></div></li></ul></div></div></div><div id='method-show' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$crop'>$crop</span><br/><a href='source/crop.html#$crop-method-show' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$crop-method-show' class='name expandable'>show</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Show crop. ...</div><div class='long'><p>Show crop.</p>\n</div></div></div></div></div></div></div>","meta":{}});