module.exports = (()=>{
	const pad2z = (x)=> ('' + x).padStart(2, '0')
	const padTab = (x)=> ('' + x).padStart(10, ' ')
	const fFinan = (x)=> padTab(Number.parseFloat(x).toFixed(3))
	const fTime = (t)=> {
		var hrs = pad2z(t.getHours())
		var mins = pad2z(t.getMinutes())
		var secs = pad2z(t.getSeconds())
		return `${hrs}:${mins}:${secs}`
	}
	
	return {
		pad2z: pad2z,
		padTab: padTab,
		finan: fFinan,
		time: fTime
	}
})()
