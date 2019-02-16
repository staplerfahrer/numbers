//#region info
/*
	This file is required by the index.html file and will
	be executed in the renderer process for that window.
	All of the Node.js APIs are available in this process.
 */
//#endregion

require('./html.js')() // no namespace

var	fs = require('fs')
	, format = require('./format.js')
	, view = require('./view.js')
	, comms = require('./comms.js')

var ally = {accounts: undefined}
	, requestTime = '...'

function holdingsLive()
{
	setInterval(()=> {
		requestTime = format.time(new Date())
		comms.get(comms.url.accounts(), data=>{
			ally.accounts = JSON.parse(data).response.accounts
			ally.accounts.time = requestTime
			printAccount(ally.accounts)
		})
	}, 5000)
}

function quotesLive()
{
	comms.stream(comms.url.quotes(['AAPL']), data=>
	{
		view.setContent('stream', data)
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
	//holdingsLive()
	quotesLive()
} 
else 
{
	//test with a static file:
	var accountsRsp = JSON.parse(fs.readFileSync('accounts.json')).response.accounts
	accountsRsp.time = requestTime
	printAccount(accountsRsp)
}
