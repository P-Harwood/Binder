import {Dimensions, StyleSheet} from "react-native";


const stylesProfile = StyleSheet.create({
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50, // half of width and height to create a circle
        backgroundColor: '#E4E4E4', // specify background color for the circle
    },BoxTitle: {
        width: "100%",
        flex: 2,
        alignItems:"center",
        justifyContent: 'center',
    },
    Container: {
        flex: 1,
        width: '100%',
    },
    BoxTitleText: {
        color: "black",
        fontSize: 30
    },
    BoxContent: {
        flex: 7,
        alignItems: "stretch",
    },
    input: {
        flex:1,
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    box: {
        backgroundColor: '#c3c3c3', // Set the background color of the box
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
        borderRadius: 10, // Add border radius to round the corners of the box
        padding:20,
    },
    boxTextContent: {
        fontSize: 15,
        color: "white",
    },

    modalInput: {
        flex: 1,
        height:"20%",
    },


    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        width: '80%', // Example width for the modal content
        height: '15%', // Example height for the modal content
        backgroundColor: 'white', // Example background color for the modal content
        borderRadius: 8, // Example border radius for the modal content
        padding: 16, // Example padding for the modal content
        flexDirection: "row",
        alignItems: "center", // Center content vertically
        justifyContent: "center", // Center content horizontally
    },
    NameText: {
        fontSize: 20,
        color: "#c3c3c3",

    },
    UniNameText: {
        fontSize: 15,
        color: "black",

    },
    LowerScreen: {
        flex: 6,
        alignItems: 'center',
        justifyContent: "center",
        width: "96%",
        marginTop: "2%",
        marginRight: "2%",
        marginBottom: "2%",
        marginLeft: "2%"
    },
    UpperScreen: {
        flex: 4,
        alignItems: 'center',
        justifyContent: "center",

        width: "100%"
    },
    UserDetailsBox: {
        flex: 2,
        alignItems: 'center',

        justifyContent: "center",
        backgroundColor: '#4f199c',
        width: "80%"

    },
    ScrollBoxes:{
        backgroundColor:"#d4d4d4",
        width: (0.8* Dimensions.get('window').width),
        borderRadius:10,
        marginRight: ( 0.01 * Dimensions.get('window').width),
        justifyContent: 'center',
        alignItems: 'center' }

});
export default stylesProfile;