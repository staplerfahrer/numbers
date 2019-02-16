var fs = require('fs')
	, oauth = require('oauth')
	, config = JSON.parse(fs.readFileSync('config.json'))
	, apiEndpoint = 'https://api.tradeking.com/v1'
	, apiStream = 'https://stream.tradeking.com/v1'
	, url = 
	{ 
		accounts: apiEndpoint + '/accounts.json' 
	}

var consumer = new oauth.OAuth(
	'https://developers.tradeking.com/oauth/request_token',
	'https://developers.tradeking.com/oauth/access_token',
	config.oauth.consumerKey,
	config.oauth.consumerSecret,
	'1.0A',
	null,
	'HMAC-SHA1')

var get = (url, callBack) => consumer.get(
	url,
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
			callBack(data)
		}
	})


module.exports = 
{
	url: url
	, get: get
}