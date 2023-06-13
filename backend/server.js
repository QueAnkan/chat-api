// import
import  express  from "express";
import cors from 'cors'
import * as dotenv from 'dotenv'
dotenv.config()

import channelsRouter from './routes/channels.js'
import usersRouter from './routes/users.js'
import messagesRouter from './routes/messages.js'
import loginRouter from './routes/login.js'

// konfigurera servern

const app = express()
const port = process.env.PORT || 3030


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

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

// secret get: autentisering


// port som lyssnar
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})