//#region info
/*
	This file is required by the index.html file and will
	be executed in the renderer process for that window.
	All of the Node.js APIs are available in this process.

	Information used:
	https://www.ally.com/api/invest/documentation/oauth/
	and
	https://www.npmjs.com/package/oauth
	and
	https://www.ally.com/api/invest/documentation/node/
	Key was: use oauth npm package, 
	with version parameter '1.0A'
 */
//#endregion

require('./html.js')() // no namespace

var format = require('./format.js')
	, view = require('./view.js')

var oauth = require('oauth')
	, fs = require('fs')
	, config = JSON.parse(fs.readFileSync('config.json'))
	, apiEndpoint = 'https://api.tradeking.com/v1'
	, apiStream = 'https://stream.tradeking.com/v1'
	, url = {accounts: () => apiEndpoint + '/accounts.json'}
	, ally = {accounts: undefined}
	, requestTime = format.time(new Date())

	
function printAccount(accounts) 
{
	var s = accounts.accountsummary
		, holdings = s.accountholdings.holding
	
	tableHoldings = require('./tableHoldings.js')
	view.setHeader(requestTime)
	view.setContent('content', tableHoldings(format, holdings))
}

if (false) 
{
	var consumer = new oauth.OAuth(
		'https://developers.tradeking.com/oauth/request_token',
		'https://developers.tradeking.com/oauth/access_token',
		config.oauth.consumerKey,
		config.oauth.consumerSecret,
		'1.0A',
		null,
		'HMAC-SHA1')

	setInterval(() => 
	{
		requestTime = format.time(new Date())
		consumer.get(
			url.accounts(),
			config.oauth.oauthToken,
			config.oauth.oauthTokenSecret,
			(error, data, response) => 
			{
				if (error) 
				{
					console.log(error)
				} 
				else 
				{
					ally.accounts = JSON.parse(data).response.accounts
					ally.accounts.time = requestTime
					printAccount(ally.accounts)
				}
			})
	}, 5000)
} 
else 
{
	//test with a static file:
	var accountsRsp = JSON.parse(fs.readFileSync('accounts.json')).response.accounts
	accountsRsp.time = requestTime
	printAccount(accountsRsp)
}
