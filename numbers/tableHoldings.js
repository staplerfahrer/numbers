let f

function buildTable(holdingsArray) 
{
	return `
		<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
			${thead()}
			${tbody(holdingsArray)}
		</table>`
}

function thead()
{
	return `
		<thead>
			<tr>
				<th class="mdl-data-table__cell--non-numeric">Symbol</th>
				<th>Cost basis</th>
				<th>Last price</th>
				<th>Shares</th>
				<th>Gain/loss</th>
			</tr>
		</thead>`
} 

function tbody (holdings) 
{
	return `
		<tbody>
			${holdings.map(h=>row(h)).join('\n')}
		</tbody>`
}

function row (holding)
{
	return `
		<tr>
			<td class="mdl-data-table__cell--non-numeric">${holding.displaydata.symbol}</td>
			<td>${f.finan(holding.cost)}</td>
			<td>${f.finan(holding.price)}</td>
			<td>${holding.qty}</td>
			<td>${f.finan(holding.gainloss)}</td>
		</tr>`
}

module.exports = (formatter)=>
{
	f = formatter
	return {
		buildTable: buildTable
	}
}








