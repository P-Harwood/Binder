import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import SignUpName from './SignUpName';
import SignUpCourse from './SignUpCourse';
import SignUpAge from './SignUpAge';
import NavigationButtons from './NavigationButtons';
import styles from '../../resources/styles/styles.js';
import GoogleLogin from './GoogleLogin.js';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpDetails(props) {
    const { socket, returnUserInformation } = props;

    const [emailFetched, setEmailFetched] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [signIn, setSignIn] = useState(false);
    const [publicKey, setPublicKey] = useState(null);

    const [screenVisibility, setVisibility] = useState({
        // 0: Google Login
        // 1: Name input
        // 2: Age input
        // 3: Course input
        '0': true,
        '1': false,
        '2': false,
        '3': false,
    });

    const [componentReady, setComponentReady] = useState({
        '0': true, // Google login does not use the navigation button
        '1': false,
        '2': false,
        '3': false,
    });

    const finishSetUp = (returnedDetails) => {
        console.log('SignUpDetails finishSetUp, signIn:', signIn, 'returnedDetails:', returnedDetails);
        returnUserInformation(returnedDetails);
    };

    // Attach socket listeners once
    useEffect(() => {
        const handlePublicKey = (key) => {
            setPublicKey(key);
        };

        const handleUserExists = async (returnedDetails, authKey) => {
            console.log('User Exists event triggered with:', returnedDetails);

            try {
                await AsyncStorage.setItem('Auth Key', authKey.toString());
                console.log('Auth key stored successfully!');
            } catch (error) {
                console.log('Error storing auth key:', error);
            }

            try {
                await AsyncStorage.setItem('User ID', returnedDetails.user_id.toString());
                console.log('User ID stored successfully!');
            } catch (error) {
                console.log('Error storing User ID:', error);
            }

            setSignIn(true);
            finishSetUp(returnedDetails);
        };

        socket.on('public key', handlePublicKey);
        socket.on('User Exists', handleUserExists);

        return () => {
            socket.off('public key', handlePublicKey);
            socket.off('User Exists', handleUserExists);
        };
    }, [socket]);

    useEffect(() => {
        console.log('useEffect - signIn:', signIn);
        if (signIn) {
            socket.off('User Exists');
        }
    }, [signIn, socket]);

    useEffect(() => {
        // when currentPage changes, update visibility
        modifyVisibility(currentPage, true);
    }, [currentPage]);

    const modifyVisibility = (key, bool) => {
        setVisibility((prevDictionary) => ({
            ...prevDictionary,
            [key]: bool,
        }));
    };

    const pageControl = async (command) => {
        if (command === 'next' && componentReady[currentPage]) {
            const lastIndex = Object.keys(screenVisibility).length - 1;

            if (currentPage === lastIndex) {
                await createUser();
                // After user creation, the server should emit "User Exists" and call finishSetUp
                finishSetUp();
            } else {
                modifyVisibility(currentPage, false);
                setCurrentPage((prev) => prev + 1);
            }
        }
    };

    const addKeyValue = (key, value) => {
        console.log('addKeyValue:', key, value);
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [key]: value,
        }));
    };

    useEffect(() => {
        console.log('userDetails:', userDetails);
    }, [userDetails]);

    const createUser = async () => {
        try {
            const hasAllFields =
                userDetails.firstName &&
                userDetails.lastName &&
                userDetails.universityCourse &&
                userDetails.universityYear;

            if (hasAllFields) {
                socket.emit('Create User', userDetails);
            } else {
                console.log('createUser called without all required fields', userDetails);
            }
        } catch (error) {
            console.log('createUser error:', error);
        }
    };

    return (
        <View style={[styles.appContainer, { backgroundColor: '#0c0032' }]}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />

            <View
                style={{
                    flex: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                {screenVisibility['0'] && (
                    <GoogleLogin dataStore={setEmailFetched} pageControl={pageControl} socket={socket} />
                )}
                {screenVisibility['1'] && (
                    <SignUpName
                        emailDefaults={emailFetched}
                        dataStore={addKeyValue}
                        updateReady={(state) =>
                            setComponentReady((prev) => ({
                                ...prev,
                                '1': state,
                            }))
                        }
                    />
                )}
                {screenVisibility['2'] && (
                    <SignUpAge
                        dataStore={addKeyValue}
                        updateReady={(state) =>
                            setComponentReady((prev) => ({
                                ...prev,
                                '2': state,
                            }))
                        }
                    />
                )}
                {screenVisibility['3'] && (
                    <SignUpCourse
                        dataStore={addKeyValue}
                        updateReady={(state) =>
                            setComponentReady((prev) => ({
                                ...prev,
                                '3': state,
                            }))
                        }
                    />
                )}
                {!screenVisibility['0'] && <NavigationButtons pageControl={pageControl} />}
            </View>

            <View style={[styles.view, { flex: 2, width: '100%' }]} />
        </View>
    );
}
