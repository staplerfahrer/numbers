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

var oauth = require('oauth')
	, fs = require('fs')
	, config = JSON.parse(fs.readFileSync('config.json'))
	, apiEndpoint = 'https://api.tradeking.com/v1'
	, url = {accounts: () => apiEndpoint + '/accounts.json'}
	, ally = {account: null}
	, eContent = document.getElementById('content')

//oauth.generate('GET', url.accounts, )
var consumer = new oauth.OAuth(
	'https://developers.tradeking.com/oauth/request_token',
	'https://developers.tradeking.com/oauth/access_token',
	config.oauth.consumerKey,
	config.oauth.consumerSecret,
	'1.0A',
	null,
	'HMAC-SHA1')

consumer.get(url.accounts(), 
	config.oauth.oauthToken, 
	config.oauth.oauthTokenSecret, 
	(error, data, response) => {
		if (error)
			console.log(error)
		else
			ally.account = JSON.parse(data).response
		
		printAccount(ally.account)
	})

// const newP = (child) => {
// 	p = document.createElement('p')
// 	if (child) p.appendChild(child)
// 	return p
// }
const text = (t) => 
	document.createTextNode(t)

const append = (node, child) =>
	(child ? node.appendChild(child) : node)

const p = (child) =>
	append(document.createElement('p'), child)

const code = (t) =>	
	append(document.createElement('pre'), 
		append(document.createElement('code'), text(t)))
	
function printAccount(account) {
	var s = account.accounts.accountsummary
		, holdings = s.accountholdings.holding
	const reducer = (p, c) => p + `${c.displaydata.symbol}: ${c.costbasis}, ${c.gainloss}.\n`
	var hTxt = holdings.reduce(reducer, '')
	var sumTxt = `${s.account}: ${hTxt}`
	
	append(eContent, t(sumTxt))
}