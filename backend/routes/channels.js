import { getDb } from "../data/database.js"
import express from 'express'
import { generateChannelId } from "../utils/generateId.js"
import { isValidChannel, isChannel } from "../utils/validators.js"

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
	
	let newChannel = req.body
	if (isValidChannel(newChannel)) {
		await db.read()
		if ( await isChannel(newChannel)) {
			res.sendStatus(409)
			console.log('chattname allready exists');
		}else {
			newChannel.chattid =  await generateChannelId()
			db.data.channels.push(newChannel)
			await db.write()
			res.send(newChannel)
			console.log('post valid');
		}
	}else {
		res.sendStatus(400)
		console.log('post invalid');
	}			
})




/* 
router.put()



router.delete('/', async (req, res) => {
	let id = Number(req.params.id)
	await db.read()
	let unwantedChannel = db.data.channels.find(channel => channel.id === id)
	if (!unwantedChannel){
		res.sendStatus(404)
		console.log("Channel not found");
		return
	}
	db.data.channels.filter(channel => channel.id !== id)
	await db.write()
	res.sendStatus(200)
	console.log('Channel deleted');


}) */




export default router