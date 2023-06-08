import { getDb } from "../data/database.js"

const db = await getDb()

// kontrollerar att channel har korrekta värden vid POST

function isValidChannel (c) {
	if ((typeof c) !== 'object' || c === null) {
		return false 
	}

	let chatnameIsValid = (typeof c.chatname) === 'string'
	chatnameIsValid = chatnameIsValid && c.chatname !==''

	let publicIsValid  = (typeof c.public) === 'boolean'
	publicIsValid = publicIsValid && c.public !==''

	if (!chatnameIsValid || !publicIsValid){
		return false
	}

	return true

}

// Kontrollerar att det inte redan finns en kanal med det namn som angetts

async function isChannel(c){
	await db.read()
	let channelExists = db.data.channels.some(channel => channel.chatname === c.chatname)

	if(channelExists) {
		return true
	}
	return false
}



 function isValidId(id) {
	let maybeId = Number(id) 
	if(isNaN(maybeId) ) {
		return false 
	}
	return maybeId >= 0  
} 


export {isValidChannel, isChannel, isValidId}
