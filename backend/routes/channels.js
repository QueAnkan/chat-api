import { getDb } from "../data/database.js"
import express from 'express'
import { generateChannelId } from "../utils/generateId.js"
import { isValidChannel, isChannel, isValidId } from "../utils/validators.js"

const router = express.Router()
const db = await getDb()




//channel get: returnerar alla kanaler

router.get('/', async (req, res) => {
	await db.read()
	let channels = db.data.channels
	res.send(channels)
})

// chanel post: skickar upp ny kanal med genererat id
router.post('/', async (req, res) => {
	
	const newChannel = req.body
	if (isValidChannel(newChannel)) {
		await db.read()
		if ( await isChannel(newChannel)) {
			res.sendStatus(409)
			console.log('chatname allready exists');
		}else {
			newChannel.chatid =  await generateChannelId()
			db.data.channels.push(newChannel)
			await db.write()
			res.send(newChannel)
			console.log('post valid');
		}
	}else {
		res.sendStatus(400)
		console.log('Post invalid');
	}			
})





// router.put()



router.delete('/:chatid', async (req, res) => {

	if(!isValidId(req.params.chatid)){
		res.sendStatus(400)
		console.log('Invalid value, chatid must be a number');
		return
	}

	let chatId = Number(req.params.chatid)
	await db.read()

	let unwantedChannel = db.data.channels.find(channel => channel.chatid === chatId)
		
	if (!unwantedChannel){
		res.sendStatus(404)
		console.log("Channel not found");
		return
	}
	db.data.channels = db.data.channels.filter(channel => channel.chatid !== chatId)
	await db.write()
	res.sendStatus(200)
	console.log('Channel deleted');

})

export default router