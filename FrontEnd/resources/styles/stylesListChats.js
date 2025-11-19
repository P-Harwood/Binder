import {Dimensions, StyleSheet} from "react-native";


const stylesListChats = StyleSheet.create({
    appContainer: {

        backgroundColor: '#6120bd',
        //alignItems: 'center',
        flexDirection: "column",
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: "100%",
        alignItems:"center",
    },
    iconContainer: {
        width: 40,
        height: 40,
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
        justifyContent: 'flex-start',
    },
    boxContainer: {
        flex: 1,
    },
    textInput: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        width: (0.8* Dimensions.get('window').width),//look into this Really does not like using percentages
        height: 50,
        marginBottom: "5%",
        alignItems: "stretch",
        color: "#240090",
        borderRadius: 5

    },
    box: {
        backgroundColor: '#4f199c',
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
    chatBoxOptions:{
        width: (0.8* Dimensions.get('window').width),//look into this, Really does not like using percentages
        borderRadius:10,
        borderWidth:1,
        borderColor:"#4f199c",
        backgroundColor:"#4f199c",
        marginBottom:1,
        marginRight:20,
        justifyContent: 'center',
        alignItems: 'stretch' }
});
export default stylesListChats;