import express from 'express'
import { getDb } from '../data/database.js'
import { isValidMessageChange, isValidMessage } from '../utils/messageValidators.js'
import {isValidId} from '../utils/validators.js'
import generateTimestamp from '../utils/generateTimestamp.js'
import { generatemessageid } from '../utils/generateId.js'

const router = express.Router()
const db = await getDb()


// Hämta meddelanden från en specifik kanal eller användare 
router.get('/', async (req, res) => {
	const {filterby, value} = req.query
	const valueAsNumber = Number(value)
	await db.read()

		if( !valueAsNumber) {
			res.sendStatus(400)
			console.log('Invalid value, chat or sender value must be a number')
			return
		}

		if(filterby !== 'chat' && filterby !== 'sender'){
			res.sendStatus(400)
			console.log('Invalid query string, must be "chat" or "sender" ');
		}
		
		function filterMessages(messages) {
			if (filterby === 'chat') {
				if (messages.chat === valueAsNumber ){
				return true;
				} 
			}
			else if (filterby === 'sender') {
				if (messages.sender === valueAsNumber){
					return true
				}
			}
			return false;
		} 
		let chatMessages = db.data.messages.filter(filterMessages);
			if(chatMessages.length === 0) {
				res.sendStatus(404)
				console.log('Chanel or sender does not exist');
				return
			} 
		res.send(chatMessages)
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
	}	
	await db.read()

	if(DM){
		let userExists = db.data.users.map(user => user.userId)
		
		if (!userExists.includes(DM)){
			res.sendStatus(400)
			console.log('Reciever does not exists');
			return
		}
	}
	if(channel){
		let channelExist = db.data.channels.map(channel => channel.chatid)

		if (!channelExist.includes(channel)) {
			res.sendStatus(400)
			console.log('Channel does not exist');
			return
		}
	}
	else{
		await db.read()
		newMessage.timestamp = await generateTimestamp()
		newMessage.messageid = await generatemessageid()
		db.data.messages.push(newMessage)
		await db.write()
		res.send(newMessage)
		console.log('Post valid');
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
		console.log('Could not find the message id to change the message...');
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