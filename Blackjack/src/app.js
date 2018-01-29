// app.js

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

// Set up for static file
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// listen on port 3000
app.listen(3000)
