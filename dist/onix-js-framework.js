(function() {
	Event = Event || window.Event;
	Event.prototype.stopPropagation = Event.prototype.stopPropagation || function() {
		this.cancelBubble = true;
	};
	Event.prototype.preventDefault = Event.prototype.preventDefault || function () {
		this.returnValue = false;
	};
})();
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
if(!Array.isArray) {
	/**
	 * Array.isArray dle ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 */
	Array.isArray = function (vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	};
}
if (!Array.prototype.forEach) { 
	Array.prototype.forEach = function(cb, _this) {
	    var len = this.length;
	    for (var i=0;i<len;i++) { 
			if (i in this) { cb.call(_this, this[i], i, this); }
		}
	}
}
if (!Array.prototype.every) { 
	Array.prototype.every = function(cb, _this) {
	    var len = this.length;
	    for (var i=0;i<len;i++) {
			if (i in this && !cb.call(_this, this[i], i, this)) { return false; }
	    }
	    return true;
	}
}
if (!Array.prototype.indexOf) { 
	Array.prototype.indexOf = function(item, from) {
	    var len = this.length;
	    var i = from || 0;
	    if (i < 0) { i += len; }
	    for (;i<len;i++) {
			if (i in this && this[i] === item) { return i; }
	    }
	    return -1;
	}
}
if (!("console" in window)) {
	var emptyFn = function() {};
	window.console = {};
	["log", "warn", "error", "clear", "info"].forEach(function(name) {
		window.console[name] = emptyFn;
	});
}
if (!Object.keys) {
	/**
	 * Object.keys dle ES5 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	 */
	Object.keys = (function () {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;
		return function (obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}
			var result = [], prop, i;
			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}
			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}
(function() {
  if(navigator.appVersion.indexOf('MSIE 8') > 0) {
    var _slice = Array.prototype.slice;
    Array.prototype.slice = function() {
      if(this instanceof Array) {
        return _slice.apply(this, arguments);
      } else {
        var result = [];
        var start = (arguments.length >= 1) ? arguments[0] : 0;
        var end = (arguments.length >= 2) ? arguments[1] : this.length;
        for(var i=start; i<end; i++) {
          result.push(this[i]);
        }
        return result;
      }
    };
  }
})();
if (!Object.create) {
	/**
	 * Object.create dle ES5 - https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
	 */
	Object.create = function (o) {
		if (arguments.length > 1) { throw new Error("Object.create polyfill only accepts the first parameter"); }
		var tmp = function() {};
		tmp.prototype = o;
		return new tmp();
	};
}
if (!Function.prototype.bind) {
	/**
	 * ES5 Function.prototype.bind
	 * Vrací funkci zbindovanou do zadaného kontextu.
	 * Zbylé volitelné parametry jsou předány volání vnitřní funkce.
	 * @param {object} thisObj Nový kontext
	 * @returns {function}
	 */
	Function.prototype.bind = function(thisObj) {
		var fn = this;
		var args = Array.prototype.slice.call(arguments, 1);
		return function() {
			return fn.apply(thisObj, args.concat(Array.prototype.slice.call(arguments)));
		}
	}
};
if (!("addEventListener" in document)) {
	var w = Window.prototype;
	var h = HTMLDocument.prototype;
	var e = Element.prototype;
	w["addEventListener"] = h["addEventListener"] = e["addEventListener"] = function(eventName, listener) {
		if (eventName == "DOMContentLoaded") {
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState === "complete") {
					listener();
				}
			});
		}
		else {
			var obj = this;
			this.attachEvent("on" + eventName, function() {
				return listener.apply(obj, arguments);
			});
		}
	};
	w["removeEventListener"] = h["removeEventListener"] = e["removeEventListener"] = function(eventName, listener) {
		return this.detachEvent("on" + eventName, listener);
	};
}
if (!("classList" in document.documentElement) && window.Element) {
	(function () {
		var prototype = Array.prototype,
		indexOf = prototype.indexOf,
		slice = prototype.slice,
		push = prototype.push,
		splice = prototype.splice,
		join = prototype.join;
		function DOMTokenList(elm) {
			this._element = elm;
			if (elm.className == this._classCache) { return; }
			this._classCache = elm.className;
			if (!this._classCache) { return; }
			var classes = this._classCache.replace(/^\s+|\s+$/g,'').split(/\s+/);
			for (var i = 0; i < classes.length; i++) {
				push.call(this, classes[i]);
			}
		}
		window.DOMTokenList = DOMTokenList;
		function setToClassName(el, classes) {
			el.className = classes.join(" ");
		}
		DOMTokenList.prototype = {
			add: function(token) {
				if (this.contains(token)) { return; }
				push.call(this, token);
				setToClassName(this._element, slice.call(this, 0));
			},
			contains: function(token) {
				return (indexOf.call(this, token) != -1);
			},
			item: function(index) {
				return this[index] || null;
			},
			remove: function(token) {
				var i = indexOf.call(this, token);
				if (i == -1) { return; }
				splice.call(this, i, 1);
				setToClassName(this._element, slice.call(this, 0));
			},
			toString: function() {
				return join.call(this, " ");
			},
			toggle: function(token) {
				if (indexOf.call(this, token) == -1) {
					this.add(token);
					return true;
				} else {
					this.remove(token);
					return false;
				}
			}
		};
		function defineElementGetter (obj, prop, getter) {
			if (Object.defineProperty) {
				Object.defineProperty(obj, prop, {
					get: getter
				});
			} else {
				obj.__defineGetter__(prop, getter);
			}
		}
		defineElementGetter(Element.prototype, "classList", function() {
			return new DOMTokenList(this);
		});
	})();
}
(function() {
	var debug = false;
	var root = this;
	var EXIF = function(obj) {
		if (obj instanceof EXIF) return obj;
		if (!(this instanceof EXIF)) return new EXIF(obj);
		this.EXIFwrapped = obj;
	};
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = EXIF;
		}
		exports.EXIF = EXIF;
	} else {
		root.EXIF = EXIF;
	}
	var ExifTags = EXIF.Tags = {
		// version tags
		0x9000 : "ExifVersion",             // EXIF version
		0xA000 : "FlashpixVersion",         // Flashpix format version
		// colorspace tags
		0xA001 : "ColorSpace",              // Color space information tag
		// image configuration
		0xA002 : "PixelXDimension",         // Valid width of meaningful image
		0xA003 : "PixelYDimension",         // Valid height of meaningful image
		0x9101 : "ComponentsConfiguration", // Information about channels
		0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel
		// user information
		0x927C : "MakerNote",               // Any desired information written by the manufacturer
		0x9286 : "UserComment",             // Comments by user
		// related file
		0xA004 : "RelatedSoundFile",        // Name of related sound file
		// date and time
		0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
		0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
		0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
		0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
		0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized
		// picture-taking conditions
		0x829A : "ExposureTime",            // Exposure time (in seconds)
		0x829D : "FNumber",                 // F number
		0x8822 : "ExposureProgram",         // Exposure program
		0x8824 : "SpectralSensitivity",     // Spectral sensitivity
		0x8827 : "ISOSpeedRatings",         // ISO speed rating
		0x8828 : "OECF",                    // Optoelectric conversion factor
		0x9201 : "ShutterSpeedValue",       // Shutter speed
		0x9202 : "ApertureValue",           // Lens aperture
		0x9203 : "BrightnessValue",         // Value of brightness
		0x9204 : "ExposureBias",            // Exposure bias
		0x9205 : "MaxApertureValue",        // Smallest F number of lens
		0x9206 : "SubjectDistance",         // Distance to subject in meters
		0x9207 : "MeteringMode",            // Metering mode
		0x9208 : "LightSource",             // Kind of light source
		0x9209 : "Flash",                   // Flash status
		0x9214 : "SubjectArea",             // Location and area of main subject
		0x920A : "FocalLength",             // Focal length of the lens in mm
		0xA20B : "FlashEnergy",             // Strobe energy in BCPS
		0xA20C : "SpatialFrequencyResponse",    //
		0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
		0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
		0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
		0xA214 : "SubjectLocation",         // Location of subject in image
		0xA215 : "ExposureIndex",           // Exposure index selected on camera
		0xA217 : "SensingMethod",           // Image sensor type
		0xA300 : "FileSource",              // Image source (3 == DSC)
		0xA301 : "SceneType",               // Scene type (1 == directly photographed)
		0xA302 : "CFAPattern",              // Color filter array geometric pattern
		0xA401 : "CustomRendered",          // Special processing
		0xA402 : "ExposureMode",            // Exposure mode
		0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
		0xA404 : "DigitalZoomRation",       // Digital zoom ratio
		0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
		0xA406 : "SceneCaptureType",        // Type of scene
		0xA407 : "GainControl",             // Degree of overall image gain adjustment
		0xA408 : "Contrast",                // Direction of contrast processing applied by camera
		0xA409 : "Saturation",              // Direction of saturation processing applied by camera
		0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
		0xA40B : "DeviceSettingDescription",    //
		0xA40C : "SubjectDistanceRange",    // Distance to subject
		// other tags
		0xA005 : "InteroperabilityIFDPointer",
		0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
	};
	var TiffTags = EXIF.TiffTags = {
		0x0100 : "ImageWidth",
		0x0101 : "ImageHeight",
		0x8769 : "ExifIFDPointer",
		0x8825 : "GPSInfoIFDPointer",
		0xA005 : "InteroperabilityIFDPointer",
		0x0102 : "BitsPerSample",
		0x0103 : "Compression",
		0x0106 : "PhotometricInterpretation",
		0x0112 : "Orientation",
		0x0115 : "SamplesPerPixel",
		0x011C : "PlanarConfiguration",
		0x0212 : "YCbCrSubSampling",
		0x0213 : "YCbCrPositioning",
		0x011A : "XResolution",
		0x011B : "YResolution",
		0x0128 : "ResolutionUnit",
		0x0111 : "StripOffsets",
		0x0116 : "RowsPerStrip",
		0x0117 : "StripByteCounts",
		0x0201 : "JPEGInterchangeFormat",
		0x0202 : "JPEGInterchangeFormatLength",
		0x012D : "TransferFunction",
		0x013E : "WhitePoint",
		0x013F : "PrimaryChromaticities",
		0x0211 : "YCbCrCoefficients",
		0x0214 : "ReferenceBlackWhite",
		0x0132 : "DateTime",
		0x010E : "ImageDescription",
		0x010F : "Make",
		0x0110 : "Model",
		0x0131 : "Software",
		0x013B : "Artist",
		0x8298 : "Copyright"
	};
	var GPSTags = EXIF.GPSTags = {
		0x0000 : "GPSVersionID",
		0x0001 : "GPSLatitudeRef",
		0x0002 : "GPSLatitude",
		0x0003 : "GPSLongitudeRef",
		0x0004 : "GPSLongitude",
		0x0005 : "GPSAltitudeRef",
		0x0006 : "GPSAltitude",
		0x0007 : "GPSTimeStamp",
		0x0008 : "GPSSatellites",
		0x0009 : "GPSStatus",
		0x000A : "GPSMeasureMode",
		0x000B : "GPSDOP",
		0x000C : "GPSSpeedRef",
		0x000D : "GPSSpeed",
		0x000E : "GPSTrackRef",
		0x000F : "GPSTrack",
		0x0010 : "GPSImgDirectionRef",
		0x0011 : "GPSImgDirection",
		0x0012 : "GPSMapDatum",
		0x0013 : "GPSDestLatitudeRef",
		0x0014 : "GPSDestLatitude",
		0x0015 : "GPSDestLongitudeRef",
		0x0016 : "GPSDestLongitude",
		0x0017 : "GPSDestBearingRef",
		0x0018 : "GPSDestBearing",
		0x0019 : "GPSDestDistanceRef",
		0x001A : "GPSDestDistance",
		0x001B : "GPSProcessingMethod",
		0x001C : "GPSAreaInformation",
		0x001D : "GPSDateStamp",
		0x001E : "GPSDifferential"
	};
	var StringValues = EXIF.StringValues = {
		ExposureProgram : {
			0 : "Not defined",
			1 : "Manual",
			2 : "Normal program",
			3 : "Aperture priority",
			4 : "Shutter priority",
			5 : "Creative program",
			6 : "Action program",
			7 : "Portrait mode",
			8 : "Landscape mode"
		},
		MeteringMode : {
			0 : "Unknown",
			1 : "Average",
			2 : "CenterWeightedAverage",
			3 : "Spot",
			4 : "MultiSpot",
			5 : "Pattern",
			6 : "Partial",
			255 : "Other"
		},
		LightSource : {
			0 : "Unknown",
			1 : "Daylight",
			2 : "Fluorescent",
			3 : "Tungsten (incandescent light)",
			4 : "Flash",
			9 : "Fine weather",
			10 : "Cloudy weather",
			11 : "Shade",
			12 : "Daylight fluorescent (D 5700 - 7100K)",
			13 : "Day white fluorescent (N 4600 - 5400K)",
			14 : "Cool white fluorescent (W 3900 - 4500K)",
			15 : "White fluorescent (WW 3200 - 3700K)",
			17 : "Standard light A",
			18 : "Standard light B",
			19 : "Standard light C",
			20 : "D55",
			21 : "D65",
			22 : "D75",
			23 : "D50",
			24 : "ISO studio tungsten",
			255 : "Other"
		},
		Flash : {
			0x0000 : "Flash did not fire",
			0x0001 : "Flash fired",
			0x0005 : "Strobe return light not detected",
			0x0007 : "Strobe return light detected",
			0x0009 : "Flash fired, compulsory flash mode",
			0x000D : "Flash fired, compulsory flash mode, return light not detected",
			0x000F : "Flash fired, compulsory flash mode, return light detected",
			0x0010 : "Flash did not fire, compulsory flash mode",
			0x0018 : "Flash did not fire, auto mode",
			0x0019 : "Flash fired, auto mode",
			0x001D : "Flash fired, auto mode, return light not detected",
			0x001F : "Flash fired, auto mode, return light detected",
			0x0020 : "No flash function",
			0x0041 : "Flash fired, red-eye reduction mode",
			0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
			0x0047 : "Flash fired, red-eye reduction mode, return light detected",
			0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
			0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
			0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
			0x0059 : "Flash fired, auto mode, red-eye reduction mode",
			0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
			0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
		},
		SensingMethod : {
			1 : "Not defined",
			2 : "One-chip color area sensor",
			3 : "Two-chip color area sensor",
			4 : "Three-chip color area sensor",
			5 : "Color sequential area sensor",
			7 : "Trilinear sensor",
			8 : "Color sequential linear sensor"
		},
		SceneCaptureType : {
			0 : "Standard",
			1 : "Landscape",
			2 : "Portrait",
			3 : "Night scene"
		},
		SceneType : {
			1 : "Directly photographed"
		},
		CustomRendered : {
			0 : "Normal process",
			1 : "Custom process"
		},
		WhiteBalance : {
			0 : "Auto white balance",
			1 : "Manual white balance"
		},
		GainControl : {
			0 : "None",
			1 : "Low gain up",
			2 : "High gain up",
			3 : "Low gain down",
			4 : "High gain down"
		},
		Contrast : {
			0 : "Normal",
			1 : "Soft",
			2 : "Hard"
		},
		Saturation : {
			0 : "Normal",
			1 : "Low saturation",
			2 : "High saturation"
		},
		Sharpness : {
			0 : "Normal",
			1 : "Soft",
			2 : "Hard"
		},
		SubjectDistanceRange : {
			0 : "Unknown",
			1 : "Macro",
			2 : "Close view",
			3 : "Distant view"
		},
		FileSource : {
			3 : "DSC"
		},
		Components : {
			0 : "",
			1 : "Y",
			2 : "Cb",
			3 : "Cr",
			4 : "R",
			5 : "G",
			6 : "B"
		}
	};
	function addEvent(element, event, handler) {
		if (element.addEventListener) {
			element.addEventListener(event, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + event, handler);
		}
	}
	function imageHasData(img) {
		return !!(img.exifdata);
	}
	function base64ToArrayBuffer(base64, contentType) {
		contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
		base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
		var binary = atob(base64);
		var len = binary.length;
		var buffer = new ArrayBuffer(len);
		var view = new Uint8Array(buffer);
		for (var i = 0; i < len; i++) {
			view[i] = binary.charCodeAt(i);
		}
		return buffer;
	}
	function objectURLToBlob(url, callback) {
		var http = new XMLHttpRequest();
		http.open("GET", url, true);
		http.responseType = "blob";
		http.onload = function(e) {
			if (this.status == 200 || this.status === 0) {
				callback(this.response);
			}
		};
		http.send();
	}
	function getImageData(img, callback) {
		function handleBinaryFile(binFile) {
			var data = findEXIFinJPEG(binFile);
			var iptcdata = findIPTCinJPEG(binFile);
			img.exifdata = data || {};
			img.iptcdata = iptcdata || {};
			if (callback) {
				callback.call(img);
			}
		}
		if (img.src) {
			if (/^data\:/i.test(img.src)) { // Data URI
				var arrayBuffer = base64ToArrayBuffer(img.src);
				handleBinaryFile(arrayBuffer);
			} else if (/^blob\:/i.test(img.src)) { // Object URL
				var fileReader = new FileReader();
				fileReader.onload = function(e) {
					handleBinaryFile(e.target.result);
				};
				objectURLToBlob(img.src, function (blob) {
					fileReader.readAsArrayBuffer(blob);
				});
			} else {
				var http = new XMLHttpRequest();
				http.onload = function() {
					if (this.status == 200 || this.status === 0) {
						handleBinaryFile(http.response);
					} else {
						throw "Could not load image";
					}
					http = null;
				};
				http.open("GET", img.src, true);
				http.responseType = "arraybuffer";
				http.send(null);
			}
		} else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
			var fileReader = new FileReader();
			fileReader.onload = function(e) {
				if (debug) console.log("Got file of length " + e.target.result.byteLength);
				handleBinaryFile(e.target.result);
			};
			fileReader.readAsArrayBuffer(img);
		}
	}
	function findEXIFinJPEG(file) {
		var dataView = new DataView(file);
		if (debug) console.log("Got file of length " + file.byteLength);
		if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
			if (debug) console.log("Not a valid JPEG");
			return false; // not a valid jpeg
		}
		var offset = 2,
			length = file.byteLength,
			marker;
		while (offset < length) {
			if (dataView.getUint8(offset) != 0xFF) {
				if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
				return false; // not a valid marker, something is wrong
			}
			marker = dataView.getUint8(offset + 1);
			if (debug) console.log(marker);
			// we could implement handling for other markers here,
			// but we're only looking for 0xFFE1 for EXIF data
			if (marker == 225) {
				if (debug) console.log("Found 0xFFE1 marker");
				return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);
				// offset += 2 + file.getShortAt(offset+2, true);
			} else {
				offset += 2 + dataView.getUint16(offset+2);
			}
		}
	}
	function findIPTCinJPEG(file) {
		var dataView = new DataView(file);
		if (debug) console.log("Got file of length " + file.byteLength);
		if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
			if (debug) console.log("Not a valid JPEG");
			return false; // not a valid jpeg
		}
		var offset = 2,
			length = file.byteLength;
		var isFieldSegmentStart = function(dataView, offset){
			return (
				dataView.getUint8(offset) === 0x38 &&
				dataView.getUint8(offset+1) === 0x42 &&
				dataView.getUint8(offset+2) === 0x49 &&
				dataView.getUint8(offset+3) === 0x4D &&
				dataView.getUint8(offset+4) === 0x04 &&
				dataView.getUint8(offset+5) === 0x04
			);
		};
		while (offset < length) {
			if ( isFieldSegmentStart(dataView, offset )){
				// Get the length of the name header (which is padded to an even number of bytes)
				var nameHeaderLength = dataView.getUint8(offset+7);
				if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
				// Check for pre photoshop 6 format
				if(nameHeaderLength === 0) {
					// Always 4
					nameHeaderLength = 4;
				}
				var startOffset = offset + 8 + nameHeaderLength;
				var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
				return readIPTCData(file, startOffset, sectionLength);
				break;
			}
			// Not the marker, continue searching
			offset++;
		}
	}
	var IptcFieldMap = {
		0x78 : 'caption',
		0x6E : 'credit',
		0x19 : 'keywords',
		0x37 : 'dateCreated',
		0x50 : 'byline',
		0x55 : 'bylineTitle',
		0x7A : 'captionWriter',
		0x69 : 'headline',
		0x74 : 'copyright',
		0x0F : 'category'
	};
	function readIPTCData(file, startOffset, sectionLength){
		var dataView = new DataView(file);
		var data = {};
		var fieldValue, fieldName, dataSize, segmentType, segmentSize;
		var segmentStartPos = startOffset;
		while(segmentStartPos < startOffset+sectionLength) {
			if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
				segmentType = dataView.getUint8(segmentStartPos+2);
				if(segmentType in IptcFieldMap) {
					dataSize = dataView.getInt16(segmentStartPos+3);
					segmentSize = dataSize + 5;
					fieldName = IptcFieldMap[segmentType];
					fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
					// Check if we already stored a value with this name
					if(data.hasOwnProperty(fieldName)) {
						// Value already stored with this name, create multivalue field
						if(data[fieldName] instanceof Array) {
							data[fieldName].push(fieldValue);
						}
						else {
							data[fieldName] = [data[fieldName], fieldValue];
						}
					}
					else {
						data[fieldName] = fieldValue;
					}
				}
			}
			segmentStartPos++;
		}
		return data;
	}
	function readTags(file, tiffStart, dirStart, strings, bigEnd) {
		var entries = file.getUint16(dirStart, !bigEnd),
			tags = {},
			entryOffset, tag,
			i;
		for (i=0;i<entries;i++) {
			entryOffset = dirStart + i*12 + 2;
			tag = strings[file.getUint16(entryOffset, !bigEnd)];
			if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
			tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
		}
		return tags;
	}
	function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
		var type = file.getUint16(entryOffset+2, !bigEnd),
			numValues = file.getUint32(entryOffset+4, !bigEnd),
			valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
			offset,
			vals, val, n,
			numerator, denominator;
		switch (type) {
			case 1: // byte, 8-bit unsigned int
			case 7: // undefined, 8-bit byte, value depending on field
				if (numValues == 1) {
					return file.getUint8(entryOffset + 8, !bigEnd);
				} else {
					offset = numValues > 4 ? valueOffset : (entryOffset + 8);
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getUint8(offset + n);
					}
					return vals;
				}
			case 2: // ascii, 8-bit byte
				offset = numValues > 4 ? valueOffset : (entryOffset + 8);
				return getStringFromDB(file, offset, numValues-1);
			case 3: // short, 16 bit int
				if (numValues == 1) {
					return file.getUint16(entryOffset + 8, !bigEnd);
				} else {
					offset = numValues > 2 ? valueOffset : (entryOffset + 8);
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getUint16(offset + 2*n, !bigEnd);
					}
					return vals;
				}
			case 4: // long, 32 bit int
				if (numValues == 1) {
					return file.getUint32(entryOffset + 8, !bigEnd);
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
					}
					return vals;
				}
			case 5:    // rational = two long values, first is numerator, second is denominator
				if (numValues == 1) {
					numerator = file.getUint32(valueOffset, !bigEnd);
					denominator = file.getUint32(valueOffset+4, !bigEnd);
					val = new Number(numerator / denominator);
					val.numerator = numerator;
					val.denominator = denominator;
					return val;
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
						denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
						vals[n] = new Number(numerator / denominator);
						vals[n].numerator = numerator;
						vals[n].denominator = denominator;
					}
					return vals;
				}
			case 9: // slong, 32 bit signed int
				if (numValues == 1) {
					return file.getInt32(entryOffset + 8, !bigEnd);
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
					}
					return vals;
				}
			case 10: // signed rational, two slongs, first is numerator, second is denominator
				if (numValues == 1) {
					return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
				} else {
					vals = [];
					for (n=0;n<numValues;n++) {
						vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
					}
					return vals;
				}
		}
	}
	function getStringFromDB(buffer, start, length) {
		var outstr = "";
		for (n = start; n < start+length; n++) {
			outstr += String.fromCharCode(buffer.getUint8(n));
		}
		return outstr;
	}
	function readEXIFData(file, start) {
		if (getStringFromDB(file, start, 4) != "Exif") {
			if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
			return false;
		}
		var bigEnd,
			tags, tag,
			exifData, gpsData,
			tiffOffset = start + 6;
		// test for TIFF validity and endianness
		if (file.getUint16(tiffOffset) == 0x4949) {
			bigEnd = false;
		} else if (file.getUint16(tiffOffset) == 0x4D4D) {
			bigEnd = true;
		} else {
			if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
			return false;
		}
		if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
			if (debug) console.log("Not valid TIFF data! (no 0x002A)");
			return false;
		}
		var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);
		if (firstIFDOffset < 0x00000008) {
			if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
			return false;
		}
		tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);
		if (tags.ExifIFDPointer) {
			exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
			for (tag in exifData) {
				switch (tag) {
					case "LightSource" :
					case "Flash" :
					case "MeteringMode" :
					case "ExposureProgram" :
					case "SensingMethod" :
					case "SceneCaptureType" :
					case "SceneType" :
					case "CustomRendered" :
					case "WhiteBalance" :
					case "GainControl" :
					case "Contrast" :
					case "Saturation" :
					case "Sharpness" :
					case "SubjectDistanceRange" :
					case "FileSource" :
						exifData[tag] = StringValues[tag][exifData[tag]];
						break;
					case "ExifVersion" :
					case "FlashpixVersion" :
						exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
						break;
					case "ComponentsConfiguration" :
						exifData[tag] =
							StringValues.Components[exifData[tag][0]] +
							StringValues.Components[exifData[tag][1]] +
							StringValues.Components[exifData[tag][2]] +
							StringValues.Components[exifData[tag][3]];
						break;
				}
				tags[tag] = exifData[tag];
			}
		}
		if (tags.GPSInfoIFDPointer) {
			gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
			for (tag in gpsData) {
				switch (tag) {
					case "GPSVersionID" :
						gpsData[tag] = gpsData[tag][0] +
							"." + gpsData[tag][1] +
							"." + gpsData[tag][2] +
							"." + gpsData[tag][3];
						break;
				}
				tags[tag] = gpsData[tag];
			}
		}
		return tags;
	}
	EXIF.getData = function(img, callback) {
		if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;
		if (!imageHasData(img)) {
			getImageData(img, callback);
		} else {
			if (callback) {
				callback.call(img);
			}
		}
		return true;
	}
	EXIF.getTag = function(img, tag) {
		if (!imageHasData(img)) return;
		return img.exifdata[tag];
	}
	EXIF.getAllTags = function(img) {
		if (!imageHasData(img)) return {};
		var a,
			data = img.exifdata,
			tags = {};
		for (a in data) {
			if (data.hasOwnProperty(a)) {
				tags[a] = data[a];
			}
		}
		return tags;
	}
	EXIF.pretty = function(img) {
		if (!imageHasData(img)) return "";
		var a,
			data = img.exifdata,
			strPretty = "";
		for (a in data) {
			if (data.hasOwnProperty(a)) {
				if (typeof data[a] == "object") {
					if (data[a] instanceof Number) {
						strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
					} else {
						strPretty += a + " : [" + data[a].length + " values]\r\n";
					}
				} else {
					strPretty += a + " : " + data[a] + "\r\n";
				}
			}
		}
		return strPretty;
	}
	EXIF.readFromBinaryFile = function(file) {
		return findEXIFinJPEG(file);
	}
	if (typeof define === 'function' && define.amd) {
		define('exif-js', [], function() {
			return EXIF;
		});
	}
}.call(this));
onix = (function() {
	/**
	 * Module object - handles one module object with services, factories etc.
	 * This object cannot be used in dependency injection!
	 * 
	 * @class $module
	 */
	var $module = function(name, dependencies) {
		/**
		 * All objects.
		 *
		 * @type {Object}
		 * @member $module
		 * @private
		 */
		this._objects = {};
		/**
		 * All run objects.
		 *
		 * @type {Object}
		 * @member $module
		 * @private
		 */
		this._runs = [];
		/**
		 * All config objects.
		 *
		 * @type {Object}
		 * @member $module
		 * @private
		 */
		this._configs = [];
		/**
		 * Module name.
		 * 
		 * @type {String}
		 * @member $module
		 * @private
		 */
		this._name = name || "";
		/**
		 * Module dependencies.
		 * 
		 * @type {Array}
		 * @member $module
		 * @private
		 */
		this._dependencies = dependencies || [];
	};
	/**
	 * Module constants.
	 *
	 * @property {Object}
	 * @type {Object}
	 * @member $module
	 * @private
	 */
	$module.CONST = {
		PROVIDER_NAME: "Provider",
		FILTER_NAME: "$filter",
		TYPE: {
			PROVIDER: 1,
			SERVICE: 2,
			FACTORY: 3,
			CONSTANT: 4,
			VALUE: 5,
			FILTER: 6,
			CONFIG: 7,
			RUN: 8
		}
	};
	/**
	 * Parse parameters. From param parse function and dependencies.
	 *
	 * @property {Function}
	 * @param  {Array|Function} param 
	 * @return {Object} Parse object
	 * @member $module
	 */
	$module.parseParam = function(param) {
		var fn;
		var inject = [];
		if (Array.isArray(param)) {
			param.every(function(item) {
				if (typeof item === "function") {
					fn = item;
					return false;
				}
				else if (typeof item === "string") {
					inject.push(item);
				}
				return true;
			}, this);
		}
		else {
			fn = param;
		}
		return {
			fn: fn,
			inject: inject
		}
	};
	/**
	 * Get filter name.
	 * 
	 * @param  {String} name
	 * @return {String}
	 * @member $module
	 */
	$module.getFilterName = function(name) {
		name = name || "";
		return $module.CONST.FILTER_NAME + name[0].toUpperCase() + name.substr(1, name.length - 1);
	};
	/**
	 * Get dependencies.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getDependencies = function() {
		return this._dependencies;
	};
	/**
	 * Get module name.
	 * 
	 * @return {String}
	 * @member $module
	 */
	$module.prototype.getName = function() {
		return this._name;
	};
	/**
	 * Get module configs.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getConfigs = function() {
		return this._configs;
	};
	/**
	 * Get module runs.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getRuns = function() {
		return this._runs;
	};
	/**
	 * Get module objects.
	 * 
	 * @return {Array}
	 * @member $module
	 */
	$module.prototype.getObjects = function() {
		return this._objects;
	};
	/**
	 * Add provider to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function} param
	 * @member $module
	 */
	$module.prototype.provider = function(name, param) {
		if (!name || !param) {
			return this;
		}
		var pp = $module.parseParam(param);
		this._objects[name + $module.CONST.PROVIDER_NAME] = {
			name: name + $module.CONST.PROVIDER_NAME,
			inject: pp.inject,
			fn: pp.fn,
			cache: null,
			type: $module.CONST.TYPE.PROVIDER
		};
		this._objects[name] = {
			name: name,
			inject: null,
			fn: null,
			cache: null,
			provider: name + $module.CONST.PROVIDER_NAME,
			type: $module.CONST.TYPE.FACTORY
		};
		return this;
	};
	/**
	 * Add service to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.service = function(name, param) {
		if (!name || !param) {
			return this;
		}
		var pp = $module.parseParam(param);
		this._objects[name] = {
			name: name,
			inject: pp.inject,
			fn: pp.fn,
			cache: null,
			type: $module.CONST.TYPE.SERVICE
		};
		return this;
	};
	/**
	 * Add factory to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.factory = function(name, param) {
		if (!name || !param) {
			return this;
		}
		var pp = $module.parseParam(param);
		this._objects[name] = {
			name: name,
			inject: pp.inject,
			fn: pp.fn,
			cache: null,
			type: $module.CONST.TYPE.FACTORY
		};
		return this;
	};
	/**
	 * Add new constant.
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {Object} param
	 * @member $module
	 */
	$module.prototype.constant = function(name, obj) {
		if (!name || !obj) {
			return this;
		}
		this._objects[name] = {
			name: name,
			cache: obj,
			type: $module.CONST.TYPE.CONSTANT
		};
		return this;
	};
	/**
	 * Add a new value.
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {Object} param
	 * @member $module
	 */
	$module.prototype.value = function(name, obj) {
		if (!name || !obj) {
			return this;
		}
		this._objects[name] = {
			name: name,
			cache: obj,
			type: $module.CONST.TYPE.VALUE
		};
		return this;
	};
	/**
	 * Add filter to the application.
	 *
	 * @chainable
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member $module
	 */
	$module.prototype.filter = function(name, param) {
		if (!name || !param) {
			return this;
		}
		var pp = $module.parseParam(param);
		this._objects[$module.getFilterName(name)] = {
			name: name,
			inject: pp.inject,
			fn: pp.fn,
			cache: null,
			type: $module.CONST.TYPE.FILTER
		};
		return this;
	};
	/**
	 * Add a new config.
	 *
	 * @chainable
	 * @param  {Array|Function} param With DI
	 * @member $module
	 */
	$module.prototype.config = function(param) {
		if (!param) {
			return this;
		}
		var pp = $module.parseParam(param);
		this._configs.push({
			fn: pp.fn,
			inject: pp.inject,
			type: $module.CONST.TYPE.CONFIG
		});
		return this;
	};
	/**
	 * Add a new run.
	 *
	 * @chainable
	 * @param  {Array|Function} param With DI
	 * @member $module
	 */
	$module.prototype.run = function(param) {
		if (!param) {
			return this;
		}
		var pp = $module.parseParam(param);
		this._runs.push({
			fn: pp.fn,
			inject: pp.inject,
			type: $module.CONST.TYPE.RUN
		});
		return this;
	};
	/**
	 * Add a new controller - only for back comptability with angular modules.
	 * This feature is not implemented!
	 *
	 * @chainable
	 * @member $module
	 */
	$module.prototype.controller = function() {
		return this;
	};
	/**
	 * Add a new directive - only for back comptability with angular modules.
	 * This feature is not implemented!
	 *
	 * @chainable
	 * @member $module
	 */
	$module.prototype.directive = function() {
		return this;
	};
	/**
	 * Modules object - handles all modules in the application; runs object.
	 * This object cannot be used in dependency injection!
	 *
	 * @class $modules
	 */
	var $modules = {
		/**
		 * All modules array.
		 *
		 * @private
		 * @member $modules
		 * @type {Array}
		 */
		_modules: [],
		/**
		 * All modules object - quick access.
		 *
		 * @private
		 * @member $modules
		 * @type {Object}
		 */
		_modulesObj: {},
		/**
		 * Modules constants.
		 *
		 * @private
		 * @member $modules
		 * @type {Object}
		 */
		_CONST: {
			MODULE_SEPARATOR: "::",
		},
		/**
		 * Function which does nothing.
		 *
		 * @private
		 * @member $modules
		 */
		_noop: function() {
		},
		/**
		 * Event - Dom LOAD.
		 *
		 * @member $modules
		 */
		domLoad: function() {
			var configs = [];
			var runs = [];
			this._modules.forEach(function(module) {
				var error = false;
				var dependencies = module.getDependencies();
				dependencies.every(function(dep) {
					if (!(dep in this._modulesObj)) {
						console.error("Module '" + this._name + "' dependency '" + dep + "' not found!");
						error = true;
						return false;
					}
					else {
						return true;
					}
				}, this);
				if (!error) {
					configs = configs.concat(module.getConfigs());
					runs = runs.concat(module.getRuns());
				}
			}, this);
			// run all configs
			configs.forEach(function(config) {
				this.run(config, true);
			}, this);
			// run all runs
			runs.forEach(function(run) {
				this.run(run);
			}, this);
		},
		/**
		 * Get object by his name.
		 *
		 * @param {String} name Object name
		 * @return {Object} Object data
		 * @member $modules
		 * @private
		 */
		_getObject: function(name) {
			var output = null;
			var searchModuleName = "";
			var searchObjectName = "";
			if (name.indexOf(this._CONST.MODULE_SEPARATOR) != -1) {
				var parts = name.split(this._CONST.MODULE_SEPARATOR);
				if (parts.length == 2) {
					searchModuleName = parts[0];
					searchObjectName = parts[1];
				}
				else {
					console.error("Get object " + name + " error! Wrong module separator use.");
					return null;
				}
			}
			else {
				searchObjectName = name;
			}
			this._modules.every(function(module) {
				var moduleObjects = module.getObjects();
				if (searchModuleName) {
					if (module.getName() != searchModuleName) return true;
					if (searchObjectName in moduleObjects) {
						output = moduleObjects[searchObjectName];
						return false;
					}
					else {
						console.error("Get object " + searchObjectName + " error! Cannot find object in the module " + searchModuleName + ".");
						return false;
					}
				}
				else {
					if (searchObjectName in moduleObjects) {
						output = moduleObjects[searchObjectName];
						return false;
					}
					else return true;
				}
			});
			return output;
		},
		/**
		 * Run object configuration; returns his cache (data).
		 *
		 * @param  {Object}  obj Object configuration
		 * @param  {Boolean} [isConfig] Is config phase?
		 * @param  {Array} [parent] Parent objects
		 * @return {Object}
		 * @member $modules
		 */
		run: function(obj, isConfig, parent) {
			parent = parent || [];
			if (parent.indexOf(obj.name) != -1) {
				console.error("Circular dependency error! Object name: " + obj.name + ", parents: " + parent.join("|"));
				return null;
			}
			var inject = [];
			if (obj.provider) {
				var providerObj = this._getObject(obj.provider);
				if (!providerObj.cache) {
					var providerFn = providerObj.fn || this._noop;
					providerObj.cache = new providerFn();
				}
				var getFn = providerObj.cache["$get"] || this._noop;
				var pp = $module.parseParam(getFn);
				obj.fn = pp.fn;
				obj.inject = pp.inject;
				delete obj.provider;
			}
			if (obj.inject && obj.inject.length) {
				obj.inject.forEach(function(objName) {
					if (typeof objName === "string") {
						var injObj = this._getObject(objName);
						if (!injObj) {
							console.error("Object name: " + objName + " not found!");
							inject.push(null);
						}
						else {
							inject.push(this.run(injObj, isConfig, obj.name ? parent.concat(obj.name) : parent));
						}
					}
					else if (typeof objName === "object") {
						inject.push(objName);
					}
				}, this);
			}
			// config phase
			if (isConfig) {
				switch (obj.type) {
					case $module.CONST.TYPE.PROVIDER:
						if (!obj.cache) {
							var fn = obj.fn || this._noop;
							obj.cache = new fn();
						}
						return obj.cache;
						break;
					case $module.CONST.TYPE.CONSTANT:
						return obj.cache;
						break;
					case $module.CONST.TYPE.CONFIG:
						var fn = obj.fn || this._noop;
						return fn.apply(fn, inject);
						break;
					default:
						return null;
				}
			}
			// run phase
			else {
				switch (obj.type) {
					case $module.CONST.TYPE.FACTORY:
					case $module.CONST.TYPE.FILTER:
						if (!obj.cache) {
							var fn = obj.fn || this._noop;
							obj.cache = fn.apply(fn, inject);
						}
						return obj.cache;
						break;
					case $module.CONST.TYPE.SERVICE:
						if (!obj.cache) {
							var fn = obj.fn || this._noop;
							var serviceObj = Object.create(fn.prototype);
							fn.apply(serviceObj, inject);
							obj.cache = serviceObj;
						}
						return obj.cache;
						break;
					case $module.CONST.TYPE.VALUE:
						return obj.cache;
						break;
					case $module.CONST.TYPE.CONSTANT:
						return obj.cache;
						break;
					case $module.CONST.TYPE.RUN:
						var fn = obj.fn || this._noop;
						return fn.apply(fn, inject);
						break;
					default:
						return null;
				}
			}
		},
		/**
		 * Add a new module to the application.
		 * 
		 * @param {String} name Module name
		 * @param {Array} [dependencies] Module dependencies
		 * @return {Object} Created module
		 * @member $modules
		 */
		addModule: function(name, dependencies) {
			var module = new $module(name, dependencies);
			this._modulesObj[name] = module
			this._modules.push(module);
			return module;
		}
	};
	// bind DOM ready
	document.addEventListener("DOMContentLoaded", $modules.domLoad.bind($modules));
	/**
	 * Main framework object, which is created like new module with name 'onix'.
	 * Module has addtional functions.
	 * 
	 * @class onix
	 */
	var onix = $modules.addModule("onix");
	/**
	 * Add a new module to the application.
	 * 
	 * @param {String} name Module name
	 * @param {Array} [dependencies] Module dependencies
	 * @return {$module} Created module
	 * @member onix
	 */
	onix.module = function(name, dependencies) {
		return $modules.addModule(name, dependencies);
	};
	/**
	 * Empty function.
	 *
	 * @member onix
	 */
	onix.noop = function() {
	};
	/**
	 * Framework info.
	 *
	 * version: 2.5.13
	 * date: 13. 6. 2016
	 * @member onix
	 */
	onix.info = function() {
		console.log('OnixJS framework\n'+
'2.5.13/13. 6. 2016\n'+
'source: https://gitlab.com/LorDOniX/onix\n'+
'documentation: https://gitlab.com/LorDOniX/onix/tree/master/docs\n'+
'@license MIT\n'+
'- Free for use in both personal and commercial projects\n');
	};
	onix.factory("$di", function() {
		/**
		 * Helper factory for dependency injection and parsing function parameters.
		 * 
		 * @class $di
		 */
		return {
			/**
			 * Parse parameters. From param parse function and dependencies.
			 *
			 * @property {Function}
			 * @param  {Array|Function} param 
			 * @return {Object} Parse object
			 * @member $di
			 */
			parseParam: $module.parseParam,
			/**
			 * Get filter name.
			 * 
			 * @param  {String} name
			 * @return {String}
			 * @member $di
			 */
			getFilterName: $module.getFilterName,
			/**
			 * Run function with possible inject - handles dependency injection.
			 * 
			 * @param  {Object} runObj
			 * @param  {Function} runObj.fn
			 * @param  {Array} runObj.inject
			 * @return {Object} Function output
			 * @member $di
			 */
			run: function(runObj) {
				if (!runObj) return null;
				if (!runObj.fn) {
					runObj.fn = function() {};
				}
				// def. type
				runObj.type = $module.CONST.TYPE.RUN;
				return $modules.run(runObj);
			}
		}
	});
	return onix;
})();
/**
 * Filter process input data and output can be used in template or in the code.
 *
 * @class $filter
 */
