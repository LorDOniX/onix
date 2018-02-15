import $crop from "utils/crop";
import $template from "template";

class Cropper {
	constructor() {
		this._els = null;
		this._anonymizer = null;

		$template.bindTemplate(document.querySelector(".main-cont"), this, elsObj => {
			this._els = elsObj;
		});

		this._cropper = new $crop({
			minWidth: 40,
			minHeight: 40,
			aspectRatio: 1
		});

		let cont = this._cropper.getContainer();
		let parEl = document.querySelector(".crop-area");
		parEl.appendChild(cont);

		this._cropper.setDim({
			areaWidth: parEl.offsetWidth,
			areaHeight: parEl.offsetHeight
		});

		this.setCenter();
		this._cropper.show();
	}

	setCenter() {
		this._cropper.setCenter();
	}

	fitToArea() {
		this._cropper.fitToArea();
	}

	backup() {
		this._cropper.backup();
	}

	restore() {
		this._cropper.restore();
	}

	aabb() {
		console.log(this._cropper.getAABB());
	}
}

export default Cropper;
