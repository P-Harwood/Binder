import { View } from 'react-native';
import React, { useState } from 'react';

import SettingsMain from './SettingsMain/SettingsMain.js';
import { SETTINGS_SCREENS } from '../../../resources/constants/pages.js';

const SettingsControl = (props) => {
    const { setScreen, socket } = props;
    const [currentScreen, setCurrentScreen] = useState(SETTINGS_SCREENS.MAIN);

    return (
        <View>
            {currentScreen === SETTINGS_SCREENS.MAIN && (
                <SettingsMain setScreen={setScreen} socket={socket} />
            )}
        </View>
    );
};

export default SettingsControl;
