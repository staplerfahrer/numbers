//#region info
/*
	This file is required by the index.html file and will
	be executed in the renderer process for that window.
	All of the Node.js APIs are available in this process.
 */
//#endregion

require('./elements.js')() // no namespace

var	fs = require('fs')
	, format = require('./format.js')
	, view = require('./view.js')
	, comms = require('./comms.js')

var ally = {accounts: undefined}
	, requestTime = '...'

function holdingsLive()
{
	// streaming: https://vega.github.io/vega-lite/tutorials/streaming.html
	let spec =
	{
		"$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json",
		"description": "A simple bar chart with embedded data.",
		"width": 360,
		"data": {
			"values": [
				{ "x": "A", "y": 28 },
				{ "x": "B", "y": 55 },
				{ "x": "C", "y": 43 },
				{ "x": "D", "y": 91 },
				{ "x": "E", "y": 81 },
				{ "x": "F", "y": 53 },
				{ "x": "G", "y": 19 },
				{ "x": "H", "y": 87 },
				{ "x": "I", "y": 52 }
			]
		},
		"mark": "line",
		"encoding": {
			"x": { "field": "x", "type": "ordinal" },
			"y": { "field": "y", "type": "quantitative" },
			"tooltip": { "field": "y", "type": "quantitative" }
		}
	}

	// result.view provides access to the Vega View API
	let view = undefined
	let updateVega = ()=>
		{
			vegaEmbed('#vis', spec)
				.then(result => {
					console.log(result)
					view = result.view
				})
				.catch(console.warn)
		}
	updateVega()
	setInterval(()=> 
	{
		requestTime = format.time(new Date())
		comms.get(comms.url.accounts(), data=>{
			ally.accounts = JSON.parse(data).response.accounts
			ally.accounts.time = requestTime
			printAccount(ally.accounts)
			spec.data.values.push( 
				{
					x: requestTime
					, y: 1 
				})
			updateVega()
		})
	}, 5000)
}

function quotesLive()
{
	comms.stream(comms.url.quotes(['AAPL']), data=>
	{
		requestTime = `<em>${format.time(new Date())}</em>&nbsp;`
		view.setContent('stream', requestTime + data)
	})
}
	
function printAccount(accounts) 
{
	var s = accounts.accountsummary
		, holdings = s.accountholdings.holding
	
	tableHoldings = require('./tableHoldings.js')
	view.setHeader(requestTime)
	view.setContent('content', tableHoldings(format, holdings))
}

if (true) 
{
	holdingsLive()
	quotesLive()
} 
else 
{
	//test with a static file:
	var accountsRsp = JSON.parse(fs.readFileSync('accounts.json')).response.accounts
	accountsRsp.time = requestTime
	printAccount(accountsRsp)
}
