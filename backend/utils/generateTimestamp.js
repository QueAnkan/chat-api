

async function generateTimestamp () {
	let timestamp = new Date()
	console.log(timestamp);

	return Number(timestamp)
}

export default generateTimestamp