import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard, Image } from 'react-native';
import styles from '../../../resources/styles/styles';
import { MAIN_PAGES } from '../../../resources/constants/pages.js';

const TABS = [
    MAIN_PAGES.MESSAGES,
    MAIN_PAGES.MEET_NEW_PEOPLE,
    MAIN_PAGES.PROFILE,
    MAIN_PAGES.SETTINGS,
];

const BottomBar = (props) => {
    const { screenUpdate } = props;
    const [keyboardMode, setKeyboardMode] = useState(false);

    const handleKeyboardShow = () => setKeyboardMode(true);
    const handleKeyboardHide = () => setKeyboardMode(false);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const getImage = (pageKey) => {
        switch (pageKey) {
            case MAIN_PAGES.PROFILE:
                return (
                    <Image
                        source={require('../../../assets/ProfileIcon.png')}
                        style={{ width: '80%', height: '80%' }}
                    />
                );
            case MAIN_PAGES.MEET_NEW_PEOPLE:
                return (
                    <Image
                        source={require('../../../assets/MeetIcon.png')}
                        style={{ width: '80%', height: '80%' }}
                    />
                );
            case MAIN_PAGES.SETTINGS:
                return (
                    <Image
                        source={require('../../../assets/SettingsIcon.png')}
                        style={{ width: '80%', height: '80%' }}
                    />
                );
            case MAIN_PAGES.MESSAGES:
            default:
                return (
                    <Image
                        source={require('../../../assets/MessageIcon.png')}
                        style={{ width: '80%', height: '80%' }}
                    />
                );
        }
    };

    if (keyboardMode) {
        return null;
    }

    return (
        <View style={[styles.view, { flex: 1, backgroundColor: '#4f199c', width: '100%' }]}>
            <View style={styles2.container}>
                {TABS.map((pageKey) => (
                    <TouchableOpacity
                        key={pageKey}
                        style={styles2.button}
                        onPress={() => screenUpdate(pageKey)}
                    >
                        {getImage(pageKey)}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles2 = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 100,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        marginHorizontal: 5,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default BottomBar;
