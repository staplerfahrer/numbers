//#region info
/*
	This file is required by the index.html file and will
	be executed in the renderer process for that window.
	All of the Node.js APIs are available in this process.
 */
//#endregion

// require('./elements.js')()

const live = true
	, refresh = 3600

let comms = require('./comms.js')
	, model = require('./model.js')
	, view = require('./view.js')(model)
	, controller = require('./controller.js')(view, model)

function liveHoldings()
{
	setInterval(()=>
	{
		comms.get(comms.url.accounts(), 
			controller.updateAccounts)
	}, refresh)
}

function liveQuotes()
{
	comms.stream(comms.url.quotes(['TSLA','ALLY']), 
		controller.streamQuotes)
}

if (live)
{
	let fs = require('fs')
	let jsonData = fs.readFileSync('./accounts.json')
	controller.updateAccounts(JSON.parse(jsonData))
	liveHoldings()
	liveQuotes()
}
else
{
	let fs = require('fs')
	let jsonData = fs.readFileSync('./accounts.json')
	controller.updateAccounts(JSON.parse(jsonData))
	setInterval(() => {
		controller.updateAccounts(JSON.parse(jsonData))
	}, refresh)
}
