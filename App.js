import React from 'react';
import {MainComponent} from './screens/mainComponent';
import {createUser} from './database';
import {useFonts} from "expo-font";

// eslint-disable-next-line no-unused-vars
const USERNAME = 'vlad.megaboy@gmail.com';
// eslint-disable-next-line no-unused-vars
const PASSWORD = '12345678';

/*const UpdateExpression = "set equipment.boots=:1";
const ExpressionAttributeValues = {
    ":1": { M: {"name": { S: "bootsName" }} }
};*/
//createUser(USERNAME, PASSWORD);
//updateDb('f304b822-2091-70ef-1610-25598420f9c3', UpdateExpression, ExpressionAttributeValues)
//getDb('f304b822-2091-70ef-1610-25598420f9c3')
export const Context = React.createContext('light');
//TODO: Lock rotation on iOS
function App() {
    const [fontsLoaded] = useFonts({
        Myriad: require("./assets/fonts/Myriad.ttf"),
        Myriad_Bold: require("./assets/fonts/Myriad_Bold.ttf"),
        Myriad_Regular: require("./assets/fonts/Myriad_Regular.ttf"),
    });

    if (!fontsLoaded) {
        return null; // or a loading screen
    }

    return <MainComponent />;
}
export default App;
