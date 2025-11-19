import React from 'react';
import Config from "./resources/Config.js"
import io from "socket.io-client";

import RSAKey from 'react-native-rsa';
import { AsyncStorage } from 'react-native';



let newSocket;
const socketConnect = (socket, setRenderNumber) => {
    console.log("Socket provided by App:", socket)

    /*
    socket.emit sends message to server through the socket,
    socket.on is used for recieving messages from the server
     */






    //checks if socket is non existance, disconnected or in the process of connecting
    if (!socket || (socket.disconnected && !socket.connecting)) {


        console.log("Creating a new socket");
        const url = Config("url");
        console.log("Connecting on url:", url)

        //this creates the socket with the parameters of set reconnection Attempts and time until connection timesout in ms
        newSocket = io(url, {reconnectionAttempts: 3, timeout:10000 });


        newSocket.on("connect_error", (error) => {
            console.log("Connection error:", error);
            //for debugging when connection error occurs
        });

        newSocket.on("connect_timeout", () => {
            console.log("Connection timeout");
        });

        newSocket.on("connect", () => {
            console.log("Connected to server");
            setRenderNumber(Math.floor(Math.random() * 1000000  ));
            //set render number is used for updating the disconnection screen
            newSocket.emit("join");

            //sends message to server of "join"
        });

        newSocket.on("message", (data) => {
            //Used for debugging and understanding what the server data is
            console.log("Received message from server:", );
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        /*
        newSocket.on("serverPublic", () =>{

        })

        const serverSend = (operation, parameters) => {
            newSocket.emit("dataSend",operation, parameters)
        }*/
        const test= () =>{
            console.log("testing serverapi")
        }

        //gives the new socket back to app
        return newSocket;
    }else{
        //a socket already exists and is connected
        console.log("Existing connection", socket)
        return "Existing"
    }
};














export default socketConnect;




