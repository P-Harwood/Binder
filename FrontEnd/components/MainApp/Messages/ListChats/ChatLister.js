import { Text, View } from 'react-native';
import React from 'react';
import stylesListChats from '../../../../resources/styles/stylesListChats.js';

const ChatLister = (props) => {
    const { chatUser, revising } = props;

    const BoxComponent = ({ chatUser, revising }) => {
        return (
            <View style={stylesListChats.box}>
                <View style={stylesListChats.boxInner}>
                    <View style={stylesListChats.iconContainer}>
                        <Text style={stylesListChats.iconText}>{chatUser.charAt(0)}</Text>
                    </View>
                </View>

                <View style={[stylesListChats.boxInner, { flexDirection: 'column', flex: 1 }]}>
                    <Text style={[stylesListChats.boxTextContent, { flex: 4, textAlign: 'left' }]}>
                        {chatUser}
                    </Text>
                    <Text style={[stylesListChats.boxTextContent, { flex: 6 }]}>{revising}</Text>
                </View>
            </View>
        );
    };

    return <BoxComponent chatUser={chatUser} revising={revising} />;
};

export default ChatLister;
