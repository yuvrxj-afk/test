const express = require('express')
const http = require('http')
const socket = require('socket.io')


const app = express();
const server = http.createServer(app)
const io = socket(server)

app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.send("<h1>On board in</h1>")
})

server.listen(3000,()=>{
    console.log("working")
})