import React, {useEffect, useState} from 'react';
import {MainComponent} from './screens/mainComponent';
import {useFonts} from 'expo-font';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {initializeApp} from './database';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
if (!global.crypto) {
    global.crypto = require('expo-crypto');
}

function App() {
    const [fontsLoaded] = useFonts({
        Roboto: require('./assets/fonts/Roboto-Medium.ttf'),
        Roboto_Regular: require('./assets/fonts/Roboto-Regular.ttf'),
        Roboto_Bold: require('./assets/fonts/Roboto-Bold.ttf'),
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                await initializeApp();
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        }
        init().then(() => {});
    }, []);

    if (loading) {
        return null;
    }

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <MainComponent />
            {/* //TODO: Splash Screen Visible Until Login Ready & Databases Fetched */}
        </SafeAreaProvider>
    );
}
export default App;
