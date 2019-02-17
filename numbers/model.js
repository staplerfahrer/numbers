let ally = 
	{ 
		accounts: undefined 
	}

let chartSpec =
	{
		"$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json",
		"description": "A simple bar chart with embedded data.",
		"width": 360,
		"data": {
			"values": [
				{ "x": "A", "y": 28 }
				, { "x": "B", "y": 55 }
				, { "x": "C", "y": 43 }
				, { "x": "D", "y": 91 }
				, { "x": "E", "y": 81 }
				, { "x": "F", "y": 53 }
				, { "x": "G", "y": 19 }
				, { "x": "H", "y": 87 }
				, { "x": "I", "y": 52 }
			]
		},
		"mark": "line",
		"encoding": {
			"x":
			{
				"field": "x",
				"type": "ordinal",
				"axis":
				{
					labelAngle: -45
				}
			},
			"y":
			{
				"field": "y",
				"type": "quantitative"
			},
			"tooltip": { "field": "y", "type": "quantitative" }
		},
	}

module.exports = 
	{
		ally: ally
		, chartSpec: chartSpec
	}