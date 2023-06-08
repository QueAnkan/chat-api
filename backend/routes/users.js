import express from 'express'
import { getDb } from '../data/database.js'



const router = express.Router()
const db = await getDb()

// Hämta alla användare

router.get('/', async (req, res) => {
	console.log('GET/users:', db);
	await db.read()
	res.send(db.data.users)
})

export default router