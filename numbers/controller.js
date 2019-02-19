let format = require('./format.js')
	, model = undefined
	, view = undefined


function updateAccounts(data) 
{

	function _transformAllyAccounts(apiAccounts)
	{
		function makeFloats(holdingStrings)
		{
			const f = Number.parseFloat
			let holdingFloats = holdingStrings
			holdingFloats.costbasis = f(holdingStrings.costbasis)
			holdingFloats.gainloss = f(holdingStrings.gainloss)
			holdingFloats.instrument.factor = f(holdingStrings.instrument.factor)
			holdingFloats.instrument.mult = f(holdingStrings.instrument.mult)
			holdingFloats.instrument.putcall = f(holdingStrings.instrument.putcall)
			holdingFloats.instrument.strkpx = f(holdingStrings.instrument.strkpx)
			holdingFloats.marketvalue = f(holdingStrings.marketvalue)
			holdingFloats.marketvaluechange = f(holdingStrings.marketvaluechange)
			holdingFloats.price = f(holdingStrings.price)
			holdingFloats.purchaseprice = f(holdingStrings.purchaseprice)
			holdingFloats.qty = f(holdingStrings.qty)
			holdingFloats.quote.change = f(holdingFloats.quote.change)
			holdingFloats.quote.lastprice = f(holdingStrings.quote.lastprice)
			holdingFloats.sodcostbasis = f(holdingStrings.sodcostbasis)
			return holdingFloats
		}

		function cost(holding) 
		{
			holding.cost = holding.costbasis / holding.qty
			return holding
		}

		let transformed = apiAccounts
		transformed.accountsummary.accountholdings.holding = transformed.accountsummary.accountholdings.holding.map(makeFloats)
		transformed.accountsummary.accountholdings.holding = transformed.accountsummary.accountholdings.holding.map(cost)
		
		return transformed
	}	

	function drawChart(spec) {
		// streaming: https://vega.github.io/vega-lite/tutorials/streaming.html
		// result.view provides access to the Vega View API
		vegaEmbed('#vis', spec)
			.then(result => {
				/*console.log(result)*/
			})
			.catch(console.warn)
	}

	let accounts = model.ally.accounts
		, chart = model.gainLossChart

	accounts = _transformAllyAccounts(data.response.accounts)
	accounts.time = format.time(new Date())
	chart.data.values.push(...accounts.accountsummary.accountholdings.holding.map(h => ({
		"symbol": h.displaydata.symbol
		, "x": accounts.time
		, "y": h.gainloss
	})))

	printAccount(accounts)
	drawChart(chart)
}

function printAccount(accounts) 
{
	let s = accounts.accountsummary
		, holdings = s.accountholdings.holding

	holdingsTable = require('./tableHoldings.js')(format).buildTable // TODO refactor away?
	view.setHeader(accounts.time)
	view.setContent('content', holdingsTable(holdings))
}

function streamQuotes(quoteOrTrade)
{
	function drawChart(spec) {
		// streaming: https://vega.github.io/vega-lite/tutorials/streaming.html
		// result.view provides access to the Vega View API
		vegaEmbed('#stream', spec)
			.then(result => {
				/*console.log(result)*/
			})
			.catch(console.warn)
	}

	if (!quoteOrTrade.hasOwnProperty('quote')
		&& !quoteOrTrade.hasOwnProperty('trade'))
	{
		console.log(quoteOrTrade)
		return
	}

	var theThing = quoteOrTrade.hasOwnProperty('quote')
		? { type: 'quote', datetime: quoteOrTrade.quote.datetime, dollars: Number.parseFloat(quoteOrTrade.quote.bid)}
		: { type: 'trade', datetime: quoteOrTrade.trade.datetime, dollars: Number.parseFloat(quoteOrTrade.trade.last)}
	
	let quoteStreamChart = model.quoteStreamChart
	quoteStreamChart.data.values.push(theThing)
	drawChart(quoteStreamChart)
}

module.exports = (statelessView, masterModel)=>
{
	view = statelessView
	model = masterModel
	return {
		updateAccounts: updateAccounts
		, printAccount: printAccount
		, streamQuotes: streamQuotes
	}
}
