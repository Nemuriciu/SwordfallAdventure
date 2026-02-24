import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {TitleSeparator} from '../../../components/titleSeparator.tsx';
import {values} from '../../../utils/values.ts';

// TODO: Generate shop items + DB + Refresh Timer
export function Shop() {
    const [refreshFetched, setRefreshFetched] = useState(false);
    const [refreshTimer, setRefreshTimer] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const didMount = useRef(2);
    const didMount_2 = useRef(1);
    const twoHour = 7200000;
    let timer: string | number | NodeJS.Timeout | undefined;

    useEffect(() => {
        //fetchShopDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!didMount.current) {
            //updateShopDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    /*useEffect(() => {
        if (!didMount_2.current) {
            if (!refreshFetched) {
                setRefreshFetched(true);

                let diff =
                    new Date().getTime() -
                    new Date(quests.refreshTimestamp).getTime();

                if (diff >= twoHour) {
                    refreshMissions();

                    diff %= twoHour;
                    dispatch(
                        questsSetTimestamp(
                            new Date(Date.now() - diff).toISOString(),
                        ),
                    );
                }

                /!* Start Refresh Timer *!/
                startTimer(twoHour - diff);
            }
        } else {
            didMount_2.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quests.refreshTimestamp]);*/

    /*useEffect(() => {
        if (refreshTimer <= 0) {
            clearInterval(timer);
            setRefreshTimer(1);
            refreshMissions();
            dispatch(questsSetTimestamp(new Date().toISOString()));
            setRefreshTimer(twoHour);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTimer]);*/

    function refreshShop() {}

    function startTimer(remainingTime: number) {
        setRefreshTimer(remainingTime);

        timer = setInterval(() => {
            setRefreshTimer(time => (time > 1 ? time - 1000 : time));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }

    function formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            {/* Shop Refresh Title */}
            <Text
                style={styles.refreshTitle}
                adjustsFontSizeToFit={true}
                numberOfLines={1}>
                Shop refresh in: {formatTime(refreshTimer)}
            </Text>
            {/* Shop Container */}
            <View style={styles.innerLayout}>
                <TitleSeparator title={'Traveling Merchant'} />
                {/* Shop Row 1 */}
                <View style={styles.shopRow}>
                    {/* Item 1 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_shards')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Item 2 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_shards')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Item 3 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_shards')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Item 4 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_shards')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TitleSeparator title={'Black Market'} />
                {/* Shop Row 2 */}
                <View style={styles.shopRow}>
                    {/* Item 1 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_diamonds')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Item 2 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_diamonds')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Item 3 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_diamonds')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Item 4 */}
                    <TouchableOpacity
                        onPress={() => {}}
                        disabled={disabled}
                        style={styles.shopItemContainer}>
                        <ImageBackground
                            style={styles.shopItem}
                            source={getImage('icon_slot')}
                            fadeDuration={0}>
                            <Text style={styles.shopItemQuantity}>
                                {/*{isItem(item) && item.quantity > 1*/}
                                {/*    ? item.quantity*/}
                                {/*    : ''}*/}
                                {''}
                            </Text>
                        </ImageBackground>
                        <View style={styles.shopItemCostLayout}>
                            <Image
                                style={styles.shopItemCostIcon}
                                source={getImage('icon_diamonds')}
                                fadeDuration={0}
                            />
                            <Text style={styles.shopItemCostText}>1999</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {/* DEBUG */}
            <CustomButton
                type={ButtonType.Red}
                title={'Refresh'}
                onPress={() => {}}
                style={styles.refreshButton}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    refreshTitle: {
        marginTop: 12,
        marginBottom: 12,
        alignSelf: 'center',
        fontSize: 16,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    innerLayout: {
        flex: 1,
        justifyContent: 'center',
        marginStart: 2,
        marginEnd: 2,
        marginBottom: 32,
    },
    shopRow: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 24,
        marginStart: 32,
        marginEnd: 32,
    },
    shopItemContainer: {
        flex: 1,
        margin: 12,
    },
    shopItem: {
        aspectRatio: 1,
        width: '100%',
        height: undefined,
    },
    shopItemQuantity: {
        position: 'absolute',
        bottom: 5,
        right: 6,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    shopItemCostLayout: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 2,
    },
    shopItemCostIcon: {
        aspectRatio: 1,
        width: '30%',
        height: undefined,
    },
    shopItemCostText: {
        flex: 1,
        marginLeft: 4,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    refreshButton: {
        width: '30%',
        alignSelf: 'center',
        aspectRatio: 3.5,
        marginTop: 4,
        marginBottom: 4,
    },
});
