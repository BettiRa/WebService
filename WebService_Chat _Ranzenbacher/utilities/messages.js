const moment = require("moment") //library

function formatMessage(username, text){
    return {
        username,
        text,
        time: moment().format("h:mm a")
    }
}
module.exports=formatMessage  //to bring into server.js