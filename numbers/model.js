let ally = 
	{ 
		accounts: undefined 
	}

// https://vega.github.io/vega-lite/docs/axis.html
let gainLossChart =	{
		$schema: "https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json"
		, description: "A simple bar chart with embedded data."
		, width: 360
		, data: {values: []}
		, mark: {type: "line", point: false}
		, encoding: 
		{
			color: { 
				field: "symbol"
				, type: "nominal" }
			, x: 
			{ 
				field: "x"
				, type: "ordinal"
				, axis: { 
					title: "time"
					, labelAngle: -45 } 
			}
			, y: 
			{ 
				field: "y"
				, type: "quantitative"
				, axis: { title: "gain/loss $"} 
			}
		}
	}
	, quoteStreamChart = {
		$schema: "https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json"
		, width: 360
		, data: {values: []}
		, mark: 
		{
			type: "point"
			, shape: "diamond"
			, size: 50
			, opacity: 0.4
			, filled: true
		}
		, encoding: {
			color: { 
				field: "type"
				, type: "nominal" }
			, x: { 
				field: "datetime"
				, type: "temporal"
				, timeUnit: "hoursminutesseconds"
				, axis: {
					title: "time"
					, labelAngle: -45
					, grid: false}}
			, y: { 
				field: "dollars"
				, type: "quantitative"
				, scale: {type: "linear", nice: true, zero: false}
				, axis: { 
					title: "quoted bid $"
					, grid: false}}
			, size: {
				field: "size"
			}
		}
	}

module.exports = 
	{
		ally: ally
		, gainLossChart: gainLossChart
		, quoteStreamChart: quoteStreamChart
	}