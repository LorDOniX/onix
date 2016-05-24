myModule = onix.module("myModule", []);

myModule.service("TestFromModule", function() {
	this.test = function() {
		console.log("TestFromModule - test function");
	};
});
