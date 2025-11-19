import React, { useEffect, useState } from 'react';
import { Text, Button, View, TextInput, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../../../resources/styles/styles';
import Images from './images.js';
import stylesProfile from '../../../resources/styles/stylesProfile.js';

const ProfileContent = (props) => {
    const { imageSelectedFunction, socket, userDetails, boxName } = props;

    const [inputModalVisible, setInputModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [newValue, setNewValue] = useState(''); // text in “add/edit” modal
    const [fetchedData, setFetchedData] = useState(null);

    const boxType = (name) => {
        if (name === 'Biography') {
            return insertBiography();
        } else if (name === 'Hobbies') {
            if (!fetchedData) {
                return (
                    <View style={[styles.appContainer, { backgroundColor: '#6432ab' }]}>
                        <ActivityIndicator size="large" />
                    </View>
                );
            }
            return boxMaker(dataBoxSelect, 10);
        } else if (name === 'Modules') {
            if (!fetchedData) {
                return (
                    <View style={[styles.appContainer, { backgroundColor: '#6432ab' }]}>
                        <ActivityIndicator size="large" />
                    </View>
                );
            }
            return boxMaker(dataBoxSelect, 10);
        } else {
            return (
                <Images
                    imageSelectedFunction={imageSelectedFunction}
                    userDetails={userDetails}
                    socket={socket}
                />
            );
        }
    };

    const boxMaker = (selectFunction, maxLength) => {
        if (fetchedData.length === 0) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <BoxComponent key={'AddItem'} item={'+'} onPressValue={addValue} />
                </View>
            );
        }

        const interestData = fetchedData.map((interest) => [
            interest['entry_id'],
            interest['interest_name'],
        ]);

        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {interestData.map(([entry_id, item]) => (
                    <BoxComponent
                        key={entry_id}
                        item={item}
                        onPressValue={() => selectFunction(entry_id, item)}
                    />
                ))}
                {interestData.length < maxLength ? (
                    <BoxComponent key={'AddItem'} item={'+'} onPressValue={addValue} />
                ) : null}
            </View>
        );
    };

    // Fetch data for each box type once on mount
    useEffect(() => {
        if (!socket || !userDetails) return;

        if (boxName === 'Hobbies') {
            const handleHobbies = (response) => {
                setFetchedData(response);
            };
            socket.on('Give Hobbies', handleHobbies);
            socket.emit('Get Hobbies', userDetails['user_id']);

            return () => {
                socket.off('Give Hobbies', handleHobbies);
            };
        }

        if (boxName === 'Modules') {
            const handleModules = (response) => {
                setFetchedData(response);
            };
            socket.on('Give Modules', handleModules);
            socket.emit('Get Modules', userDetails['user_id']);

            return () => {
                socket.off('Give Modules', handleModules);
            };
        }

        if (boxName === 'Biography') {
            const handleBiography = (response) => {
                setFetchedData(response['biography']);
            };
            socket.on('Give Biography', handleBiography);
            setFetchedData(userDetails['biography']);
            socket.emit('Get Biography', userDetails['user_id']);

            return () => {
                socket.off('Give Biography', handleBiography);
            };
        }

        // For Images box we fetch nothing here (handled by <Images />)
    }, [boxName, socket, userDetails]);

    // Open/close modal based on selectedData
    useEffect(() => {
        if (selectedData) {
            setInputModalVisible(true);
            setNewValue(selectedData.selectedValue || '');
        } else {
            setInputModalVisible(false);
        }
    }, [selectedData]);

    const dataBoxSelect = (id, item) => {
        setSelectedData({ selectedValue: item, selectedID: id });
    };

    const handleSave = () => {
        if (!newValue) {
            // nothing to save
            setSelectedData(null);
            setNewValue('');
            setInputModalVisible(false);
            return;
        }

        if (!selectedData) {
            // add new
            socket.emit(`Add ${boxName}`, userDetails['user_id'], newValue);
        } else {
            // edit existing
            socket.emit(
                `Update ${boxName}`,
                userDetails['user_id'],
                selectedData['selectedID'],
                newValue
            );
        }

        setSelectedData(null);
        setNewValue('');
        setInputModalVisible(false);
    };

    const handleDelete = () => {
        if (selectedData) {
            socket.emit('Remove ' + boxName, userDetails['user_id'], selectedData['selectedID']);
        }
        setSelectedData(null);
        setNewValue('');
        setInputModalVisible(false);
    };

    const biographyChange = (text) => {
        socket.emit('Update Biography', userDetails['user_id'], text);
    };

    const insertBiography = () => {
        return (
            <TextInput
                style={stylesProfile.input}
                multiline
                numberOfLines={4}
                placeholder="Tell us about yourself"
                defaultValue={fetchedData || ''}
                onChangeText={biographyChange}
            />
        );
    };

    const addValue = () => {
        setSelectedData(null);
        setNewValue('');
        setInputModalVisible(true);
    };

    const BoxComponent = ({ item, onPressValue }) => {
        return (
            <TouchableOpacity onPress={onPressValue}>
                <View style={stylesProfile.box}>
                    <Text style={stylesProfile.boxTextContent}>{item}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={stylesProfile.Container}>
            <Modal animationType="fade" transparent visible={inputModalVisible}>
                <View style={stylesProfile.modalContainer}>
                    <View style={{ flex: 1 }} />
                    <View style={stylesProfile.modalContent}>
                        <TextInput
                            style={stylesProfile.modalInput}
                            placeholder="Enter value"
                            value={newValue}
                            onChangeText={setNewValue}
                        />
                        <Button title="Remove" onPress={handleDelete} />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
            </Modal>

            <View style={stylesProfile.BoxTitle}>
                <Text style={stylesProfile.BoxTitleText}>{boxName}</Text>
            </View>
            <View style={stylesProfile.BoxContent}>{boxType(boxName)}</View>
        </View>
    );
};

export default ProfileContent;
