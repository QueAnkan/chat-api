import express from 'express'
import { getDb } from '../data/database.js'
import {isValidUser, isValidUserChange, userExists} from '../utils/userValidators.js'
import { isValidId } from '../utils/validators.js'
import { generateUserId } from '../utils/generateId.js'


const router = express.Router()
const db = await getDb()

// Hämta alla användare
router.get('/', async (req, res) => {
	console.log('GET/users:', db);
	await db.read()
	res.send(db.data.users)
})


// Hämta en användare utifrån id
router.get('/:userid', async (req, res) => {
	
	let userid = Number(req.params.userid)

	if(!isValidId(req.params.userid)) {
		res.sendStatus(400)
		console.log('Incorrect value, userid must be a number...');
		return
	}
	
	await db.read()
	
	let possibleUser = db.data.users.find(user => user.userid === userid)
	if (!possibleUser) {
		res.sendStatus(404)
		console.log('User not found...');
		return
	}
	res.send(possibleUser)
})


// Lägg till användare
router.post('/', async(req, res) => {
	const possibleUser = req.body

	if(isValidUser(possibleUser)){
		await db.read()
		if ( await userExists(db.data.users,possibleUser.uname, possibleUser.password)) {
			res.sendStatus(409) 
			console.log('Användaren finns redan')
		}else{
			possibleUser.id = await generateUserId();
			db.data.users.push(possibleUser);
			await db.write();
			res.send(possibleUser);
			console.log('post valid')		
		}
	}else {
		res.sendStatus(400); 
		console.log('felsöker, post invalid')
	}
})


// Ändra användare
router.put('/:userid', async (req, res) => {
	
	if(!isValidId(req.params.userid)) {
		res.sendStatus(400)
		console.log('Invalid value, userid must be a number...');
		return
	}

	let userid = Number(req.params.userid)

	if(!isValidUserChange(req.body)){
		res.sendStatus(400)
		console.log('Post invalid');
		return
	}

	await db.read()
	let oldUserIndex = db.data.users.findIndex(user => user.userid === userid)
	if (oldUserIndex === -1) {
		res.sendStatus(404)
		console.log('User not found');
		return
	}

	let editedUser = {
		...db.data.users[oldUserIndex]}
		editedUser = {
			...editedUser,
			...req.body,
			userid: userid
			 }


db.data.users[oldUserIndex] = editedUser 
await db.write()
res.sendStatus(200)
console.log('User has been edited');
})


// ta bort användare
router.delete('/:userid', async (req, res) => {

	if(!isValidId(req.params.userid)) {
		res.sendStatus(400)
		console.log('Invalid value, userid must be a number...');
		return
	}
	
	let userid = Number(req.params.userid)
	await db.read()

	let unwantedUser = db.data.users.find(user => user.userid === userid)
	if (!unwantedUser) {
		res.sendStatus(404)
		console.log("User not found");
		return
	}

	db.data.users = db.data.users.filter(users => users.userid !== userid)
	await db.write()
	res.sendStatus(200)
	console.log('User deleted');

})

export default router