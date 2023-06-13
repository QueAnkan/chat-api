import { getDb } from "../data/database.js"

const db = await getDb()


// Kontrollerar om det finns en användare med det id som angetts
async function isUser(u) {
	await db.read()
	let userExists = db.data.users.some(user => user.userid === u.userid)

	if (userExists){
		return true
	}
	return false
}


//Kontrollerar om användarnamn och lösenord redan finns
async function userExists(users, uname, password) {
	for (let i = 0; i < users.length; i++) {
		if(users[i].uname === uname || users[i].password === password) {
			return true;
		}
	}
	return false

}


// Kontrollera att user-objekt är korrekt och innehåller både användare och lösenord
function isValidUser (u) {
	if ((typeof u) !== 'object' || u === null) {
		return false
	}
	let nameIsValid = (typeof u.uname) === 'string'
	nameIsValid = nameIsValid && u.uname !== ''

	let passwordIsValid = (typeof u.password) === 'string'
	passwordIsValid = passwordIsValid && u.password !== ''

	if(!nameIsValid || !passwordIsValid ) {
		return false
	}
	return true
}

// Kontrollerar att user-objektet är innehåller korrekta värden på användare eller lösenord
function isValidUserChange (u) {

	if((typeof u) !== 'object' || u === null) {
		return false
	}

	let unameIsValid = (typeof u.uname) === 'string'
	unameIsValid = unameIsValid && u.uname !== ''

	let passwordIsValid = (typeof u.password) === 'string'
	passwordIsValid = passwordIsValid && u.password !== ''

	if(u.uname) {
		if (!unameIsValid){
			return false
		}
		return true
	}

	if(u.password){
		if(!passwordIsValid){
			return false
		}
		return true
	}
	return true
}

export {isUser, isValidUser, userExists, isValidUserChange}