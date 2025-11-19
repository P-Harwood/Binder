import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    appContainer: {

        backgroundColor: '#89cff0',
        //alignItems: 'center',
        flexDirection: "column",
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: "100%",
        alignItems:"center",
    },
    text: {
        fontSize: 20,
        color: "white",
    },
    view: {
        alignItems: 'center',
        justifyContent: "center",
    },
    textInput: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        width: '80%',
        height: 50,
        marginBottom: "5%",
        alignItems: "stretch",
        color: "#240090",
        borderRadius: 5

    }
    ,
    genderInput: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        width: "100%",
        borderRadius:5,
        height: 40,
        alignItems: "stretch",
        color: "#240090"

    },

});
export default styles;