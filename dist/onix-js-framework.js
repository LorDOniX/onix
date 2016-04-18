(function() {
	Event = Event || window.Event;

	Event.prototype.stopPropagation = Event.prototype.stopPropagation || function() {
		this.cancelBubble = true;
	};

	Event.prototype.preventDefault = Event.prototype.preventDefault || function () {
		this.returnValue = false;
	};
})();

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
;(function() {

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
;onix = (function() {
	/**
	 * Main framework object.
	 * 
	 * @class onix
	 */
	var onix = function() {
		/**
		 * All objects
		 *
		 * @type {Array}
		 * @member onix
		 * @private
		 */
		this._allObj = [];

		/**
		 * All processed objects
		 *
		 * @type {Object}
		 * @member onix
		 * @private
		 */
		this._objects = {};

		/**
		 * Config name
		 *
		 * @member onix
		 * @private
		 */
		this._CONFIG_NAME = "$config";
	};

	/**
	 * App types
	 *
	 * @property {Object}
	 * @param {Number} SERVICE
	 * @param {Number} FACTORY
	 * @param {Number} CONSTANT
	 * @param {Number} RUN
	 * @member onix
	 */
	onix.TYPES = {
		SERVICE: 1,
		FACTORY: 2,
		CONSTANT: 3,
		RUN: 4
	};

	/**
	 * Init function
	 *
	 * @member onix
	 */
	onix.prototype.init = function() {
		// pred DOM loadem
		this._objects[this._CONFIG_NAME] = {};

		document.addEventListener("DOMContentLoaded", this._domLoad.bind(this));
	};


	/**
	 * Dependency injection bind
	 *
	 * @param  {Function|Array} param
	 * @param  {Object} [replace]
	 * @return {Object}
	 * @member onix
	 */
	onix.prototype.bindDI = function(param, replace) {
		var fn;
		var args = [];

		replace = replace || {};

		if (Array.isArray(param)) {
			param.every(function(item) {
				if (typeof item === "function") {
					fn = item;
					return false;
				}
				else {
					args.push(item in replace ? replace[item] : this._objects[item]);
				}

				return true;
			}, this);
		}
		else {
			fn = param;
		}

		/**
		 * Run new binded function - with the new
		 * 
		 * @param  {Function|Object} [scope] 
		 * @param  {Boolean} [callWithNew] 
		 * @return {Function}
		 */
		return function(scope, callWithNew) {
			if (callWithNew) {
				var obj = Object.create(fn.prototype);
				fn.apply(obj, args);
				return obj;
			}
			else {
				return fn.apply(scope || fn, args);
			}
		};
	};

	/**
	 * Event - Dom LOAD
	 *
	 * @member onix
	 * @private
	 */
	onix.prototype._domLoad = function() {
		var runs = [];

		// process all inner items
		this._allObj.forEach(function(item) {
			// only 2 types
			switch (item.type) {
				case onix.TYPES.SERVICE:
					this._objects[item.name] = this.bindDI(item.param)(null, true);
					break;

				case onix.TYPES.FACTORY:
					this._objects[item.name] = this.bindDI(item.param)();
					break;

				case onix.TYPES.CONSTANT:
					this._objects[item.name] = item.param;
					break;

				case onix.TYPES.RUN:
					runs.push(item.param);
					break;
			}
		}, this);

		// delete them
		this._allObj.length = 0;

		// onix main run
		this.bindDI(this._run)(this);

		// run all runs
		runs.forEach(function(run) {
			this.bindDI(run)();
		}, this);

		//testTempl
	};

	/**
	 * Main access point in the framework
	 *
	 * @member onix
	 * @private
	 */
	onix.prototype._run = [
		"$i18n",
		"$template",
		"$loader",
		"$route",
		"$myQuery",
	function(
		$i18n,
		$template,
		$loader,
		$route,
		$myQuery
	) {
		/**
		 * Quick acces to myQuery and DOM manipulation
		 *
		 * @param  {String|HTMLElement|Array} value
		 * @param {HTMLElement} [parent]
		 * @return {$myQuery}
		 * @member onix
		 * @property {Function}
		 */
		this.element = function(value, parent) {
			return new $myQuery.get(value, parent);
		};

		// inits
		$loader.init();
		$template.init();

		/**
		 * Get text function. Translate for the current language and the key.
		 *
		 * @param  {String} key
		 * @param  {Object} [replace] Replace all {} in the string
		 * @return {String}
		 * @member window
		 * @property {Function}
		 */
		window._ = $i18n._.bind($i18n);
	}];

	/**
	 * Read/add config to the onix application.
	 *
	 * @param  {Object|String} obj
	 * @member onix
	 */
	onix.prototype.config = function(obj) {
		if (typeof obj === "string") {
			// obj is key
			return this._objects[this._CONFIG_NAME][obj];
		}
		else if (typeof obj === "object") {
			Object.keys(obj).forEach(function(key) {
				this._objects[this._CONFIG_NAME][key] = obj[key];
			}.bind(this));
		}
	};

	/**
	 * Add service to the application.
	 *
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member onix
	 */
	onix.prototype.service = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: onix.TYPES.SERVICE
		});
	};

	/**
	 * Add factory to the application.
	 *
	 * @param  {String} name 
	 * @param  {Function|Array} param
	 * @member onix
	 */
	onix.prototype.factory = function(name, param) {
		this._allObj.push({
			name: name,
			param: param,
			type: onix.TYPES.FACTORY
		});
	};

	/**
	 * Add new constant
	 * 
	 * @param  {String} name
	 * @param  {Object} param
	 * @member onix
	 */
	onix.prototype.constant = function(name, obj) {
		this._allObj.push({
			name: name,
			param: obj,
			type: onix.TYPES.CONSTANT
		});
	};

	/**
	 * Add a new run
	 * 
	 * @param  {Array|Function} param With DI
	 * @member onix
	 */
	onix.prototype.run = function(param) {
		this._allObj.push({
			param: param,
			type: onix.TYPES.RUN
		});
	};

	/**
	 * Get object
	 *
	 * @param  {String} name
	 * @return {Function|Object} 
	 * @member onix
	 */
	onix.prototype.getObject = function(name) {
		name = name || "";

		return this._objects[name];
	};

	/**
	 * Empty function
	 *
	 * @member onix
	 */
	onix.prototype.noop = function() {

	};

	/**
	 * Framework info.
	 *
	 * @member onix
	 */
	onix.prototype.info = function() {
		console.log(
			"Onix JS Framework\n" +
			"Version: 2.2.0\n" +
			"Date: 18. 4. 2016"
		);
	};

	var onixInst = new onix();

	// init app
	onixInst.init();

	return onixInst;
})();
;/**
 * Main framework configuration
 * 
 * @class CONFIG
 */
