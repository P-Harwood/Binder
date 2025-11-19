import { Text, View, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '../../../resources/styles/styles.js';
import ProfileContent from './profileContent.js';
import stylesProfile from '../../../resources/styles/stylesProfile.js';

import PictureModal from './PictureModal.js';

const Profile = (props) => {
    const { socket, userDetails } = props;

    const [imageModal, setImageModal] = useState(false);
    const options = ['Make Profile Picture', 'Delete'];

    const [imageSelected, setImageSelected] = useState(null);
    const [currentlyRevisingButton, setCurrentlyRevisingButton] = useState(false);

    useEffect(() => {
        const updateRevisingButton = (switchValue) => {
            console.log('Currently revising', switchValue);
            setCurrentlyRevisingButton(switchValue === 'Currently Revising');
        };

        socket.on('currently Revising', updateRevisingButton);
        socket.emit('Get Revising', userDetails['user_id']);

        return () => {
            socket.off('currently Revising', updateRevisingButton);
        };
    }, [socket, userDetails]);

    const toggleSwitch = () => {
        const sendValue = !currentlyRevisingButton ? 'Currently Revising' : 'Not Currently Revising';
        socket.emit('Set Revising', userDetails['user_id'], sendValue);
    };

    const imageSelectedFunction = async (id, uri) => {
        setImageSelected({ id, uri });
        console.log('Selected image id:', id);
        setImageModal(true);
    };

    const makeProfilePicture = async () => {
        setImageModal(false);
        if (!imageSelected) return;


        console.log('Make profile picture not implemented. Selected image:', imageSelected);
    };

    const removeImage = async () => {
        setImageModal(false);
        if (!imageSelected) return;

        console.log('Removing', imageSelected.id);
        socket.emit('Remove Image', imageSelected.id);
    };

    const opacities = [
        { title: 'Biography', key: 'Biography' },
        { title: 'Modules', key: 'Modules' },
        { title: 'Hobbies', key: 'Hobbies' },
        { title: 'Images', key: 'Images' },
    ];

    return (
        <View style={[styles.appContainer, { backgroundColor: '#6120bd' }]}>
            {/* Upper portion of the screen */}
            <View style={stylesProfile.UpperScreen}>
                {/* top of screen */}
                <View style={{ flex: 2 }}>{/* User Icon could go here */}</View>

                {/* name and university box */}
                <View style={stylesProfile.UserDetailsBox}>
                    <Text style={stylesProfile.NameText}>
                        {userDetails['firstname'] + '  ' + userDetails['lastname']}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View>
                            <Text style={stylesProfile.NameText}>Currently Revising</Text>
                        </View>
                    </View>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={currentlyRevisingButton ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={currentlyRevisingButton}
                    />
                </View>
            </View>

            {/* Lower portion of the screen */}
            <View style={stylesProfile.LowerScreen}>
                <View style={{ flex: 1 }} />

                <View style={{ flex: 5 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator>
                        {opacities.map(({ title, key }) => (
                            <TouchableOpacity key={key} style={stylesProfile.ScrollBoxes}>
                                <ProfileContent
                                    imageSelectedFunction={imageSelectedFunction}
                                    socket={socket}
                                    userDetails={userDetails}
                                    boxName={title}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ flex: 1 }}>
                    <Modal visible={imageModal} transparent animationType="fade">
                        <PictureModal
                            options={options}
                            removeImage={removeImage}
                            makeProfilePicture={makeProfilePicture}
                        />
                    </Modal>
                </View>
            </View>
        </View>
    );
};

export default Profile;
