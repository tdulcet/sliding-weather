var Clay = require("@rebble/clay");
var clayConfig = require("./config");
var customClay = require("./custom-clay");
var clay = new Clay(clayConfig, customClay);

// Get a free API key from: https://openweathermap.org/api
var KEY = "f61067dc65c40cb194ce75d72e352357";

function xhrRequest(url, type, callback, errorCallback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if (this.status >= 200 && this.status < 300) {
			callback(this.responseText);
		} else {
			errorCallback("HTTP status code " + this.status);
		}
	};
	xhr.onerror = function () {
		errorCallback("Error fetching weather.");
	};
	xhr.open(type, url);
	xhr.send();
}

function queryString(params) {
	var parts = [];

	Object.keys(params).forEach(function (key) {
		parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
	});

	return parts.join("&");
}

function sendWeather(result) {
	var dictionary = {
		temperature: Math.round(result.temperature),
		conditions: result.conditions
	};
	console.log(JSON.stringify(dictionary))

	Pebble.sendAppMessage(dictionary, function (e) {
		console.log("Weather info sent.");
	}, function (e) {
		console.error("Error sending weather info.");
	});
}

function weather1(settings, latitude, longitude) {
	var url = "https://api.openweathermap.org/data/2.5/weather";
	var params = {};
	if (latitude != null && longitude != null) {
		params.lat = latitude;
		params.lon = longitude;
	} else {
		params.zip = settings.zip + "," + settings.country;
	}
	params.units = settings.units && settings.units === "f" ? "imperial" : "metric";
	params.appid = settings.key || KEY;
	params.lang = navigator.language.split("-", 1)[0];
	url += "?" + queryString(params);
	console.log(url);

	xhrRequest(url, "GET", function (responseText) {
		console.log(responseText);

		var json = JSON.parse(responseText);

		if (json.cod === 200) {
			sendWeather({
				temperature: json.main.temp,
				conditions: json.weather[0].description
			});
		} else {
			console.error("Status code: " + json.cod);
		}
	}, function (error) {
		console.error(error);
	});
}

var WMO_codes = {
	0: "Clear sky",
	1: "Mainly clear",
	2: "Partly cloudy",
	3: "Overcast",
	45: "Fog",
	48: "Rime fog",
	51: "Light Drizzle",
	53: "Drizzle",
	55: "Heavy Drizzle",
	56: "Light Freezing Drizzle",
	57: "Heavy Freezing Drizzle",
	61: "Light Rain",
	63: "Rain",
	65: "Heavy Rain",
	66: "Light Freezing Rain",
	67: "Heavy Freezing Rain",
	71: "Light Snow",
	73: "Snow fall",
	75: "Heavy Snow",
	77: "Snow grains",
	80: "Light Showers",
	81: "Showers",
	82: "Heavy Showers",
	85: "Light Snow showers",
	86: "Heavy Snow showers",
	95: "Thunderstorm",
	96: "Thunderstorm light hail",
	99: "Thunderstorm heavy hail"
};

function weather5(settings, latitude, longitude) {
	var url = "https://api.open-meteo.com/v1/forecast";
	var params = {};
	if (latitude != null && longitude != null) {
		params.latitude = latitude;
		params.longitude = longitude;
	} else {
		throw new Error("ZIP code unsupported");
	}
	params.current = "temperature_2m,weather_code";
	params.temperature_unit = settings.units && settings.units === "f" ? "fahrenheit" : "celsius";
	url += "?" + queryString(params);
	console.log(url);

	xhrRequest(url, "GET", function (responseText) {
		console.log(responseText);

		var json = JSON.parse(responseText);

		sendWeather({
			temperature: json.current.temperature_2m,
			conditions: WMO_codes[json.current.weather_code]
		});
	}, function (error) {
		console.error(error);
	});
}

function weather(settings, latitude, longitude) {
	var aweather = settings.weather && parseInt(settings.weather, 10);
	if (aweather === 1) {
		weather1(settings, latitude, longitude);
	} else /* if (aweather === 5) */ {
		weather5(settings, latitude, longitude);
	}
}

function getWeather() {
	var settingsString = localStorage.getItem("clay-settings");

	var settings = settingsString ? JSON.parse(settingsString) : {};
	console.log(JSON.stringify(settings));

	if (!settings.location || settings.location === "true") {
		navigator.geolocation.getCurrentPosition(
			function (position) {
				var { latitude, longitude } = position.coords;
				weather(settings, position.coords.latitude, position.coords.longitude);
			},
			function (error) {
				console.error("Error requesting location.", error.message);
			},
			{ timeout: 60000, maximumAge: 60000 }
		);
	} else {
		weather(settings);
	}
}

Pebble.addEventListener("ready", function (e) {
	console.log("PebbleKit JS ready!");

	getWeather();
});

Pebble.addEventListener("appmessage", function (e) {
	console.log("AppMessage received!");

	// var dict = e.payload;

	getWeather();
});