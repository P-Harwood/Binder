import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Config from '../../../resources/Config';
import stylesImages from '../../../resources/styles/stylesImages';

const Images = (props) => {
    const { imageSelectedFunction, userDetails, socket } = props;

    const url = Config('url');
    const [images, setImages] = useState(null);

    useEffect(() => {
        updateImages();
        socket.on('Image Removed', updateImages);

        return () => {
            socket.off('Image Removed', updateImages);
        };
    }, [socket, userDetails]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1,
        });

        const imageUri = result?.assets?.[0]?.uri || result?.uri;

        if (!result.canceled && imageUri) {
            await sendImageToServer(imageUri);
        }
    };

    const ImageDisplayer = ({ id, uri }) => {
        const imageSelected = async () => {
            await imageSelectedFunction(id, uri);
        };

        return (
            <TouchableOpacity key={id} style={stylesImages.imageBox} onPress={imageSelected}>
                <Image key={'Image' + id} style={{ width: 56, height: 100 }} source={{ uri }} />
            </TouchableOpacity>
        );
    };

    const updateImages = async () => {
        console.log('Updating images');
        try {
            const retrieveImages = await fetch(`${url}/returnImages/${userDetails['user_id']}`, {
                method: 'GET',
            });
            const imageArray = await retrieveImages.json();
            setImages(imageArray);
        } catch (error) {
            console.error('updateImages error:', error);
        }
    };

    const displayImages = () => {
        if (!images) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <BoxComponent key={'AddItem'} item={'+'} onPressValue={pickImage} />
                </View>
            );
        }

        const imageArray = images.map((image) => [image['image_id'], image['image_location']]);

        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {imageArray.map(([image_id, image_location]) => (
                    <ImageDisplayer
                        key={image_id}
                        id={image_id}
                        uri={url + image_location.substring(8)}
                    />
                ))}
                {imageArray.length < 5 ? (
                    <BoxComponent key={'AddItem'} item={'+'} onPressValue={pickImage} />
                ) : null}
            </View>
        );
    };

    const BoxComponent = ({ item, onPressValue }) => {
        return (
            <TouchableOpacity onPress={onPressValue}>
                <View style={stylesImages.box}>
                    <Text style={stylesImages.boxTextContent}>{item}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {displayImages()}
        </View>
    );
};

export default Images;
