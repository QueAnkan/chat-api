import { getDb } from "../data/database.js"
import express from 'express'
import { generateChannelId } from "../utils/generateId.js"
import { isValidChannel, isChannel, isValidId } from "../utils/validators.js"
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const router = express.Router()
const db = await getDb()

const secret = process.env.SECRET || 'M116610'

//channel get: returnerar alla kanaler
router.get('/', async (req, res) => {
	await db.read()
	let channels = db.data.channels
	res.send(channels)
})


// Channel get:id hämta en kanal med hjälp av id
router.get('/:chatid', async (req, res) => {

	let chatid = Number(req.params.chatid)

	if(!isValidId(req.params.chatid)) {
		res.sendStatus(400)
		console.log('Incorrect value, chatid must be a number...');
		return
	}
 
	await db.read()
	
	let possibleChannel = db.data.channels.find( channel => channel.chatid === chatid)
		if (!possibleChannel) {
			res.sendStatus(404)
			console.log('Channel not found');
			return
		}

	if (!possibleChannel.public){
		let authHeader = req.headers.authorization
		console.log("authHeader", authHeader);
		if( !authHeader){
		res.status(403).send('Channel locked, you must be authenticated to use this channel.')
		console.log("Channel locked, you must be authenticated to use this channel.");
		return
		}
		
		let token = authHeader.replace ( 'Bearer ', '')

		try{
			let decoded = jwt.verify(token, secret)
			let userId = Number(decoded.userId)
			console.log(decoded, decoded.userId);
			let user = db.data.users.find( u => u.userid === userId)
			console.log('user', user);
			if (user){
			res.sendStatus(200)
			console.log(`User ${user.uname} is authenticated and has access to this private channel`);
			}else{
				res.status(404).send('User not found')
				console.log('User not found');
			}
			
			return
		}
		catch(error){
		res.status(401).send('Token for authentication not valid in this GET-request')
		console.log(error);
		return
		}
	}

		res.send(possibleChannel)
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


// ta bort en befintlig kanal med hjälp av id
router.delete('/:chatid', async (req, res) => {

	if(!isValidId(req.params.chatid)){
		res.sendStatus(400)
		console.log('Invalid value, chatid must be a number');
		return
	}

	let chatid = Number(req.params.chatid)
	await db.read()

	let unwantedChannel = db.data.channels.find(channel => channel.chatid === chatid)
		
	if (!unwantedChannel){
		res.sendStatus(404)
		console.log("Channel not found");
		return
	}
	db.data.channels = db.data.channels.filter(channel => channel.chatid !== chatid)
	await db.write()
	res.sendStatus(200)
	console.log('Channel deleted');

})

export default router