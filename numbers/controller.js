let view = undefined
	, model = undefined
	, format = undefined

function refreshHoldings(data) 
{
	let accounts = model.ally.accounts
		, chart = model.chartSpec

	accounts = data.response.accounts
	accounts.time = format.time(new Date())
	chart.data.values.push(
		{
			x: accounts.time
			, y: 1
		})

	printAccount(accounts)
	drawChart(chart)
}

function printAccount(accounts) 
{
	let s = accounts.accountsummary
		, holdings = s.accountholdings.holding

	tableHoldings = require('./tableHoldings.js') // TODO refactor away, pass 'format' into contructor like here
	view.setHeader(accounts.time)
	view.setContent('content', tableHoldings(format, holdings))
}

function drawChart(spec)
{
	// streaming: https://vega.github.io/vega-lite/tutorials/streaming.html
	// result.view provides access to the Vega View API
	vegaEmbed('#vis', spec)
		.then(result => {
			console.log(result)})
		.catch(console.warn)
}

module.exports = (statelessView, masterModel, formatter)=>
{
	view = statelessView
	model = masterModel
	format = formatter
	return {
		refreshHoldings: refreshHoldings
		, printAccount: printAccount
		, drawChart: drawChart
	}
}
