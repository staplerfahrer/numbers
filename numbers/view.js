let _model = undefined

function setHeader(html) 
{
	setContent('header', html)
}

function setContent(id, html) 
{
	document.getElementById(id).innerHTML = html
}

function setupGainLoss(spec, changeSet) 
{
	vegaEmbed('#vis', spec)
		.then(result => {
			setInterval(()=>{
				result.view
					.change('chartData', changeSet)
					.run()
			}, 1000)

		})
		.catch(console.warn)
}

function setupStream(spec, changeSet)
{
	vegaEmbed('#stream', spec)
		.then(result => {
			setInterval(() => {
				result.view
					.change('chartData', changeSet)
					.run()
			}, 1000)

		})
		.catch(console.warn)
}

module.exports = (model)=>
{
	_model = model

	setupGainLoss(_model.gainLossChart, _model.gainLossData)
	setupStream(_model.quoteStreamChart, _model.quoteStreamData)

	return {
		setHeader: setHeader
		, setContent: setContent
	}
} 
