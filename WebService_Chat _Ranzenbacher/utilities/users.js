const users=[]
//mySQL
var express=require("express") 
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "WebService1",
  database: "chatDB"
});

//connect database
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

//create users table if not existent
var sql = "CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,socketid VARCHAR(255), name VARCHAR(255), room VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err){ console.log("User Table exists")}
        else
        console.log("User Table created");
      });



      function dropDB(){
        var sql = "DROP Table users"
       con.query(sql, function (err, result) {
        if (err){ console.log("err")}
       else
           console.log("dropped");
       });
    }
    



//USER

//join user to chat
function userJoin(id, username, room){
    const user = { id, username, room } //create
    users.push(user) //add to array

    //insert to DB

   

    var sqlFind=`SELECT * FROM users WHERE name= "${username}"`;
    con.query(sqlFind, function (err, result) {
        console.log(result)
        if (result.length===0) {
            console.log("no entry found in DB")
            var sql = `INSERT INTO users (socketid,name, room) VALUES ('${id}','${username}', '${room}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(`INSERTED user: ${username}`);
              });
    }
    else {
        var sql = `UPDATE users SET room="${room}" WHERE name="${username}"`;
        con.query(sql, function (err, result) {
            console.log("1 user updated in DB");
        });
    }
    })
    return user
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
}
//user leaves the chat
function userLeaves(id){
    const index = users.findIndex(user=> user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0] //take out user
    }
}

//get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

//export
module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
}