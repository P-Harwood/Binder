import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { AsyncStorage } from 'react-native';





import socketConnect from './socketConnect';
import SignUpMain from './components/SignUp/SignUpMain';
import MainScreen from './components/MainApp/MainScreen';
import styles from './resources/styles/styles';

import { Buffer } from 'buffer';

import { Crypt, RSA } from 'hybrid-crypto-js';
import Aes from 'react-native-aes-crypto'





export default function App() {
    //Root component off the application

    const [currentScreen, setCurrentScreen] = useState('SignUp');
    //Current screen which dictates if the application goes to Sign up page or MainScreen

    const [socket, setSocket] = useState(null);
    //Socket used to contact the server


    const [userDetails, setUserDetails] = useState(null);
    //Contains user Details, fetched from the server


    const [renderNumber, setRenderNumber] = useState(null);

    const [publicKey, setPublicKey] = useState(null);
    const [AESKey, setAESKey] = useState(null);



    /*
    const generateRSAKey = async () => {
      try {
          const RSAKey = require('react-native-rsa');
          const bits = 2048;
          const exponent = '10001';
          const rsa = new RSAKey();
          await rsa.generate(bits, exponent);




          const genPublicKey = {
                n: rsa.n.toString(),
                e: rsa.e.toString(),
              };
          console.log(convertKeyToPEM(genPublicKey.n, genPublicKey.e))



          setPrivateKey(rsa.getPrivateString());
          setPublicKey(genPublicKey);

          await checkSocketConnection(genPublicKey)
          return true
      } catch (error) {
        console.log('Error generating RSA key:', error);
      }
    };

    };*/
    const generateAES = (size) =>{
        return Aes.randomKey(size)
    };

    const encryptAES = async (publicKey) => {
        try {


          console.log(publicKey);


          console.log("HERE")
          const rsa = new RSA();
          const crypt = new Crypt();


          const encrypted_Key = await crypt.encrypt(publicKey, generateAES(32).toString('base64'));
          const encrypted_IV = await crypt.encrypt(publicKey,generateAES(16).toString('base64'));

          const keys = {
              key: encrypted_Key,
              IV: encrypted_IV};
          console.log('Encrypted AES key:', keys.key);
          console.log('Encrypted AES IV:', keys.IV);
          socket.emit("ClientAESKey",keys)

      } catch (error) {
        console.log('Error generating RSA key:', error);
      }
    }

    const checkSocketConnection = () => {
        //Checks if a socket connection is present
        if (!socket || (socket.disconnected && !socket.connecting)) {
            console.log('Connecting to server...');


            //Creates a new socket it can either return a string of "existing"
            // (extra validation to prevent disconnecting a valid socket) or it returns a new socket
            const newSocket = socketConnect(socket, setRenderNumber);

            //If a socket is returned, socket becomes returned newSocket
            if (newSocket !== 'Existing') {
                setSocket(newSocket);
                console.log('Creating New Socket');
                console.log('Emitting public key to server:', publicKey);


                newSocket.on("ServerRSA", (serverRSA) => {
                    setPublicKey(serverRSA)
                    })
                newSocket.emit('RequestRSA');
                setRenderNumber(Math.floor(Math.random() * 1000000));
            } else {
                console.log('socketConnect already has a valid socket');
                setRenderNumber(Math.floor(Math.random() * 1000000));
            }
        } else {
            console.log('SocketConnection is already valid');
            setRenderNumber(Math.floor(Math.random() * 1000000));
            console.log(
                'Socket Connected:',
                socket.connected,
                'Socket Connecting:',
                socket.connecting,
                'Socket Disconnected:',
                socket.disconnected
            );
        }
    };

    useEffect(() => {
        const callSocketFunction = async() =>{
            await checkSocketConnection()
                    console.log("Initial Use Effect Called. Socket being created");

            }
        callSocketFunction();
    }, []);

     useEffect(() => {
       const useEffectPublicKey = async () => {
         console.log(publicKey);
         await encryptAES(publicKey);
       };
       useEffectPublicKey();
     }, [publicKey]);



    useEffect(() => {
      if (socket) {
        socket.on("AES", async (key) => {
          try {
            await AsyncStorage.setItem('AESKey', key);
            console.log('AESKey stored in AsyncStorage:', key);
          } catch (error) {
            console.log('Error storing AESKey in AsyncStorage:', error);
          }
        });
      }
    }, [socket]);


    useEffect(() => {
        console.log("User Details updated. New Value:",userDetails);
        if (userDetails) {
            //if userDetails is truthy (has any value, not something such as false, [] or {}
            setCurrentScreen('MainScreen');
        }
        //useEffect is called when parameters are altered (in this situation [userDetails])
    }, [userDetails]);

    const screenControl = () => {
        //tells the screen what component to provide (disconnection Screen, MainScreen or SignUP)


        if (!socket || socket.disconnected) {
            //if no valid socket is present then a disconnection screen is returned
            return (
                <View style={{ backgroundColor: 'black', height: '100%', width: '100%' }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 4 }}>
                        <Text style={[styles.text, { alignSelf: 'center' }]}>Binder is Loading</Text>
                        <Text style={[styles.text, { alignSelf: 'center' }]}>
                            Please have patience, We are establishing a connection for you.
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
            );
        } else {
            //if a valid socket is present then either the component of MainScreen or Signup is displayed
            return (
                <View>
                    {currentScreen === "SignUp" &&<SignUpMain returnUserInformation={setUserDetails} socket={socket}/>}
                    {currentScreen === "MainScreen" &&<MainScreen setScreen = {setCurrentScreen} userDetails={userDetails} socket={socket} />}
                </View>
            );
        }
    };


    /*
    this is what calls screenControl, the key is set to render number, so it can be easily updated
    this method was originally used to update through components but an interval check would
    rerender all subcomponents and ruin the app
     */
    return <View key = {renderNumber}>{screenControl()}</View>;
}