onix.factory("$filter", [
	"$di",
function(
	$di
) {
	var emptyFilter = function(value) {
		return value || "";
	};
	/**
	 * Return filter by his name or returns empty filter. Filter name is concatenation of $filter + Filter name.
	 *
	 * @method filter
	 * @param  {String} filterName 
	 * @return {Object}
	 * @member $filter
	 */
	return function(filterName) {
		if (!filterName) {
			return emptyFilter;
		}
		// get filter name
		filterName = $di.getFilterName(filterName);
		return $di.run({
			fn: function(moduleObj) {
				return moduleObj || emptyFilter;
			},
			inject: [filterName]
		});
	};
}]);
/**
 * Commom functions used in whole application.
 *
 * @class $common
 */
onix.service("$common", [
	"$q",
function(
	$q
) {
	/**
	 * Object copy, from source to dest.
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 * @private
	 */
	this._objCopy = function(dest, source) {
		Object.keys(source).forEach(function(prop) {
			if (source.hasOwnProperty(prop)) {
				dest[prop] = this.cloneValue(source[prop]);
			}
		}.bind(this));
	};
	/**
	 * Confirm window, returns promise.
	 *
	 * @param  {String} txt
	 * @return {$q}
	 * @member $common
	 */
	this.confirm = function(txt) {
		var promise = $q.defer();
		if (confirm(txt)) {
			promise.resolve();
		}
		else {
			promise.reject();
		}
		return promise;
	};
	/**
	 * Merge multiple objects into the single one.
	 *
	 * @return {Object}
	 * @member $common
	 */
	this.merge = function() {
		var count = arguments.length;
		var dest = {};
		if (count > 0) {
			for (var i = 0; i < count; i++) {
				var source = arguments[i];
				this._objCopy(dest, source);
			}
		}
		return dest;
	};
	/**
	 * Extend one object by other; from source to dest.
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 */
	this.extend = function(dest, source) {
		dest = dest || {};
		source = source || {};
		this._objCopy(dest, source);
	};
	/**
	 * Clone value without references.
	 * 
	 * @param  {Object} value Input value
	 * @param  {Number} [lvl] Recursive threshold
	 * @return {Object} cloned value
	 * @member $common
	 */
	this.cloneValue = function(value, lvl) {
		lvl = lvl || 1;
		// recursive call threshold
		if (lvl > 100) return null;
		switch (typeof value) {
			case "object":
				if (Array.isArray(value)) {
					// array
					var newArray = [];
					value.forEach(function(item) {
						newArray.push(this.cloneValue(item, lvl + 1));
					}, this);
					return newArray;
				}
				else if (value instanceof Date) {
					// date
					return new Date(value.getTime());
				}
				else if (value instanceof Element) {
					// element
					return value;
				}
				else if (value) {
					// object
					var newObj = {};
					Object.keys(value).forEach(function(prop) {
						if (value.hasOwnProperty(prop)) {
							newObj[prop] = this.cloneValue(value[prop], lvl + 1);
						}
					}.bind(this));
					return newObj;
				}
				else {
					// null
					return null;
				}
			case "undefined":
			case "function":
			case "number":
			case "string":
				return value;
		}
	};
	/**
	 * Inherit function with another function/s.
	 * First argument is source function, others are for inheritance.
	 * Last parameters have higher priority than the previous ones.
	 *
	 * @member $common
	 */
	this.inherit = function() {
		// first is source, rest is inherit classess
		var args = arguments;
		if (args.length < 2) return;
		var source = args[0].prototype;
		var inherits = Array.prototype.slice.call(args, 1);
		// all inherits items
		inherits.forEach(function(inhItem) {
			// iterate prototype items
			for (var p in inhItem.prototype) {
				source[p] = typeof inhItem.prototype[p] != "object"
					? inhItem.prototype[p]
					: JSON.parse(JSON.stringify(inhItem.prototype[p]));
			}
		}, this);
	};
	/**
	 * Bind function arguments without scope.
	 *
	 * @param  {Function} cb
	 * @return {Function}
	 * @member $common
	 */
	this.bindWithoutScope = function(cb) {
		var bindArgs = Array.prototype.slice.call(arguments, 1);
		return function () {
			var internalArgs = Array.prototype.slice.call(arguments, 0);
			var args = Array.prototype.concat(internalArgs, bindArgs);
			return cb.apply(this, args);
		};
	};
	/**
	 * Missing for each for Node array.
	 *
	 * @param  {Object[]} nodes
	 * @param  {Function} cb
	 * @param  {Object|Function} scope
	 * @member $common
	 */
	this.nodesForEach = function(nodes, cb, scope) {
		cb = cb || function() {};
		if (nodes) {
			Array.prototype.slice.call(nodes).forEach(function(item, ind) {
				cb.apply(scope || cb, [item, ind]);
			});
		}
	};
	/**
	 * Reverse for each.
	 *
	 * @param  {Array} arr
	 * @param {Function} cb
	 * @param {Function} scope
	 * @member $common
	 */
	this.reverseForEach = function (arr, cb, scope) {
		arr = arr || [];
		cb = cb || function() {};
		for (var i = arr.length - 1; i >= 0; i--) {
			cb.apply(scope || this, [arr[i], i]);
		}
	};
	/**
	 * HEX value to DEC.
	 *
	 * @param  {String} hex
	 * @return {Number}
	 * @member $common
	 */
	this.hxToDe = function(hex) {
		hex = hex.toLowerCase();
		switch (hex) {
			case "a":
				return 10;
			case "b":
				return 11;
			case "c":
				return 12;
			case "d":
				return 13;
			case "e":
				return 14;
			case "f":
				return 15;
			default:
				return parseInt(hex, 10);
		}
	};
	/**
	 * HEX value to RGB.
	 *
	 * @param  {String} hexColor
	 * @return {Object}
	 * @member $common
	 */
	this.hexToRGB = function(hexColor) {
		if (hexColor[0] == "#") {
			hexColor = hexColor.replace("#", "");
			if (hexColor.length == 3) {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[0]),
					g: this.hxToDe(hexColor[1]) * 16 + this.hxToDe(hexColor[1]),
					b: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[2])
				};
			}
			else {
				return {
					r: this.hxToDe(hexColor[0]) * 16 + this.hxToDe(hexColor[1]),
					g: this.hxToDe(hexColor[2]) * 16 + this.hxToDe(hexColor[3]),
					b: this.hxToDe(hexColor[4]) * 16 + this.hxToDe(hexColor[5])
				};
			}
		}
		else {
			return hexColor;
		}
	};
	/**
	 * Is value element?
	 *
	 * @param  {Object} val
	 * @return {Boolean}
	 * @member $common
	 */
	this.isElement = function(val) {
		return (val instanceof HTMLElement);
	};
	/**
	 * Is item object?
	 * 
	 * @param  {Object} item
	 * @return {Boolean}
	 * @member $common
	 */
	this.isObject = function(item) {
		return (typeof item === "object" && !Array.isArray(item) && item !== null);
	};
	/**
	 * Cover function for console.log, which allows to replace {0..n} occurences inside string.
	 * First argument is string, other arguments are for replace objects by key.
	 * 
	 * @member $common
	 */
	this.col = function() {
		var args = Array.prototype.slice.call(arguments);
		var output = "";
		var params = {};
		args.forEach(function(arg, ind) {
			if (ind == 0) {
				output = arg;
			}
			else {
				params["[{]" + (ind - 1) + "[}]"] = arg;
			}
		});
		Object.keys(params).forEach(function(param) {
			output = output.replace(new RegExp(param, "g"), params[param]);
		});
		if (output) {
			console.log(output);
		}
	};
	/**
	 * Format size in bytes.
	 * 
	 * @param  {Number} size
	 * @return {String}
	 * @member $common
	 */
	this.formatSize = function(size) {
		if (typeof size !== "number") {
			return "null";
		}
		var lv = size > 0 ? Math.floor(Math.log(size) / Math.log(1000)) : 0;
		var sizes = ["", "K", "M", "G", "T"];
		lv = Math.min(sizes.length, lv);
		var value = lv > 0 ? (size / Math.pow(1000, lv)).toFixed(2) : size;
		return value + " " + sizes[lv] + "B";
	};
}]);
/**
 * Functionality over browser cookies.
 *
 * @class $cookie
 */
