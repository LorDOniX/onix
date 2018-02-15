import $slider from "utils/slider";
import $anonymizer from "utils/anonymizer";
import $template from "template";
import * as $features from "features";

class Anonymizer {
	constructor() {
		this._els = null;
		this._anonymizer = null;

		$template.bindTemplate(document.querySelector(".main-cont"), this, elsObj => {
			this._els = elsObj;
		});

		this._slider = new $slider(this._els.sliderHolder, {
			timeout: 0,
			wheelStep: 3
		});

		this._slider.on("change", value => {
			this._anonymizer.setEntityValue(value);
		});

		this._anonymizer = new $anonymizer(this._els.canvasHolder, {
			zoom: 20,
			zoomMoveStep: 1,
			maxZoom: 140,
			minZoom: 20,
			entityPreview: this._els.canvasEntityHolder,
			canWidth: 1024,
			canHeight: 512
		});

		if (!$features.CANVAS) {
			alert("Canvas is not available!");
			return;
		}

		//this._anonymizer.loadImage("/img-test/test-photo.jpg");
		this._anonymizer.loadImage("/img-test/pano.jpg");

		this._anonymizer.on("zoom", value => {
			let zoomEl = this._els.zoom;
			zoomEl.innerHTML = "Zoom " + value;
		});

		this._setEntity();
	}

	zoomPlus() {
		this._anonymizer.zoomPlus();
	}

	zoomMinus() {
		this._anonymizer.zoomMinus();
	}

	switchEntity() {
		this._anonymizer.switchEntity();

		this._setEntity();
	}

	_setEntity() {
		let switcher = this._els.switcher;
		switcher.innerHTML = "Current: " + this._anonymizer.getEntityId();

		let entityObj = this._anonymizer.getEntity();

		this._slider.rewriteOpts({
			min: entityObj.min,
			max: entityObj.max
		});

		this._slider.setValue(entityObj.value);
	}

	stepBack() {
		this._anonymizer.stepBack();
	}
	
	removeAll() {
		this._anonymizer.removeAll();
	}

	"export"() {
		console.log(this._anonymizer.exportEntites());
	}
}

export default Anonymizer;
