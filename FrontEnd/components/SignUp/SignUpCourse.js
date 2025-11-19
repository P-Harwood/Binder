import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import styles from '../../resources/styles/styles.js';

const COURSES_URL = 'https://pastebin.com/raw/7jUwEwGE';

const SignUpCourse = (props) => {
    const { dataStore, updateReady } = props;

    const [inputBoxValue, setInputBoxValue] = useState('');
    const [courseList, setCourseList] = useState([]);
    const [matchingCourses, setMatchingCourses] = useState([]);
    const [displaySuggestionBox, setDisplaySuggestionBox] = useState(false);

    useEffect(() => {
        retrieveDataSet();
    }, []);

    const retrieveDataSet = () => {
        fetch(COURSES_URL)
            .then((response) => response.text())
            .then((text) => {
                const courseListArray = text.split('\n').map((course) => course.trim());
                setCourseList(courseListArray);
            })
            .catch((error) => console.error('Error fetching courses:', error));
    };

    const courseSelected = (item) => {
        console.log('Selected course:', item);
        setDisplaySuggestionBox(false);
        setInputBoxValue(item);
    };

    useEffect(() => {
        if (inputBoxValue) {
            dataStore('universityCourse', inputBoxValue);
            updateReady(true);
        } else {
            updateReady(false);
        }
    }, [inputBoxValue, dataStore, updateReady]);

    const courseInputValueChange = (text) => {
        setInputBoxValue(text);

        if (!text) {
            setDisplaySuggestionBox(false);
            setMatchingCourses([]);
            return;
        }

        setDisplaySuggestionBox(true);

        const matching = courseList.filter((course) =>
            course.toLowerCase().startsWith(text.toLowerCase())
        );
        setMatchingCourses(matching);
    };

    return (
        <View style={styles2.container}>
            <TextInput
                value={inputBoxValue}
                placeholder="Enter University Course"
                onChangeText={courseInputValueChange}
                style={styles.textInput}
            />

            {displaySuggestionBox && (
                <View style={styles2.listContainer}>
                    <FlatList
                        data={matchingCourses}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => courseSelected(item)}>
                                <View style={styles2.listItemContainer}>
                                    <Text style={styles2.listItem}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles2.listContentContainer}
                    />
                </View>
            )}
        </View>
    );
};

export default SignUpCourse;

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        width: '80%',
        alignItems: 'center',
    },
    listContainer: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        maxHeight: 200,
        backgroundColor: '#ffffff',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        zIndex: 1,
        elevation: 2,
    },
    listContentContainer: {
        flexGrow: 1,
    },
    listItem: {
        padding: 16,
        fontSize: 16,
    },
    listItemContainer: {
        backgroundColor: '#EFEFEF',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
});