onix.service("$cookie", function() {
	/**
	 * Get cookies by her name.
	 *
	 * @param  {String} name
	 * @return {String}
	 * @member $cookie
	 * @private
	 */
	this.get = function(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			cookies.every(function(cookie) {
				cookie = cookie.trim();
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					return false;
				}
				else return true;
			});
		}
		return cookieValue;
	};
});
/**
 * Date operations.
 * 
 * @class $date
 */
onix.service("$date", function() {
	/**
	 * Parse EN date to CS format.
	 * year-month-day -> day. month. year
	 * 2016-06-31 -> 31. 6. 2016
	 * 
	 * @param {String} enDate
	 * @return {String}
	 * @member $date
	 */
	this.dateENtoCS = function(enDate) {
		enDate = enDate || "";
		var parts = enDate.split("-");
		if (parts.length == 3) {
			// delete first 0
			return [parts[2].replace(/^0/, ""), parts[1].replace(/^0/, ""), parts[0]].join(". ");
		}
		else return "";
	};
	/**
	 * Parse CS date to EN format.
	 * day. month. year -> year-month-day
	 * 31. 6. 2016 -> 2016-06-31
	 * 
	 * @param {String} csDate
	 * @return {String}
	 * @member $date
	 */
	this.dateCStoEN = function(csDate) {
		// day. month. year 31. 12. 2015
		csDate = csDate || "";
		var parts = csDate.split(".");
		if (parts.length == 3) {
			var year = parts[2].trim();
			var month = parts[1].trim();
			var date = parts[0].trim();
			// add 0 from left
			date = date.length == 1 ? "0" + date : date;
			month = month.length == 1 ? "0" + month : month;
			return [year, month, date].join("-");
		}
		else return "";
	};
	/**
	 * Is string contains CS date format?
	 * 
	 * @param  {String} csDate
	 * @return {Boolean}
	 * @member $date
	 */
	this.isCSdate = function(csDate) {
		csDate = csDate || "";
		return !!(csDate.match(/([1-9]|[1-3][0-9])\.[ ]*([1-9]|1[0-2])\.[ ]*[1-9][0-9]{3}/));
	};
});
/**
 * Class for creating DOM elements and getting their references.
 * 
 * @class $dom
 */
onix.service("$dom", function() {
	/**
	 * Create $dom from the configuration.
	 *
	 * @param  {Object} config
	 * @param  {String} config.el Element name
	 * @param  {Object} config.attrs Atributes
	 * @param  {Array} config.child Child nodes
	 * @param  {Array} config.events Bind events
	 * @param  {String|Array} config.class Add CSS class/es
	 * @param  {Object} [exported] to this object will be exported all marked elements (_exported attr.)
	 * @return {Object}
	 * @member $dom
	 */
	this.create = function(config, exported) {
		var el = document.createElement(config.el);
		Object.keys(config).forEach(function(key) {
			switch (key) {
				case "el":
					break;
				case "attrs":
					Object.keys(config.attrs).forEach(function(attr) {
						el.setAttribute(attr, config.attrs[attr]);
					});
					break;
				case "events":
					config.events.forEach(function(item) {
						el.addEventListener(item.event, item.fn);
					});
					break;
				case "child":
					config.child.forEach(function(child) {
						el.appendChild(this.create(child, exported));
					}, this);
					break;
				case "_exported":
					exported[config._exported] = el;
					break;
				case "class":
					var value = config["class"];
					if (typeof value === "string") {
						el.classList.add(value);
					}
					else if (Array.isArray(value)) {
						value.forEach(function(item) {
							el.classList.add(item);
						});
					}
					break;
				default:
					el[key] = config[key];
			}
		}, this);
		return el;
	};
	/**
	 * Get element from the document.
	 *
	 * @param  {String|Array} els Els = "" -> element; [x, y] -> { x: el, y: el }; [{sel: "div", name: "xyz"}] -> { "xyz": div el }
	 * @param  {Object} [parent]
	 * @return {Object}
	 * @member $dom
	 */
	this.get = function(els, parent) {
		var output;
		parent = parent || document;
		if (typeof els === "string" && els) {
			output = parent.querySelector(els);
		}
		else if (Array.isArray(els)) {
			output = {};
			els.forEach(function(item) {
				if (typeof item === "string") {
					var name = item.replace(/^[.# ]+/g, "");
					output[name] = parent.querySelector(item);
				}
				else {
					var name = item.sel.replace(/^[.# ]+/g, "");
					output[item.name || name] = parent.querySelector(item.sel);
				}
			});
		}
		return output;
	};
});
onix.factory("$event", function() {
	/**
	 * This class is used for extending existing objects and brings signal functionality.
	 * 
 	 * @class $event
 	 */
	var $event = function() {};
	/**
	 * Init event functionality.
	 * 
	 * @member $event
	 * @private
	 */
	$event.prototype._eventInit = function() {
		/**
		 * All events. { name: name, event: function, scope, [once] }
		 * 
		 * @type {Array}
		 * @member $event
		 * @private
		 */
		this._allEvents = [];
	};
	/**
	 * Add new event to the stack.
	 * 
	 * @param  {String} name 
	 * @param  {Function} fn
	 * @param  {Object|Function} [scope]
	 * @member $event
	 */
	$event.prototype.on = function (name, fn, scope) {
		if (arguments.length < 2) return;
		this._allEvents.push({ 
			name: name,
			fn: fn,
			scope: scope
		});
	};
	/**
	 * Remove event from the stack.
	 * 
	 * @param  {String} name 
	 * @param  {Function} [fn]
	 * @member $event
	 */
	$event.prototype.off = function (name, fn) {
		if (!name) return;
		var len = this._allEvents.length - 1;
		for (var i = len; i >= 0; i--) {
			var item = this._allEvents[i];
			if (item.name != name) continue;
			if (!fn || (fn && item.fn == fn)) {
				this._allEvents.splice(i, 1);
			}
		}
	};
	/**
	 * Add one time event to the stack.
	 * 
	 * @param  {String} name
	 * @param  {Function} [fn]
	 * @param  {Object|Function} [scope]
	 * @member $event
	 */
	$event.prototype.once = function (name, fn, scope) {
		if (arguments.length < 2) return;
		this._allEvents.push({ 
			name: name,
			fn: fn,
			scope: scope,
			once: true
		});
	};
	/**
	 * Trigger event with arguments 0..n.
	 * 
	 * @param  {String} name
	 * @member $event
	 */
	$event.prototype.trigger = function (name) {
		if (!name) return;
		var args = Array.prototype.slice.call(arguments, 1);
		var len = this._allEvents.length - 1;
		for (var i = len; i >= 0; i--) {
			var item = this._allEvents[i];
			if (item.name != name) continue;
			// call fn
			item.fn.apply(item.scope || this, args);
			// once event
			if (item.once) {
				this._allEvents.splice(i, 1);
			}
		}
	};
	return $event;
});
onix.factory("$resize", [
	"$common",
	"$event",
function(
	$common,
	$event
) {
	// ------------------------ private ----------------------------------------
	/**
	 * Handle window resize event, triggers signal "resize".
	 *
	 * @class $resize
	 */
	var $resize = function() {
		// event init
		this._eventInit();
		/**
		 * Is active?
		 *
		 * @member $resize
		 * @private
		 */
		this._active = false;
		/**
		 * Resize object.
		 *
		 * @member $resize
		 * @private
		 */
		this._resizeObj = {
			id: null,
			timeout: 333
		};
		/**
		 * Binds for functions.
		 *
		 * @member $resize
		 * @private
		 */
		this._binds = {
			resize: this._resize.bind(this),
			resizeInner: this._resizeInner.bind(this)
		};
	};
	// add events
	$common.inherit($resize, $event);
	/**
	 * Window resize event.
	 *
	 * @member $resize
	 * @private
	 */
	$resize.prototype._resize = function() {
		if (this._resizeObj.id) {
			clearTimeout(this._resizeObj.id);
			this._resizeObj.id = null;
		}
		this._resizeObj.id = setTimeout(this._binds.resizeInner, this._resizeObj.timeout);
	};
	/**
	 * Window resize event - trigger signal "resize".
	 *
	 * @member $resize
	 * @private
	 */
	$resize.prototype._resizeInner = function() {
		this.trigger("resize");
	};
	// ------------------------ public ----------------------------------------
	/**
	 * Bind resize event to window object.
	 *
	 * @member $resize
	 */
	$resize.prototype.start = function() {
		if (this._active) return;
		window.addEventListener("resize", this._binds.resize);
		this._active = true;
	};
	/**
	 * Unbind resize event from window object.
	 *
	 * @member $resize
	 */
	$resize.prototype.end = function() {
		if (!this._active) return;
		window.removeEventListener("resize", this._binds.resize);
		this._active = false;
	};
	return new $resize();
}]);
/**
 * Filter - lowercase functionality.
 *
 * @class $filterLowercase
 */
onix.filter("lowercase", function() {
	/**
	 * Input is transformatted to lowercase.
	 *
	 * @method lowercase
	 * @param  {String} input
	 * @return {String|Object}
	 * @member $filterLowercase
	 */
	return function(input) {
		if (typeof input === "string") {
			return input.toLowerCase();
		}
		else return input;
	};
});
/**
 * Filter - uppercase functionality.
 *
 * @class $filterUppercase
 */
onix.filter("uppercase", function() {
	/**
	 * Input is transformatted to uppercase.
	 *
	 * @method uppercase
	 * @param  {String} input
	 * @return {String|Object}
	 * @member $filterUppercase
	 */
	return function(input) {
		if (typeof input === "string") {
			return input.toUpperCase();
		}
		else return input;
	};
});
/**
 * Filter - json stringify functionality.
 *
 * @class $filterJson
 */
onix.filter("json", function() {
	/**
	 * Input object is stringfied.
	 *
	 * @method json
	 * @param {Object} obj Input object
	 * @param {Number} [spacing] Number of spaces per indetation
	 * @return {String}
	 * @member $filterJson
	 */
	return function(obj, spacing) {
		if (typeof obj === "object") {
			var space = null;
			if (spacing) {
				spacing = parseInt(spacing, 10);
				space = isNaN(spacing) ? null : spacing;
			}
			return JSON.stringify(obj, null, space);
		}
		else return obj;
	};
});
/**
 * XMLHttpRequest cover class.
 * 
 * @class $http
 */
onix.service("$http", [
	"$q",
	"$common",
function(
	$q,
	$common
) {
	/**
	 * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects.
	 * Prepare post data.
	 *
	 * @param  {Object|Array} data { name, value }
	 * @return {Object}
	 * @member $http
	 * @private
	 */
	this._preparePostData = function(data) {
		var formData = new FormData();
		if (data) {
			if (Array.isArray(data)) {
				data.forEach(function(item) {
					formData.append(item.name, item.value);
				});
			}
			else {
				Object.keys(data).forEach(function(key) {
					formData.append(key, data[key]);
				});
			}
		}
		return formData;
	};
	/**
	 * Update URL using get data.
	 *
	 * @param  {String} url
	 * @param  {Array} data { name, value }
	 * @return {String}
	 * @member $http
	 * @private
	 */
	this._updateURL = function(url, data) {
		if (data) {
			var add = [];
			if (Array.isArray(data)) {
				data.forEach(function(item) {
					add.push(item.name + "=" + encodeURIComponent(item.value));
				});
				url += (url.indexOf("?") == -1 ? "?" : "") + add.join("&");
			}
		}
		return url;
	};
	/**
	 * Request types.
	 *
	 * @property {Object}
	 * @param {Number} JSON
	 * @param {Number} FORM_DATA
	 * @member $http
	 */
	this.POST_TYPES = {
		JSON: 1,
		FORM_DATA: 2
	};
	/**
	 * Http methods.
	 *
	 * @property {Object}
	 * @param {String} POST
	 * @param {String} GET
	 * @param {String} DELETE
	 * @param {String} PATCH
	 * @member $http
	 */
	this.METHOD = {
		POST: "POST",
		GET: "GET",
		DELETE: "DELETE",
		PATCH: "PATCH"
	};
	/**
	 * Create new XHR request, returns promise.
	 *
	 * @param  {Object} config
	 * @param  {String} config.url URL
	 * @param  {String} [config.method] Method from $http.METHOD
	 * @param  {String} [config.postType] Post type from $http.POST_TYPES
	 * @param  {Array} [config.getData] Data, which will be send in the url (GET)
	 * @param  {Object|FormData} [config.postData] Post data
	 * @param  {Object} [config.headers] Additional headers
	 * @return {$q}
	 * @member $http
	 */
	this.createRequest = function(config) {
		var promise = $q.defer();
		var request = new XMLHttpRequest();
		config = config || {};
		var method = config.method || this.METHOD.GET;
		var url = config.url || "";
		if (!url) {
			promise.reject();
			return promise;
		}
		url = this._updateURL(url, config.getData);
		request.onerror = function () { promise.reject(); };
		request.open(method, url, true);
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				var responseData = request.responseText || "";
				var responseType = request.getResponseHeader("Content-Type");
				var promiseData = null;
				if (responseType == "application/json") {
					promiseData = responseData.length ? JSON.parse(responseData) : {};
				}
				else {
					promiseData = responseData;
				}
				// 200 ok
				// 201 created
				// 204 succesfully deleted
				// 403 unautorized
				promise[request.status >= 200 && request.status < 300 ? "resolve" : "reject"]({
					status: request.status,
					data: promiseData,
					url: url,
					method: method
				});
			}
		};
		try {
			// add headers
			var headers = config.headers;
			if ($common.isObject(headers)) {
				Object.keys(headers).forEach(function(headerName) {
					request.setRequestHeader(headerName, headers[headerName]);
				});
			}
			if (method == this.METHOD.GET) {
				request.setRequestHeader('Accept', 'application/json');
			}
			var type = config.postType || this.POST_TYPES.JSON;
			if (config.postData && type == this.POST_TYPES.JSON) {
				request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
				request.send(JSON.stringify(config.postData));
			}
			else if (config.postData && type == this.POST_TYPES.FORM_DATA) {
				request.send(this._preparePostData(config.postData));
			}
			else {
				request.send();
			}
		}
		catch (err) {
			promise.reject();
		}
		return promise;
	};
}]);
onix.provider("$i18n", function() {
	/**
	 * All langs data.
	 *
	 * @type {Object}
	 * @member $i18nProvider
	 * @private
	 */
	var _langs = {};
	/**
	 * Current language-
	 *
	 * @type {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _currentLang = "";
	/**
	 * Bind global _ as translation function-
	 *
	 * @type {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _bindGlobalTranslation = true;
	/**
	 * Replace translated text by object. This functions is implementation of message format object replace inside the string.
	 *
	 * @param  {String} translate
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _transReplace = function(translate, replace) {
		translate = translate || "";
		replace = replace || {};
		var replaceParts = translate.match(/{[^}]+,.*}|{[^}]*}/g);
		if (replaceParts) {
			var finalReplace = {};
			replaceParts.forEach(function(part) {
				var key = part;
				if (key.length > 2) {
					key = key.substr(1, key.length - 2);
				}
				// multi
				var parts = key.split(",");
				var name = parts[0].trim();
				var multiPartsObj = {};
				if (parts.length == 2) {
					var multiParts = parts[1].match(/[a-zA-Z0-9_]+{[^}]*}/g);
					if (multiParts) {
						multiParts.forEach(function(mpart) {
							var mpartSplits = mpart.split("{");
							var mpartValue = mpartSplits[1];
							mpartValue = mpartValue.substr(0, mpartValue.length - 1);
							multiPartsObj[mpartSplits[0].trim()] = mpartValue;
						});
					}
				}
				var replaceValue = name in replace ? replace[name] : "";
				if (typeof replaceValue === "number" && Object.keys(multiPartsObj).length) {
					var multiKey;
					switch (replaceValue) {
						case 1:
							multiKey = "one";
							break;
						case 2:
						case 3:
						case 4:
							multiKey = "few";
							break;
						default:
							multiKey = "other";
					}
					replaceValue = multiKey in multiPartsObj ? multiPartsObj[multiKey] : "";
				}
				finalReplace[part] = replaceValue;
			});
			Object.keys(finalReplace).forEach(function(key) {
				translate = translate.replace(new RegExp(key, "g"), finalReplace[key]);
			});
		}
		return translate;
	};
	/**
	 * Get text function. Translate for the current language and the key.
	 *
	 * @param  {String} key
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18nProvider
	 * @private
	 */
	var _getText = function(key, replace) {
		key = key || "";
		var lObj = _langs[_currentLang];
		var translate = "";
		if (lObj) {
			var parts = key.split(".");
			var len = parts.length;
			parts.every(function(item, ind) {
				if (item in lObj) {
					lObj = lObj[item];
					if (ind == len - 1) {
						translate = lObj;
						return false;
					}
				}
				else return false;
				// go on
				return true;
			});
		}
		return _transReplace(translate, replace);
	};
	/**
	 * Add a new language.
	 *
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @member $i18nProvider
	 * @private
	 */
	var _addLanguage = function(lang, data) {
		if (!lang || !data) return;
		if (!_langs[lang]) {
			_langs[lang] = {};
		}
		// merge
		Object.keys(data).forEach(function(key) {
			_langs[lang][key] = data[key];
		});
	};
	/**
	 * Set new language by his key.
	 *
	 * @param {String} lang Language key
	 * @member $i18nProvider
	 * @private
	 */
	var _setLanguage = function(lang) {
		_currentLang = lang || "";
	};
	/**
	 * Disable global translation in _
	 *
	 * @member $i18nProvider
	 */
	this.disableGlobalTranslation = function() {
		_bindGlobalTranslation = false;
	};
	/**
	 * Add a new language.
	 *
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @member $i18nProvider
	 */
	this.addLanguage = function(lang, data) {
		_addLanguage(lang, data);
	};
	/**
	 * Set new language by his key.
	 *
	 * @param {String} lang Language key
	 * @member $i18nProvider
	 */
	this.setLanguage = function(lang) {
		_setLanguage(lang);
	};
	/**
	 * Post process during config phase.
	 *
	 * @member $i18nProvider
	 */
	this.postProcess = function() {
		if (_bindGlobalTranslation) {
			/**
			 * Get text function. Translate for the current language and the key.
			 *
			 * @param  {String} key
			 * @param  {Object} [replace] Replace all {} in the string
			 * @return {String}
			 * @member window
			 * @property {Function}
			 */
			window._ = _getText;
		}
	};
	/**
	 * Language support, string translation with support for message format syntax.
	 * 
	 * @class $i18n
	 */
	this.$get = ["$http", "$q", function(
				$http, $q) {
		var $i18n = {
			/**
			 * Get text function. Translate for the current language and the key.
			 *
			 * @param  {String} key
			 * @param  {Object} [replace] Replace all {} in the string
			 * @return {String}
			 * @member $i18n
			 */
			_: function(key, replace) {
				return _getText(key, replace);
			},
			/**
			 * Add a new language.
			 *
			 * @param {String} lang Language key
			 * @param {Object} data
			 * @member $i18n
			 */
			addLanguage: function(lang, data) {
				_addLanguage(lang, data);
			},
			/**
			 * Set new language by his key.
			 *
			 * @param {String} lang Language key
			 * @member $i18n
			 */
			setLanguage: function(lang) {
				_setLanguage(lang);
			},
			/**
			 * Get current language key.
			 *
			 * @return {String} Language key
			 * @member $i18n
			 */
			getLanguage: function(lang) {
				return _currentLang;
			},
			/**
			 * Get all languages keys.
			 *
			 * @return {Array[String]} Languages keys
			 * @member $i18n
			 */
			getAllLanguages: function(lang) {
				return Object.keys(_langs);
			},
			/**
			 * Load language from the file.
			 *
			 * @param  {String} lang Language key
			 * @param  {String} url  Path to the file
			 * @return {$q}
			 * @member $i18n
			 */
			loadLanguage: function(lang, url) {
				var promise = $q.defer();
				$http.createRequest({
					url: url
				}).then(function(data) {
					_addLanguage(lang, data.data);
					promise.resolve();
				}, function(data) {
					promise.resolve();
				});
				return promise;
			}
		};
		return $i18n;
	}];
});
/**
 * Provider for registering _ translate object.
 *
 * @private
 * @member onix
 */
onix.config(["$i18nProvider", function($i18nProvider) {
	$i18nProvider.postProcess();
}]);
/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $image
 */
onix.service("$image", [
	"$q",
function(
	$q
) {
	/**
	 * FileReader is available.
	 *
	 * @private
	 * @member $image
	 * @type {Boolean}
	 */
	this._hasFileReader = "FileReader" in window;
	/**
	 * Canvas is available.
	 *
	 * @private
	 * @member $image
	 * @type {Boolean}
	 */
	this._hasCanvas = !!document.createElement("canvas").getContext;
	/**
	 * Read one image file - gets canvas with it. EXIF is readed, you can specific max size for image scale.
	 *
	 * @param  {Object} file Input file
	 * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
	 * @return {$q} Promise with output object
	 * @member $image
	 */
	this.readFromFile = function(file, maxSize) {
		var promise = $q.defer();
		if (!this._hasFileReader) {
			promise.reject();
			return promise;
		}
		var reader = new FileReader();
		var output = {
			img: null,
			exif: null,
			canvas: null
		};
		reader.onload = function(e) {
			var binaryData = reader.result;
			var binaryDataArray = new Uint8Array(binaryData);
			var exif = null;
			// exif only for jpeg
			if (file.type != "png") {
				exif = this.getEXIF(binaryData);
			}
			var img = new Image();
			img.onload = function() {
				var imd = this.getImageDim(img, maxSize);
				var canvas = this.getCanvas(img, {
					width: imd.width,
					height: imd.height,
					orientation: exif ? exif.Orientation : 0,
					scaled: imd.scale != 1
				});
				output.img = img;
				output.exif = exif;
				output.canvas = canvas;
				promise.resolve(output);
			}.bind(this);
			img.src = this.fileToBase64(file.type, binaryDataArray);
		}.bind(this);
		reader.readAsArrayBuffer(file);
		return promise;
	};
	/**
	 * Counts image dimension; if maxSize is available, new dimension is calculated.
	 *
	 * @param  {Image} img
	 * @param  {Number} [maxSize] If image width/height is higher than this value, image will be scaled to this dimension
	 * @return {Object}
	 * @member $image
	 */
	this.getImageDim = function(img, maxSize) {
		var maxSize = maxSize || 0;
		var largeWidth = maxSize > 0 && img.width > maxSize;
		var largeHeight = maxSize > 0 && img.height > maxSize;
		var output = {
			width: img.width,
			height: img.height,
			scale: 1
		};
		if (largeWidth || largeHeight) {
			// resize picture
			var imgWidth = img.width;
			var imgHeight = img.height;
			// portrait x landscape
			if (img.width > img.height) {
				// landscape
				imgHeight = maxSize * imgHeight / imgWidth;
				imgWidth = maxSize;
			}
			else {
				// portrait
				imgWidth = maxSize * imgWidth / imgHeight;
				imgHeight = maxSize;
			}
			output.scale = img.width / imgWidth; // ratio between original x scaled image
			output.width = imgWidth;
			output.height = imgHeight;
		}
		return output;
	};
	/**
	 * Get image canvas - read input img, create canvas with it.
	 *
	 * @param  {Image} img
	 * @param  {Object} [optsArg] Variable options
	 * @param  {Number} [optsArg.width] Output canvas width
	 * @param  {Number} [optsArg.height] Output canvas height
	 * @param  {Number} [optsArg.orientation] EXIF orientation
	 * @param  {Boolean} [optsArg.scaled = false]
	 * @return {Canvas}
	 * @member $image
	 */
	this.getCanvas = function(img, optsArg) {
		var opts = {
			width: img.width || 0,
			height: img.height || 0,
			orientation: 0,
			scaled: false
		};
		for (var key in optsArg) {
			opts[key] = optsArg[key];
		}
		if (!this._hasCanvas) return null;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var draw = true;
		canvas.width = opts.width;
		canvas.height = opts.height;
		// rotate
		if (opts.orientation) {
			switch (opts.orientation) {
				case 2:
					// horizontal flip
					ctx.translate(opts.width, 0);
					ctx.scale(-1, 1);
					break;
				case 3:
					// 180° rotate left
					ctx.translate(opts.width, opts.height);
					ctx.rotate(Math.PI);
					break;
				case 4:
					// vertical flip
					ctx.translate(0, opts.height);
					ctx.scale(1, -1);
					break;
				case 5:
					// vertical flip + 90 rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.scale(1, -1);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;
				case 6:
					// 90° rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(0, -opts.height);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;
				case 7:
					// horizontal flip + 90 rotate right
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(opts.width, -opts.height);
					ctx.scale(-1, 1);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;
				case 8:
					// 90° rotate left
					canvas.width = opts.height;
					canvas.height = opts.width;
					ctx.rotate(-0.5 * Math.PI);
					ctx.translate(-opts.width, 0);
					if (opts.scaled) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
			}
		}
		if (draw) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (opts.scaled) {
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
			}
			else {
				ctx.drawImage(img, 0, 0);
			}
		}
		return canvas;
	};
	/**
	 * Binary data to base64.
	 *
	 * @param  {String} fileType
	 * @param  {Array} binaryData
	 * @return {String}
	 * @member $image
	 */
	this.fileToBase64 = function(fileType, binaryData) {
		var length = binaryData.length;
		var output = "";
		for (var i = 0; i < length; i += 1) {
			output += String.fromCharCode(binaryData[i]);
		}
		return 'data:' + fileType + ';base64,' + btoa(output);
	};
	/**
	 * Is file a picture?
	 *
	 * @param  {File}  file
	 * @return {Boolean}
	 * @member $image
	 */
	this.isPicture = function(file) {
		if (file) {
			return (file.type == "image/jpeg" || file.type == "image/pjpeg" || file.type == "image/png");
		}
		else return false;
	};
	/**
	 * Get picture files from array of files.
	 * 
	 * @param  {Array} array of files
	 * @return {Array}
	 * @member $image
	 */
	this.getPictureFiles = function(files) {
		var pictureFiles = [];
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var item = files[i];
				if (this.isPicture(item)) {
					pictureFiles.push(item);
				}
			}
		}
		return pictureFiles;
	};
	/**
	 * Get picture files count from the array of Files. This function uses 'getPictureFiles'.
	 * 
	 * @param  {Array} array of files
	 * @return {Boolean}
	 * @member $image
	 */
	this.getPicturesCount = function(files) {
		return this.getPictureFiles(files).length;
	};
	/**
	 * Get image EXIF information.
	 * 
	 * @param  {Binary[]} imgData Binary img data
	 * @return {Object}
	 * @member $image
	 */
	this.getEXIF = function(imgData) {
		if ("EXIF" in window) {
			return EXIF.readFromBinaryFile(imgData);
		}
		else {
			return {};
		}
	};
}]);
onix.factory("$job", [
	"$q",
function(
	$q
) {
	/**
	 * Factory for manage multiple tasks.
	 * 
 	 * @class $job
 	 */
	var $job = function() {
		this._donePromise = $q.defer();
		this._tasks = [];
		this._taskDone = {
			cb: null,
			scope: null
		};
	};
	/**
	 * Add task to job. Every job task needs to call doneFn(), which is added to the last argument position.
	 * 
	 * @param {Function} task Job function
	 * @param {Function|Object} [scope] Variable function scope
	 * @param {Object} [args] Add params to the function
	 * @member $job
	 */
	$job.prototype.add = function(task, scope, args) {
		args = args || [];
		if (!Array.isArray(args)) {
			args = [args];
		}
		this._tasks.push({
			task: task,
			scope: scope,
			args: args
		});
	};
	/**
	 * Start job.
	 *
	 * @member $job
	 */
	$job.prototype.start = function() {
		if (!this._tasks.length) return;
		// because of pop
		this._tasks.reverse();
		this._doJob();
		return this._donePromise;
	};
	/**
	 * Clear all job taks.
	 *
	 * @member $job
	 */
	$job.prototype.clear = function() {
		this._tasks = [];
	};
	/**
	 * Set progress function, which will be called after each task will be done.
	 * 
	 * @param {Function} cb
	 * @param {Function|Object} [scope]
	 * @member $job
	 */
	$job.prototype.setTaskDone = function(cb, scope) {
		this._taskDone.cb = cb;
		this._taskDone.scope = scope;
	};
	/**
	 * Internal function for running job queue.
	 *
	 * @member $job
	 */
	$job.prototype._doJob = function() {
		var rest = this._tasks.length;
		if (rest == 0) {
			this._donePromise.resolve();
		}
		else {
			var job = this._tasks.pop();
			var doneFn = function() {
				if (this._taskDone.cb) {
					var doneFnArgs = Array.prototype.slice.call(arguments, 0);
					this._taskDone.cb.apply(this._taskDone.scope || this._taskDone.cb, doneFnArgs);
				}
				this._doJob();
			}.bind(this);
			job.task.apply(job.scope || job.task, job.args.concat(doneFn));
		}
	};
	return {
		/**
		 * Factory for creating new job.
		 *
		 * @member $job
		 */
		create: function() {
			return new $job();
		},
		/**
		 * Run jobs array with count for how many functions will be processed simultinously.
		 *
		 * @param  {Object[]} jobsArray Array with jobs objects
		 * @param  {Function} jobsArray.task Job function
		 * @param  {Function} [jobsArray.scope] Variable function scope
		 * @param  {Function} [jobsArray.args] Add params to the function
		 * @param  {Number} count How many functions processed simultinously
		 * @param  {Object} taskDoneObj Callback after one task have been done
		 * @param  {Object} taskDoneObj.cb Function
		 * @param  {Object} [taskDoneObj.scope] Function scope
		 * @return {$q} Callback after all jobs are done
		 * @member $job
		 */
		multipleJobs: function(jobsArray, count, taskDoneObj) {
			var len = jobsArray.length;
			var jobs = [];
			for (var i = 0; i < len; i++) {
				var jp = count > 0 ? i % count : i;
				var jobItem = jobsArray[i];
				if (!jobs[jp]) {
					jobs[jp] = this.create();
					if (taskDoneObj) {
						jobs[jp].setTaskDone(taskDoneObj.cb, taskDoneObj.scope);
					}
				}
				// add one job
				jobs[jp].add(jobItem.task, jobItem.scope, jobItem.args);
			}
			var jobPromises = [];
			jobs.forEach(function(job) {
				jobPromises.push(job.start());
			});
			return $q.all(jobPromises);
		}
	};
}]);
/**
 * Cover class for localStorage.
 * 
 * @class $localStorage
 */
