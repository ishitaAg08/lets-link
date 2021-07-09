require("dotenv").config()
const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server)

io.on("connection", (socket) => {
	socket.emit("me", socket.id)
	
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})
if(process.env.NODE_ENV == "production"){
	app.use(express.static("client/public"));
	const path = require("path");
	/*app.get('*',(req,res)=>{
		res.sendFile(path.join(__dirname,'./client/public/index.html'))
	})*/
}

const port= process.env.PORT || 5000;
server.listen(port, () => console.log(`server is running on port ${port}`))
