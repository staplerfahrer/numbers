let format = require('./format.js')
	, model = undefined
	, view = undefined


function updateAccounts(data) 
{

	function _transformAllyAccounts(apiAccounts)
	{
		function makeFloats(hldngsStr)
		{
			const f = Number.parseFloat
			let hldngsFlt = hldngsStr
			hldngsFlt.costbasis = f(hldngsStr.costbasis)
			hldngsFlt.gainloss = f(hldngsStr.gainloss)
			hldngsFlt.instrument.factor = f(hldngsStr.instrument.factor)
			hldngsFlt.instrument.mult = f(hldngsStr.instrument.mult)
			hldngsFlt.instrument.putcall = f(hldngsStr.instrument.putcall)
			hldngsFlt.instrument.strkpx = f(hldngsStr.instrument.strkpx)
			hldngsFlt.marketvalue = f(hldngsStr.marketvalue)
			hldngsFlt.marketvaluechange = f(hldngsStr.marketvaluechange)
			hldngsFlt.price = f(hldngsStr.price)
			hldngsFlt.purchaseprice = f(hldngsStr.purchaseprice)
			hldngsFlt.qty = f(hldngsStr.qty)
			hldngsFlt.quote.change = f(hldngsStr.quote.change)
			hldngsFlt.quote.lastprice = f(hldngsStr.quote.lastprice)
			hldngsFlt.sodcostbasis = f(hldngsStr.sodcostbasis)
			return hldngsFlt
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

	let accounts = model.ally.accounts
	accounts = _transformAllyAccounts(data.response.accounts)
	accounts.time = format.time(new Date())
	let datas = accounts.accountsummary.accountholdings.holding.map(
		h => ({
			"symbol": h.displaydata.symbol
			, "x": accounts.time
			, "y": h.gainloss
		}))
	printAccount(accounts)
	model.gainLossData.insert(datas)
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
	// function drawChart(spec) {
	// 	// streaming: https://vega.github.io/vega-lite/tutorials/streaming.html
	// 	// result.view provides access to the Vega View API
	// 	vegaEmbed('#stream', spec)
	// 		.then(result => {
	// 			/*console.log(result)*/
	// 		})
	// 		.catch(console.warn)
	// }

	if (!quoteOrTrade.hasOwnProperty('quote')
		&& !quoteOrTrade.hasOwnProperty('trade'))
	{
		console.log(quoteOrTrade)
		return
	}

	var theThing = quoteOrTrade.hasOwnProperty('quote')
		? { 
			type: 'quote'
			, datetime: quoteOrTrade.quote.datetime
			, dollars: Number.parseFloat(quoteOrTrade.quote.bid)
			, size: Number.parseInt(quoteOrTrade.quote.bidsz)
		}
		: { 
			type: 'trade'
			, datetime: quoteOrTrade.trade.datetime
			, dollars: Number.parseFloat(quoteOrTrade.trade.last)
			, size: Number.parseInt(quoteOrTrade.trade.vl)
		}
	
	quoteStreamChart.data.values.push(theThing)
	let datas = 
	model.quoteStreamData.insert(datas)
	// let quoteStreamChart = model.quoteStreamChart
	// drawChart(quoteStreamChart)
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
