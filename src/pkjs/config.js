module.exports = [
	{
		type: "heading",
		defaultValue: "Sliding Weather Settings"
	},
	{
		type: "text",
		defaultValue: "<a href=\"https://github.com/tdulcet/sliding-weather\" target=\"_blank\"><button type=\"button\">ℹ️ Information</button></a><a href=\"https://tealdulcet.com/#donate\" target=\"_blank\"><button type=\"button\">❤️ Donate</button></a>"
	},
	{
		type: "section",
		items: [
			{
				type: "heading",
				defaultValue: "Location"
			},
			{
				type: "radiogroup",
				messageKey: "location",
				label: "Location",
				defaultValue: "true",
				options: [
					{
						label: "Current (requires location access)",
						value: "true"
					},
					{
						label: "ZIP code",
						value: "false"
					}
				]
			},
			{
				type: "input",
				messageKey: "zip",
				group: "code",
				label: "ZIP code",
				defaultValue: ""
			},
			{
				type: "input",
				messageKey: "country",
				group: "code",
				label: "Country (2 letter code)",
				defaultValue: "",
				attributes: {
					minlength: "2",
					maxlength: "2"
				}
			}
		]
	},
	{
		type: "section",
		items: [
			{
				type: "heading",
				defaultValue: "Units"
			},
			{
				type: "radiogroup",
				messageKey: "units",
				label: "Units",
				defaultValue: "c",
				options: [
					{
						label: "Metric (°C)",
						value: "c"
					},
					{
						label: "Imperial (°F)",
						value: "f"
					}
				]
			}
		]
	},
	{
		type: "section",
		items: [
			{
				type: "heading",
				defaultValue: "Weather API"
			},
			{
				type: "radiogroup",
				messageKey: "weather",
				label: "Weather API",
				defaultValue: "5",
				options: [
					{
						label: "OpenWeatherMap (requires API key)",
						value: "1"
					},
					{
						label: "Open-Meteo",
						value: "5"
					}
				]
			},
			{
				type: "text",
				group: "key",
				defaultValue: "Get a free API key from <a target=\"_blank\" href=\"https://openweathermap.org/api\">OpenWeatherMap.org</a>."
			},
			{
				type: "input",
				messageKey: "key",
				group: "key",
				label: "API key",
				defaultValue: ""
			}
		]
	},
	{
		type: "submit",
		defaultValue: "Save Settings"
	}
];
