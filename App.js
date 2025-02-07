import React from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {MainComponent} from './screens/mainComponent';
import {createUser} from './database';

// eslint-disable-next-line no-unused-vars
const USERNAME = 'vlad.megaboy@gmail.com';
// eslint-disable-next-line no-unused-vars
const PASSWORD = '12345678';
export const USER_ID = 'e3e408f2-0061-7050-cc66-5c04d5540e9f';

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
    return (
        <Provider store={store}>
            <MainComponent />
        </Provider>
    );
}
export default App;
