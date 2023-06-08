import express from 'express'
import { getDb } from '../data/database.js'
import { isValidId } from '../utils/validators.js'

const router = express.Router()
const db = await getDb()

// Hämta meddelanden från en specifik kanal

// TODO validering för om inloggad eller ej

router.get('/:chat', async (req, res) => {
if(!isValidId(req.params.chat)) {
	res.sendStatus(400)
	console.log('Invalid value, chat must be a number')
	return
}

let chat = Number(req.params.chat)

await db.read()
let chatMessages = db.data.messages.filter(messages => messages.chat === chat)

if(chatMessages.length === 0) {
	res.sendStatus(404)
	console.log('Chanel does not exist');
	return
}
res.send(chatMessages)
console.log('Messages recieved');
})


// lägga till meddelande
// TODO validering

router.post('/', async (req,res) => {

	let newMessage = req.body
	await db.read()
	db.data.messages.push(newMessage)
	await db.write()
	res.send(newMessage)
	console.log('Post valid');
})











export default router