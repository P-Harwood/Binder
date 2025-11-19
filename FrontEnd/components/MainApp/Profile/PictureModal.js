import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';



const PictureModal = (props) => {
     const { options, removeImage, makeProfilePicture} = props;


     console.log("PictureModal Loading")
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => option === 'Delete' ? removeImage() : makeProfilePicture()}

        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};






const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    flexDirection: 'column',
    alignItems:"center",
    justifyContent: 'center',
  },
  optionButton: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  optionText: {
    fontSize: 20,
    color: '#333333',
  },
});

export default PictureModal;
