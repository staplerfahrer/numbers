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
	, view = require('./view.js')
	, controller = require('./controller.js')(view, model)
	, format = require('./format.js')

function liveHoldings()
{
	setInterval(()=>
	{
		comms.get(comms.url.accounts(), 
			data=>controller.updateAccounts(data))
	}, refresh)
}

function liveQuotes()
{
	comms.stream(comms.url.quotes(['TSLA']), 
		data=>controller.streamQuotes(data))
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
