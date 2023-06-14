import { getDb } from "../data/database.js"

 const db = await getDb()

async function generateUserId() {
	await db.read()
	const highestId = Number(db.data.users.reduce((maxId, currentUser) => {
		return Math.max(maxId, currentUser.userid) 
	}, 0))

	console.log('Generate: ', highestId)
	
	return highestId + 1 
	
}

async function generateChannelId() {
	console.log('Hämtar data: ? ', db)
	await db.read()
	const highestId = Number(db.data.channels.reduce((maxId, currentChannel) => { return Math.max(maxId, currentChannel.chatid)
	}, 0))
	return highestId + 1
}


async function generateMessageId() {
	await db.read()
	const highestId = Number(db.data.messages.reduce((maxId, currentMessage) => { return Math.max(maxId, currentMessage.messageid)
	}, 0))
	return highestId + 1
}


 export { generateUserId, generateChannelId, generateMessageId }