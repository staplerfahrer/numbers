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
	function ok(x)
	{
		return (x.hasOwnProperty('quote')
			|| x.hasOwnProperty('trade'))
	}	

	function theThing(qt) 
	{
		return (qt.hasOwnProperty('quote')
			? {
				type: 'quote'
				, datetime: qt.quote.datetime
				, dollars: Number.parseFloat(qt.quote.bid)
				, size: Number.parseInt(qt.quote.bidsz)
			}
			: {
				type: 'trade'
				, datetime: qt.trade.datetime
				, dollars: Number.parseFloat(qt.trade.last)
				, size: Number.parseInt(qt.trade.vl)
			})
	}

	quoteOrTrade.filter(x=>!ok(x)).map(x=>console.log(x))
	let datas = quoteOrTrade.filter(ok).map(theThing)
	model.quoteStreamData.insert(datas)
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
