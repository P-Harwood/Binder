import {Dimensions, StyleSheet} from "react-native";
import styles from "./styles";

const stylesOpenChats = StyleSheet.create({


    iconContainer: {
        width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "gray",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
    },
    iconText: {
        fontSize: 20,
            fontWeight: "bold",
            color: "white",
    },
    boxInner: {
        flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-start",
    },
    boxContainer: {
        flex: 1, // Add flex: 1 to make the TouchableOpacity stretch horizontally
    },
    notLocalSender: {
        backgroundColor: "#c3c3c3",//2E8B57
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            padding: 20,
            flexDirection: "row",
            marginBottom: "1%",
            width: "70%",
    },
    localSender: {
        backgroundColor: "#95A5A6",//300042
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            padding: 20,
            flexDirection: "row",
            marginBottom: "1%",
            width: "70%",
            alignSelf: "flex-end",
    },
    boxTextContent: {
        fontSize: 15,
            color: "white",
    },chatDetails:{
        backgroundColor:"#89cff0",
        borderRadius:20,
    },
    topBarChatDetails: {
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: 'center',
        width: "100%",
        height: "100%",
        backgroundColor: "#4f199c",
        flex: 2,

    },
    sendMessageBox: {
        backgroundColor: '#6120bd',
        padding: 10
    },

    sendInputBox: {
        flex: 1,
        backgroundColor: '#6120bd',
        color:"#C3C3C3"
    },
    messageLogContainer:{
        flex: 10,
        marginTop:"5%",
        marginBottom:"5%",
        marginRight:"5%",
        marginLeft:"5%"},

    backButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6120bd',
        borderRadius: 50,
        padding: 10,
    },
    backButtonText: {
        color: '#c3c3c3',
        fontWeight: 'bold',
    },
    backButtonContainer: {
        flex: 1,
        height: '60%',
        justifyContent: 'center'
    },


    text: {
        textAlign: 'center',
        flex:2,
        fontSize: 20,
        color: "white",
    },
})
export default stylesOpenChats;