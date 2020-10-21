
const chatForm=document.getElementById("chat-form") //from chat.html 
const chatMessages=document.querySelector(".chat-messages")
const roomName=document.getElementById("room-name")
const userList=document.getElementById("users")

//get username and room from URL 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});
console.log("Your Username and room:"+username+" in "+room)  
  

const socket=io()  //have access because I added scripttag at "chat.html"

//JOIN room
socket.emit("joinRoom", {username,room})
console.log("You joined a chatroom")

//get room and its users
socket.on("roomUsers",({room,users})=>{
    outputRoomName(room)
    outputUsers(users)

})

//catch messages from server
socket.on("message", message =>{
    console.log(message)   //log message from Server
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//when message is submitted
chatForm.addEventListener("submit", e =>{
    e.preventDefault()   //when u submit form, it submits it to a file. We STOP that
    //get msg text
    const msg = e.target.elements.msg.value //id in chat.html = msg  //need value
   //emit msg to server
    socket.emit("ChatMessage",msg)

    //clear input after submission
    e.target.elements.msg.value=""
    e.target.elements.msg.focus();

})
//add message to DOM-tree
function outputMessage(message){
    const div=document.createElement("div")
    div.classList.add("message")
    //change <p>
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    //add <div> to chat-messages
    document.querySelector(".chat-messages").appendChild(div)
}

//add room to DOM
function outputRoomName(room){
    roomName.innerText = room
    console.log("room is updated to "+room)
}
//add users to DOM
function outputUsers(users){
   userList.innerHTML = `${users.map(user =>`<li>${user.username}</li>`).join("")}` //join cause its an array
   console.log("user is added")
}