onix.config({
	/**
	 * Template delimiter
	 *
	 * @type {Object}
	 * @member CONFIG
	 */
	TMPL_DELIMITER: {
		LEFT: "{{",
		RIGHT: "}}"
	}
});
;/**
 * @class $localStorage
 *
 * Cover class for localStorage
 */
onix.service("$localStorage", function() {
	this._disable = !("localStorage" in window);

	/**
	 * Set value to localStorage
	 *
	 * @param {String} key
	 * @param {String} [value]
	 * @member $localStorage
	 */
	this.set = function(key, value) {
		if (this._disable || !key) return;

		localStorage.setItem(key, value);
	};

	/**
	 * Get value from localStorage
	 *
	 * @param {String} key
	 * @return {String}
	 * @member $localStorage
	 */
	this.get = function(key) {
		if (this._disable || !key) return null;

		return localStorage.getItem(key);
	};

	/**
	 * Remove key from localStorage
	 *
	 * @param {String} key
	 * @return {Boolean}
	 * @member $localStorage
	 */
	this.remove = function(key) {
		if (this._disable || !key) return null;

		return localStorage.removeItem(key);
	};
});
;onix.factory("$q", function() {
	/**
	 * @class $q
	 *
	 * Promise implementation which is similar to angular $q
	 */
	var $promise = function() {
		/**
		 * Promise states
		 *
		 * @member $q
		 * @private
		 */
		this._E_STATES = {
			IDLE: 0,
			RESOLVED: 1,
			REJECTED: 2
		};

		// current state
		this._state = this._E_STATES.IDLE;

		// all funcs
		this._funcs = [];

		// done data
		this._finishData = null;
	};

	/**
	 * Resolve all functions
	 *
	 * @param  {Boolean} isError
	 * @member $q
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
		this._state = isError ? this._E_STATES.REJECTED : this._E_STATES.RESOLVED;
	};

	/**
	 * Is promise already finished?
	 *
	 * @return {Boolean}
	 * @member $q
	 * @private
	 */
	$promise.prototype._isAlreadyFinished = function() {
		if (this._state != this._E_STATES.IDLE) {
			this._resolveFuncs(this._state == this._E_STATES.REJECTED);
		}
	};

	/**
	 * Resolve promise using obj
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$promise.prototype.resolve = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(false);
	};

	/**
	 * Reject promise using obj
	 *
	 * @param  {Object} obj
	 * @member $q
	 */
	$promise.prototype.reject = function(obj) {
		this._finishData = obj;
		this._resolveFuncs(true);
	};

	/**
	 * After promise resolve/reject call then (okFn, errorFn)
	 *
	 * @chainable
	 * @param {Function} [cbOk]
	 * @param {Function} [cbError]
	 * @member $q
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
	 * After promise resolve call then cbOk
	 *
	 * @chainable
	 * @param  {Function} cbOk
	 * @member $q
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
	 * After promise reject call then cbError
	 *
	 * @chainable
	 * @param  {Function} cbError
	 * @member $q
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
	 * Finally for promise
	 *
	 * @chainable
	 * @param  {Function} cb
	 * @member $q
	 */
	$promise.prototype["finally"] = function(cb) {
		this._funcs.push({
			fn: cb,
			"finally": true
		});

		this._isAlreadyFinished();

		return this;
	};
	
	return {
		/**
		 * Resolve all promises in the array
		 *
		 * @param {$q[]} promises
		 * @return {$q}
		 * @member $q
		 */
		all: function(promises) {
			var promise = new $promise();

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
		 * Deferable object of the promise
		 *
		 * @return {$q}
		 * @member $q
		 */
		defer: function() {
			return new $promise();
		}
	};
});
;onix.factory("$job", [
	"$q",
function(
	$q
) {
	/**
 	 * @class $job
 	 *
 	 * Factory for manage multiple tasks
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
	 * Add task to JOB
	 * 
	 * @param {Function} task 
	 * @param {Function|Object} [scope]
	 * @param {Object} [args] Add params
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

		// kvuli pop
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
	 * Set progress function, which will be called after each task will be done
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
		 * Factory for creating new Job
		 *
		 * @member $job
		 */
		create: function() {
			return new $job();
		}
	};
}]);
;onix.factory("$myQuery", function() {
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
			this._els = parent.querySelectorAll(value);
		}
		else if (Array.isArray(value)) {
			this._els = value;
		}
		else {
			// node element todo
			this._els.push(value);
		}

		return this;
	};

	/**
	 * Operation on elements
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
	 * @param  {String} [newValue]
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
	 * Get or set attribute
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
	 * Get or set src
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.src = function(newValue) {
		return this._setGetAll(newValue, "src");
	};

	/**
	 * Hide element
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
	 * Show element
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
	 * Get or set value
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
	 * Get or set HTML
	 * 
	 * @param  {String} [newValue]
	 * @return {String}
	 * @member $myQuery
	 */
	$myQuery.prototype.html = function(newValue) {
		return this._setGetAll(newValue, "innerHTML");
	};

	/**
	 * Append another element to this one
	 * TODO: cannot use on n elements
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
	 * Add CSS class
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
	 * Remove CSS class
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
	 * Toggle CSS class
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
	 * Get width
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
	 * Get height
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
	 * Click event
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
	 * Change event
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
	 * Foreach
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
	 * Remove element
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
	 * Prepend element
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
	 * Get all elements length
	 * 
	 * @return {Number}
	 * @member $myQuery
	 */
	$myQuery.prototype.len = function() {
		return this._els.length;
	};

	return {
		 /**
		 * Main cover function
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
;/**
 * @class $dom
 *
 * Class for creating DOM elements and getting their references.
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
	 * @param  {String|Array} els     els = "" -> element; array [] -> {...}
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
;/**
 * @class $location
 *
 * Support class for location operations.
 */
onix.service("$location", function() {
	// ------------------------ public ----------------------------------------
	
	/**
	 * Page refresh
	 *
	 * @member $location
	 */
	this.refresh = function() {
		window.location.reload();
	};

	/**
	 * Create a new search url
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
	 * Get or set new url search. obj -> set new url from obj; !obj -> create obj from search part of url
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
	 * Get current location
	 *
	 * @return {String}
	 * @member $location
	 */
	this.get = function() {
		return window.location.pathname;
	};
	
});
;/**
 * @class $common
 *
 * Commom functions used in whole application.
 */
onix.service("$common", [
	"$q",
function(
	$q
) {
	/**
	 * Object copy, from source to dest
	 *
	 * @param  {Object} dest
	 * @param  {Object} source
	 * @member $common
	 * @private
	 */
	this._objCopy = function(dest, source) {
		Object.keys(source).forEach(function(prop) {
			if (source.hasOwnProperty(prop)) {
				var sourceVal = source[prop];
				var sourceType = typeof sourceVal;

				// array
				if (Array.isArray(sourceVal)) {
					// array - copy object to another array - keep referencings on array, objects
					var newArray = [];

					sourceVal.forEach(function(item) {
						newArray.push(item);
					});

					dest[prop] = newArray;
				}
				// not null and object
				else if (sourceVal && sourceType === "object") {
					// recursive copy
					if (!(prop in dest)) {
						dest[prop] = {};
 					}

					this._objCopy(dest[prop], sourceVal);
				}
				else {
					// string, numbers, functions
					dest[prop] = sourceVal;
				}
			}
		}.bind(this));
	};

	/**
	 * Get cookie by her name
	 *
	 * @param  {String} name
	 * @return {String}
	 * @member $common
	 * @private
	 */
	this.getCookie = function(name) {
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
	 * Create one object from arguments
	 *
	 * @param  {Object|Function} mainObj
	 * @param  {Object|Function|Array} a data | dependicies
	 * @param  {Object|Function} [b] data | dependicies
	 * @return {Object}
	 * @member $common
	 */
	this.create = function(mainObj, a, b) {
		var args = [];

		if (a && b && Array.isArray(a)) {
			// a == dependicies
			// b == data

			// arguments
			a.forEach(function(item) {
				args.push(onix.getObject(item));
			});
		}

		// data
		args.push(mainObj);

		// data override
		args.push(b || a);

		return this.merge.apply(this, args);
	};

	/**
	 * Merge multiple objects into the single one
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
	 * Bind function arguments without scope
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
	 * Reverse for each
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
	 * HEX value to DEC
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
	 * HEX value to RGB
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
}]);
;/**
 * @class $notify
 *
 * $notify uses bootstrap alerts and provides additional functionality
 */
onix.service("$notify", [
	"$common",
	"$q",
function(
	$common,
	$q
) {
	/**
	 * Create notification object from the element
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
	 * Set value to the notify element
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
	 * Reset CSS classes
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
	 * Show OK state
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
	 * Show ERROR state
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
	 * Show INFO state
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
	 * Show WARNING state
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
	 * Hide alert after timeout and returns promise at the end of operation
	 *
	 * @return {$q}
	 * @member $notify
	 */
	$notify.prototype.hide = function() {
		var promise = $q.defer();

		setTimeout(function() {
			this.reset();
			
			promise.resolve();
		}.bind(this), this._HIDE_TIMEOUT);

		return promise;
	};

	/**
	 * Main public access to the notify obj
	 *
	 * @param  {HTMLElement} el
	 * @return {$notify}
	 * @member $notify
	 */
	this.get = function(el) {
		return new $notify(el);
	};
}]);
;onix.factory("$event", [
	"$common",
function(
	$common
) {
	/**
 	 * @class $event
 	 *
 	 * This class is used for extending existing objects and brings signal functionality.
 	 */
	return {
		/**
		 * All events. { name: name, event: function, scope, [once] }
		 * 
		 * @type {Array}
		 * @member $event
		 * @private
		 */
		_allEvents: [],

		/**
		 * Get all events by his name.
		 * 
		 * @param  {String} name 
		 * @return {Array}
		 * @member $event
		 */
		_getEvents: function (name) {
			var events = [];

			this._allEvents.forEach(function(item, ind) {
				if (name == item.name) {
					events.push({
						item: item,
						pos: ind
					});
				}
			});

			return events;
		},

		/**
		 * Add new event to the stack.
		 * 
		 * @param  {String} name 
		 * @param  {Function} fn
		 * @param  {Object|Function} scope
		 * @member $event
		 */
		on: function (name, fn, scope) {
			this._allEvents.push({ 
				name: name,
				fn: fn,
				scope: scope
			});
		},

		/**
		 * Remove event from the stack.
		 * 
		 * @param  {String} name 
		 * @param  {Function} [fn]
		 * @member $event
		 */
		off: function (name, fn) {
			var events = this._getEvents(name);

			$common.reverseForEach(events, function(item) {
				if (!fn || fn && item.fn == fn) {
					this._allEvents.splice(item.pos, 1);
				}
			}, this);
		},

		/**
		 * Add one time event to the stack.
		 * 
		 * @param  {String} name
		 * @param  {Function} [fn]
		 * @param  {Object|Function} [scope]
		 * @member $event
		 */
		once: function (name, fn, scope) {
			this._allEvents.push({ 
				name: name,
				fn: fn,
				scope: scope,
				once: true
			});
		},

		/**
		 * Trigger event with arguments 0..n
		 * 
		 * @param  {String} name
		 * @member $event
		 */
		trigger: function (name) {
			var events = this._getEvents(name);
			var args = arguments;
			var onceArray = [];

			events.forEach(function(event) {
				var newArgs = Array.prototype.slice.call(args, 0);
				newArgs.shift();

				var item = event.item;

				item.fn.apply(item.scope || this, newArgs);
				if (item.once) {
					onceArray.push(event.pos);
				}
			}, this);

			$common.reverseForEach(onceArray, function(pos) {
				this._allEvents.splice(pos, 1);
			}, this);
		}
	};
}]);
;/**
 * @class $loader
 *
 * Progress loader in the application
 */
onix.service("$loader", [
	"$dom",
function(
	$dom
) {
	/**
	 * Create loader
	 *
	 * @private
	 * @member $loader
	 */
	this._create = function() {
		this._el = $dom.create({
			el: "div",
			"class": "loader"
		});

		// insert into the body on first position
		document.body.insertBefore(this._el, document.body.firstChild);
	};
	
	/**
	 * Loader init
	 *
	 * @member $loader
	 */
	this.init = function() {
		this._create();
	};

	/**
	 * Start loader
	 *
	 * @member $loader
	 */
	this.start = function() {
		this._el.classList.add("start");
	};

	/**
	 * End loader
	 *
	 * @member $loader
	 */
	this.end = function() {
		this._el.classList.remove("start");
		this._el.classList.add("end");

		setTimeout(function() {
			this._el.classList.remove("end");
			this._el.classList.add("hide");

			setTimeout(function() {
				this._el.classList.remove("hide");
			}.bind(this), 350);
		}.bind(this), 150);
	};
}]);
;/**
 * @class $http
 *
 * XMLHttpRequest cover class.
 */
onix.service("$http", [
	"$q",
	"$common",
function(
	$q,
	$common
) {
	/**
	 * https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects
	 * Prepare post data
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
	 * Request types
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
;/**
 * @class $i18n
 *
 * Language support, string translation with support for message format syntax
 */
onix.service("$i18n", [
	"$http",
	"$q",
function(
	$http,
	$q
) {
	/**
	 * All langs data
	 *
	 * @private
	 * @type {Object}
	 * @member $i18n
	 * @private
	 */
	this._langs = {};

	/**
	 * Current language
	 *
	 * @private
	 * @type {String}
	 * @member $i18n
	 * @private
	 */
	this._currentLang = "";

	/**
	 * Add a new language
	 *
	 * @param {String} lang Language key
	 * @param {Object} data
	 * @member $i18n
	 */
	this.addLanguage = function(lang, data) {
		this._langs[lang] = data;
	};

	/**
	 * Set new language by his key.
	 *
	 * @param {String} lang Language key
	 * @member $i18n
	 */
	this.setLanguage = function(lang) {
		this._currentLang = lang;
	};

	/**
	 * Get text function. Translate for the current language and the key.
	 *
	 * @param  {String} key
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18n
	 */
	this._ = function(key, replace) {
		key = key || "";
		var lObj = this._langs[this._currentLang];
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

		return this._transReplace(translate, replace);
	};

	/**
	 * Replace translated text by object. This functions is implementation of message format object replace inside the string
	 *
	 * @param  {String} translate
	 * @param  {Object} [replace] Replace all {} in the string
	 * @return {String}
	 * @member $i18n
	 * @private
	 */
	this._transReplace = function(translate, replace) {
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
	 * Load language from the file.
	 *
	 * @param  {String} lang Language key
	 * @param  {String} url  Path to the file
	 * @return {$q}
	 * @member $i18n
	 */
	this.loadLanguage = function(lang, url) {
		var promise = $q.defer();

		$http.createRequest({
			url: url
		}).then(function(data) {
			this.addLanguage(lang, data.data);
			promise.resolve();
		}.bind(this), function(data) {
			promise.resolve();
		});

		return promise;
	};
}]);
;/**
 * @class $template
 *
 * Handle templates, binds events - syntax similar to moustache and angular template system
 */
onix.service("$template", [
	"$common",
	"$q",
	"$http",
	"$config",
function(
	$common,
	$q,
	$http,
	$config
) {
	/**
	 * Template cache.
	 *
	 * @type {Object}
	 * @member $template
	 * @private
	 */
	this._cache = {};

	/**
	 * Regular expressions for handle template variables
	 *
	 * @type {Object}
	 * @member $template
	 * @private
	 */
	this._RE = {
		VARIABLE: /[$_a-zA-Z][$_a-zA-Z0-9]+/g,
		NUMBERS: /[-]?[0-9]+[.]?([0-9e]+)?/g,
		STRINGS: /["'][^"']+["']/g,
		JSONS: /[{][^}]+[}]/g,
		ALL: /[-]?[0-9]+[.]?([0-9e]+)?|["'][^"']+["']|[{][^}]+[}]|[$_a-zA-Z][$_a-zA-Z0-9]+/g
	};

	/**
	 * Parse a function name from the string
	 *
	 * @param  {String} value
	 * @return {String}
	 * @member $template
	 * @private
	 */
	this._parseFnName = function(value) {
		value = value || "";

		return value.match(/[a-zA-Z0-9_]+/)[0];
	};

	/**
	 * Parse arguments from the string -> makes array from them
	 *
	 * @param  {String} value
	 * @param  {Object} config
	 * @param  {Object} config.$event Event object
	 * @param  {Object} config.$element Reference to element
	 * @return {Array}
	 * @member $template
	 * @private
	 */
	this._parseArgs = function(value, config) {
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
	};

	/**
	 * Bind one single event to the element
	 * 
	 * @param  {HTMLElement} el
	 * @param  {String} eventName click, keydown...
	 * @param  {String} data data-x value
	 * @param  {Function} scope
	 * @member $template
	 * @private
	 */
	this._bindEvent = function(el, eventName, data, scope) {
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
	};

	/**
	 * Init - get all templates from the page. Uses 'text/template' script with template data
	 *
	 * @member $template
	 */
	this.init = function() {
		onix.element("script[type='text/template']").forEach(function(item) {
			this.add(item.id, item.innerHTML);
		}, this);
	};
	
	/**
	 * Add new item to the cachce
	 *
	 * @param {String} key 
	 * @param {String} data
	 * @member $template
	 */
	this.add = function(key, data) {
		this._cache[key] = data;
	};

	/**
	 * Compile one template - replaces all ocurances of {} by model
	 *
	 * @param  {String} key Template key/name
	 * @param  {Object} data Model
	 * @return {String}
	 * @member $template
	 */
	this.compile = function(key, data) {
		var tmpl = this.get(key);
		var cnf = $config.TMPL_DELIMITER;

		if (data) {
			Object.keys(data).forEach(function(key) {
				tmpl = tmpl.replace(new RegExp(cnf.LEFT + "[ ]*" + key + "[ ]*" + cnf.RIGHT, "g"), data[key]);
			});
		}

		return tmpl;
	};

	/**
	 * Get template from the cache
	 *
	 * @param  {String} key Template key/name
	 * @return {String}
	 * @member $template
	 */
	this.get = function(key) {
		return this._cache[key] || "";
	};

	/**
	 * Bind all elements in the root element. Selectors all data-[click|change|bind|keydown] and functions are binds against scope object.
	 * Supports: click, change, keydown, bind
	 *
	 * @param  {HTMLElement} root
	 * @param  {Object|Function} scope
	 * @member $template
	 */
	this.bindTemplate = function(root, scope) {
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

			if ("addEls" in scope && typeof scope.addEls === "function") {
				scope.addEls(newEls);
			}
		}
	};

	/**
	 * Load template from the path, returns promise after load
	 *
	 * @param  {String} key
	 * @param  {String} path
	 * @return {$q}
	 * @member $template
	 */
	this.load = function(key, path) {
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
	};
}]);
;/**
 * @class $route
 *
 * Simple router for the application
 */
onix.service("$route", [
	"$location",
	"$template",
function(
	$location,
	$template
) {
	/**
	 * All routes
	 *
	 * @private
	 * @type {Array}
	 * @member $route
	 */
	
	this._routes = [];

	/**
	 * Otherwise route
	 *
	 * @private
	 * @type {Object}
	 * @member $route
	 */
	this._otherwise = null;

	/**
	 * Add route to the router.
	 *
	 * @chainable
	 * @param  {String} url 
	 * @param  {Object} config
	 * @param  {String} [config.templateUrl] Template URL which will be loaded and cached in the $template
	 * @param  {String} [config.controller] Run this function if the route is used
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
	 * @param  {String} [config.templateUrl] Template URL which will be loaded and cached in the $template
	 * @param  {String} [config.controller] Run this function if the route is used
	 * @member $route
	 */
	this.otherwise = function(config) {
		this._otherwise = {
			config: config
		};

		return this;
	};

	/**
	 * Run controller from route path
	 *
	 * @private
	 * @param  {String|Array|Function} contr
	 * @param  {Object} [contrData] 
	 */
	this._runController = function(contr, contrData) {
		if (typeof contr === "string") {
			var param = onix.getObject(contr);

			onix.bindDI(param, contrData)();
		}
		else if (Array.isArray(contr)) {
			onix.bindDI(contr, contrData)();
		}
		else if (typeof contr === "function") {
			contr.apply(contr, [contrData]);
		}
	};

	/**
	 * Route GO. Walk through all routes, if there is match, route controller will be called
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
			var templateUrl = null;
			var contr = null;
			var contrData = {};

			Object.keys(config).forEach(function(key) {
				var value = config[key];

				switch (key) {
					case "templateUrl":
						templateUrl = value;
						break;
						
					case "controller":
						contr = value;
						break;

					default:
						contrData[key] = value;
				}
			});

			if (templateUrl) {
				$template.load(config.templateUrl, config.templateUrl).done(function() {
					if (contr) {
						this._runController(contr, contrData);
					}
				}.bind(this));
			}
			else {
				if (contr) {
					this._runController(contr, contrData);
				}
			}
		}
	};
}]);
;onix.factory("$select", [
	"$common",
	"$event",
	"$dom",
function(
	$common,
	$event,
	$dom
) {
	/**
	 * $select uses bootstrap dropdown and provides additional functionality
	 *
	 * @class $select
	 * @param {HTMLElement} el Where element has class "dropdown"
	 * @param {Object} opts
	 * @param {Boolean} opts.addCaption Add caption to select
	 * @member $select
	 */
	var $select = function(el, opts) {
		// extend our class
		$common.extend(this, $event);

		this._opts = {
			addCaption: false
		};

		for (var key in opts) {
			this._opts[key] = opts[key];
		}

		this._const = {
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
			choiceClick: $common.bindWithoutScope(this._choiceClick, this)
		};

		this._bind();
	};

	/**
	 * Bind clicks on the select
	 *
	 * @member $select
	 * @private
	 */
	$select.prototype._bind = function() {
		this._bindCaption();
		this._bindChoices();
	};

	/**
	 * Bind caption el
	 * 
	 * @member $select
	 * @private
	 */
	$select.prototype._bindCaption = function() {
		var captionEl = this._el.querySelector(this._const.CAPTION_SEL);

		if (captionEl) {
			// click on the caption
			captionEl.addEventListener("click", this._binds.captionClick);

			// insert span placeholder for caption
			if (this._opts.addCaption) {
				var caretEl = captionEl.querySelector(this._const.CARET_SEL);

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
	 * Event - click on caption
	 * 
	 * @param  {Event} e 
	 * @param  {Object} scope
	 * @member $select
	 * @private
	 */
	$select.prototype._captionClick = function(e, scope) {
		var con = scope._const;

		e.stopPropagation();

		var isOpen = scope._el.classList.contains(con.OPEN_CLASS);

		var removeAllOpened = function() {
			// remove all
			onix.element(con.OPEN_DROPDOWN_SEL).forEach(function(item) {
				item.classList.remove("open");
			});
		};

		var clickFn = function() {
			removeAllOpened();
			window.removeEventListener("click", clickFn);
		};

		removeAllOpened();

		if (isOpen) {
			// outside click
			window.removeEventListener("click", clickFn);
		}
		else {
			// outside click
			window.addEventListener("click", clickFn);

			scope._el.classList.add(con.OPEN_CLASS);
		}
	};

	/**
	 * Bind choices inside select
	 *
	 * @member $select
	 * @private
	 */
	$select.prototype._bindChoices = function() {
		onix.element(this._const.OPTIONS_SEL, this._el).forEach(function(option) {
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
	 * Event - click on option
	 * 
	 * @param  {Event} e 
	 * @param  {Object} scope
	 * @member $select
	 * @private
	 */
	$select.prototype._choiceClick = function(e, scope) {
		var con = scope._const;

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
	 * Unbind choices
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
	 * Rebind choices
	 *
	 * @member $select
	 */
	$select.prototype.rebindChoices = function() {
		this.unbindChoices();
		this._bindChoices();
	};

	/**
	 * Select option from the select
	 * 
	 * @param {Number} ind Position 0..n
	 * @member $select
	 */
	$select.prototype.selectOption = function(ind) {
		if (typeof ind === "undefined") {
			ind = 0;
		}

		var optionsCount = this._optinsRef.length;

		if (optionsCount > 0 && ind >= 0 && ind < optionsCount) {
			var el = this._optinsRef[ind].el;
			var parent = this._optinsRef[ind].el.parentNode;

			if (!parent.classList.contains(this._const.ACTIVE_CLASS)) {
				parent.classList.add(this._const.ACTIVE_CLASS);

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
	 * Set add caption from the current value
	 *
	 * @member $select
	 */
	$select.prototype.setAddCaption = function() {
		if (!this._opts.addCaption) return;

		this._optinsRef.every(function(item) {
			var parent = item.el.parentNode;

			if (parent.classList.contains(this._const.ACTIVE_CLASS)) {
				this._captionTextEl.innerHTML = item.el.innerHTML;
				return false;
			}
			else return true;
		}, this);
	};

	return $select;
}]);
;/**
 * @class $uploadImages
 *
 * Class for creating img previews from File[] variable
 */
onix.service("$uploadImages", [
	"$job",
	"$q",
	"$dom",
function(
	$job,
	$q,
	$dom
) {
	/**
	 * Disable?
	 *
	 * @private
	 * @member $uploadImages
	 * @type {Boolean}
	 */
	this._disable = !("FileReader" in window);

	/**
	 * Max preview image height
	 *
	 * @private
	 * @member $uploadImages
	 * @type {Object}
	 */
	this._const = {
		previewMaxSize: 180
	};

	/**
	 * Do jobs for processing all images
	 *
	 * @private
	 * @param  {Array} dataArray Array of files with images
	 * @param  {Function} fn Job task
	 * @param  {Number} count How many functions processed simultinously
	 * @param  {Function} taskDoneObj Callback after one task have been done
	 * @return {$q} Callback after all job is done
	 * @member $uploadImages
	 */
	this._doJobs = function(dataArray, fn, count, taskDoneObj) {
		var len = dataArray.length;
		var jobs = [];

		for (var i = 0; i < len; i++) {
			var jp = i % count;

			if (!jobs[jp]) {
				jobs[jp] = $job.create();

				if (taskDoneObj) {
					jobs[jp].setTaskDone(taskDoneObj.cb, taskDoneObj.scope);
				}
			}

			jobs[jp].add(fn, this, dataArray[i]);
		}

		var jobPromises = [];

		jobs.forEach(function(job) {
			jobPromises.push(job.start());
		});

		return $q.all(jobPromises);
	};

	/**
	 * Is file a picture?
	 *
	 * @private
	 * @param  {File}  file
	 * @return {Boolean}
	 * @member $uploadImages
	 */
	this._isPicture = function(file) {
		if (file) {
			return (file.type == "image/jpeg" || file.type == "image/pjpeg" || file.type == "image/png");
		}
		else return false;
	};

	/**
	 * Read one file, create one preview
	 *
	 * @private
	 * @param  {Object} fileObj
	 * @param  {Object} fileObj.file File reference
	 * @param  {String} fileObj.previewID Preview ID for DOM position
	 * @param  {Function} doneFn Callback, after one preview is loaded and drawed to canvas
	 * @member $uploadImages
	 */
	this._readFile = function(fileObj, doneFn) {
		var file = fileObj.file;
		var previewID = fileObj.previewID;

		var fileObj = {
			file: file,
			exif: null,
			img: null
		};

		var preview = this._createPreview(file);
		
		// append
		if (previewID in this._dom) {
			this._dom[previewID].appendChild(preview.cont);
		}
		else {
			this._dom.previewItems.appendChild(preview.cont);
		}

		var reader = new FileReader();

		reader.onload = function(e) {
			var binaryData = reader.result;
			var binaryDataArray = new Uint8Array(binaryData);
			var exif = null;

			if (file.type != "png") {
				exif = EXIF.readFromBinaryFile(binaryData);
			}

			var img = new Image();

			img.onload = function() {
				var imd = this._getImageDim(img);
				var canvas = this._processInputImage(img, imd, exif.Orientation);
				
				preview.cont.classList.remove("preview-loading");
				preview.canvasCover.innerHTML = "";
				preview.canvasCover.appendChild(canvas);

				fileObj.exif = exif;
				fileObj.img = img;
				doneFn();
			}.bind(this);

			img.src = this._fileToBase64(file.type, binaryDataArray);
		}.bind(this);

		reader.readAsArrayBuffer(file);
	};

	/**
	 * Create one image preview
	 *
	 * @private
	 * @param  {File} file
	 * @return {Object} dom references
	 * @member $uploadImages
	 */
	this._createPreview = function(file) {
		var exported = {};

		var cont = $dom.create({
			el: "span",
			"class": ["preview-item", "preview-loading"],
			child: [{
				el: "span",
				"class": "canvas-cover",
				child: [{
					el: "img",
					"class": "preview-loader",
					src: "/static/img/loading.gif"
				}],
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
	 * Counts image dimension; if maxSize is available, new dimension is calculated
	 *
	 * @private
	 * @param  {Image} img
	 * @return {Object}
	 * @member $uploadImages
	 */
	this._getImageDim = function(img) {
		var maxSize = this._const.previewMaxSize;
		var largeWidth = img.width > maxSize;
		var largeHeight = img.height > maxSize;

		var output = {
			width: img.width,
			height: img.height,
			scale: 1,
			large: false
		};

		if (largeWidth || largeHeight) {
			// resizneme obrazek
			var imgWidth = img.width;
			var imgHeight = img.height;

			// vybereme vetsi ze stran
			if (img.width > img.height) {
				// sirka
				imgHeight = maxSize * imgHeight / imgWidth;
				imgWidth = maxSize;
			}
			else {
				// vyska
				imgWidth = maxSize * imgWidth / imgHeight;
				imgHeight = maxSize;
			}

			output.scale = img.width / imgWidth; // pomer orig. a zmenseneho obrazku
			output.width = imgWidth;
			output.height = imgHeight;
			output.large = true;
		}

		return output;
	};

	/**
	 * Process image: rotate by exif, decrase size according to MAX SIZE
	 *
	 * @private
	 * @param  {Image} img
	 * @param  {Object} imd object dimension
	 * @param  {Number} orientation EXIF orientation
	 * @return {Canvas}
	 * @member $uploadImages
	 */
	this._processInputImage = function(img, imd, orientation) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var draw = true;

		canvas.width = imd.width;
		canvas.height = imd.height;

		// rotate
		if (orientation) {
			switch (orientation) {
				case 2:
					// horizontal flip
					ctx.translate(imd.width, 0);
					ctx.scale(-1, 1);
					break;

				case 3:
					// 180° rotate left
					ctx.translate(imd.width, imd.height);
					ctx.rotate(Math.PI);
					break;

				case 4:
					// vertical flip
					ctx.translate(0, imd.height);
					ctx.scale(1, -1);
					break;

				case 5:
					// vertical flip + 90 rotate right
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.scale(1, -1);

					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 6:
					// 90° rotate right
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(0, -imd.height);
					
					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 7:
					// horizontal flip + 90 rotate right
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(0.5 * Math.PI);
					ctx.translate(imd.width, -imd.height);
					ctx.scale(-1, 1);

					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
					break;

				case 8:
					// 90° rotate left
					canvas.width = imd.height;
					canvas.height = imd.width;
					ctx.rotate(-0.5 * Math.PI);
					ctx.translate(-imd.width, 0);

					if (imd.large) {
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
						draw = false;
					}
			}
		}

		if (draw) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (imd.large) {
				ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
			}
			else {
				ctx.drawImage(img, 0, 0);
			}
		}

		return canvas;
	};

	/**
	 * Binary data to base64
	 *
	 * @private
	 * @param  {String} fileType
	 * @param  {Array} binaryData
	 * @return {String}
	 * @member $uploadImages
	 */
	this._fileToBase64 = function(fileType, binaryData) {
		var length = binaryData.length
		var output = "";

		for (var i = 0; i < length; i += 1) {
			output += String.fromCharCode(binaryData[i]);
		}

		return 'data:' + fileType + ';base64,' + btoa(output);
	};

	/**
	 * Create preview holders.
	 *
	 * @private
	 * @param {HTMLElement} el
	 * @param {Number} count
	 * @member $uploadImages
	 */
	this._createPreviewHolders = function(el, count) {
		if (!el || (count != 4 && count != 7)) return;

		var exported = {};

		// placeholder for panorama
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
	 * Main function for showing img previews.
	 * 
	 * @param  {HTMLElement} el
	 * @param  {File[]} files
	 * @member $uploadImages
	 */
	this.show = function(el, files) {
		if (this._disable || !el || !files) return;

		// clear previous
		el.innerHTML = "";

		this._dom = {
			previewItems: el
		};

		var pictureFiles = this.getPictureFiles(files);
		var count = pictureFiles.length;

		if (count) {
			this._createPreviewHolders(el, count);

			// sort by name, make previewID - only for 7 pictures
			pictureFiles = pictureFiles.sort(function(a, b) {
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				else 
					return 0;
			}).map(function(file, ind) {
				return {
					file: file,
					previewID: "img_0" + ind
				};
			});

			this._doJobs(pictureFiles, this._readFile, 2);
		}
	};

	/**
	 * Get picture files from array of files
	 * 
	 * @param  {Array} array of files
	 * @return {Array}
	 * @member $uploadImages
	 */
	this.getPictureFiles = function(files) {
		var pictureFiles = [];

		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var item = files[i];

				if (this._isPicture(item)) {
					pictureFiles.push(item);
				}
			}
		}

		return pictureFiles;
	};

	/**
	 * Get picture files count from the array of Files. This function uses 'getPictureFiles'
	 * 
	 * @param  {Array} array of files
	 * @return {Boolean}
	 * @member $uploadImages
	 */
	this.getPicturesCount = function(files) {
		return this.getPictureFiles(files).length;
	};
}]);
