onix.run([
	"$slider",
	"$anonymizer",
	"$template",
function(
	$slider,
	$anonymizer,
	$template
) {
	var HP = function() {
		this._els = null;
		this._anonymizer = null;

		$template.bindTemplate(document.querySelector(".main-cont"), this, function(elsObj) {
			this._els = elsObj;
		}.bind(this));
	};

	HP.prototype.run = function() {
		this._slider = new $slider(this._els.sliderHolder, {
			timeout: 0
		});

		this._slider.on("change", function(value) {
			this._anonymizer.setEntityValue(value);
		}, this);

		this._anonymizer = new $anonymizer(this._els.canvasHolder, {
			zoom: 20,
			zoomMoveStep: 1,
			maxZoom: 140,
			minZoom: 20,
			entityPreview: this._els.canvasEntityHolder,
			canWidth: 1024,
			canHeight: 512
		});
		//this._anonymizer.loadImage("/img/praha.jpg");
		this._anonymizer.loadImage("/img/pano.jpg");

		this._anonymizer.on("zoom", function(value) {
			var zoomEl = this._els.zoom;
			zoomEl.innerHTML = "Zoom " + value;
		}, this);

		this._setEntity();

		setTimeout(function() {
			//this._anonymizer.syncPort(800,400);
		}.bind(this), 3000);
	};

	HP.prototype.zoomPlus = function() {
		this._anonymizer.zoomPlus();
	};

	HP.prototype.zoomMinus = function() {
		this._anonymizer.zoomMinus();
	};

	HP.prototype.switchEntity = function() {
		this._anonymizer.switchEntity();

		this._setEntity();
	};

	HP.prototype._setEntity = function() {
		var switcher = this._els.switcher;
		switcher.innerHTML = "Current: " + this._anonymizer.getEntityId();

		var entityObj = this._anonymizer.getEntity();

		this._slider.rewriteOpts({
			min: entityObj.min,
			max: entityObj.max
		});

		this._slider.setValue(entityObj.value);
	};

	HP.prototype.stepBack = function() {
		this._anonymizer.stepBack();
	};
	
	HP.prototype.removeAll = function() {
		this._anonymizer.removeAll();
	};

	HP.prototype.export = function() {
		console.log(this._anonymizer.exportEntites());
	};
	
	var hpInst = new HP();
	hpInst.run();
}]);
