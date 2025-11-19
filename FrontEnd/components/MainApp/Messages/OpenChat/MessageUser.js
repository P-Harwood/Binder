import { Text, View, BackHandler, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import stylesOpenChats from '../../../../resources/styles/stylesOpenChats.js';
import Conversation from './Conversation.js';
import styles from '../../../../resources/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessageUser = (props) => {
    const { onBackButton, chattingTo, userDetails, socket } = props;

    const [textValue, setTextValue] = useState('');
    const [fetchedData, setFetchedData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    const backButtonPress = () => {
        onBackButton();
        return true;
    };

    // Handle Android hardware back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backButtonPress);
        return () => backHandler.remove();
    }, [onBackButton]);

    useEffect(() => {
        const fetchDataAsync = async () => {
            socket.emit('checkConversation', chattingTo['conversation_ID'], await getLastMessage());
        };

        fetchDataAsync();

        const storeNewMessages = (newMessages) => {
            console.log('New Messages:', newMessages);
            storeConversation(newMessages);
            setDataLoading(false);
        };

        socket.on('New Messages', storeNewMessages);

        return () => {
            socket.off('New Messages', storeNewMessages);
        };
    }, [chattingTo, socket]);

    async function onSendButtonPress() {
        if (textValue.trim()) {
            const message = {
                conversationID: chattingTo['conversation_ID'],
                sender_id: userDetails['user_id'],
                message: textValue,
                recipientId: chattingTo['chatWithID'],
            };

            socket.emit('sendMessage', message, await getLastMessage());
            setTextValue('');
        }
    }

    const storeConversation = async (newData) => {
        const storageKey = 'conversation' + chattingTo['conversation_ID'];
        const existingData = await AsyncStorage.getItem(storageKey);
        const data = existingData ? JSON.parse(existingData) : [];

        const updatedData = data.length > 0 ? [...data, ...newData] : newData;

        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
        const reversedData = [...updatedData].reverse();
        setFetchedData(reversedData);
    };

    const getLastMessage = async () => {
        const storageKey = 'conversation' + chattingTo['conversation_ID'];
        const existingData = await AsyncStorage.getItem(storageKey);
        const data = existingData ? JSON.parse(existingData) : [];

        if (!data) {
            return 0;
        }
        return data.length > 0 ? data[data.length - 1]?.['message_id'] || 0 : 0;
    };

    if (dataLoading) {
        return (
            <View style={[styles.appContainer, { backgroundColor: '#6432ab' }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: '#6432ab', flex: 5, width: '100%' }}>
            {/* Top bar: back button + name */}
            <View style={stylesOpenChats.topBarChatDetails}>
                <View style={stylesOpenChats.backButtonContainer}>
                    <TouchableOpacity style={stylesOpenChats.backButton} onPress={backButtonPress}>
                        <Text style={stylesOpenChats.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>

                <Text style={stylesOpenChats.text}>{chattingTo.chatUser}</Text>
                <View style={{ flex: 1 }} />
            </View>

            <View style={stylesOpenChats.messageLogContainer}>
                {fetchedData && fetchedData.length !== 0 && (
                    <FlatList
                        inverted
                        data={fetchedData}
                        keyExtractor={(item) => item['message_id'].toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={stylesOpenChats.chatBoxOptions}
                                key={item['message_id']}
                            >
                                <Conversation
                                    localUserID={userDetails['user_id']}
                                    messageDetails={{
                                        messageID: item['message_id'],
                                        sender_id: item['sender_id'],
                                        message: item['content'],
                                        sent_at: item['sent_at'],
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <TextInput
                    placeholder="Enter text here"
                    placeholderTextColor="#C3C3C3"
                    style={stylesOpenChats.sendInputBox}
                    value={textValue}
                    onChangeText={(text) => setTextValue(text)}
                />
                <TouchableOpacity style={stylesOpenChats.sendMessageBox} onPress={onSendButtonPress}>
                    <Text style={{ color: 'white' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MessageUser;
