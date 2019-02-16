var f
	, cost = holding =>
		Number.parseFloat(holding.costbasis) / Number.parseFloat(holding.qty)
	, thead = `
		<thead>
			<tr>
				<th class="mdl-data-table__cell--non-numeric">Symbol</th>
				<th>Cost basis</th>
				<th>Last price</th>
				<th>Shares</th>
				<th>Gain/loss</th>
			</tr>
		</thead>`
	, tbody = holdings => `
		<tbody>
			${holdings.map(h => row(h)).join('\n')}
		</tbody>`
	, row = holding => `
		<tr>
			<td class="mdl-data-table__cell--non-numeric">${holding.displaydata.symbol}</td>
			<td>${f.finan(cost(holding))}</td>
			<td>${f.finan(holding.price)}</td>
			<td>${holding.qty}</td>
			<td>${f.finan(holding.gainloss)}</td>
		</tr>`

module.exports = (format, holdingsArray) => {
	f = format
	table = `
		<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
			${thead}
			${tbody(holdingsArray)}
		</table>`

	return table
}


