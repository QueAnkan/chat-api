import express from 'express'
import { getDb } from '../data/database.js'
import { isValidMessageChange, isValidMessage } from '../utils/messageValidators.js'
import {isValidId} from '../utils/validators.js'
import generateTimestamp from '../utils/generateTimestamp.js'
import { generateMessageId } from '../utils/generateId.js'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const router = express.Router()
const db = await getDb()
const secret = process.env.SECRET || 'M116610'

// Hämta meddelanden från en specifik kanal eller användare 
router.get('/', async (req, res) => {
	const {filterby, value} = req.query
	const valueAsNumber = Number(value)
	await db.read()

	let channel = db.data.channels.find(
		c => c.chatid === valueAsNumber)
		console.log('channel', channel);

		if( !valueAsNumber) {
			res.sendStatus(400)
			console.log('Invalid value, chat or sender value must be a number')
			return
		}

		if(filterby !== 'chat' && filterby !== 'sender'){
			res.sendStatus(400)
			console.log('Invalid query string, must be "chat" or "sender" ');
			return
		}
		
		function filterMessages(messages) {
			if (filterby === 'chat') {
				if (messages.chat === valueAsNumber ){
				return true;
				} 
			}
			else if (filterby === 'sender' ) {
				if (messages.sender === valueAsNumber && !messages.chat){
					return true
				}
			}
			return false;
		} 
		let chatMessages = db.data.messages.filter(filterMessages);
		console.log('chatMessages', chatMessages);
			if(chatMessages.length === 0) {
				res.sendStatus(404)
				console.log('Channel or sender does not exist');
				return
			} 

			let responseSent = false;

			for (let i = 0; i < chatMessages.length; i++){
				let message = chatMessages[i];
				if (chatMessages && filterby === 'sender'&& !message.chat ){
					let authHeader = req.headers.authorization
			console.log("authHeader", authHeader);
			if( !authHeader){
			res.status(403).send('Channel locked, you must be authenticated to use this channel.')
			responseSent = true
			break
			
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
			}
			

		if (!responseSent && chatMessages && channel.public === false){
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

	if (!responseSent) {
		res.send(chatMessages);
	}
		console.log('Messages recieved');
})


// lägga till meddelande i kanal eller DM
router.post('/', async (req,res) => {
	
	const newMessage = req.body
	const DM = req.body.reciever
	const channel = req.body.chat

	if(!isValidMessage(newMessage)) {
		await db.read()
		res.sendStatus(400)
		console.log('Post invalid');
		return
	}	
	await db.read()

	if(DM){
		let userExists = db.data.users.map(user => user.userid)
		if (!userExists.includes(DM)){
			res.sendStatus(400)
			console.log('Reciever does not exists');
			return
		}else{
			await db.read()
			newMessage.timestamp = await generateTimestamp()
			newMessage.messageid = await generateMessageId()
			db.data.messages.push(newMessage)
			await db.write()
			res.send(newMessage)
			console.log('Post valid');
		}
	}
	if(channel){
		let channelExist = db.data.channels.map(channel => channel.chatid)
console.log('channelExist', channelExist
);
console.log('channel', channel);
		if (!channelExist.includes(channel)) {
			res.sendStatus(400)
			console.log('Channel does not exist');
			return
		}
		else{
			await db.read()
			newMessage.timestamp = await generateTimestamp()
			newMessage.messageid = await generateMessageId()
			db.data.messages.push(newMessage)
			await db.write()
			res.send(newMessage)
			console.log('Post valid');
		}
	}	
})


// För att ändra i meddelanden, allt utom messageid kan ändras
 router.put('/:messageid', async (req, res) => {
	
	if(!isValidId(req.params.messageid)){
		res.sendStatus(400)
		console.log('Invalid value, messageid must be a number');
		return
	}

	let messageid = Number(req.params.messageid) 

	if(!isValidMessageChange(req.body)) {
		res.sendStatus(400)
		console.log('invalid value');
		return
	}

	await db.read()
	let oldMessageIndex = db.data.messages.findIndex(message => message.messageid === messageid)

	
	if(oldMessageIndex === -1) {
		res.sendStatus(404)
		console.log('Message not found');
		return
	}

	let editMessage = { ...db.data.messages[oldMessageIndex]}
	editMessage = {
		...editMessage,
		...req.body,
		messageid:messageid,
	}
	
	db.data.messages[oldMessageIndex] = editMessage
	await db.write()
	res.sendStatus (200)
	console.log('Message have been changed');
 })

 
// ta bort meddelande
router.delete('/:messageid', async (req, res) => {

	if(!isValidId(req.params.messageid)){
		res.sendStatus(400)
		console.log('Invalid value, messageid must be a number');
		return
	}

	let messageid = Number(req.params.messageid)
	await db.read()

	let unwantedMessage = db.data.messages.find(message => message.messageid === messageid)

	if (!unwantedMessage){
		res.sendStatus(404)
		console.log("Message not found");
		return
	}
	db.data.messages = db.data.messages.filter(message => message.messageid !== messageid)
	await db.write()
	res.sendStatus(200)
	console.log('Message deleted'); 

})

export default router