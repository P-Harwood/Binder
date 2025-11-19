import { View } from 'react-native';
import React, { useState } from 'react';

import ListChats from './ListChats/ListChats.js';
import MessageUser from './OpenChat/MessageUser.js';
import { MESSAGE_SCREENS } from '../../../resources/constants/pages.js';

const MessageControl = (props) => {
    const { userDetails, socket } = props;

    const [currentScreen, setCurrentScreen] = useState(MESSAGE_SCREENS.LIST_CHATS);
    const [chatToDetails, setChatToDetails] = useState([]);

    const changeScreen = (orderRequest) => {
        const [screen, payload] = orderRequest;

        if (screen === MESSAGE_SCREENS.OPEN_CHAT) {
            setChatToDetails(payload);
            setCurrentScreen(screen);
        } else if (screen === MESSAGE_SCREENS.LIST_CHATS) {
            setChatToDetails([]);
            setCurrentScreen(screen);
        }
    };

    return (
        <View>
            {currentScreen === MESSAGE_SCREENS.LIST_CHATS && (
                <ListChats socket={socket} selectFunction={changeScreen} userDetails={userDetails} />
            )}
            {currentScreen === MESSAGE_SCREENS.OPEN_CHAT && (
                <MessageUser
                    socket={socket}
                    userDetails={userDetails}
                    onBackButton={() => changeScreen([MESSAGE_SCREENS.LIST_CHATS])}
                    chattingTo={chatToDetails}
                />
            )}
        </View>
    );
};

export default MessageControl;
