import { Text, View, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import styles from '../../../../resources/styles/styles.js';
import stylesListChats from '../../../../resources/styles/stylesListChats.js';
import SettingsList from './SettingsList.js';

import AsyncStorage from '@react-native-async-storage/async-storage';
import stylesSettings from '../../../../resources/styles/stylesSettings.js';
import { ROOT_SCREENS } from '../../../../resources/constants/pages.js';

const SettingsMain = (props) => {
    const { setScreen, socket } = props;
    const [logOutModalVisible, setLogOutModalVisible] = useState(false);

    // Clears async storage and returns to signup screen
    const logOut = async () => {
        try {
            await AsyncStorage.clear();
            setScreen(ROOT_SCREENS.SIGN_UP);
        } catch (e) {
            console.error('Failed to clear AsyncStorage:', e);
        }
        console.log('Logging out');
    };

    const settings = [
        {
            key: '1',
            title: 'Logout',
            displayText: 'Log out of your account',
        },
    ];

    return (
        <View style={stylesListChats.appContainer}>
            {/* Logout confirm modal */}
            <Modal animationType="fade" transparent visible={logOutModalVisible}>
                <View style={stylesSettings.modalContainer}>
                    <View style={stylesSettings.modalContent}>
                        <Text style={{ color: 'black', fontSize: 20, marginBottom: '5%' }}>
                            Are you sure you want to log out?
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }} />
                            <Button title="Cancel" onPress={() => setLogOutModalVisible(false)} />
                            <View style={{ flex: 1 }} />
                            <Button title="Log Out" onPress={logOut} />
                            <View style={{ flex: 1 }} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Spacer + title */}
            <View style={{ flex: 1 }}>
                <View style={{ flex: 2 }} />
                <Text style={styles.text}>Settings</Text>
            </View>

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            <View style={{ flex: 5 }}>
                <ScrollView vertical showsHorizontalScrollIndicator={false}>
                    {settings.map(({ key, title, displayText }) => (
                        <TouchableOpacity
                            key={key}
                            style={stylesListChats.chatBoxOptions}
                            onPress={() => setLogOutModalVisible(true)}
                        >
                            <SettingsList title={title} displayText={displayText} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

export default SettingsMain;
