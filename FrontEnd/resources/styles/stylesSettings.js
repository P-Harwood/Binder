import {Dimensions, StyleSheet} from "react-native";


const stylesListChats = StyleSheet.create({
    screenContainer:{

    },
    iconContainer: {
        borderRadius: 20,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    boxInner: {
        flexDirection: 'row',
        alignItems: 'center',
        flex:1,
        justifyContent: 'flex-start',
    },
    boxContainer: {
        flex: 1,
    },
    box: {
        backgroundColor: '#d4d4d4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        flexDirection: 'row',
    },
    boxTextContent: {
        fontSize: 15,
        color: 'white',
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
        flexDirection: "column",
        alignItems: "center", // Center content vertically
        justifyContent: "center", // Center content horizontally
    },
    chatBoxOptions:{
        backgroundColor:"#d4d4d4",
        width: (Dimensions.get('window').width),//look into this Really does not like using percentages
        borderRadius:10,
        borderWidth:1,
        borderColor:"#c3c3c3",
        marginBottom:1,
        marginRight:20,
        justifyContent: 'center',
        alignItems: 'stretch' }
});
export default stylesListChats;