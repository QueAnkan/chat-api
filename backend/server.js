// import
import  express  from "express";
import cors from 'cors'
// import dotenv from 'dotenv'
// import jwt from 'jsonwebtoken'
import channelsRouter from './routes/channels.js'
import usersRouter from './routes/users.js'
import messagesRouter from './routes/messages.js'

// konfigurera servern

const app = express()
const port = 8008

// middleware
app.use( cors() )
app.use( (req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.body);
	next()
})

app.use('/api', express.json())


//// routes ////



app.use('/api/channels', channelsRouter)

app.use('/api/messages', messagesRouter)

// private get: returnerar  meddelanden(objekt med uname, medelandetext och tid) om man är behörig (inloggad)

//  private post: skickar  upp data object med användarnamn, input-värde(text) och tidsstämpel om behörig (inloggad)


//  users get hämta alla användare

app.use('/api/users', usersRouter)

//login post: skickar upp uname och password

// secret get: autentisering


// port som lyssnar
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})