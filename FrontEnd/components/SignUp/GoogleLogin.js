import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function GoogleLogin(props) {
    const { dataStore, socket, pageControl } = props;

    const [token, setToken] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    const tryUserAuthenticateToken = async () => {
        console.log('trying to auto login');
        try {
            const authKey = await AsyncStorage.getItem('Auth Key');
            const user_id = await AsyncStorage.getItem('User ID');
            if (authKey !== null && user_id !== null) {
                console.log('sending autologin', user_id, authKey);
                socket.emit('test Auth', user_id, authKey);
            } else {
                console.log('Auto Login rejected: ', authKey, user_id);
            }
        } catch (error) {
            console.error(`Error returning Authentication Key:`, error);
        }
    };

    // Google Sign-In SDK config
    useEffect(() => {
        const configureGoogleSignIn = async () => {
            await GoogleSignin.configure({
                scopes: ['openid', 'profile', 'email'],
                webClientId:
                    '495045106095-h1l866sknajtt04dgvguk6db8beubrec.apps.googleusercontent.com',
                androidClientId:
                    '495045106095-f9ji32kqlegd8pc2h5sdnsaj5jvq6ib5.apps.googleusercontent.com',
                offlineAccess: true,
            });
        };

        configureGoogleSignIn();
        tryUserAuthenticateToken();
    }, []);

    // React to token changes
    useEffect(() => {
        console.log('New token:', token);
        if (token) {
            validateIdToken();
        }
    }, [token]);

    // Listen for server response saying the user does not exist yet
    useEffect(() => {
        const handleUserNotExist = (userDetails) => {
            console.log('User does not exist, going to signup:', userDetails);
            dataStore(userDetails);
            pageControl('next');
        };

        socket.on('User Not Exist', handleUserNotExist);

        return () => {
            //delete listener
            socket.off('User Not Exist', handleUserNotExist);
        };
    }, [socket, dataStore, pageControl]);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn();
            const idToken = user.idToken;

            setToken(idToken);
            setUserInfo(user);
            console.log('Google user info:', user);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Sign-in cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign-in operation is in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Google Play services are not available');
            } else {
                console.log('Error occurred while signing in with Google', error);
            }
        }
    };

    const validateIdToken = async () => {
        try {
            console.log('Validating ID token');
            await checkEmail(
                token,
                '495045106095-h1l866sknajtt04dgvguk6db8beubrec.apps.googleusercontent.com'
            );
        } catch (error) {
            console.log('validateIdToken error:', error);
        }
    };

    const checkEmail = async (idToken, clientID) => {
        socket.emit('checkEmail', idToken, clientID);
    };

    return (
        <View style={styles.container}>
            {userInfo === null ? (
                <Button
                    title="Sign in with Google"
                    onPress={() => {
                        signInWithGoogle();
                    }}
                />
            ) : (
                <Text style={styles.text}>{userInfo.user?.name || 'Signed in'}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
