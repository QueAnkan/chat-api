// import
import  express  from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

// kofigurera servern

// middleware
app.use( cors() )
app.use ( express.json() )
app.use( (req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.body);
})



//// routes ////

//public get: returnerar publika kanaler: kanalnamn och array av meddelanden(objekt med uname, medelandetext och tid) 

// public post: skickar upp data object med användarnamn, input-värde(text) och tidsstämpel


//login post: skickar upp uname och password

// secret get: autentisering


// port som lyssnar