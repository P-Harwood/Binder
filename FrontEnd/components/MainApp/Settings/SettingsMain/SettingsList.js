import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import stylesSettings from '../../../../resources/styles/stylesSettings.js';

const SettingsList = (props) => {
    const { displayText } = props;

    return (
        <View style={stylesSettings.box}>
            <View style={stylesSettings.boxInner}>
                <TouchableOpacity>
                    <Text style={stylesSettings.iconText}>{displayText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SettingsList;