onix.factory("$localStorage", function() {
	// localStorage provider
	var provider = ("localStorage" in window) ? localStorage : {
		_data: {},
		setItem: function(key, value) {
			if (!key) return;
			this._data[key] = value;
		},
		getItem: function(key) {
			if (!key) return null;
			return this._data[key];
		},
		removeItem: function(key) {
			if (!key) return;
			if (key in this._data) {
				delete this._data[key];
			}
		}
	};
	return {
		/**
		 * Set value to localStorage.
		 *
		 * @param {String} key
		 * @param {String} [value]
		 * @member $localStorage
		 */
		set: function(key, value) {
			provider.setItem(key, value);
		},
		/**
		 * Get value from localStorage.
		 *
		 * @param {String} key
		 * @return {String}
		 * @member $localStorage
		 */
		get: function(key) {
			return provider.getItem(key);
		},
		/**
		 * Remove key from localStorage.
		 *
		 * @param {String} key
		 * @return {Boolean}
		 * @member $localStorage
		 */
		remove: function(key) {
			provider.removeItem(key);
		}
	};
});
/**
 * Support class for location operations.
 * 
 * @class $location
 */
onix.service("$location", function() {
	// ------------------------ public ----------------------------------------
	/**
	 * Page refresh.
	 *
	 * @member $location
	 */
	this.refresh = function() {
		window.location.reload();
	};
	/**
	 * Create a new search url.
	 * 
	 * @param  {Object} obj
	 * @return {String}
	 * @member $location
	 */
	this.createSearchURL = function(obj) {
		var newURL = [];
		if (obj) {
			// write
			var newURL = [];
			Object.keys(obj).forEach(function(key) {
				newURL.push(key + "=" + encodeURIComponent(obj[key]));
			});
		}
		if (newURL.length) {
			return "?" + newURL.join("&");
		}
		else return "";
	};
	/**
	 * Get or set new url search. obj -> set new url from obj; !obj -> create obj from search part of url.
	 *
	 * @param  {Object} [obj]
	 * @return {Object}
	 * @member $location
	 */
	this.search = function(obj) {
		if (obj) {
			// write
			var newURL = this.createSearchURL(obj);
			if (newURL) {
				window.location.search = newURL;
			}
		}
		else {
			// read
			var data = location.search;
			var output = {};
			if (data) {
				data = data.replace("?", "");
				data.split("&").forEach(function(item) {
					var parts = item.split("=");
					output[parts[0]] = decodeURIComponent(parts[1]);
				});
			}
			return output;
		}
	};
	/**
	 * Get current location.
	 *
	 * @return {String}
	 * @member $location
	 */
	this.get = function() {
		return window.location.pathname;
	};
});
/**
 * Many useful alghoritms.
 * 
 * @class $math
 */
onix.service("$math", function() {
	/**
	 * Math constants.
	 *
	 * @private
	 * @type {Object}
	 * @member $math
	 */
	this._CONST = {
		ZOOM: 156543.034
	};
	/**
	 * Is there two bounding box intersection?
	 * 
	 * @param  {Object} bbox1
	 * @param  {Number} bbox1.x Left top coordinates - axe x
	 * @param  {Number} bbox1.y Left top coordinates - axe y
	 * @param  {Number} bbox1.width Width of the bbox
	 * @param  {Number} bbox1.height Height of the bbox
	 * @param  {Object} bbox2
	 * @param  {Number} bbox2.x Left top coordinates - axe x
	 * @param  {Number} bbox2.y Left top coordinates - axe y
	 * @param  {Number} bbox2.width Width of the bbox
	 * @param  {Number} bbox2.height Height of the bbox
	 * @return {Boolean}
	 * @member $math
	 */
	this.isBBoxIntersection = function(bbox1, bbox2) {
		var ltx = Math.max(bbox1.x, bbox2.x);
		var lty = Math.max(bbox1.y, bbox2.y);
		var rbx = Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width);
		var rby = Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height);
		// width and height of intesection has to be higher than 0
		var width = Math.abs(rbx - ltx);
		var height = Math.abs(rby - lty);
		if (ltx <= rbx && lty <= rby && width * height > 0) {
			return true;
		}
		else {
			return false;
		}
	};
	/**
	 * Get BBox from points.
	 * 
	 * @param  {Object[]} points
	 * @param  {Number} points.x Coordinate on axe x
	 * @param  {Number} points.y Coordinate on axe y
	 * @return {Object} Output bbox with x, y, width and height variables
	 * @member $math
	 */
	this.getBBox = function(points) {
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		// for each point
		for (var i = 0; i < points.length; i++) {
			minX = Math.min(points[i].x, minX);
			minY = Math.min(points[i].y, minY);
			maxX = Math.max(points[i].x, maxX);
			maxY = Math.max(points[i].y, maxY);
		}
		return {
			x: minX,
			y: minY,
			width: Math.abs(maxX - minX),
			height: Math.abs(maxY - minY)
		};
	};
	/**
	 * Determinant 2x2 count.
	 * 
	 * @param {Number} x1
	 * @param {Number} x2
	 * @param {Number} y1
	 * @param {Number} y2
	 * @returns {Number}
	 * @member $math
	 */
	this.det2 = function(x1, x2, y1, y2) {
		return (x1 * y2 - y1 * x2);
	};
	/**
	 * Intersection of two lines.
	 * 
	 * @param  {Object} firstLine
	 * @param  {Object} firstLine.x1 Line start axe x
	 * @param  {Object} firstLine.y1 Line start axe y
	 * @param  {Object} firstLine.x2 Line end axe x
	 * @param  {Object} firstLine.y2 Line end axe y
	 * @param  {Object} secondLine
	 * @param  {Object} secondLine.x1 Line start axe x
	 * @param  {Object} secondLine.y1 Line start axe y
	 * @param  {Object} secondLine.x2 Line end axe x
	 * @param  {Object} secondLine.y2 Line end axe y
	 * @returns {Object} Intersection point x, y
	 * @member $math
	 */
	this.linesIntersection = function(firstLine, secondLine) {
		var TOLERANCE = 0.000001;
		var a = this.det2(firstLine.x1 - firstLine.x2, firstLine.y1 - firstLine.y2, secondLine.x1 - secondLine.x2, secondLine.y1 - secondLine.y2);
		if (Math.abs(a) < TOLERANCE) return null; // lines are parallel
		var d1 = this.det2(firstLine.x1, firstLine.y1, firstLine.x2, firstLine.y2);
		var d2 = this.det2(secondLine.x1, secondLine.y1, secondLine.x2, secondLine.y2);
		var x = this.det2(d1, firstLine.x1 - firstLine.x2, d2, secondLine.x1 - secondLine.x2) / a;
		var y = this.det2(d1, firstLine.y1 - firstLine.y2, d2, secondLine.y1 - secondLine.y2) / a;
		if (x < Math.min(firstLine.x1, firstLine.x2) - TOLERANCE || x > Math.max(firstLine.x1, firstLine.x2) + TOLERANCE) return null
		if (y < Math.min(firstLine.y1, firstLine.y2) - TOLERANCE || y > Math.max(firstLine.y1, firstLine.y2) + TOLERANCE) return null
		if (x < Math.min(secondLine.x1, secondLine.x2) - TOLERANCE || x > Math.max(secondLine.x1, secondLine.x2) + TOLERANCE) return null
		if (y < Math.min(secondLine.y1, secondLine.y2) - TOLERANCE || y > Math.max(secondLine.y1, secondLine.y2) + TOLERANCE) return null
		return {
			x: Math.round(x),
			y: Math.round(y)
		};
	};
	/**
	 * Is there point and bounding box intersection?
	 * 
	 * @param  {Object} point
	 * @param  {Number} point.x Point coordinates - axe x
	 * @param  {Number} point.y Point coordinates - axe y
	 * @param  {Object} bbox
	 * @param  {Number} bbox.x Left top coordinates - axe x
	 * @param  {Number} bbox.y Left top coordinates - axe y
	 * @param  {Number} bbox.width Width of the bbox
	 * @param  {Number} bbox.height Height of the bbox
	 * @return {Boolean}
	 * @member $math
	 */
	this.pointBBoxIntersection = function(point, bbox) {
		return point.x >= bbox.x && point.x <= (bbox.x + bbox.width) && point.y >= bbox.y && point.y <= (bbox.y + bbox.height);
	};
	/**
	 * Logarithm - base 2.
	 * 
	 * @param  {Number} val Input value
	 * @return {Number}
	 * @member $math
	 */
	this.log2 = function(val) {
		return Math.log(val) / Math.log(2);
	};
	/**
	 * Map zoom in mercator projection to distance in meters.
	 * 
	 * @param  {Number} zoom   Mercator zoom - 2..n
	 * @param  {Number} horFOV Horizontal field of view
	 * @param  {Number} height Screen height size
	 * @return {Number} Distance in meters
	 * @member $math
	 */
	this.zoomToDistance = function(zoom, horFOV, height) {
		var resolution = this._CONST.ZOOM / Math.pow(2, zoom); // m/px
		var halfHeight = height / 2;
		var y = Math.floor(resolution * halfHeight);
		// we need a half - its in degrees - thats why / 2 * / 180 for radians [rad]; vertical fov -> we need height
		var alfa = horFOV / 360 * Math.PI;
		return Math.floor(y / Math.tan(alfa));
	};
	/**
	 * Reverse function for zoomToDistance - distance in meters to zoom in mercator projection.
	 * 
	 * @param  {Number} distance Distance in meters
	 * @param  {Number} horFOV Horizontal field of view
	 * @param  {Number} height Screen height size
	 * @return {Number} Mercator zoom
	 * @member $math
	 */
	this.distanceToZoom = function(distance, horFOV, height) {
		var alfa = horFOV / 360 * Math.PI;
		var y = Math.tan(alfa) * distance;
		var mPPx = 2 * y / height; // distance / half of height; meters per pixel
		return Math.floor(this.log2(this._CONST.ZOOM / mPPx));
	};
	/**
	 * Move point coordinates by angle in degrees.
	 * 
	 * @param  {Object} point
	 * @param  {Number} point.x Point coordinates - axe x
	 * @param  {Number} point.y Point coordinates - axe y
	 * @param  {Number} angle Angle in degrees CW
	 * @member $math
	 */
	this.movePointByAngle = function(point, angle) {
		var rad = (360 - angle) / 180 * Math.PI;
		var x = point.x;
		var y = point.y;
		point.x = x * Math.cos(rad) - y * Math.sin(rad);
		point.y = x * Math.sin(rad) + y * Math.cos(rad)
	};
	/**
	 * Move point by vector, you can also rotate vector by angle in degrees.
	 * 
	 * @param  {Object} point
	 * @param  {Number} point.x Point coordinates - axe x
	 * @param  {Number} point.y Point coordinates - axe y
	 * @param  {Object} vector
	 * @param  {Number} vector.x Point coordinates - axe x
	 * @param  {Number} vector.y Point coordinates - axe y
	 * @param  {Number} [angle] Angle in degrees for vector rotation CW
	 * @member $math
	 */
	this.movePointByVector = function(point, vector, angle) {
		// because overwrite reference object
		var vectorSave = {
			x: vector.x,
			y: vector.y
		};
		this.movePointByAngle(vectorSave, angle || 0);
		point.x += vectorSave.x;
		point.y += vectorSave.y;
	};
	/**
	 * Set value in selected range.
	 * 
	 * @param {Number} value Input value
	 * @param {Number} min Min value
	 * @param {Number} max Max value
	 * @return {Number}
	 * @member $math
	 */
	this.setRange = function(value, min, max) {
		if (value < min) {
			return min;
		}
		else if (value > max) {
			return max;
		}
		else {
			return value;
		}
	};
});
onix.factory("$myQuery", function() {
	/**
	 * DOM manipulation in the style of jquery.
	 * 
	 * @class $myQuery
	 * @chainable
	 * @param {String|HTMLElement|Array} value
	 * @param {HTMLElement} [parent]
	 * @member $myQuery
	 */
	var $myQuery = function(value, parent) {
		this._els = [];
		parent = parent || document;
		if (typeof value === "string") {
			if (parent instanceof $myQuery) {
				parent = parent.getEl();
			}
			this._els = parent.querySelectorAll(value);
		}
		else if (Array.isArray(value)) {
			this._els = value;
		}
		else {
			this._els.push(value);
		}
		return this;
	};
	/**
	 * Operation on elements.
	 * 
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 * @private
	 */
	$myQuery.prototype._operation = function(cb, scope) {
		// NodeList -> Array
		if (!Array.isArray(this._els)) {
			this._els = Array.prototype.slice.call(this._els);
		}
		this._els.forEach(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});
	};
	/**
	 * Set or get all - cover function.
	 * 
	 * @chainable
	 * @param  {String} newValue
	 * @param  {String} attr
	 * @member $myQuery
	 * @private
	 */
	$myQuery.prototype._setGetAll = function(newValue, attr) {
		if (newValue) {
			this._operation(function(item) {
				item[attr] = newValue;
			});
			return this;
		}
		else {
			var values = [];
			this._operation(function(item) {
				values.push(item[attr]);
			});
			if (!values.length) {
				return null;
			}
			else if (values.length == 1) {
				return values[0];
			}
			else {
				return values;
			}
		}
	};
	/**
	 * Get original element.
	 *
	 * @param  {Number} [ind]
	 * @return {HTMLElement}
	 * @member $myQuery
	 */
	$myQuery.prototype.getEl = function(ind) {
		ind = ind || 0;
		if (ind > this._els.length) {
			return null;
		}
		else {
			return this._els[ind];
		}
	};
	/**
	 * Get or set attribute.
	 *
	 * @chainable
	 * @param  {String} name
	 * @param  {String} [newValue]
	 * @return {String|Array}
	 * @member $myQuery
	 */
	$myQuery.prototype.attr = function(name, newValue) {
		if (newValue) {
			this._operation(function(item) {
				item.setAttribute(name, newValue);
			});
			return this;
		}
		else {
			var values = [];
			this._operation(function(item) {
				values.push(item.getAttribute(name));
			});
			if (!values.length) {
				return null;
			}
			else if (values.length == 1) {
				return values[0];
			}
			else {
				return values;
			}
		}
	};
	/**
	 * Get or set src.
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};
	/**
	 * Hide element.
	 * 
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.hide = function() {
		this._operation(function(item) {
			item.style.display = "none";
		});
		return this;
	};
	/**
	 * Show element.
	 *
	 * @chainable
	 * @param  {String} [displayStyle]
	 * @member $myQuery
	 */
	$myQuery.prototype.show = function(displayStyle) {
		this._operation(function(item) {
			item.style.display = displayStyle || "";
		});
		return this;
	};
	/**
	 * Get or set value.
	 *
	 * @chainable
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.val = function(newValue) {
		return this._setGetAll(newValue, "value");
	};
	/**
	 * Get or set HTML.
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};
	/**
	 * Append another element to this one.
	 *
	 * @chainable
	 * @param  {HTMLElement} child
	 * @member $myQuery
	 */
	$myQuery.prototype.append = function(child) {
		this._operation(function(item) {
			item.appendChild(child);
		});
		return this;
	};
	/**
	 * Add CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.addClass = function(className) {
		this._operation(function(item) {
			item.classList.add(className);
		});
		return this;
	};
	/**
	 * Remove CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.removeClass = function(className) {
		this._operation(function(item) {
			item.classList.remove(className);
		});
		return this;
	};
	/**
	 * Toggle CSS class.
	 *
	 * @chainable
	 * @param  {String} className
	 * @member $myQuery
	 */
	$myQuery.prototype.toggleClass = function(className) {
		this._operation(function(item) {
			item.classList.toggle(className);
		});
		return this;
	};
	/**
	 * Get width.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.width = function() {
		var width = 0;
		this._operation(function(item) {
			width += item.offsetWidth;
		});
		return width;
	};
	/**
	 * Get height.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.height = function() {
		var height = 0;
		this._operation(function(item) {
			height += item.offsetHeight;
		});
		return height;
	};
	/**
	 * Click event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.click = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("click", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});
		return this;
	};
	/**
	 * Change event.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.change = function(cb, scope) {
		this._operation(function(item) {
			item.addEventListener("change", function(event) {
				cb.apply(scope || cb, [event, item]);
			});
		});
		return this;
	};
	/**
	 * Foreach.
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @param  {Function} [scope]
	 * @member $myQuery
	 */
	$myQuery.prototype.forEach = function(cb, scope) {
		this._operation(function(item, ind) {
			cb.apply(scope || cb, [item, ind]);
		});
		return this;
	};
	/**
	 * Remove element.
	 *
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.remove = function() {
		this._operation(function(item) {
			item.parentNode.removeChild(item);
		});
		return this;
	};
	/**
	 * Prepend element.
	 *
	 * @chainable
	 * @param  {HTMLElement} child
	 * @member $myQuery
	 */
	$myQuery.prototype.prepend = function(child) {
		this._operation(function(item) {
			item.parentNode.insertBefore(child, item);
		});
		return this;
	};
	/**
	 * Empty element - clear all its children.
	 * Much faster than innerHTML = "".
	 * 
	 * @chainable
	 * @member $myQuery
	 */
	$myQuery.prototype.empty = function() {
		this._operation(function(item) {
			while (item.firstChild) {
				item.removeChild(item.firstChild);
			}
		});
		return this;
	};
	/**
	 * Get all elements length.
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.len = function() {
		return this._els.length;
	};
	/**
	 * Quick acces to myQuery and DOM manipulation.
	 *
	 * @param  {String|HTMLElement|Array} value
	 * @param {HTMLElement} [parent]
	 * @return {$myQuery}
	 * @member onix
	 * @property {Function}
	 */
	onix.element = function(value, parent) {
		return new $myQuery(value, parent);
	};
	return {
		 /**
		 * Main cover function.
		 * 
		 * @param  {String|HTMLElement|Array} value
		 * @param {HTMLElement} [parent]
		 * @return {$myQuery}
		 * @member $myQuery
		 */
		get: function(value, parent) {
			return new $myQuery(value, parent);
		}
	};
});
/**
 * Run for cache $myQuery object.
 *
 * @private
 * @member onix
 */
