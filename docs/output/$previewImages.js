Ext.data.JsonP.$previewImages({"tagname":"class","name":"$previewImages","autodetected":{},"files":[{"filename":"preview-images.js","href":"preview-images.html#$previewImages"}],"members":[{"name":"_createPreview","tagname":"method","owner":"$previewImages","id":"method-_createPreview","meta":{"private":true}},{"name":"_createPreviewHolders","tagname":"method","owner":"$previewImages","id":"method-_createPreviewHolders","meta":{"private":true}},{"name":"_jobTask","tagname":"method","owner":"$previewImages","id":"method-_jobTask","meta":{"private":true}},{"name":"show","tagname":"method","owner":"$previewImages","id":"method-show","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-S-previewImages","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/preview-images.html#$previewImages' target='_blank'>preview-images.js</a></div></pre><div class='doc-contents'><p>Class for creating img previews from File[] variable.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-_createPreview' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$previewImages'>$previewImages</span><br/><a href='source/preview-images.html#$previewImages-method-_createPreview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$previewImages-method-_createPreview' class='name expandable'>_createPreview</a>( <span class='pre'>file, [maxSize]</span> ) : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Create one image preview. ...</div><div class='long'><p>Create one image preview.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>file</span> : File<div class='sub-desc'>\n</div></li><li><span class='pre'>maxSize</span> : Number (optional)<div class='sub-desc'><p>Max image size</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>dom references</p>\n</div></li></ul></div></div></div><div id='method-_createPreviewHolders' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$previewImages'>$previewImages</span><br/><a href='source/preview-images.html#$previewImages-method-_createPreviewHolders' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$previewImages-method-_createPreviewHolders' class='name expandable'>_createPreviewHolders</a>( <span class='pre'>el, count</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Create preview holders. ...</div><div class='long'><p>Create preview holders. Only for images count 4 and 7.\nFour images are in the one row, seven images has the last one above them.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : HTMLElement<div class='sub-desc'>\n</div></li><li><span class='pre'>count</span> : Number<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_jobTask' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$previewImages'>$previewImages</span><br/><a href='source/preview-images.html#$previewImages-method-_jobTask' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$previewImages-method-_jobTask' class='name expandable'>_jobTask</a>( <span class='pre'>previewObj, maxSize, jobDone</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>One job task ...</div><div class='long'><p>One job task</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>previewObj</span> : Object<div class='sub-desc'><p>Object with file and preview ID</p>\n</div></li><li><span class='pre'>maxSize</span> : Number<div class='sub-desc'><p>Max image size in px</p>\n</div></li><li><span class='pre'>jobDone</span> : Function<div class='sub-desc'><p>Function which indicates that job is done</p>\n</div></li></ul></div></div></div><div id='method-show' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='$previewImages'>$previewImages</span><br/><a href='source/preview-images.html#$previewImages-method-show' target='_blank' class='view-source'>view source</a></div><a href='#!/api/$previewImages-method-show' class='name expandable'>show</a>( <span class='pre'>el, files, [opts]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Main function for showing img previews. ...</div><div class='long'><p>Main function for showing img previews.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : HTMLElement<div class='sub-desc'><p>Placeholder element</p>\n</div></li><li><span class='pre'>files</span> : File[]<div class='sub-desc'>\n</div></li><li><span class='pre'>opts</span> : Object (optional)<div class='sub-desc'><p>Configuration</p>\n<ul><li><span class='pre'>maxSize</span> : Number (optional)<div class='sub-desc'><p>Max image size in px; the size is used for image scale</p>\n<p>Defaults to: <code>0</code></p></div></li><li><span class='pre'>count</span> : Number (optional)<div class='sub-desc'><p>How many images are processed simultinously</p>\n<p>Defaults to: <code>0</code></p></div></li><li><span class='pre'>createHolder</span> : Boolean (optional)<div class='sub-desc'><p>Create placeholder, see _createPreviewHolders function</p>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></li></ul></div></div></div></div></div></div></div>","meta":{}});