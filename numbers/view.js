function setHeader(html) {
	setContent('header', html)
}

function setContent(id, html) {
	document.getElementById(id).innerHTML = html
}

module.exports = {
	setHeader: setHeader
	, setContent: setContent
}