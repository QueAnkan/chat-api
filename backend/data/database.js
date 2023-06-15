import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'



async function getDb() {
	const __dirname = dirname(fileURLToPath(import.meta.url))
	const file = join(__dirname, 'db.json')
	const adapter = new JSONFile(file)
	const db = new Low(adapter, {})
	await db.read()
	// console.log(db.data);
	return db
	
}

export { getDb }