cropperApp = onix.module("cropperApp", ["menu"]);

cropperApp.run([
	"$crop",
	"$template",
	"MainMenu",
function(
	$crop,
	$template,
	MainMenu
) {
	var Cropper = function() {
		MainMenu.create(MainMenu.PAGES.CROPPER);

		this._els = null;
		this._anonymizer = null;

		$template.bindTemplate(document.querySelector(".main-cont"), this, function(elsObj) {
			this._els = elsObj;
		}.bind(this));

		this._cropper = new $crop({
			minWidth: 1024 / 10,
			minHeight: 583 / 10,
			aspectRatio: 3/2
		});

		var cont = this._cropper.getContainer();

		var parEl = document.querySelector(".crop-area");
		parEl.appendChild(cont);

		this._cropper.setDim({
			width: parEl.offsetWidth,
			height: parEl.offsetHeight
		});

		this._cropper.show();
	};

	Cropper.prototype.setCenter = function() {
		this._cropper.setCenter();
	};

	Cropper.prototype.backup = function() {
		this._cropper.backup();
	};

	Cropper.prototype.restore = function() {
		this._cropper.restore();
	};

	Cropper.prototype.aabb = function() {
		console.log(this._cropper.getAABB());
	};

	new Cropper();
}]);