onix.run(["$myQuery", function() {
}]);
onix.factory("$promise", function() {
	/**
	 * ES6 promise implementation.
	 * 
	 * @class $promise
	 */
	var $promise = function(cbFn) {
		/**
		 * Promise states.
		 *
		 * @member $promise
		 * @private
		 */
		this._STATES = {
			IDLE: 0,
			RESOLVED: 1,
			REJECTED: 2
		};
		// current state
		this._state = this._STATES.IDLE;
		// all funcs
		this._funcs = [];
		// done data
		this._finishData = null;
		// call promise cb function
		if (cbFn && typeof cbFn === "function") {
			cbFn.apply(cbFn, [
				this._resolve.bind(this),
				this._reject.bind(this)
			]);
		}
	};
	/**
	 * Resolve promise using obj.
	 *
	 * @private
	 * @param  {Object} obj
	 * @member $promise
	 */
	$promise.prototype._resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};
	/**
	 * Reject promise using obj.
	 *
	 * @private
	 * @param  {Object} obj
	 * @member $promise
	 */
	$promise.prototype._reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};
	/**
	 * Resolve all functions.
	 *
	 * @param  {Boolean} isError
	 * @member $promise
	 * @private
	 */
	$promise.prototype._resolveFuncs = function(isError) {
		this._funcs.forEach(function(fnItem) {
			if (fnItem["finally"] || (fnItem.isError && isError) || (!fnItem.isError && !isError)) {
				(fnItem.fn)(this._finishData);
			}
		}, this);
		// clear array
		this._funcs.length = 0;
		this._state = isError ? this._STATES.REJECTED : this._STATES.RESOLVED;
	};
	/**
	 * Is promise already finished?
	 *
	 * @return {Boolean}
	 * @member $promise
	 * @private
	 */
	$promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._STATES.IDLE) {
			this._resolveFuncs(this._state == this._STATES.REJECTED);
		}
	};
	/**
	 * After promise resolve/reject call then (okFn, errorFn).
	 *
	 * @chainable
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @member $promise
	 */
	$promise.prototype.then = function(cbOk, cbError) {
		if (cbOk && typeof cbOk === "function") {
			this._funcs.push({
				fn: cbOk,
				isError: false
			});
		}
		if (cbError && typeof cbError === "function") {
			this._funcs.push({
				fn: cbError,
				isError: true
			});
		}
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * After promise resolve call then cbOk.
	 *
	 * @chainable
	 * @param  {Function} cbOk
	 * @member $promise
	 */
	$promise.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * After promise reject call then cbError.
	 *
	 * @chainable
	 * @param  {Function} cbError
	 * @member $promise
	 */
	$promise.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * Finally for promise.
	 *
	 * @method finally
	 * @chainable
	 * @param  {Function} cb
	 * @member $promise
	 */
	$promise.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});
		this._isAlreadyFinished();
		return this;
	};
	// static methods
	/**
	 * Resolve all promises in the array.
	 *
	 * @param {$promise[]} promises
	 * @return {$promise}
	 * @member $promise
	 */
	$promise.all = function(promises) {
		return new $promise(function(resolve) {
			if (Array.isArray(promises)) {
				var count = promises.length;
				var test = function() {
					count--;
					if (count == 0) {
						resolve();
					}
				};
				promises.forEach(function(item) {
					item["finally"](test);
				});
			}
			else {
				resolve();
			}
		});
	};
	/**
	 * Resolve promise with variable object.
	 *
	 * @param {Object} [obj] Resolved object
	 * @return {$promise}
	 * @member $promise
	 */
	$promise.resolve = function(obj) {
		return new $promise(function(resolve) {
			resolve(obj);
		});
	};
	/**
	 * Reject promise with variable object.
	 *
	 * @param {Object} [obj] Rejected object
	 * @return {$promise}
	 * @member $promise
	 */
	$promise.reject = function(obj) {
		return new $promise(function(resolve, reject) {
			reject(obj);
		});
	};
	return $promise;
});
onix.factory("$q", function() {
	/**
	 * Promise implementation which is similar to angular $q.
	 * 
	 * @class $q
	 */
	var $q = function() {
		/**
		 * Promise states.
		 *
		 * @member $q
		 * @private
		 */
		this._STATES = {
			IDLE: 0,
			RESOLVED: 1,
			REJECTED: 2
		};
		// current state
		this._state = this._STATES.IDLE;
		// all funcs
		this._funcs = [];
		// done data
		this._finishData = null;
	};
	/**
	 * Resolve all functions.
	 *
	 * @param  {Boolean} isError
	 * @member $q
	 * @private
	 */
	$q.prototype._resolveFuncs = function(isError) {
		this._funcs.forEach(function(fnItem) {
			if (fnItem["finally"] || (fnItem.isError && isError) || (!fnItem.isError && !isError)) {
				(fnItem.fn)(this._finishData);
			}
		}, this);
		// clear array
		this._funcs.length = 0;
		this._state = isError ? this._STATES.REJECTED : this._STATES.RESOLVED;
	};
	/**
	 * Is promise already finished?
	 *
	 * @return {Boolean}
	 * @member $q
	 * @private
	 */
	$q.prototype._isAlreadyFinished = function() {
		if (this._state != this._STATES.IDLE) {
			this._resolveFuncs(this._state == this._STATES.REJECTED);
		}
	};
	/**
	 * Resolve promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$q.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};
	/**
	 * Reject promise using obj.
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$q.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};
	/**
	 * After promise resolve/reject call then (okFn, errorFn).
	 *
	 * @chainable
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @member $q
	 */
	$q.prototype.then = function(cbOk, cbError) {
		if (cbOk && typeof cbOk === "function") {
			this._funcs.push({
				fn: cbOk,
				isError: false
			});
		}
		if (cbError && typeof cbError === "function") {
			this._funcs.push({
				fn: cbError,
				isError: true
			});
		}
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * After promise resolve call then cbOk.
	 *
	 * @chainable
	 * @param  {Function} cbOk
	 * @member $q
	 */
	$q.prototype.done = function(cbOk) {
		this._funcs.push({
			fn: cbOk,
			isError: false
		});
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * After promise reject call then cbError.
	 *
	 * @chainable
	 * @param  {Function} cbError
	 * @member $q
	 */
	$q.prototype.error = function(cbError) {
		this._funcs.push({
			fn: cbError,
			isError: true
		});
		this._isAlreadyFinished();
		return this;
	};
	/**
	 * Finally for promise.
	 *
	 * @method finally
	 * @chainable
	 * @param  {Function} cb
	 * @member $q
	 */
	$q.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});
		this._isAlreadyFinished();
		return this;
	};
	return {
		/**
		 * Inner method for chaining promises.
		 * 
		 * @param  {Object[]} opts
		 * @param  {String|Function} opts.method Function or method name inside scope
		 * @param  {Object} opts.scope Scope for method function
		 * @param  {Array} opts.args Additional arguments for function
		 * @param  {$q} promise Done promise $q
		 * @param  {Array} outArray Array for output from all executed promises
		 * @private
		 * @member $q
		 */
		_chainPromisesInner: function(opts, promise, outArray) {
			var firstItem = opts.shift();
			if (firstItem) {
				// string or function itself
				var fn;
				var error = false;
				switch (typeof firstItem.method) {
					case "string":
						if (!firstItem.scope || !(firstItem.method in firstItem.scope)) {
							error = true;
						}
						else {
							fn = firstItem.scope[firstItem.method];
							if (typeof fn !== "function") {
								error = true;
							}
						}
						break;
					case "function":
						fn = firstItem.method;
						break;
					default:
						error = true;
				}
				if (!error) {
					fn.apply(firstItem.scope || fn, firstItem.args || []).then(function(data) {
						outArray.push(data);
						this._chainPromisesInner(opts, promise, outArray);
					}.bind(this), function(err) {
						outArray.push(err);
						this._chainPromisesInner(opts, promise, outArray);
					}.bind(this));
				}
				else {
					promise.resolve(outArray);
				}
			}
			else {
				promise.resolve(outArray);
			}
		},
		/**
		 * Resolve all promises in the array.
		 *
		 * @param {$q[]} promises
		 * @return {$q}
		 * @member $q
		 */
		all: function(promises) {
			var promise = new $q();
			if (Array.isArray(promises)) {
				var count = promises.length;
				var test = function() {
					count--;
					if (count == 0) {
						promise.resolve();
					}
				};
				promises.forEach(function(item) {
					item["finally"](test);
				});
			}
			else {
				promise.resolve();
			}
			return promise;
		},
		/**
		 * Deferable object of the promise.
		 *
		 * @return {$q}
		 * @member $q
		 */
		defer: function() {
			return new $q();
		},
		/**
		 * Is object promise?
		 * 
		 * @param  {Object}  obj Tested object
		 * @return {Boolean}
		 * @member $q
		 */
		isPromise: function(obj) {
			return obj instanceof $q;
		},
		/**
		 * Chaining multiple methods with promises, returns promise.
		 * 
		 * @param  {Object[]} opts
		 * @param  {String|Function} opts.method Function or method name inside scope
		 * @param  {Object} opts.scope Scope for method function
		 * @param  {Array} opts.args Additional arguments for function
		 * @return {$q}
		 * @member $q
		 */
		chainPromises: function(opts) {
			var promise = this.defer();
			this._chainPromisesInner(opts, promise, []);
			return promise;
		}
	};
});
/**
 * Simple router for the application.
 * 
 * @class $route
 */
onix.service("$route", [
	"$location",
	"$template",
	"$di",
	"$routeParams",
function(
	$location,
	$template,
	$di,
	$routeParams
) {
	/**
	 * All routes.
	 *
	 * @private
	 * @type {Array}
	 * @member $route
	 */
	this._routes = [];
	/**
	 * Otherwise route.
	 *
	 * @private
	 * @type {Object}
	 * @member $route
	 */
	this._otherwise = null;
	/**
	 * Set $routeParams object. First clear all old keys and add new ones, if the available.
	 *
	 * @private
	 * @param {Object} [routeParams] Route params object
	 * @type {Object}
	 * @member $route
	 */
	this._setRouteParams = function(routeParams) {
		Object.keys($routeParams).forEach(function(key) {
			delete $routeParams[key];
		});
		routeParams = routeParams || {};
		Object.keys(routeParams).forEach(function(key) {
			$routeParams[key] = routeParams[key];
		});
	};
	/**
	 * Add route to the router.
	 *
	 * @chainable
	 * @param  {String} url 
	 * @param  {Object} config
	 * @param  {String} [config.templateId] Template ID which will be used for templateUrl
	 * @param  {String} [config.templateUrl] Template URL which will be loaded and cached in the $template
	 * @param  {String} [config.controller] Run this function if the route is used
	 * @param  {Object} [config.xyz] Rest parameters goes to the $routeParams
	 * @member $route
	 */
	this.when = function(url, config) {
		this._routes.push({
			url: url,
			config: config
		});
		return this;
	};
	/**
	 * Otherwise.
	 *
	 * @chainable
	 * @param  {String} page
	 * @param  {Object} config
	 * @param  {String} [config.templateId] Template ID which will be used for templateUrl
	 * @param  {String} [config.templateUrl] Template URL which will be loaded and cached in the $template
	 * @param  {String} [config.controller] Run this function if the route is used
	 * @param  {Object} [config.xyz] Rest parameters goes to the $routeParams
	 * @member $route
	 */
	this.otherwise = function(config) {
		this._otherwise = {
			config: config
		};
		return this;
	};
	/**
	 * Run controller from route path.
	 *
	 * @private
	 * @param  {Array|Function} contr
	 * @param  {Object} [routeParams] Additonal data
	 * @member $route
	 */
	this._runController = function(contr, routeParams) {
		var pp = $di.parseParam(contr);
		this._setRouteParams(routeParams);
		$di.run({
			fn: pp.fn,
			inject: pp.inject
		});
	};
	/**
	 * Route GO. Walk through all routes, if there is match, route controller will be called.
	 *
	 * @member $route
	 */
	this.go = function() {
		var path = $location.get();
		var find = false;
		var config = null;
		var data = {};
		this._routes.every(function(item) {
			if (path.match(new RegExp(item.url))) {
				config = item.config;
				find = true;
				return false;
			}
			else {
				return true;
			}
		});
		if (!find && this._otherwise) {
			config = this._otherwise.config;
		}
		if (config) {
			var templateId = "";
			var templateUrl = null;
			var contr = null;
			var routeParams = {};
			Object.keys(config).forEach(function(key) {
				var value = config[key];
				switch (key) {
					case "templateId":
						templateId = value;
						break;
					case "templateUrl":
						templateUrl = value;
						break;
					case "controller":
						contr = value;
						break;
					default:
						routeParams[key] = value;
				}
			});
			if (templateUrl) {
				$template.load(config.templateId || config.templateUrl, config.templateUrl).done(function() {
					if (contr) {
						this._runController(contr, routeParams);
					}
				}.bind(this));
			}
			else {
				if (contr) {
					this._runController(contr, routeParams);
				}
			}
		}
	};
}]);
/**
 * Data for controllers in the $route.
 * 
 * @class $routeParams
 */
