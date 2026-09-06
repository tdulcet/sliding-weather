module.exports = function (minified) {
	var clayConfig = this;

	clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function () {
		var location = clayConfig.getItemByMessageKey("location");
		var weather = clayConfig.getItemByMessageKey("weather");

		function toggleLocation() {
			var value = location.get() === "false";
			var items = clayConfig.getItemsByGroup("code");
			items.forEach(function (item) {
				if (value) {
					item.show();
				} else {
					item.hide();
				}
			});
		}

		function toggleWeather() {
			var value = weather.get() === "1";
			var items = clayConfig.getItemsByGroup("key");
			items.forEach(function (item) {
				if (value) {
					item.show();
				} else {
					item.hide();
				}
			});
		}

		toggleLocation();
		toggleWeather();

		location.on("change", toggleLocation);
		weather.on("change", toggleWeather);
	});
};