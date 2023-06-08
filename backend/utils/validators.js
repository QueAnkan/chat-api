import { getDb } from "../data/database.js"


const db = await getDb()

function isValidChannel (c) {
	if ((typeof c) !== 'object' || c === null) {
		return false 
	}

	let chattnameIsValid = (typeof c.chattname) === 'string'
	chattnameIsValid = chattnameIsValid && c.chattname !==''

	let publicIsValid  = (typeof c.public) === 'boolean'
	publicIsValid = publicIsValid && c.public !==''

	if (!chattnameIsValid || !publicIsValid){
		return false
	}

	return true

}



async function isChannel(c){
	await db.read()
	let channelExists = db.data.channels.some(channel => channel.chattname === c.chattname)

	if(channelExists) {
		return true
	}
	return false
}


export {isValidChannel, isChannel}