onix.factory("$routeParams", function() {
	return {};
});
onix.provider("$template", function() {
	/**
	 * Configuration for template delimeters.
	 *
	 * @type {Object}
	 * @member $templateProvider
	 * @private
	 */
	var _conf = {
		left: "{{",
		right: "}}"
	};
	/**
	 * Set template config; you can use "left" {{ and "right" }} template delimeters.
	 * 
	 * @param {Object} confParam Object with new config
	 * @member $templateProvider
	 */
	this.setConfig = function(confParam) {
		Object.keys(confParam).forEach(function(confParamKey) {
			_conf[confParamKey] = confParam[confParamKey];
		});
	};
	/**
	 * Handle templates, binds events - syntax similar to moustache and angular template system.
	 * $myQuery is used for cache record.
	 *
	 * @class $template
	 */
	this.$get = ["$common", "$q", "$http", "$filter", function(
				$common, $q, $http, $filter) {
		var $template = {
			/**
			 * Template cache.
			 *
			 * @type {Object}
			 * @member $template
			 * @private
			 */
			_cache: {},
			/**
			 * Regular expressions for handle template variables.
			 *
			 * @type {Object}
			 * @member $template
			 * @private
			 */
			_RE: {
				VARIABLE: /[$_a-zA-Z][$_a-zA-Z0-9]+/g,
				NUMBERS: /[-]?[0-9]+[.]?([0-9e]+)?/g,
				STRINGS: /["'][^"']+["']/g,
				JSONS: /[{][^}]+[}]/g,
				ALL: /[-]?[0-9]+[.]?([0-9e]+)?|["'][^"']+["']|[{][^}]+[}]|[$_a-zA-Z][$_a-zA-Z0-9]+/g
			},
			/**
			 * Constants.
			 * 
			 * @type {Object}
			 * @member $template
			 * @private
			 */
			_CONST: {
				FILTER_DELIMETER: "|",
				FILTER_PARAM_DELIMETER: ":",
				TEMPLATE_SCRIPT_SELECTOR: "script[type='text/template']"
			},
			/**
			 * Parse a function name from the string.
			 *
			 * @param  {String} value
			 * @return {String}
			 * @member $template
			 * @private
			 */
			_parseFnName: function(value) {
				value = value || "";
				return value.match(/[a-zA-Z0-9_]+/)[0];
			},
			/**
			 * Parse arguments from the string -> makes array from them.
			 *
			 * @param  {String} value
			 * @param  {Object} config
			 * @param  {Object} config.$event Event object
			 * @param  {Object} config.$element Reference to element
			 * @return {Array}
			 * @member $template
			 * @private
			 */
			_parseArgs: function(value, config) {
				argsValue = value ? value.replace(/^[^(]+./, "").replace(/\).*$/, "") : "";
				var args = [];
				var matches = argsValue.match(this._RE.ALL);
				if (matches) {
					var all = [];
					matches.forEach(function(item) {
						var value;
						if (item.match(this._RE.STRINGS)) {
							value = item.substr(1, item.length - 2)
						}
						else if (item.match(this._RE.NUMBERS)) {
							value = parseFloat(item);
						}
						else if (item.match(this._RE.JSONS)) {
							value = JSON.parse(item);
						}
						else if (item.match(this._RE.VARIABLE)) {
							var variable = item.match(this._RE.VARIABLE)[0];
							if (variable == "$event") {
								value = config.event;
							}
							else if (variable == "$element") {
								value = config.el;
							}
							else {
								// todo - maybe eval with scope
								value = null;
							}
						}
						all.push({
							value: value,
							pos: argsValue.indexOf(item)
						});
					}, this);
					if (all.length) {
						all.sort(function(a, b) {
							return a.pos - b.pos
						}).forEach(function(item) {
							args.push(item.value);
						});
					}
				}
				return args;
			},
			/**
			 * Bind one single event to the element.
			 * 
			 * @param  {HTMLElement} el
			 * @param  {String} eventName click, keydown...
			 * @param  {String} data data-x value
			 * @param  {Function} scope
			 * @member $template
			 * @private
			 */
			_bindEvent: function(el, eventName, data, scope) {
				if (data && this._parseFnName(data) in scope) {
					el.addEventListener(eventName, $common.bindWithoutScope(function(event, templScope) {
						var value = this.getAttribute("data-" + eventName);
						var fnName = templScope._parseFnName(value);
						var args = templScope._parseArgs(value, {
							el: this,
							event: event
						});
						scope[fnName].apply(scope, args);
					}, this));
				}
			},
			/**
			 * Init - get all templates from the page. Uses 'text/template' script with template data.
			 * Each script has to have id and specifi type="text/template".
			 *
			 * @private
			 * @member $template
			 */
			_init: function() {
				onix.element(this._CONST.TEMPLATE_SCRIPT_SELECTOR).forEach(function(item) {
					this.add(item.id || "", item.innerHTML);
				}, this);
			},
			/**
			 * Add new item to the cache.
			 *
			 * @param {String} key 
			 * @param {String} data
			 * @member $template
			 */
			add: function(key, data) {
				this._cache[key] = data;
			},
			/**
			 * Compile one template - replaces all ocurances of {{ xxx }} by model.
			 *
			 * @param  {String} key Template key/name
			 * @param  {Object} data Model
			 * @return {String}
			 * @member $template
			 */
			compile: function(key, data) {
				var tmpl = this.get(key);
				if (data) {
					var all = tmpl.match(new RegExp(_conf.left + "(.*?)" + _conf.right, "g")) || [];
					all.forEach(function(item) {
						var itemSave = item;
						item = item.replace(new RegExp("^" + _conf.left), "").replace(new RegExp(_conf.right + "$"), "");
						if (item.indexOf(this._CONST.FILTER_DELIMETER) != -1) {
							var filterValue;
							// filters
							item.split(this._CONST.FILTER_DELIMETER).forEach(function(filterItem, ind) {
								filterItem = filterItem.trim();
								if (!ind) {
									// value
									if (filterItem in data) {
										filterValue = data[filterItem];
									}
								}
								else {
									// preprocessing by filter
									var args = [filterValue];
									var filterParts = filterItem.split(this._CONST.FILTER_PARAM_DELIMETER);
									var filterName = "";
									if (filterParts.length == 1) {
										filterName = filterParts[0].trim();
									}
									else {
										filterParts.forEach(function(filterPartItem, filterPartInd) {
											filterPartItem = filterPartItem.trim();
											if (!filterPartInd) {
												filterName = filterPartItem;
											}
											else {
												args.push(filterPartItem);
											}
										});
									}
									var filter = $filter(filterName);
									filterValue = filter.apply(filter, args);
								}
							}, this);
							tmpl = tmpl.replace(itemSave, filterValue || "");
						}
						else {
							// standard
							var replaceValue = "";
							item = item.trim();
							if (item in data) {
								replaceValue = data[item];
							}
							tmpl = tmpl.replace(itemSave, replaceValue);
						}
					}, this);
				}
				return tmpl;
			},
			/**
			 * Get template from the cache.
			 *
			 * @param  {String} key Template key/name
			 * @return {String}
			 * @member $template
			 */
			get: function(key) {
				return this._cache[key] || "";
			},
			/**
			 * Bind all elements in the root element. Selectors all data-[click|change|bind|keydown] and functions are binds against scope object.
			 * For data-bind, scope has to have "addEls" function.
			 * Supports: click, change, keydown, bind.
			 *
			 * @param  {HTMLElement} root Root element
			 * @param  {Object} scope Scope which against will be binding used
			 * @param  {Function} [addElsCb] Callback function with object with all data-bind objects
			 * @member $template
			 */
			bindTemplate: function(root, scope, addElsCb) {
				var allElements = onix.element("*[data-click], *[data-change], *[data-bind], *[data-keydown]", root);
				if (allElements.len()) {
					var newEls = {};
					allElements.forEach(function(item) {
						this._bindEvent(item, "click", item.getAttribute("data-click"), scope);
						this._bindEvent(item, "change", item.getAttribute("data-change"), scope);
						this._bindEvent(item, "keydown", item.getAttribute("data-keydown"), scope);
						var dataBind = item.getAttribute("data-bind");
						if (dataBind) {
							newEls[dataBind] = item;
						}
					}, this);
					if (addElsCb && typeof addElsCb === "function") {
						addElsCb(newEls);
					}
				}
			},
			/**
			 * Load template from the path, returns promise after load.
			 *
			 * @param  {String} key
			 * @param  {String} path
			 * @return {$q}
			 * @member $template
			 */
			load: function(key, path) {
				var promise = $q.defer();
				$http.createRequest({
					url: path
				}).then(function(data) {
					this.add(key, data.data);
					promise.resolve();
				}.bind(this), function(data) {
					promise.reject();
				});
				return promise;
			}
		};
		// template init
		$template._init();
		return $template;
	}];
});
onix.factory("$anonymizer", [
	"$math",
	"$event",
	"$loader",
	"$q",
	"$common",
function(
	$math,
	$event,
	$loader,
	$q,
	$common
) {
	/**
	 * Anonymizer - canvas for image preview with posibility for add geometries.
	 *
	 * @param {HTMLElement} parent Where is canvas appended
	 * @param {Object} [optsArg] Configuration
	 * @param {Number} [optsArg.canWidth] Canvas width
	 * @param {Number} [optsArg.canHeight] Canvas height
	 * @param {Number} [optsArg.zoom = 100] start zoom in [%]
	 * @param {Number} [optsArg.minZoom = 20] min zoom in [%]
	 * @param {Number} [optsArg.maxZoom = 100] max zoom in [%]
	 * @param {Number} [optsArg.zoomStep = 10] How many [%] add/dec with zoom change
	 * @param {Number} [optsArg.zoomMoveStep = 1] Under 100% multiplier for faster image movement
	 * @param {Object} [optsArg.curEntity = $anonymizer.ENTITES.CIRCLE] Start entity from $anonymizer.ENTITES
	 * @param {Number} [optsArg.showPreview = true] Show preview - image overview
	 * @param {Number} [optsArg.previewLeft = 17] Preview location from left top corner, axe x [px]
	 * @param {Number} [optsArg.previewTop = 17] Preview location from left top corner, axe y [px]
	 * @param {Number} [optsArg.previewWidth = 200] Preview image width [px]
	 * @param {HTMLElement} [optsArg.entityPreview = null] Create entity preview? Parent for append.
	 * @class $anonymizer
	 */
	var $anonymizer = function(parent, optsArg) {
		// is canvas available?
		this._hasCanvas = !!document.createElement("canvas").getContext;
		if (!this._hasCanvas) {
			console.error("Canvas is not available!");
			return null;
		}
		// event init
		this._eventInit();
		// parent reference
		this._parent = parent;
		this._parent.classList.add("anonymizer");
		this._opts = {
			canWidth: parent.offsetWidth || 0,
			canHeight: parent.offsetHeight || 0,
			zoom: 100,
			minZoom: 20,
			maxZoom: 100,
			zoomStep: 10,
			zoomMoveStep: 1,
			curEntity: $anonymizer.ENTITES.CIRCLE,
			showPreview: true,
			previewLeft: 17,
			previewTop: 17,
			previewWidth: 200,
			entityPreview: null
		};
		for (var key in optsArg) {
			this._opts[key] = optsArg[key];
		}
		// canvas width & height
		this._canWidth = this._opts.canWidth;
		this._canHeight = this._opts.canHeight;
		// zoom
		this._zoom = this._opts.zoom;
		// zoom step
		this._zoomStep = this._opts.zoomStep;
		// step for zoom move
		this._zoomMoveStep = 0;
		// act. image width
		this._curWidth = 0;
		// act. image height
		this._curHeight = 0;
		// create main canvas
		this._canvas = document.createElement("canvas");
		this._canvas.width = this._canWidth;
		this._canvas.height = this._canHeight;
		// ctx of main canvas
		this._ctx = this._canvas.getContext("2d");
		// loaded image
		this._img = null;
		// original image width
		this._imgWidth = 0;
		// original image height
		this._imgHeight = 0;
		// canvas & ctx for create line
		this._lineCanvas = null;
		this._lineCanvasCtx = null;
		// canvas & ctx for preview of a entity
		this._entityCanvas = null;
		this._entityCanvasCtx = null;
		// entites to draw
		this._entites = [];
		// image draw offset axe x
		this._x = 0;
		// image draw offset axe y
		this._y = 0;
		// threshold for click
		this._THRESHOLD = {
			MIN: -1,
			MAX: 1
		};
		// helper for mouse event
		this._mouse = {
			startXSave: 0,
			startYSave: 0,
			startX: 0,
			startY: 0
		};
		this._flags = {
			wasRightClick: false,
			wasMove: false,
			wasPreview: false,
			wasLine: false,
			wasImgMove: false
		};
		// binds
		this._binds = {
			mouseWheel: this._mouseWheel.bind(this),
			mouseDown: this._mouseDown.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseUp: this._mouseUp.bind(this),
			mouseMoveLine: this._mouseMoveLine.bind(this),
			mouseUpLine: this._mouseUpLine.bind(this),
			mouseUpDocument: this._mouseUpDocument.bind(this),
			contextMenu: this._contextmenu.bind(this)
		};
		// firefox
		this._canvas.addEventListener("DOMMouseScroll", this._binds.mouseWheel);
		// others
		this._canvas.addEventListener("mousewheel", this._binds.mouseWheel);
		this._canvas.addEventListener("mousedown", this._binds.mouseDown);
		this._canvas.addEventListener("contextmenu", this._binds.contextMenu);
		// spinner - progress for image load
		this._spinner = $loader.getSpinner();
		parent.appendChild(this._spinner);
		parent.appendChild(this._canvas);
		// preview canvas
		if (this._opts.entityPreview) {
			this._entityCanvas = document.createElement("canvas");
			this._entityCanvas.width = 300;
			this._entityCanvas.height = 150;
			this._entityCanvasCtx = this._entityCanvas.getContext("2d");
			this._opts.entityPreview.appendChild(this._entityCanvas);
		}
	};
	/**
	 * Extend $anonymizer with events functionality.
	 */
	$common.inherit($anonymizer, $event);
	/**
	 * List of entites.
	 * 
	 * @type {Object}
	 * @param {Object} CIRCLE Circle entity
	 * @param {Object} LINE Line entity
	 * @member $anonymizer
	 * @static
	 */
	$anonymizer.ENTITES = {
		CIRCLE: {
			min: 10,
			value: 50,
			max: 100,
			id: "CIRCLE",
			fillStyle: "rgba(0, 0, 255, 0.5)",
			priority: 1
		},
		LINE: {
			min: 10,
			value: 20,
			max: 100,
			id: "LINE",
			strokeStyle: "rgba(0, 255, 0, 0.5)",
			priority: 2
		}
	};
	/**
	 * Scene redraw - clear, picture, entites.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._redraw = function() {
		// pictue
		this._ctx.clearRect(0, 0, this._canWidth, this._canHeight);
		this._ctx.drawImage(this._img, this._x, this._y, this._img.width, this._img.height, 0, 0, this._curWidth, this._curHeight);
		// entites
		if (this._entites.length) {
			var zc = this._zoom / 100;
			var xc = this._x * zc;
			var yc = this._y * zc;
			this._entites.forEach(function(entity) {
				switch (entity.id) {
					case $anonymizer.ENTITES.CIRCLE.id:
						var radius = Math.round(entity.value * zc);
						var x = Math.round(this._curWidth * entity.xRatio - xc);
						var y = Math.round(this._curHeight * entity.yRatio - yc);
						this._drawCircle(this._ctx, x, y, radius);
						break;
					case $anonymizer.ENTITES.LINE.id:
						var lineWidth = Math.round(entity.value * zc);
						var x = Math.round(this._curWidth * entity.xRatio - xc);
						var y = Math.round(this._curHeight * entity.yRatio - yc);
						var x2 = Math.round(this._curWidth * entity.x2Ratio - xc);
						var y2 = Math.round(this._curHeight * entity.y2Ratio - yc);
						this._drawLine(this._ctx, x, y, x2, y2, lineWidth);
						break;
				}
			}, this);
		}
		// image preview
		this._drawPreview();
	};
	/**
	 * Draw white canvas.
	 * 
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._setWhiteCanvas = function() {
		this._ctx.clearRect(0, 0, this._canWidth, this._canHeight);
		this._drawFillRect(this._ctx, 0, 0, this._canWidth, this._canHeight, "#fff");
	};
	/**
	 * Draw a circle.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Center coordinates axe x
	 * @param  {Number} y Center coordinates axe y
	 * @param  {Number} radius Circle radius
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawCircle = function(ctx, x, y, radius) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.fillStyle = $anonymizer.ENTITES.CIRCLE.fillStyle;
		ctx.closePath();
		ctx.fill();
	};
	/**
	 * Draw a line.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Line start coordinates axe x
	 * @param  {Number} y Line start coordinates axe y
	 * @param  {Number} x2 Line end coordinates axe x
	 * @param  {Number} y2 Line end coordinates axe y
	 * @param  {Number} lineWidth Line width [px]
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawLine = function(ctx, x, y, x2, y2, lineWidth) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x2, y2);
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = $anonymizer.ENTITES.LINE.strokeStyle;
		ctx.closePath();
		ctx.stroke();
	};
	/**
	 * Draw a filled rectangle.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Start coordinates axe x
	 * @param  {Number} y Start coordinates axe y
	 * @param  {Number} width Rectangle width
	 * @param  {Number} height Rectangle height
	 * @param  {String} fillStyle Fill style
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawFillRect = function(ctx, x, y, width, height, fillStyle) {
		ctx.beginPath();
		ctx.fillStyle = fillStyle || "";
		ctx.fillRect(x, y, width, height);
		ctx.closePath();
	};
	/**
	 * Draw a rectangle, only border.
	 * 
	 * @param  {Canvas} ctx Canvas context
	 * @param  {Number} x Start coordinates axe x
	 * @param  {Number} y Start coordinates axe y
	 * @param  {Number} width Rectangle width
	 * @param  {Number} height Rectangle height
	 * @param  {String} strokeStyle Border style
	 * @param  {Number} lineWidth Border width
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawRect = function(ctx, x, y, width, height, strokeStyle, lineWidth) {
		ctx.beginPath();
		ctx.rect(x, y, width, height);
		ctx.lineWidth = lineWidth || 1;
		ctx.strokeStyle = strokeStyle || "";
		ctx.closePath();
		ctx.stroke();
	};
	/**
	 * Draw a image preview.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawPreview = function() {
		if (!this._opts.showPreview) return;
		var ratio = this._imgWidth / this._imgHeight;
		var height = Math.round(this._opts.previewWidth / ratio);
		// background
		this._drawFillRect(this._ctx, this._opts.previewLeft - 1, this._opts.previewTop - 1, this._opts.previewWidth + 2, height + 2, "rgba(255, 255, 255, 0.5)");
		// picture
		this._ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height, this._opts.previewLeft, this._opts.previewTop, this._opts.previewWidth, height);
		// red border - current view
		var zc = this._zoom / 100;
		var xc = this._x * zc;
		var yc = this._y * zc;
		var xRatio = xc / this._curWidth;
		var yRatio = yc / this._curHeight;
		var x2Ratio = (xc + this._canWidth) / this._curWidth;
		var y2Ratio = (yc + this._canHeight) / this._curHeight;
		// restrictions
		xRatio = $math.setRange(xRatio, 0, 1);
		yRatio = $math.setRange(yRatio, 0, 1);
		x2Ratio = $math.setRange(x2Ratio, 0, 1);
		y2Ratio = $math.setRange(y2Ratio, 0, 1);
		var x1 = Math.round(this._opts.previewLeft + xRatio * this._opts.previewWidth);
		var y1 = Math.round(this._opts.previewTop + yRatio * height);
		var x2 = Math.round(this._opts.previewLeft + x2Ratio * this._opts.previewWidth);
		var y2 = Math.round(this._opts.previewTop + y2Ratio * height);
		// red border
		this._drawRect(this._ctx, x1, y1, x2 - x1, y2 - y1, "#C01", 1);
	};
	/**
	 * Draw a entity preview for circle/line.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._drawEntityPreview = function() {
		if (!this._opts.entityPreview) return;
		var width = this._entityCanvas.width;
		var height = this._entityCanvas.height;
		this._entityCanvasCtx.clearRect(0, 0, width, height);
		this._drawFillRect(this._entityCanvasCtx, 0, 0, width, height, "#f9f9f9");
		var curEnt = this._opts.curEntity;
		var zc = this._zoom / 100;
		switch (curEnt.id) {
			case $anonymizer.ENTITES.CIRCLE.id:
				var radius = Math.round(curEnt.value * zc);
				var x = Math.round(width / 2);
				var y = Math.round(height / 2);
				this._drawCircle(this._entityCanvasCtx, x, y, radius);
				break;
			case $anonymizer.ENTITES.LINE.id:
				var x1 = Math.round(width * 0.2);
				var y1 = Math.round(height / 2);
				var x2 = Math.round(width * 0.8);
				// y2 = y1
				var lineWidth = Math.round(curEnt.value * zc);
				this._drawLine(this._entityCanvasCtx, x1, y1, x2, y1, lineWidth);
				break;
		}
	};
	/**
	 * Get center point for zoom, otherwise is used point with mouse wheel and cursor position.
	 *
	 * @param {Number} [x] Coordinates on canvas axe x, otherwise is used center point on axe x
	 * @param {Number} [y] Coordinates on canvas axe y, otherwise is used center point on axe y
	 * @return {Object}
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._getFromPoint = function(x, y) {
		var fromPoint = {
			x: x || Math.round(this._canWidth / 2),
			y: y || Math.round(this._canHeight / 2)
		};
		var zc = this._zoom / 100;
		var x = Math.round(this._x * zc) + fromPoint.x;
		var y = Math.round(this._y * zc) + fromPoint.y;
		fromPoint.xRatio = x / this._curWidth;
		fromPoint.yRatio = y / this._curHeight;
		return fromPoint;
	};
	/**
	 * Post zoom operation - new image dimenstions, new move zoom step.
	 * 
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._postZoom = function() {
		var zc = this._zoom / 100;
		this._curWidth = Math.round(this._img.width * zc);
		this._curHeight = Math.round(this._img.height * zc);
		if (this._zoom < 100) {
			// function for zoom and mouse move
			this._zoomMoveStep = Math.max(((100 - this._zoom) / 10 * this._opts.zoomMoveStep) / 2, 1);
		}
	};
	/**
	 * Set image center on the canvas center.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._setCenter = function() {
		this._setPosition(0.5, 0.5);
	};
	/**
	 * Set image offset position.
	 * 
	 * @param {Number} xRatio <0;1> Point position on the image
	 * @param {Number} yRatio <0;1> Point position on the image
	 * @param {Number} [x] Screen offset, otherwise center [px], axe x
	 * @param {Number} [y] Screen offset, otherwise center [px], axe y
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._setPosition = function(xRatio, yRatio, x, y) {
		x = x || this._canWidth / 2;
		y = y || this._canHeight / 2;
		xRatio = $math.setRange(xRatio, 0, 1);
		yRatio = $math.setRange(yRatio, 0, 1);
		var zc = this._zoom / 100;
		var xc = (this._curWidth * xRatio) - x;
		var yc = (this._curHeight * yRatio) - y;
		this._x = Math.max(Math.round(xc / zc), 0);
		this._y = Math.max(Math.round(yc / zc), 0);
	};
	/**
	 * Align image to the canvas - left top corner and bottom right corner.
	 *
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._alignImgToCanvas = function() {
		var maxX = Math.max(this._curWidth - this._canWidth, 0);
		var currX = Math.round(this._x * this._zoom / 100);
		if (this._x < 0) {
			this._x = 0;
		}
		else if (currX > maxX) {
			this._x = Math.round(maxX * 100 / this._zoom);
		}
		var maxY = Math.max(this._curHeight - this._canHeight, 0);
		var currY = Math.round(this._y * this._zoom / 100);
		if (this._y < 0) {
			this._y = 0;
		}
		else if (currY > maxY) {
			this._y = Math.round(maxY * 100 / this._zoom);
		}
	};
	/**
	 * It event contains right mouse click?
	 *
	 * @param {Event} e Mouse event
	 * @return {Boolean}
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._isRightClick = function(e) {
		if (e && ((e.which && e.which == 3) || (e.button && e.button == 2))) {
			return true;
		}
		else {
			return false;
		}
	};
	/**
	 * Disable context menu for canvas during right mouse click.
	 * 
	 * @param  {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._contextmenu = function(e) {
		e.stopPropagation();
		e.preventDefault();
	};
	/**
	 * Mouse wheel event.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseWheel = function(e) {
		if (!this._imgWidth && !this._imgHeight) return;
		var delta = e.wheelDelta || -e.detail;
		if (!delta) { return; }
		e.stopPropagation();
		e.preventDefault();
		var fromPoint = this._getFromPoint(e.offsetX, e.offsetY);
		if (delta > 0) {
			this._setZoom(this._zoom + this._zoomStep, fromPoint);
		}
		else {
			this._setZoom(this._zoom - this._zoomStep, fromPoint);
		}
	};
	/**
	 * Mouse down - create a circle, start of the line, start of move.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseDown = function(e) {
		if (!this._imgWidth && !this._imgHeight) return;
		e.stopPropagation();
		e.preventDefault();
		this._mouse.startXSave = e.offsetX;
		this._mouse.startYSave = e.offsetY;
		this._mouse.startX = e.offsetX;
		this._mouse.startY = e.offsetY;
		this._flags.wasMove = false;
		this._flags.wasRightClick = this._isRightClick(e);
		// circle
		if (this._opts.curEntity == $anonymizer.ENTITES.CIRCLE) {
			this._flags.wasImgMove = false;
			this._flags.wasPreview = false;
			this._canvas.addEventListener("mousemove", this._binds.mouseMove);
			this._canvas.addEventListener("mouseup", this._binds.mouseUp);
			this._canvas.addEventListener("mouseleave", this._binds.mouseUp);
		}
		// line
		else if (this._opts.curEntity == $anonymizer.ENTITES.LINE) {
			// add canvas
			var lineCanvas = document.createElement("canvas");
			lineCanvas.width = this._canWidth;
			lineCanvas.height = this._canHeight;
			lineCanvas.classList.add("line-canvas");
			this._flags.wasPreview = false;
			this._flags.wasLine = false;
			this._lineCanvas = lineCanvas;
			this._lineCanvas.addEventListener("mousemove", this._binds.mouseMoveLine);
			this._lineCanvas.addEventListener("mouseup", this._binds.mouseUpLine);
			this._lineCanvas.addEventListener("contextmenu", this._binds.contextMenu);
			if (this._flags.wasRightClick) {
				this._lineCanvas.classList.add("is-dragged");
			}
			document.addEventListener("mouseup", this._binds.mouseUpDocument);
			this._lineCanvasCtx = this._lineCanvas.getContext("2d");
			this._parent.appendChild(lineCanvas);
		}
	};
	/**
	 * Image move - according to the coordinates of the mouse.
	 * 
	 * @param  {Number} newX New value on the axe x
	 * @param  {Number} newY New value on the axe y
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._imgMove = function(newX, newY) {
		var diffX = this._mouse.startX - newX;
		var diffY = this._mouse.startY - newY;
		if (diffX == 0 && diffY == 0) {
			return;
		}
		// image movement constant
		var zms = this._zoomMoveStep > 0 ? this._zoomMoveStep : 1;
		// move image to the new coordinates
		this._x = diffX * zms + this._x;
		this._y = diffY * zms + this._y;
		this._alignImgToCanvas();
		this._redraw();
	};
	/**
	 * Mouse move over the canvas.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseMove = function(e) {
		// mouse cursor
		if (!this._flags.wasMove) {
			this._canvas.classList.add("is-dragged");
		}
		// mouse move flag
		this._flags.wasMove = true;
		// mouse move over the preview?
		var isPreview = this._isPreview(e.offsetX, e.offsetY);
		if (!this._flags.wasRightClick && !this._flags.wasImgMove && isPreview) {
			// set preview flag
			this._flags.wasPreview = true;
			// image move over the preview
			this._setPosition(isPreview.xRatio, isPreview.yRatio);
			this._alignImgToCanvas();
			this._redraw();
		}
		else if (!this._flags.wasPreview) {
			// image move - flag
			this._flags.wasImgMove = true;
			// image move
			this._imgMove(e.offsetX, e.offsetY);
		}
		// save
		this._mouse.startX = e.offsetX;
		this._mouse.startY = e.offsetY;
	};
	/**
	 * Is there a preview on coordinates x, y?
	 * 
	 * @param  {Number} x Click position on canvas, axe x
	 * @param  {Number} y Click position on canvas, axe y
	 * @return {Object} Object with percent ration or null
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._isPreview = function(x, y) {
		if (!this._opts.showPreview) return null;
		var ratio = this._imgWidth / this._imgHeight;
		// sirka a vyska nahledu
		var width = this._opts.previewWidth;
		var height = Math.round(this._opts.previewWidth / ratio);
		var left = this._opts.previewLeft;
		var top = this._opts.previewTop;
		var zc = this._zoom / 100;
		x = x || 0;
		y = y || 0;
		if (x >= left && x <= left + width && y >= top && y <= top + height) {
			return {
				xRatio: (x - left) / width,
				yRatio: (y - top) / height
			};
		}
		else {
			return null;
		}
	};
	/**
	 * Mouse up - draw a circle, end of move, preview click.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseUp = function(e) {
		var thresholdTest = false;
		// only it was move
		if (this._flags.wasMove) {
			// difference towards start click
			var diffX = this._mouse.startXSave - e.offsetX;
			var diffY = this._mouse.startYSave - e.offsetY;
			if (diffX >= this._THRESHOLD.MIN && diffX <= this._THRESHOLD.MAX && diffY >= this._THRESHOLD.MIN && diffY <= this._THRESHOLD.MAX) {
				// we are in the range
				thresholdTest = true;
			}
		}
		// click - there was no move, threshold test, it is disabled for right mouse click
		if (!this._flags.wasRightClick && (!this._flags.wasMove || thresholdTest)) {
			var isPreview = this._isPreview(e.offsetX, e.offsetY);
			if (isPreview) {
				// preview click - click coordinates on the canvas center
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			}
			else {
				// add circle
				var zc = this._zoom / 100;
				var x = Math.round(this._x * zc) + e.offsetX;
				var y = Math.round(this._y * zc) + e.offsetY;
				this._entites.push({
					id: this._opts.curEntity.id,
					value: this._opts.curEntity.value,
					xRatio: x / this._curWidth,
					yRatio: y / this._curHeight
				});
				this._redraw();
			}
		}
		this._canvas.classList.remove("is-dragged");
		this._canvas.removeEventListener("mousemove", this._binds.mouseMove);
		this._canvas.removeEventListener("mouseup", this._binds.mouseUp);
		this._canvas.removeEventListener("mouseleave", this._binds.mouseUp);
	};
	/**
	 * Mouse move over canvas - line draw.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseMoveLine = function(e) {
		// mouse move
		this._flags.wasMove = true;
		// right mouse click
		if (this._flags.wasRightClick) {
			// image move
			this._imgMove(e.offsetX, e.offsetY);
			// save
			this._mouse.startX = e.offsetX;
			this._mouse.startY = e.offsetY;
		}
		// left mouse click
		else {
			var isPreview = this._isPreview(e.offsetX, e.offsetY);
			var wasPreview = this._flags.wasPreview;
			if (!this._flags.wasLine && isPreview) {
				this._flags.wasPreview = true;
				// move over preview
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			}
			else if (!this._flags.wasPreview) {
				this._flags.wasLine = true;
				// line width
				var lineWidth = Math.round(this._opts.curEntity.value * this._zoom / 100);
				// clear
				this._lineCanvasCtx.clearRect(0, 0, this._canWidth, this._canHeight);
				// draw a line
				this._drawLine(this._lineCanvasCtx, this._mouse.startX, this._mouse.startY, e.offsetX, e.offsetY, lineWidth);
			}
			// change of state
			if (!wasPreview && this._flags.wasPreview) {
				this._lineCanvas.classList.add("is-dragged");
			}
		}
	};
	/**
	 * End of move over canvas - create line, image move.
	 * Draw a line in main canvas.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseUpLine = function(e) {
		var isPreview = null;
		if (!this._flags.wasMove) {
			isPreview = this._isPreview(e.offsetX, e.offsetY);
		}
		// only for left mouse click
		if (!this._flags.wasRightClick) {
			if (isPreview) {
				// preview click - click coordinates on the canvas center
				this._setPosition(isPreview.xRatio, isPreview.yRatio);
				this._alignImgToCanvas();
				this._redraw();
			}
			else if (this._flags.wasLine) {
				// create a line
				var zc = this._zoom / 100;
				var xc = Math.round(this._x * zc);
				var yc = Math.round(this._y * zc);
				var x = xc + this._mouse.startX;
				var y = yc + this._mouse.startY;
				var x2 = xc + e.offsetX;
				var y2 = yc + e.offsetY;
				this._entites.push({
					id: this._opts.curEntity.id,
					value: this._opts.curEntity.value,
					xRatio: x / this._curWidth,
					yRatio: y / this._curHeight,
					x2Ratio: x2 / this._curWidth,
					y2Ratio: y2 / this._curHeight
				});
				this._redraw();
			}
		}
		this._lineCanvas.classList.remove("is-dragged");
		this._lineCanvas.removeEventListener("mousemove", this._binds.mouseMoveLine);
		this._lineCanvas.removeEventListener("mouseup", this._binds.mouseUpLine);
		this._lineCanvas.removeEventListener("contextmenu", this._binds.contextMenu);
		document.removeEventListener("mouseup", this._binds.mouseUpDocument);
		this._parent.removeChild(this._lineCanvas);
		this._lineCanvas = null;
	};
	/**
	 * Mouse up over the document - drawing a line outside a canvas and mouse up -> line is canceled.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._mouseUpDocument = function(e) {
		this._flags.wasLine = false;
		this._mouseUpLine(e);
	};
	/**
	 * Set new value for zoom.
	 * 
	 * @param  {Number} value New value
	 * @param  {Object} [fromPoint] Center of the screen or data from mouse wheel
	 * @private
	 * @member $anonymizer
	 */
	$anonymizer.prototype._setZoom = function(value, fromPoint) {
		var oldZoom = this._zoom;
		var newZoom = $math.setRange(value, this._opts.minZoom, this._opts.maxZoom);
		if (newZoom == oldZoom) return;
		this._zoom = newZoom;
		this.trigger("zoom", this._zoom);
		this._postZoom();
		fromPoint = fromPoint || this._getFromPoint();
		this._setPosition(fromPoint.xRatio, fromPoint.yRatio, fromPoint.x, fromPoint.y);
		this._alignImgToCanvas();
		this._drawEntityPreview();
		this._redraw();
	};
	/**
	 * Load and show image in canvas. Returns promise after load.
	 * 
	 * @param  {String} url Path to image
	 * @return {$q} Promise
	 * @member $anonymizer
	 */
	$anonymizer.prototype.loadImage = function(url) {
		var promise = $q.defer();
		this._setWhiteCanvas();
		this._spinner.classList.remove("hide");
		var img = new Image();
		img.addEventListener("load", function() {
			this._spinner.classList.add("hide");
			this._img = img;
			this._imgWidth = img.width;
			this._imgHeight = img.height;
			this._zoom = this._opts.zoom;
			this.trigger("zoom", this._zoom);
			this._postZoom();
			this._setCenter();
			this._alignImgToCanvas();
			this._drawEntityPreview();
			this._redraw();
			promise.resolve();
		}.bind(this));
		img.addEventListener("error", function() {
			this._spinner.classList.add("hide");
			this._img = null;
			this._imgWidth = 0;
			this._imgHeight = 0;
			promise.reject();
		}.bind(this));
		img.src = url || "";
		return promise;
	};
	/**
	 * Increase zoom by one step, fires signal "zoom".
	 * 
	 * @member $anonymizer
	 */
	$anonymizer.prototype.zoomPlus = function() {
		this._setZoom(this._zoom + this._zoomStep);
	};
	/**
	 * Decrease zoom by one step, fires signal "zoom".
	 * 
	 * @member $anonymizer
	 */
	$anonymizer.prototype.zoomMinus = function() {
		this._setZoom(this._zoom - this._zoomStep);
	};
	/**
	 * Set new value for zoom.
	 * 
	 * @param  {Number} value New value
	 * @member $anonymizer
	 */
	$anonymizer.prototype.setZoom = function(value) {
		this._setZoom(value);
	};
	/**
	 * Get current draw entity ID.
	 * 
	 * @return {String}
	 * @member $anonymizer
	 */
	$anonymizer.prototype.getEntityId = function() {
		return this._opts.curEntity.id;
	};
	/**
	 * Switch to other entity, uses priority.
	 *
	 * @member $anonymizer
	 */
	$anonymizer.prototype.switchEntity = function() {
		var variants = Object.keys($anonymizer.ENTITES);
		var priority = this._opts.curEntity.priority;
		var selVariant = null;
		var lowestVariant = null;
		variants.forEach(function(variant) {
			var varObj = $anonymizer.ENTITES[variant];
			if (!selVariant && varObj.priority > this._opts.curEntity.priority) {
				selVariant = varObj;
			}
			if (!lowestVariant || varObj.priority < lowestVariant.priority) {
				lowestVariant = varObj;
			}
		}, this);
		if (!selVariant) {
			selVariant = lowestVariant;
		}
		this._opts.curEntity = selVariant;
		this._drawEntityPreview();
	};
	/**
	 * Get current entity object.
	 * 
	 * @return {Object}
	 * @member $anonymizer
	 */
	$anonymizer.prototype.getEntity = function() {
		return this._opts.curEntity;
	};
	/**
	 * Set value for current entity.
	 * 
	 * @param {Number} val New value
	 * @return {Boolean} If there was an error -> it returns false
	 * @member $anonymizer
	 */
	$anonymizer.prototype.setEntityValue = function(val) {
		val = val || 0;
		if (val >= this._opts.curEntity.min && val <= this._opts.curEntity.max) {
			this._opts.curEntity.value = val;
			this._drawEntityPreview();
			return true;
		}
		else {
			return false;
		}
	};
	/**
	 * Set circle as a selected entity.
	 *
	 * @member $anonymizer
	 */
	$anonymizer.prototype.setCircleEntity = function() {
		this._opts.curEntity = $anonymizer.ENTITES.CIRCLE;
		this._drawEntityPreview();
	};
	/**
	 * Set line as a selected entity.
	 *
	 * @member $anonymizer
	 */
	$anonymizer.prototype.setLineEntity = function() {
		this._opts.curEntity = $anonymizer.ENTITES.LINE;
		this._drawEntityPreview();
	};
	/**
	 * Take last entity and redraw a scene.
	 * 
	 * @member $anonymizer
	 */
	$anonymizer.prototype.stepBack = function() {
		if (!this._imgWidth && !this._imgHeight) return;
		this._entites.pop();
		this._redraw();
	};
	/**
	 * Remove all entites and redraw a scene.
	 * 
	 * @member $anonymizer
	 */
	$anonymizer.prototype.removeAll = function() {
		if (!this._imgWidth && !this._imgHeight) return;
		this._entites = [];
		this._redraw();
	};
	/**
	 * Export all entites on the screen and count them towards original image size.
	 * 
	 * @return {Object}
	 * @member $anonymizer
	 */
	$anonymizer.prototype.exportEntites = function() {
		var output = {
			actions: [],
			image: {
				width: this._imgWidth,
				height: this._imgHeight
			}
		};
		this._entites.forEach(function(entity) {
			switch (entity.id) {
				case $anonymizer.ENTITES.CIRCLE.id:
					output.actions.push({
						type: entity.id.toLowerCase(),
						x: Math.round(this._imgWidth * entity.xRatio),
						y: Math.round(this._imgHeight * entity.yRatio),
						r: entity.value
					});
					break;
				case $anonymizer.ENTITES.LINE.id:
					output.actions.push({
						type: entity.id.toLowerCase(),
						x1: Math.round(this._imgWidth * entity.xRatio),
						y1: Math.round(this._imgHeight * entity.yRatio),
						x2: Math.round(this._imgWidth * entity.x2Ratio),
						y2: Math.round(this._imgHeight * entity.y2Ratio),
						width: entity.value
					});
					break;
			}
		}, this);
		return output;
	};
	/**
	 * Resize canvas with new width and height.
	 * 
	 * @param  {Number} [width] New width in [px]
	 * @param  {Number} [height] New height in [px]
	 * @member $anonymizer
	 */
	$anonymizer.prototype.syncPort = function(width, height) {
		width = width || this._parent.offsetWidth;
		height = height || this._parent.offsetHeight;
		this._canWidth = width;
		this._canHeight = height;
		this._canvas.width = width;
		this._canvas.height = height;
		if (this._img) {
			this._postZoom();
			this._setCenter();
			this._alignImgToCanvas();
			this._drawEntityPreview();
			this._redraw();
		}
	};
	return $anonymizer;
}]);
/**
 * Progress loader in the application.
 * 
 * @class $loader
 */
