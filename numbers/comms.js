/*
	https://www.ally.com/api/invest/documentation/node-streaming/

	Information used:
	https://www.ally.com/api/invest/documentation/oauth/
	and
	https://www.npmjs.com/package/oauth
	and
	https://www.ally.com/api/invest/documentation/node/
	Key thing to learn was: use npm package oauth,
		with version parameter '1.0A'
*/

var fs = require('fs')
	, oauth = require('oauth')
	, config = JSON.parse(fs.readFileSync('config.json'))
	, apiEndpoint = 'https://api.tradeking.com/v1'
	, apiStream = 'https://stream.tradeking.com/v1'
	, url = 
	{ 
		accounts: ()=> apiEndpoint + '/accounts.json'
		, quotes: symbolsArray=> apiStream + '/market/quotes.json?symbols=' + symbolsArray.join()
	}

var client = new oauth.OAuth(
	null, // for users 'https://developers.tradeking.com/oauth/request_token',
	null, // for users 'https://developers.tradeking.com/oauth/access_token',
	config.oauth.consumerKey,
	config.oauth.consumerSecret,
	'1.0A',
	null, // callback url for users
	'HMAC-SHA1')

var get = (url, callBack)=> client.get(
	url,
	config.oauth.oauthToken,
	config.oauth.oauthTokenSecret,
	(error, data, response)=> 
	{
		if (error) 
		{
			console.log(error)
		}
		else 
		{
			callBack(data)
		}
	})

var stream = (url, callBack)=>
	{
		var strm = client.get(
			url,
			config.oauth.oauthToken,
			config.oauth.oauthTokenSecret)

		strm.on('response',	
			response=>
			{
				response.setEncoding('utf8')
				response.on('data', 
					data=>
					{
						console.log(data)
						callBack(data)
					})
			})
		strm.end()
	}

module.exports = 
{
	url: url
	, get: get
	, stream: stream
}