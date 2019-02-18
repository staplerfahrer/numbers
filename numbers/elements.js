module.exports = ()=>
{	
	text = t=> 
		document.createTextNode(t)
	
	append = (node, child)=> 
		(child ? node.appendChild(child).parentElement : node)
	
	p = child=>
		append(document.createElement('p'), child)
	
	code = content=>	
		append(document.createElement('pre'), 
			append(document.createElement('code'), text(content)))
	
	//better functions
	div = (classes, children)=>
		{
			var d = document.createElement('div')
			d.classList.add(...classes)
			d.append(...children)
			return d
		}

	elems = htmlString=> 
		{
			d = document.createElement('div')
			d.innerHTML = htmlString
			return d.children
		}

	appendHtml = (node, htmlString)=>
		node.append(...elems(htmlString))
}