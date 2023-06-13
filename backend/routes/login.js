
import express from 'express'
import { getDb } from '../data/database.js'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const router = express.Router()
const db = await getDb()


const secret = process.env.SECRET 


//login post: skickar upp uname och password
router.post('/', async (req, res) => {


	if (!req.body || !req.body.uname || !req.body.password){
		res.sendStatus(400)
		console.log('Post invalid');
		return
	}
	const { uname, password} = req.body

	await db.read()

	let match = db.data.users.find(user => user.uname === uname)
	console.log('match',match);
	if (!match) {
		console.log('Fel användarnamn');
		res.sendStatus(401)
		return
	} 

	if (match.password !==password) {
		console.log('Fel lösenord');
		res.sendStatus(401)
		return
	}

	const hour = 60 * 60
	const payload = { userId : match.id}
	const options = {expiresIn: hour * 3}
	let token = jwt.sign(payload, secret, options)
	let tokenPackage = {token: token}
	res.send(tokenPackage)
})

export default router