onix.factory("$loader", [
	"$dom",
function(
	$dom
) {
	var $loader = {
		/**
		 * Create loader.
		 *
		 * @private
		 * @member $loader
		 */
		_create: function() {
			this._el = $dom.create({
				el: "div",
				"class": "loader"
			});
			// insert into the body on first position
			document.body.insertBefore(this._el, document.body.firstChild);
		},
		/**
		 * Loader init.
		 *
		 * @private
		 * @member $loader
		 */
		_init: function() {
			this._create();
		},
		/**
		 * Start loader.
		 *
		 * @member $loader
		 */
		start: function() {
			this._el.classList.add("start");
		},
		/**
		 * End loader.
		 *
		 * @member $loader
		 */
		end: function() {
			this._el.classList.remove("start");
			this._el.classList.add("end");
			setTimeout(function() {
				this._el.classList.remove("end");
				this._el.classList.add("hide");
				setTimeout(function() {
					this._el.classList.remove("hide");
				}.bind(this), 350);
			}.bind(this), 150);
		},
		/**
		 * Get spinner - DOM or object.
		 *
		 * @param {Boolean} [getObject] True for object DOM configuration for $dom; default HTML node
		 * @return {HTMLElement|Object}
		 * @member $loader
		 */
		getSpinner: function(getObject) {
			var children = [];
			for (var i = 1; i < 6; i++) {
				children.push({
					el: "div",
					"class": "rect" + i
				});
			}
			var domConf = {
				el: "div",
				"class": "spinner",
				child: children
			};
			return (getObject ? domConf : $dom.create(domConf));
		}
	};
	// loader init
	$loader._init();
	return $loader;
}]);
/**
 * $notify uses bootstrap alerts and provides additional functionality.
 * 
 * @class $notify
 */
onix.service("$notify", [
	"$common",
	"$q",
function(
	$common,
	$q
) {
	/**
	 * Create notification object from the element.
	 * 
	 * @param {HTMLElement} el
	 * @member $notify
	 */
	var $notify = function(el) {
		this._el = el;
		this._HIDE_TIMEOUT = 1500; // [ms]
		this._options = {
			"ok": "alert-success",
			"error": "alert-danger",
			"info": "alert-info",
			"warn": "alert-warning"
		};
		return this;
	};
	/**
	 * Set value to the notify element.
	 *
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 * @private
	 */
	$notify.prototype._setValue = function(txt) {
		if ($common.isElement(txt)) {
			onix.element(this._el).empty().append(txt);
		}
		else if (typeof txt === "string") {
			this._el.innerHTML = txt;
		}
	};
	/**
	 * Reset CSS classes.
	 *
	 * @member $notify
	 */
	$notify.prototype.reset = function() {
		Object.keys(this._options).forEach(function(key) {
			this._el.classList.remove(this._options[key]);
		}.bind(this));
		return this;
	};
	/**
	 * Show OK state.
	 * 
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.ok = function(txt) {
		this._el.classList.add(this._options["ok"]);
		this._setValue(txt);
		return this;
	};
	/**
	 * Show ERROR state.
	 * 
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.error = function(txt) {
		this._el.classList.add(this._options["error"]);
		this._setValue(txt);
		return this;
	};
	/**
	 * Show INFO state.
	 *
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.info = function(txt) {
		this._el.classList.add(this._options["info"]);
		this._setValue(txt);
		return this;
	};
	/**
	 * Show WARNING state.
	 *
	 * @param  {String|HTMLElement} txt
	 * @member $notify
	 */
	$notify.prototype.warn = function(txt) {
		this._el.classList.add(this._options["warn"]);
		this._setValue(txt);
		return this;
	};
	/**
	 * Hide alert after timeout and returns promise at the end of operation.
	 * Default timeout is 1500 ms.
	 *
	 * @param {Number} [timeout] Hide timeout in [ms]
	 * @return {$q}
	 * @member $notify
	 */
	$notify.prototype.hide = function(timeout) {
		var promise = $q.defer();
		setTimeout(function() {
			this.reset();
			promise.resolve();
		}.bind(this), timeout || this._HIDE_TIMEOUT);
		return promise;
	};
	/**
	 * Main public access to the notify obj.
	 *
	 * @param  {HTMLElement} el
	 * @return {$notify}
	 * @member $notify
	 */
	this.get = function(el) {
		return new $notify(el);
	};
}]);
/**
 * Class for creating img previews from File[] variable.
 * 
 * @class $previewImages
 */
