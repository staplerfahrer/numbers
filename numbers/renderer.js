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

var apiEndpoint = 'https://api.tradeking.com/v1'

var url = {
	accounts: () => apiEndpoint + '/accounts.json'
}

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
		var accountData = JSON.parse(data)
		console.log(accountData.response)
	})
