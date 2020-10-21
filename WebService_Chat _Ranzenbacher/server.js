//bring in from other classes
const formatMessage= require("./utilities/messages")
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require("./utilities/users")

const path= require("path");
const http=require("http")
const admin="Admin"
//create server
const express = require("express");
const socketio=require("socket.io")

const app = express();
const server=http.createServer(app)
const io=socketio(server)

//public folder should be static folder to access front end
//SET static folder
app.use(express.static(path.join(__dirname,"public")));
const PORT=process.env.PORT ||8080;  // environmental variable or this



//when client's ENTERING/CONNECTING
io.on("connection", socket => {
    socket.on("joinRoom",({username,room}) => {
     //JOIN room
        const user=userJoin(socket.id,username,room)
        socket.join(user.room)


        //Welcome user
        socket.emit("message",formatMessage(admin,"Welcome to the Chatroom "+user.username)) //is caught in main.js
        //broadcast to room users when connects
        socket.broadcast.to(user.room).emit("message",formatMessage(admin,`${user.username} joined the chat`))  //everybody but user that connected
        console.log(user.username+" in "+user.room)
        //send users and room info when a connect happens (listens)
        io.to(user.room).emit("roomUsers",{
            room:user.room,
            users: getRoomUsers(user.room)
        })
    })

    
    //LISTEN for chat msg from user
    socket.on("ChatMessage", (msg) => {
        const user=getCurrentUser(socket.id)
        io.to(user.room).emit("message",formatMessage(user.username,msg))
    })
    //when user DISCONNECTS, send message 
    socket.on("disconnect",() =>{
        const user=userLeaves(socket.id)
        if (user){
            io.to(user.room).emit("message",formatMessage(admin,`${user.username} has left`))
             //send users and room info when a connect happens (listens)
            io.to(user.room).emit("roomUsers",{
                room:user.room,
                users: getRoomUsers(user.room)
        })
        }        
    })
}) 

//run server with port nr.
    server.listen(PORT, () => 
        console.log(`Server running on PORT ${PORT}`));


