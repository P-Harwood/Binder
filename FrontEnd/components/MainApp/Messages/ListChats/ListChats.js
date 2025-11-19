import { Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../../../../resources/styles/styles.js';
import stylesListChats from '../../../../resources/styles/stylesListChats.js';
import ChatLister from './ChatLister.js';
import Config from '../../../../resources/Config.js';

const url = Config('url');

const ListChats = (props) => {
    const { selectFunction, userDetails } = props;

    const [chatSearchValue, setChatSearchValue] = useState('');
    const [matchingChats, setMatchingChats] = useState([]);
    const [fetchedData, setFetchedData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetchDataAsync = async () => {
            const result = await fetchData();
            setFetchedData(result || []);
            setDataLoading(false);
        };

        fetchDataAsync();
    }, []);

    const fetchData = async () => {
        try {
            const userId = userDetails['user_id'];
            const response = await fetch(`${url}/getConversations/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            return formatReturnedConversations(json);
        } catch (error) {
            console.error('fetchData error:', error);
            return [];
        }
    };

    const pressChat = (chatUser, conversation_ID, lastMessage, chatWithID) => {
        selectFunction([
            'OpenChat',
            {
                chatUser,
                conversation_ID,
                lastMessage,
                chatWithID,
            },
        ]);
    };

    const formatReturnedConversations = (returnedJSON) => {
        const localUserID = userDetails['user_id'];
        const newArray = [];

        returnedJSON.forEach((conversation) => {
            let talkingToUser;

            if (conversation['person1_id'] === localUserID) {
                talkingToUser = 'person2';
            } else {
                talkingToUser = 'person1';
            }

            newArray.push({
                conversation_ID: conversation['conversation_id'],
                chatWithID: conversation[`${talkingToUser}_id`],
                chatWithName:
                    conversation[`${talkingToUser}_firstname`] +
                    ' ' +
                    conversation[`${talkingToUser}_lastname`],
                revising: conversation[`${talkingToUser}_currently_revising`],
                content: '',
            });
        });

        return newArray;
    };

    const search = (input) => {
        setChatSearchValue(input);

        if (!input) {
            setMatchingChats(fetchedData || []);
            return;
        }

        const filteredChats = (fetchedData || []).filter((chat) =>
            chat.chatWithName.toLowerCase().startsWith(input.toLowerCase())
        );
        setMatchingChats(filteredChats);
    };

    const searchControl = () => {
        if (chatSearchValue) {
            return matchingChats;
        }
        return fetchedData || [];
    };

    if (dataLoading) {
        return (
            <View style={[styles.appContainer, { backgroundColor: '#6120bd' }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={[stylesListChats.appContainer, { alignItems: 'center', backgroundColor: '#6120bd' }]}>
            <View style={{ flex: 4 }}>
                <View style={{ flex: 1 }} />
                <Text style={styles.text}>Your Chats:</Text>

                <View style={{ flex: 1, width: '100%' }}>
                    <TextInput
                        value={chatSearchValue}
                        placeholder="Search For Chat..."
                        onChangeText={search}
                        style={stylesListChats.textInput}
                    />
                </View>
            </View>

            <View style={{ flex: 8 }}>
                <ScrollView vertical showsHorizontalScrollIndicator={false}>
                    {searchControl().map(({ chatWithName, chatWithID, conversation_ID, revising, content }) => (
                        <TouchableOpacity
                            key={conversation_ID}
                            style={stylesListChats.chatBoxOptions}
                            onPress={() => pressChat(chatWithName, conversation_ID, content, chatWithID)}
                        >
                            <ChatLister chatUser={chatWithName} revising={revising} lastMessage={content} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={{ flex: 1 }} />
        </View>
    );
};

export default ListChats;
