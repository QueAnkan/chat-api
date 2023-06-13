import { getDb } from "../data/database.js"

const db = await getDb()


// kontrollera att message har korrekta värden vid POST
function isValidMessage (m) {
	if ((typeof m) !== 'object' || m === null) {
		return false
	}

	let contentIsValid = (typeof m.content) === 'string' 
	let possibleChat = (typeof m.chat) === 'number' || (typeof m.reciever) === 'number'
	
	if(!possibleChat || !contentIsValid) {
		return false
	}
	return true	
}


// Kontrollera att message är ett objekt och att det är rätt värden på det man vill ändra vid PUT
function isValidMessageChange (m) { 
	if((typeof m) !== 'object' || m === null){
		return false
	}
	let contentIsValid = (typeof m.content) === 'string' 
	let possibleChat = (typeof m.chat) === 'number' || (typeof m.reciever) === 'number'
	let validSender = (typeof m.sender) === 'number'

	if(m.content) {
		if(!contentIsValid){
			return false
		}
		return true
	}

	if(m.chat || m.reciever) {
		if (!possibleChat){
		return false}
	}

	if(m.sender) {
		if(!validSender){
			return false
		}
		return true
	}

	return true
}

export { isValidMessage, isValidMessageChange}