import { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const COLORS = {
    background: '#0c0032',
    text: '#ffffff',
    inputText: '#240090',
    inputBorder: '#000000',
};

const SignUpName = (props) => {
    const { emailDefaults, dataStore, updateReady } = props;

    const [firstNameValue, setFirstNameValue] = useState(emailDefaults.firstName || '');
    const [lastNameValue, setLastNameValue] = useState(emailDefaults.lastName || '');

    const saveNames = () => {
        const hasFirst = !!firstNameValue;
        const hasLast = !!lastNameValue;

        if (hasFirst && hasLast) {
            dataStore('firstName', firstNameValue);
            dataStore('lastName', lastNameValue);

            if (emailDefaults && emailDefaults.email) {
                dataStore('email', emailDefaults.email);
            }

            updateReady(true);
        } else {
            updateReady(false);
        }
    };

    useEffect(() => {
        saveNames();
    }, [firstNameValue, lastNameValue]);

    return (
        <View style={[styles.view, { flex: 4, width: '100%' }]}>
            <Text style={styles.text}>Welcome, what is your name?</Text>
            <TextInput
                value={firstNameValue}
                style={styles.textInput}
                onChangeText={setFirstNameValue}
                placeholder="First Name"
            />
            <TextInput
                value={lastNameValue}
                style={styles.textInput}
                onChangeText={setLastNameValue}
                placeholder="Last Name"
            />
        </View>
    );
};

export default SignUpName;

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        color: COLORS.text,
        marginBottom: 12,
    },
    view: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        width: '80%',
        height: 50,
        marginBottom: '5%',
        alignItems: 'stretch',
        color: COLORS.inputText,
        paddingHorizontal: 10,
        borderRadius: 4,
    },
});
