import {Text, View} from 'react-native';
import React from 'react';
import stylesOpenChats from '../../../../resources/styles/stylesOpenChats.js';

const Conversation = (props) => {
    const {localUserID, messageDetails} = props;


    //this creates a text box for each singular  message

    //applies chat style dependent on who sends the messsage
    const getBoxStyle = () => {
        if (messageDetails["sender_id"] === localUserID) {
            return stylesOpenChats.localSender;
        } else{
            return stylesOpenChats.notLocalSender;
        }
    };

    return (
        <View key={messageDetails["messageID"]} style={getBoxStyle()}>
            <View style={stylesOpenChats.boxInner}>
                <Text style={stylesOpenChats.boxTextContent}>{messageDetails["message"]}</Text>
            </View>
        </View>
    );
};


export default Conversation;