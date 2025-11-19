import { View } from 'react-native';
import { useState } from 'react';

import styles from '../../resources/styles/styles.js';
import BottomBar from './BottomBar/BottomBar.js';
import Profile from './Profile/Profile.js';
import MessageControl from './Messages/MessageControl.js';
import SettingsControl from './Settings/SettingsControl.js';
import MatchControl from './MatchPeople/MatchControl.js';

import { MAIN_PAGES } from '../../resources/constants/pages.js';

export default function MainScreen(props) {
    const { setScreen, userDetails, socket } = props;

    // controls which main tab is visible
    const [currentPage, setCurrentPage] = useState(MAIN_PAGES.MESSAGES);

    return (
        <View style={styles.appContainer}>
            <View
                style={{
                    flex: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#6120bd',
                    width: '100%',
                }}
            >
                {/* displays current page */}
                {currentPage === MAIN_PAGES.MEET_NEW_PEOPLE && (
                    <MatchControl socket={socket} userDetails={userDetails} />
                )}
                {currentPage === MAIN_PAGES.PROFILE && (
                    <Profile socket={socket} userDetails={userDetails} />
                )}
                {currentPage === MAIN_PAGES.MESSAGES && (
                    <MessageControl socket={socket} userDetails={userDetails} />
                )}
                {currentPage === MAIN_PAGES.SETTINGS && (
                    <SettingsControl setScreen={setScreen} socket={socket} userDetails={userDetails} />
                )}
            </View>

            <BottomBar screenUpdate={setCurrentPage} />
        </View>
    );
}
