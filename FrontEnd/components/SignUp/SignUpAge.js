import { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import styles from '../../resources/styles/styles.js';

const SignUpAge = (props) => {
    const { dataStore, updateReady } = props;
    const [yearValue, setYearValue] = useState('');

    const yearValueChange = (text) => {
        if (text) {
            const numericValue = text.replace(/[^0-9]/g, '');
            setYearValue(numericValue);

            if (numericValue) {
                updateReady(true);
                dataStore('universityYear', numericValue);
            } else {
                updateReady(false);
            }
        } else {
            setYearValue('');
            updateReady(false);
        }
    };

    return (
        <View style={[styles.view, { flex: 4, width: '100%' }]}>
            <Text style={styles.text}>What year are you at university?</Text>
            <TextInput
                value={yearValue}
                style={styles.textInput}
                onChangeText={yearValueChange}
                placeholder="University Year"
                keyboardType="number-pad"
            />
        </View>
    );
};

export default SignUpAge;
