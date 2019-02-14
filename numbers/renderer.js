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
	, ally = {accounts: undefined}
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

const pad2z = (x) => ('' + x).padStart(2, '0')
const pad8s = (x) => ('' + x).padStart(8, ' ')

const time = () => {
	var t = new Date()
	var hrs = pad2z(t.getHours())
	var mins = pad2z(t.getMinutes())
	var secs = pad2z(t.getSeconds())
	return `${hrs}:${mins}:${secs}`
}

const text = (t) => 
	document.createTextNode(t)

const append = (node, child) =>
	(child ? node.appendChild(child).parentElement : node)

const p = (child) =>
	append(document.createElement('p'), child)

const code = (t) =>	
	append(document.createElement('pre'), 
		append(document.createElement('code'), text(t)))
	
function printAccount(accounts) {
	const reducer = (p, c) => 
		p + `${c.displaydata.symbol}\t${pad8s(c.costbasis)}${pad8s(c.gainloss)}\n`

	var s = accounts.accountsummary
		, holdings = s.accountholdings.holding

	var hTxt = holdings.reduce(reducer, '')
	var sumTxt = `${s.account}\n========\n${accounts.time}\n\n${hTxt}`
	
	append(eContent, code(sumTxt))
}

var requestTime = time()
// consumer.get(url.accounts(),
// 	config.oauth.oauthToken,
// 	config.oauth.oauthTokenSecret,
// 	(error, data, response) => {
// 		if (error) {
// 			console.log(error)
// 		} else {
// 			ally.accounts = JSON.parse(data).response.accounts
// 			ally.accounts.time = requestTime
// 			printAccount(ally.accounts)
// 		}
// 	})

// test with a static file:
var accountsRsp = JSON.parse(fs.readFileSync('accounts.json')).response.accounts
accountsRsp.time = requestTime
printAccount(accountsRsp)
