const express=require("express");
const app=express();
const http=require("http");
const { join } = require("path");
let server=http.createServer(app);
let cors=require('cors')

const {Server}=require("socket.io");
const io=new Server(server,{
    cors:{
        origin:"http://127.0.0.1:5500"
    }
});

app.use(cors());


app.get("/",(req,res)=>{
    res.sendFile(join(__dirname,"index.html"))
})





io.on('connection',(socket)=>{
    console.log("a user Connection",socket.id);
    //create event whe user connected
    socket.broadcast.emit("user_connected",{userId:socket.id});

    socket.on("message",(msg)=>{
        io.emit("sendMessageForAll",{msg:msg,userId:socket.id})
    })

    socket.on('typing',()=>{
        socket.broadcast.emit("client_typing")
    })

    socket.on('stoptyping',()=>{
        socket.broadcast.emit('stop_typing');
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit("user_left",{userId:socket.id});
        console.log("left");
    });


    
})


//we run the server not app
server.listen(3000,()=>{
    console.log("server localhost 3000");
})