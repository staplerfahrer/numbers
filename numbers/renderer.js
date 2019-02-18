//#region info
/*
	This file is required by the index.html file and will
	be executed in the renderer process for that window.
	All of the Node.js APIs are available in this process.
 */
//#endregion

// require('./elements.js')()

let comms = require('./comms.js')
	, model = require('./model.js')
	, view = require('./view.js')
	, controller = require('./controller.js')(view, model)
	, format = require('./format.js')

function liveHoldings()
{
	setInterval(()=>
	{
		comms.get(
			comms.url.accounts(), 
			(jsonData)=>{controller.updateAccounts(JSON.parse(jsonData))})
	}, 60000)
}

function liveQuotes()
{
	comms.stream(comms.url.quotes(['AAPL']), data=>
	{
		let label = `<em>${format.time(new Date())}</em>&nbsp;`
		view.setContent('stream', label + data)
	})
}

if (true)
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
	}, 1000)
}
