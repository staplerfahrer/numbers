let format = require('./format.js')
	, model = undefined
	, view = undefined


function updateAccounts(data) 
{
	let accounts = model.ally.accounts
		, chart = model.chartSpec

	accounts = _transformAllyAccounts(data.response.accounts)
	accounts.time = format.time(new Date())
	chart.data.values.push(
		{
			x: accounts.time
			, y: 1//ys: accounts.accountsummary.accountholdings.holding.map(h=>h.cost)
		})

	printAccount(accounts)
	drawChart(chart)
}

function _transformAllyAccounts(apiAccounts)
{
	function cost(holding) 
	{
		holding.cost = Number.parseFloat(holding.costbasis) / Number.parseFloat(holding.qty)
		return holding
	}

	let transformed = apiAccounts
	transformed.accountsummary.accountholdings.holding = transformed.accountsummary.accountholdings.holding.map(cost)
	return transformed
}

function printAccount(accounts) 
{
	let s = accounts.accountsummary
		, holdings = s.accountholdings.holding

	holdingsTable = require('./tableHoldings.js')(format).buildTable // TODO refactor away?
	view.setHeader(accounts.time)
	view.setContent('content', holdingsTable(holdings))
}

function drawChart(spec)
{
	// streaming: https://vega.github.io/vega-lite/tutorials/streaming.html
	// result.view provides access to the Vega View API
	vegaEmbed('#vis', spec)
		.then(result => {
			/*console.log(result)*/})
		.catch(console.warn)
}

module.exports = (statelessView, masterModel)=>
{
	view = statelessView
	model = masterModel
	return {
		updateAccounts: updateAccounts
		, printAccount: printAccount
	}
}
