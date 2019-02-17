//#region info
/*
	This file is required by the index.html file and will
	be executed in the renderer process for that window.
	All of the Node.js APIs are available in this process.
 */
//#endregion

require('./elements.js')() // no namespace

let format = require('./format.js')
	, comms = require('./comms.js')
	, model = require('./model.js')
	, view = require('./view.js')
	, controller = require('./controller.js')(view, model, format)


function liveHoldings()
{
	setInterval(()=>
	{
		comms.get(
			comms.url.accounts(), 
			(jsonData)=>{controller.refreshHoldings(JSON.parse(jsonData))})
	}, 5000)
}

function liveQuotes()
{
	// comms.stream(comms.url.quotes(['AAPL']), data=>
	// {
	// 	let label = `<em>${format.time(new Date())}</em>&nbsp;`
	// 	view.setContent('stream', label + data)
	// })
}

if (true)
{
	liveHoldings()
	liveQuotes()
}