onix.service("$previewImages", [
	"$q",
	"$image",
	"$dom",
	"$job",
	"$loader",
function(
	$q,
	$image,
	$dom,
	$job,
	$loader
) {
	/**
	 * Create one image preview.
	 *
	 * @private
	 * @param  {File} file
	 * @param  {Number} [maxSize] Max image size
	 * @return {Object} dom references
	 * @member $previewImages
	 */
	this._createPreview = function(file, maxSize) {
		var exported = {};
		var cont = $dom.create({
			el: "span",
			"class": ["preview-item", "preview-loading"],
			child: [{
				el: "span",
				"class": "canvas-cover",
				child: [$loader.getSpinner(true)],
				style: "height: " + (maxSize || 100) + "px",
				_exported: "canvasCover"
			}, {
				el: "span",
				"class": "title",
				innerHTML: file.name.replace(/\..*/g, "")
			}]
		}, exported);
		return {
			cont: cont,
			canvasCover: exported.canvasCover
		};
	};
	/**
	 * Create preview holders. Only for images count 4 and 7.
	 * Four images are in the one row, seven images has the last one above them.
	 *
	 * @private
	 * @param {HTMLElement} el
	 * @param {Number} count
	 * @member $previewImages
	 */
	this._createPreviewHolders = function(el, count) {
		if (!el || (count != 4 && count != 7)) return;
		var exported = {};
		// placeholder for 7 images
		if (count == 7) {
			// ceiling line
			el.appendChild($dom.create({
				el: "div",
				child: [{
					el: "span",
					_exported: "img_06"
				}]
			}, exported));
		}
		var child = [];
		var childCount = count == 7 ? 6 : 4;
		for (var i = 0; i < childCount; i++) {
			child.push({
				el: "span",
				_exported: "img_0" + i
			});
		}
		// rest line
		el.appendChild($dom.create({
			el: "div",
			child: child
		}, exported));
		for (var i = 0; i < count; i++) {
			this._dom["img_0" + i] = exported["img_0" + i];
		}
	};
	/**
	 * One job task
	 *
	 * @private
	 * @param  {Object} previewObj Object with file and preview ID
	 * @param  {Number} maxSize Max image size in px
	 * @param  {Function} jobDone Function which indicates that job is done
	 */
	this._jobTask = function(previewObj, maxSize, jobDone) {
		var file = previewObj.file;
		var previewID = previewObj.previewID;
		var preview = this._createPreview(file, maxSize);
		// append
		if (previewID in this._dom) {
			this._dom[previewID].appendChild(preview.cont);
		}
		else {
			this._dom.previewItems.appendChild(preview.cont);
		}
		$image.readFromFile(file, maxSize).then(function(readFileObj) {
			preview.cont.classList.remove("preview-loading");
			preview.canvasCover.innerHTML = "";
			preview.canvasCover.appendChild(readFileObj.canvas);
			jobDone();
		});
	};
	/**
	 * Main function for showing img previews.
	 * 
	 * @param  {HTMLElement} el Placeholder element
	 * @param  {File[]} files
	 * @param  {Object} [opts] Configuration
	 * @param  {Number} [opts.maxSize] Max image size in px; the size is used for image scale
	 * @param  {Number} [opts.count] How many images are processed simultinously
	 * @param  {Boolean} [opts.createHolder] Create placeholder, see _createPreviewHolders function
	 * @member $previewImages
	 */
	this.show = function(el, files, optsArg) {
		// clear previous
		el.innerHTML = "";
		// add class
		el.classList.add("preview-images");
		var opts = {
			maxSize: 0,
			count: 0,
			createHolder: false
		};
		for (var key in optsArg) {
			opts[key] = optsArg[key];
		}
		this._dom = {
			previewItems: el
		};
		var pictureFiles = $image.getPictureFiles(files);
		var count = pictureFiles.length;
		if (count) {
			// create placeholder?
			if (opts.createHolder) {
				this._createPreviewHolders(el, count);
			}
			var jobsArray = [];
			// sort by name, make previewID - only for 7 pictures
			pictureFiles = pictureFiles.sort(function(a, b) {
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				else 
					return 0;
			}).forEach(function(pf, ind) {
				jobsArray.push({
					task: this._jobTask,
					scope: this,
					args: [{
						file: pf,
						previewID: "img_0" + ind
					}, opts.maxSize]
				});
			}, this);
			// run jobs array
			$job.multipleJobs(jobsArray, opts.count);
		}
	};
}]);
onix.factory("$select", [
	"$common",
	"$event",
	"$dom",
function(
	$common,
	$event,
	$dom
) {
	/**
	 * $select uses bootstrap dropdown and provides additional functionality.
	 *
	 * @class $select
	 * @param {HTMLElement} el Where element has class "dropdown"
	 * @param {Object} opts
	 * @param {Boolean} opts.addCaption Add caption to select
	 * @member $select
	 */
	var $select = function(el, opts) {
		// event init
		this._eventInit();
		this._opts = {
			addCaption: false
		};
		for (var key in opts) {
			this._opts[key] = opts[key];
		}
		this._CONST = {
			CAPTION_SEL: ".dropdown-toggle",
			OPTIONS_SEL: ".dropdown-menu a",
			CARET_SEL: ".caret",
			OPEN_DROPDOWN_SEL: ".dropdown.open",
			OPEN_CLASS: "open",
			ACTIVE_CLASS: "active"
		};
		this._el = el;
		this._optinsRef = [];
		this._captionEl = null;
		this.captionTextEl = null;
		this._binds = {
			captionClick: $common.bindWithoutScope(this._captionClick, this),
			choiceClick: $common.bindWithoutScope(this._choiceClick, this),
			removeAllOpened: this._removeAllOpened.bind(this),
			click: this._click.bind(this)
		};
		this._bind();
	};
	/**
	 * Extend $select with events functionality.
	 */
	$common.inherit($select, $event);
	/**
	 * Bind clicks on the select.
	 *
	 * @member $select
	 * @private
	 */
	$select.prototype._bind = function() {
		this._bindCaption();
		this._bindChoices();
	};
	/**
	 * Bind caption el.
	 * 
	 * @member $select
	 * @private
	 */
	$select.prototype._bindCaption = function() {
		var captionEl = this._el.querySelector(this._CONST.CAPTION_SEL);
		if (captionEl) {
			// click on the caption
			captionEl.addEventListener("click", this._binds.captionClick);
			// insert span placeholder for caption
			if (this._opts.addCaption) {
				var caretEl = captionEl.querySelector(this._CONST.CARET_SEL);
				if (caretEl) {
					var captionTextEl = $dom.create({
						el: "span",
						"class": "add-caption"
					});
					captionEl.insertBefore(captionTextEl, caretEl);
					this._captionTextEl = captionTextEl;
				}
			}
		}
		this._captionEl = captionEl;
	};
	/**
	 * Remove all opened selectors -> close all.
	 *
	 * @member $select
	 * @private
	 */
	$select.prototype._removeAllOpened = function() {
		var con = this._CONST;
		// remove all
		onix.element(con.OPEN_DROPDOWN_SEL).forEach(function(item) {
			item.classList.remove(con.OPEN_CLASS);
		});
	};
	/**
	 * Outside click.
	 * 
	 * @member $select
	 * @private
	 */
	$select.prototype._click = function() {
		this._removeAllOpened();
		window.removeEventListener("click", this._binds.click);
	};
	/**
	 * Event - click on caption.
	 * 
	 * @param  {Event} e 
	 * @param  {Object} scope
	 * @member $select
	 * @private
	 */
	$select.prototype._captionClick = function(e, scope) {
		e.stopPropagation();
		var isOpen = scope._el.classList.contains(scope._CONST.OPEN_CLASS);
		scope._binds.removeAllOpened();
		if (isOpen) {
			// outside click
			window.removeEventListener("click", scope._binds.click);
		}
		else {
			// outside click
			window.addEventListener("click", scope._binds.click);
			scope._el.classList.add(scope._CONST.OPEN_CLASS);
		}
	};
	/**
	 * Bind choices inside select.
	 *
	 * @member $select
	 * @private
	 */
	$select.prototype._bindChoices = function() {
		onix.element(this._CONST.OPTIONS_SEL, this._el).forEach(function(option) {
			option.addEventListener("click", this._binds.choiceClick);
			// event ref
			this._optinsRef.push({
				el: option,
				event: "click",
				fn: this._binds.choiceClick
			});
		}, this);
	};
	/**
	 * Event - click on option.
	 * 
	 * @param  {Event} e 
	 * @param  {Object} scope
	 * @member $select
	 * @private
	 */
	$select.prototype._choiceClick = function(e, scope) {
		var con = scope._CONST;
		e.stopPropagation();
		if (!this.parentNode.classList.contains(con.ACTIVE_CLASS)) {
			// remove previously selected
			var active = this.parentNode.parentNode.querySelector("." + con.ACTIVE_CLASS);
			if (active) {
				active.classList.remove(con.ACTIVE_CLASS);
			}
			// add to the current
			this.parentNode.classList.add(con.ACTIVE_CLASS);
			scope._el.classList.remove(con.OPEN_CLASS);
			if (scope._opts.addCaption && scope._captionTextEl) {
				scope._captionTextEl.innerHTML = this.innerHTML;
			}
			// trigger click
			var value = this.getAttribute("data-value") || "";
			scope.trigger("change", value);
		}
	};
	/**
	 * Unbind choices.
	 *
	 * @member $select
	 */
	$select.prototype.unbindChoices = function() {
		if (this._optinsRef.length) {
			this._optinsRef.forEach(function(option) {
				option.el.removeEventListener(option.event, option.fn);
			});
			this._optinsRef = [];
		}
	};
	/**
	 * Rebind choices.
	 *
	 * @member $select
	 */
	$select.prototype.rebindChoices = function() {
		this.unbindChoices();
		this._bindChoices();
	};
	/**
	 * Select option from the select.
	 * 
	 * @param {Number} ind Position 0..n
	 * @member $select
	 */
	$select.prototype.selectOption = function(ind) {
		ind = ind || 0;
		var optionsCount = this._optinsRef.length;
		if (optionsCount > 0 && ind >= 0 && ind < optionsCount) {
			var el = this._optinsRef[ind].el;
			var parent = this._optinsRef[ind].el.parentNode;
			if (!parent.classList.contains(this._CONST.ACTIVE_CLASS)) {
				parent.classList.add(this._CONST.ACTIVE_CLASS);
				if (this._opts.addCaption && this._captionTextEl) {
					this._captionTextEl.innerHTML = el.innerHTML;
				}
				// trigger click
				var value = el.getAttribute("data-value") || "";
				this.trigger("change", value);
			}
		}
	};
	/**
	 * Set add caption from the current value.
	 *
	 * @member $select
	 */
	$select.prototype.setAddCaption = function() {
		if (!this._opts.addCaption) return;
		this._optinsRef.every(function(item) {
			var parent = item.el.parentNode;
			if (parent.classList.contains(this._CONST.ACTIVE_CLASS)) {
				this._captionTextEl.innerHTML = item.el.innerHTML;
				return false;
			}
			else return true;
		}, this);
	};
	return $select;
}]);
onix.factory("$slider", [
	"$dom",
	"$event",
	"$common",
function(
	$dom,
	$event,
	$common
) {
	/**
	 * Slider - slider with input for selecting numbers from the range.
	 * 
	 * @param {HTMLElement} parent Where is canvas appended
	 * @param {Object} [optsArg] Configuration
	 * @param {Number} [optsArg.min] Min value
	 * @param {Number} [optsArg.max] Max value
	 * @param {Number} [optsArg.timeout] Timeout for signal fire (keydown, move)
	 * @class $slider
	 */
	var $slider = function(parent, optsArg) {
		// event init
		this._eventInit();
		this._parent = parent;
		this._root = this._create();
		this._opts = {
			min: 0,
			max: 100,
			timeout: 333
		};
		for (var key in optsArg) {
			this._opts[key] = optsArg[key];
		}
		// selected value
		this._value = null;
		// signal change - helper
		this._signalObj = {
			id: null,
			lastValue: null
		};
		// is key down?
		this._isKeydown = false;
		parent.appendChild(this._root);
		this._binds = {
			keyUp: this._keyUp.bind(this),
			click: this._click.bind(this),
			mouseDownCaret: this._mouseDownCaret.bind(this),
			mouseMoveLineHolder: this._mouseMoveLineHolder.bind(this),
			mouseUpDocument: this._mouseUpDocument.bind(this),
			sendSignalInner: this._sendSignalInner.bind(this),
			mouseWheel: this._mouseWheel.bind(this)
		};
		this._els.input.addEventListener("keyup", this._binds.keyUp);
		this._els.tube.addEventListener("click", this._binds.click);
		this._els.caret.addEventListener("mousedown", this._binds.mouseDownCaret);
		this._els.lineHolder.addEventListener("mousemove", this._binds.mouseMoveLineHolder);
		// firefox
		this._els.lineHolder.addEventListener("DOMMouseScroll", this._binds.mouseWheel);
		// others
		this._els.lineHolder.addEventListener("mousewheel", this._binds.mouseWheel);
		// def. max value
		this.setValue(this._opts.max);
	};
	/**
	 * Extend $slider with events functionality.
	 */
	$common.inherit($slider, $event);
	/**
	 * Create slider and his children.
	 *
	 * @member $slider
	 * @private
	 */
	$slider.prototype._create = function() {
		this._els = {};
		return $dom.create({
			el: "div",
			"class": "slider",
			child: [{
				el: "input",
				type: "text",
				value: "",
				_exported: "input"
			}, {
				el: "span",
				"class": "line-holder",
				_exported: "lineHolder",
				child: [{
					el: "span",
					"class": "lh-tube",
					_exported: "tube"
				}, {
					el: "span",
					"class": "lh-caret",
					_exported: "caret"
				}]
			}]
		}, this._els);
	};
	/**
	 * Set caret position.
	 * 
	 * @param {Number} posX Value [px] caret offset accord to the start
	 * @member $slider
	 * @private
	 */
	$slider.prototype._setCaret = function(posX) {
		var width = this._els.lineHolder.offsetWidth;
		if (posX < 0) {
			posX = 0;
		}
		else if (posX > width) {
			posX = width;
		}
		this._els.caret.style.left = posX.toFixed(2) + "px";
	};
	/**
	 * Key up event from the input.
	 *
	 * @member $slider
	 * @private
	 */
	$slider.prototype._keyUp = function() {
		var inputEl = this._els.input;
		var value = parseFloat(inputEl.value);
		var errors = 0;
		if (isNaN(value)) {
			errors++;
		}
		else if (!this.setValue(value)) {
			errors++;
		}
		else {
			this._sendSignal(true);
		}
		inputEl.classList[errors ? "add" : "remove"]("error");
	};
	/**
	 * Click on tube event.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 */
	$slider.prototype._click = function(e) {
		e.stopPropagation();
		e.preventDefault();
		var width = this._els.lineHolder.offsetWidth;
		var value = e.offsetX;
		var ratio = value / width;
		// increate click range
		if (ratio <= 0.05) {
			value = 0;
		}
		else if (ratio >= 0.95) {
			value = width;
		}
		this._isKeydown = false;
		this._setCaret(value);
		this._setValue(value, true);
	};
	/**
	 * Click on the caret event, binds mouse up over the document.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseDownCaret = function(e) {
		e.stopPropagation();
		e.preventDefault();
		this._isKeydown = true;
		document.addEventListener("mouseup", this._binds.mouseUpDocument);
	};
	/**
	 * Mouse up event over the document.
	 * 
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseUpDocument = function() {
		this._isKeydown = false;
		document.removeEventListener("mouseup", this._binds.mouseUpDocument);
	};
	/**
	 * Mouse move event over line holder - only if was clicked on the caret.
	 *
	 * @param {Event} e
	 * @member $slider
	 * @private
	 */
	$slider.prototype._mouseMoveLineHolder = function(e) {
		if (!this._isKeydown) return;
		var posX = e.offsetX;
		var caretEl = this._els.caret;
		if (e.target == caretEl) {
			posX += parseFloat(caretEl.style.left) - caretEl.offsetWidth / 2;
		}
		this._setCaret(posX);
		this._setValue(posX);
	};
	/**
	 * Get value -> position convert.
	 *
	 * @param {Number} value Value in the range --> [px] position for the caret.
	 * @return {Number}
	 * @member $slider
	 * @private
	 */
	$slider.prototype._getPosFromValue = function(value) {
		value = value || this._value;
		var width = this._els.lineHolder.offsetWidth;
		var range = this._opts.max - this._opts.min;
		var posX = (value - this._opts.min) / range * width;
		return posX;
	};
	/**
	 * Set value using caret position. Fires signal "change".
	 *
	 * @param {Number} posX Value on the axe x
	 * @param {Boolean} [fromClick] It was called from click method?
	 * @member $slider
	 * @private
	 */
	$slider.prototype._setValue = function(posX, fromClick) {
		posX = posX || 0;
		var width = this._els.lineHolder.offsetWidth;
		var range = this._opts.max - this._opts.min;
		if (posX < 0) {
			posX = 0;
		}
		else if (posX > width) {
			posX = width;
		}
		var value = Math.round(posX / width * range + this._opts.min);
		this._value = value;
		this._els.input.value = value;
		this._sendSignal(!fromClick);
	};
	/**
	 * Delayed sending of signal.
	 *
	 * @param {Boolean} [withTimeout] Send with timeout?
	 * @member $slider
	 * @private
	 */
	$slider.prototype._sendSignal = function(withTimeout) {
		if (this._signalObj.id) {
			clearTimeout(this._signalObj.id);
			this._signalObj.id = null;
		}
		if (withTimeout) {
			this._signalObj.id = setTimeout(this._binds.sendSignalInner, this._opts.timeout);
		}
		else {
			this._sendSignalInner();
		}
	};
	/**
	 * Mouse wheel event.
	 *
	 * @param {Event} e Mouse event
	 * @private
	 * @member $slider
	 */
	$slider.prototype._mouseWheel = function(e) {
		var delta = e.wheelDelta || -e.detail;
		if (!delta) { return; }
		e.stopPropagation();
		e.preventDefault();
		if (delta > 0) {
			this.setValue(this._value + 1);
			this._sendSignal();
		}
		else {
			this.setValue(this._value - 1);
			this._sendSignal();
		}
	};
	/**
	 * Delayed sending of signal - inner method.
	 *
	 * @member $slider
	 * @private
	 */
	$slider.prototype._sendSignalInner = function() {
		if (this._value == this._signalObj.lastValue) return;
		this._signalObj.lastValue = this._value;
		this.trigger("change", this._value);
	};
	/**
	 * Set slider value.
	 * 
	 * @param {Number} value New value
	 * @return {Boolean} If there was error, it returns false
	 * @member $slider
	 */
	$slider.prototype.setValue = function(value) {
		if (typeof value === "number" && value >= this._opts.min && value <= this._opts.max) {
			this._value = value;
			this._els.input.value = value;
			this._setCaret(this._getPosFromValue(value));
			return true;
		}
		else {
			return false;
		}
	};
	/**
	 * Get slider value.
	 * 
	 * @return {Number}
	 * @member $slider
	 */
	$slider.prototype.getValue = function() {
		return this._value;
	};
	/**
	 * Overwrite configuration object.
	 *
	 * @param {Object} optsArg See constructor.
	 * @member $slider
	 */
	$slider.prototype.rewriteOpts = function(optsArg) {
		for (var key in optsArg) {
			this._opts[key] = optsArg[key];
		}
		if (this._value < this._opts.min || this._value > this._opts.max) {
			this._value = this._opts.max;
		}
		this.setValue(this._value);
	};
	return $slider;
}]);
onix.factory("$crop", [
	"$dom",
	"$math",
function(
	$dom,
	$math
) {
	/**
	 *
	 * Crop - this class is used for selection crop above the image/element.
	 * 
	 * @param {Object} [options] Configuration
	 * @param {Number} [options.canWidth] Canvas width
	 * @param {Number} [options.canHeight] Canvas height
	 * @param {Number} [options.zoom = 100] start zoom in [%]
	 * @param {Number} [options.minZoom = 20] min zoom in [%]
	 * @param {Number} [options.maxZoom = 100] max zoom in [%]
	 * @param {Number} [options.zoomStep = 10] How many [%] add/dec with zoom change
	 * @param {Number} [options.zoomMoveStep = 1] Under 100% multiplier for faster image movement
	 * @param {Object} [options.curEntity = $anonymizer.ENTITES.CIRCLE] Start entity from $anonymizer.ENTITES
	 * @param {Number} [options.showPreview = true] Show preview - image overview
	 * @param {Number} [options.previewLeft = 17] Preview location from left top corner, axe x [px]
	 * @param {Number} [options.previewTop = 17] Preview location from left top corner, axe y [px]
	 * @param {Number} [options.previewWidth = 200] Preview image width [px]
	 * @class $crop
	 */
	var $crop = function(options) {
		this._CONST = {
			HIDE_CLASS: "hide"
		};
		this._options = {
			width: 250, // initial size
			height: 250,
			minWidth: 10,
			minHeight: 10, // always higher than 0! if resizable=true
			maxWidth: Infinity,
			maxHeight: Infinity,
			resizable: true,
			aspectRatio: null
		};
		for (var op in options) {
			this._options[op] = options[op];
		}
		// areas dimensions
		this._dim = {
			areaWidth: 0,
			areaHeight: 0,
			width: this._options.width,
			height: this._options.height
		};
		this._changed = false;
		this._backupData = null;
		this._groups = {
			"point-nw": [{ type: "nw", x: true, y: true }, { type: "sw", x: true }, { type: "ne", y: true }],
			"point-ne": [{ type: "ne", x: true, y: true }, { type: "se", x: true }, { type: "nw", y: true }],
			"point-sw": [{ type: "sw", x: true, y: true }, { type: "nw", x: true }, { type: "se", y: true }],
			"point-se": [{ type: "se", x: true, y: true }, { type: "ne", x: true }, { type: "sw", y: true }]
		};
		this._points = { nw: { x: 0, y: 0 }, ne: { x: 0, y: 0 }, sw: { x: 0, y: 0 }, se: { x: 0, y: 0 }};
		this._type = null;
		this._mouse = {
			startXSave: 0,
			startYSave: 0,
			startX: 0,
			startY: 0
		};
		this._binds = {
			mouseDown: this._mouseDown.bind(this),
			mouseMove: this._mouseMove.bind(this),
			mouseUp: this._mouseUp.bind(this)
		};
		this._dom = {};
		this._create();
		// set center
		this.setCenter();
		// crop is by default hidden
		this.hide();
	};
	/**
	 * Create crop element.
	 * 
	 * @return {Element}
	 * @member $crop
	 * @private
	 */
	$crop.prototype._create = function() {
		var cropClass = ["crop"];
		if (this._options.resizable) {
			cropClass.push("resizable");
		}
		$dom.create({
			el: "div",
			"class": cropClass,
			child: [{
				el: "div",
				"class": "crop-top",
				child: [{
					el: "span",
					"class": "point-nw"
				}, {
					el: "span",
					"class": "point-ne"
				}],
				_exported: "cropTop"
			}, {
				el: "div",
				"class": "crop-bottom",
				child: [{
					el: "span",
					"class": "point-sw"
				}, {
					el: "span",
					"class": "point-se"
				}],
				_exported: "cropBottom"
			}, {
				el: "div",
				"class": "crop-left",
				_exported: "cropLeft"
			}, {
				el: "div",
				"class": "crop-right",
				_exported: "cropRight"
			}, {
				el: "div",
				"class": "crop-middle",
				_exported: "cropMiddle"
			}],
			_exported: "container"
		}, this._dom);
		this._dom.container.addEventListener("mousedown", this._binds.mouseDown);
	};
	/**
	 * Set crop center above his area.
	 *
	 * @private
	 * @member $crop
	 */
	$crop.prototype._setCenter = function() {
		var width = this._dim.width;
		var height = this._dim.height;
		var leftDiff = Math.round((this._dim.areaWidth - width) / 2);
		var topDiff = Math.round((this._dim.areaHeight - height) / 2);
		var p = this._points;
		p.nw.x = leftDiff;
		p.nw.y = topDiff;
		p.ne.x = p.nw.x + width;
		p.ne.y = p.nw.y + height;
		p.sw.x = this._dim.areaWidth - leftDiff;
		p.sw.y = this._dim.areaHeight - topDiff;
		p.se.x = p.ne.x;
		p.se.y = p.ne.y;
	};
	/**
	 * Align crop points inside his area.
	 * 
	 * @private
	 * @member $crop
	 */
	$crop.prototype._alignPoints = function() {
		var p = this._points;
		p.nw.x = $math.setRange(p.nw.x, 0, this._dim.areaWidth - this._dim.width);
		p.sw.x = $math.setRange(p.sw.x, 0, this._dim.areaWidth - this._dim.width);
		p.ne.x = $math.setRange(p.ne.x, this._dim.width, this._dim.areaWidth);
		p.se.x = $math.setRange(p.se.x, this._dim.width, this._dim.areaWidth);
		p.nw.y = $math.setRange(p.nw.y, 0, this._dim.areaHeight - this._dim.height);
		p.ne.y = $math.setRange(p.ne.y, 0, this._dim.areaHeight - this._dim.height);
		p.sw.y = $math.setRange(p.sw.y, this._dim.height, this._dim.areaHeight);
		p.se.y = $math.setRange(p.se.y, this._dim.height, this._dim.areaHeight);
	};
	/**
	 * Redraw crop - calculate all his points and set them in dom objects.
	 * 
	 * @private
	 * @member $crop
	 */
	$crop.prototype._redraw = function() {
		var p = this._points;
		var leftX = p.nw.x;
		var leftY = p.nw.y;
		var size = this._getSize();
		this._dom.cropTop.style.left = leftX + "px";
		this._dom.cropTop.style.width = size.width + "px";
		this._dom.cropTop.style.height = leftY + "px";
		this._dom.cropBottom.style.left = leftX + "px";
		this._dom.cropBottom.style.width = size.width + "px";
		this._dom.cropBottom.style.height = (this._dim.areaHeight - p.sw.y) + "px";
		this._dom.cropLeft.style.width = leftX + "px";
		this._dom.cropLeft.style.height = this._dim.areaHeight + "px";
		this._dom.cropRight.style.width = (this._dim.areaWidth - p.ne.x) + "px";
		this._dom.cropRight.style.height = this._dim.areaHeight + "px";
		this._dom.cropMiddle.style.width = size.width + "px";
		this._dom.cropMiddle.style.height = size.height + "px";
		this._dom.cropMiddle.style.left = leftX + "px";
		this._dom.cropMiddle.style.top = leftY + "px";
	};
	/**
	 * Mouse down - move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 */
	$crop.prototype._mouseDown = function(e) {
		e.stopPropagation();
		e.preventDefault();
		var target = e ? e.target : null;
		this._type = target.getAttribute("class");
		switch (this._type) {
			case "crop-top":
			case "crop-bottom":
			case "crop-left":
			case "crop-right":
				return;
		}
		// save values during click
		this._mouse.startX = e.clientX;
		this._mouse.startY = e.clientY;
		this._mouse.startXSave = e.clientX;
		this._mouse.startYSave = e.clientY;
		document.addEventListener("mousemove", this._binds.mouseMove);
		document.addEventListener("mouseup", this._binds.mouseUp);
	};
	/**
	 * Mouse move - move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 */
	$crop.prototype._mouseMove = function(e) {
		e.stopPropagation();
		e.preventDefault();
		var diffX =  e.clientX - this._mouse.startX;
		var diffY = e.clientY - this._mouse.startY;
		if (this._type == "crop-middle") {
			// move
			Object.keys(this._points).forEach(function(key) {
				this._points[key].x += diffX;
				this._points[key].y += diffY;
			}, this);
			this._alignPoints();
			this._redraw();
		}
		else {
			// resize - which group?
			var group = this._groups[this._type];
			if (this._options.aspectRatio) {
				diffY = diffX / this._options.aspectRatio * (this._type == "point-nw" || this._type == "point-se" ? 1 : -1);
			}
			if (this._resizeTest(diffX, diffY, group)) {
				group.forEach(function(i) {
					var point = this._points[i.type];
					// add diffx, diffy to all group members
					point.x += i.x ? diffX : 0;
					point.y += i.y ? diffY : 0;
				}, this);
				// update size
				var size = this._getSize();
				this._dim.width = size.width;
				this._dim.height = size.height;
				this._redraw();
			}
		}
		// overwrite
		this._mouse.startX = e.clientX;
		this._mouse.startY = e.clientY;
	};
	/**
	 * Mouse up - end of move/resize crop.
	 * 
	 * @param  {Event} e
	 * @private
	 * @member $crop
	 */
	$crop.prototype._mouseUp = function(e) {
		e.stopPropagation();
		e.preventDefault();
		document.removeEventListener("mousemove", this._binds.mouseMove);
		document.removeEventListener("mouseup", this._binds.mouseUp);
		if (this._mouse.startXSave != e.clientX || this._mouse.startYSave != e.clientY) {
			// crop was changed
			this._changed = true;
		}
	};
	/**
	 * Get size of crop.
	 * 
	 * @param  {Object} [points] Points object, default is used crop points.
	 * @return {Object}
	 * @member $crop
	 */
	$crop.prototype._getSize = function(points) {
		points = points || this._points;
		return {
			width: Math.abs(points.ne.x - points.nw.x),
			height: Math.abs(points.sw.y - points.nw.y)
		};
	};
	/**
	 * Resize test - if returns false, crop size is on the edge of the area.
	 * 
	 * @param  {Number} diffX Increment on axe X
	 * @param  {Number} diffY Increment on axe Y
	 * @param  {Array[Object]} group Selected group from mouse down
	 * @return {Boolean} false - error
	 * @member $crop
	 */
	$crop.prototype._resizeTest = function(diffX, diffY, group) {
		if (!this._options.aspectRatio) {
			return false;
		}
		var points = {
			nw: {
				x: this._points.nw.x,
				y: this._points.nw.y
			},
			ne: {
				x: this._points.ne.x,
				y: this._points.ne.y
			},
			sw: {
				x: this._points.sw.x,
				y: this._points.sw.y
			},
			se: {
				x: this._points.se.x,
				y: this._points.se.y
			}
		}
		group.forEach(function(i) {
			var point = points[i.type];
			// add diffx, diffy to all group members
			point.x = this._points[i.type].x + (i.x ? diffX : 0);
			point.y = this._points[i.type].y + (i.y ? diffY : 0);
		}, this);
		// min. and max. value
		var size = this._getSize(points);
		// test
		if (
			size.width < this._options.minWidth || size.width > this._options.maxWidth ||
			size.height < this._options.minHeight || size.height > this._options.maxHeight ||
			points.nw.x < 0 || points.se.x > this._dim.areaWidth ||
			points.nw.y < 0 || points.sw.y > this._dim.areaHeight
		) {
			return false;
		}
		else {
			return true;
		}
	};
	/**
	 * Set crop center above his area.
	 * 
	 * @member $crop
	 */
	$crop.prototype.setCenter = function() {
		this._setCenter();
		this._redraw();
	};
	/**
	 * Remove crop from DOM.
	 * 
	 * @member $crop
	 */
	$crop.prototype.destroy = function() {
		var c = this.getContainer();
		if (c.parentNode) {
			c.parentNode.removeChild(c);
		}
	};
	/**
	 * Get crop root el.
	 * 
	 * @return {HTMLElement}
	 * @member $crop
	 */
	$crop.prototype.getContainer = function() {
		return this._dom.container;
	};
	/**
	 * Set crop dimensions.
	 * 
	 * @param {Object} dim
	 * @param {Number} dim.width Area width
	 * @param {Number} dim.height Area height
	 * @member $crop
	 */
	$crop.prototype.setDim = function(dim) {
		if (!dim) {
			return;
		}
		var areaWidth = dim.width;
		var areaHeight = dim.height;
		this._dim.areaWidth = areaWidth;
		this._dim.areaHeight = areaHeight;
		this._dom.container.style.width = areaWidth + "px";
		this._dom.container.style.height = areaHeight + "px";
		var width = Math.min(this._dim.width, this._dim.areaWidth);
		var height = Math.min(this._dim.height, this._dim.areaHeight);
		if (this._options.aspectRatio) {
			height = Math.round(width / this._options.aspectRatio);
		}
		this._dim.width = width;
		this._dim.height = height;
		this.setCenter();
	};
	/**
	 * Show crop.
	 *
	 * @member $crop
	 */
	$crop.prototype.show = function() {
		this._dom.container.classList.remove(this._CONST.HIDE_CLASS);
	};
	/**
	 * Hide crop.
	 *
	 * @member $crop
	 */
	$crop.prototype.hide = function() {
		this._dom.container.classList.add(this._CONST.HIDE_CLASS);
	};
	/**
	 * Is crop visible?
	 * 
	 * @return {Boolean}
	 * @member $crop
	 */
	$crop.prototype.isVisible = function() {
		return !(this._dom.container.classList.contains(this._CONST.HIDE_CLASS));
	};
	/**
	 * Is crop changed?
	 * 
	 * @return {Boolean}
	 * @member $crop
	 */
	$crop.prototype.isChanged = function() {
		return this._changed;
	};
	/**
	 * Backup current crop state - his position and change state.
	 * 
	 * @member $crop
	 */
	$crop.prototype.backup = function() {
		this._backupData = {
			changed: this._changed,
			aabb: this.getAABB()
		};
	};
	/**
	 * Restore crop saved state - his position and change state.
	 * 
	 * @member $crop
	 */
	$crop.prototype.restore = function() {
		if (this._backupData) {
			this._changed = this._backupData.changed;
			var aabb = this._backupData.aabb;
			var nw = this._points["nw"];
			var ne = this._points["ne"];
			var sw = this._points["sw"];
			var se = this._points["se"];
			// restore
			nw.x = aabb[0];
			nw.y = aabb[1];
			se.x = aabb[2];
			se.y = aabb[3];
			ne.x = se.x;
			ne.y = nw.y;
			sw.x = nw.x;
			sw.y = se.y;
			this._redraw();
			this._backupData = null;
		}
	};
	/**
	 * Get crop bounding box.
	 * 
	 * @param {Number} [scale=1] Recalculate all positions using scale constants, def. is 1
	 * @return {Array} [x1, y1, x2, y2] 2 points coordinates from top left corner
	 * @member $crop
	 */
	$crop.prototype.getAABB = function(scale) {
		var nw = this._points["nw"];
		var se = this._points["se"];
		scale = scale || 1.0;
		return [
			Math.round(nw.x * scale),
			Math.round(nw.y * scale),
			Math.round(se.x * scale),
			Math.round(se.y * scale)
		];
	};
	return $crop;
}]);
