import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../../../resources/styles/styles';
import config from '../../../resources/Config';

const { width } = Dimensions.get('window');

const MatchControl = (props) => {
    const { socket, userDetails } = props;

    const [matches, setMatches] = useState(null);
    const [userPage, setUserPage] = useState(0);
    const [imageBoxWidth, setImageBoxWidth] = useState(0);

    const url = config('url');

    const onImageBoxLayout = (event) => {
        setImageBoxWidth(event.nativeEvent.layout.width);
    };

    const boxMaker = (array, title) => {
        if (array.length === 0) {
            return (
                <Text
                    style={{
                        textAlign: 'center',
                        flex: 1,
                        fontSize: 20,
                        color: 'white',
                        marginTop: '10%',
                    }}
                >
                    {title}
                </Text>
            );
        }

        if (title !== 'biography') {
            const fields = array.map((interest) => [interest['id'], interest['name']]);
            return (
                <View style={{ backgroundColor: '#89cff0' }}>
                    <Text style={styles2.boxTextContent}>{title}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {fields.map((field) => (
                            <View key={field[0]} style={styles2.box}>
                                <Text style={styles2.boxTextContent}>{field[1]}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Text style={styles2.boxTextContent}>{title}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View style={styles2.box}>
                            <Text style={styles2.boxTextContent}>{array['biography']}</Text>
                        </View>
                    </View>
                </View>
            );
        }
    };

    const changeImage = (event) => {
        if (!matches || matches.length === 0) return;
        if (!matches[0].images || matches[0].images.length === 0) return;

        const inputX = event.nativeEvent.locationX;
        const screenCenterX = imageBoxWidth / 2;

        if (inputX < screenCenterX && userPage > 0) {
            setUserPage((prev) => prev - 1);
        } else if (inputX >= screenCenterX && userPage < matches[0].images.length) {
            setUserPage((prev) => prev + 1);
        }
    };

    const userContent = () => {
        if (!matches || matches.length === 0) return null;

        const current = matches[0];

        if (userPage === current.images.length) {
            return (
                <View style={{ backgroundColor: '#6120bd', width: '100%', height: '100%' }}>
                    <View>{boxMaker(current.user, 'biography')}</View>
                    <View>{boxMaker(current.modules, 'modules')}</View>
                    <View>{boxMaker(current.hobbies, 'hobbies')}</View>
                </View>
            );
        } else {
            const image = current.images[userPage];
            if (!image) return null;

            return (
                <Image
                    style={styles2.image}
                    source={{ uri: url + image.name.substring(7) }}
                    resizeMode="cover"
                />
            );
        }
    };

    useEffect(() => {
        socket.emit('Give Matches', userDetails);
        const receiveNewMatches = (newMatches) => {
            if (newMatches) {
                console.log('New matches:', newMatches);
                setMatches(newMatches);
            }
        };

        socket.on('New Matches', receiveNewMatches);

        return () => {
            socket.off('New Matches', receiveNewMatches);
        };
    }, [socket, userDetails]);


    useEffect(() => {
        if (matches && matches.length > 0) {
            setUserPage(0);
        }
    }, [matches]);

    const highlightUser = () => {
        if (matches && matches.length > 0) {
            socket.emit('Highlight User', userDetails['user_id'], matches[0]['user']['user_id']);
            const newMatches = [...matches];
            newMatches.shift();
            setMatches(newMatches);
        }
    };

    const skipUser = () => {
        if (matches && matches.length > 0) {
            socket.emit('Skip User', userDetails['user_id'], matches[0]['user']['user_id']);
            const newMatches = [...matches];
            newMatches.shift();
            setMatches(newMatches);
        }
    };

    if (!matches || matches.length === 0) {
        return (
            <View style={styles2.container}>
                <Text style={styles.text}>You have matched everyone!</Text>
            </View>
        );
    }

    return (
        <View style={styles2.container}>
            <View
                style={{
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#4f199c',
                    flex: 2,
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        flex: 1,
                        fontSize: 20,
                        color: 'white',
                        marginTop: '10%',
                    }}
                >
                    {matches[0]['user']['firstname']} {matches[0]['user']['lastname']}
                </Text>
            </View>

            <View style={{ flex: 14 }}>
                <TouchableOpacity style={styles2.imageBox} onPress={changeImage} onLayout={onImageBoxLayout}>
                    {userContent()}
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', width: '80%', marginBottom: '5%' }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: '#4f199c',
                        backgroundColor: '#4f199c',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={skipUser}
                >
                    <Text style={styles.text}>Skip</Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#4f199c',
                        borderRadius: 20,
                        backgroundColor: '#4f199c',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={highlightUser}
                >
                    <Text style={styles.text}>Highlight</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#6120bd',
    },
    box: {
        backgroundColor: '#c3c3c3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
    },
    imageBox: {
        width: width - 20,
        height: '80%',
        margin: 10,
        backgroundColor: '#EEE',
        alignItems: 'center',
        borderColor: '#6120bd',
        borderWidth: 1,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    boxTextContent: {
        fontSize: 20,
        fontStyle: 'bold',
        color: 'white',
    },
});

export default MatchControl;
