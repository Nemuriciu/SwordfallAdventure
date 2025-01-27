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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {missionsSet} from '../../../redux/slices/missionsSlice.tsx';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {TitleSeparator} from '../../../components/titleSeparator.tsx';

// TODO: Generate shop items + DB + Refresh Timer
export function Shop() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const dispatch = useDispatch();
    const [refreshFetched, setRefreshFetched] = useState(false);
    const [refreshTimer, setRefreshTimer] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const didMount = useRef(2);
    const didMount_2 = useRef(1);
    const twoHour = 7200000;
    let timer: string | number | NodeJS.Timeout | undefined;

    useEffect(() => {
        //fetchMissionsDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!didMount.current) {
            //updateMissionsDB();
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
                    new Date(missions.refreshTimestamp).getTime();

                if (diff >= twoHour) {
                    refreshMissions();

                    diff %= twoHour;
                    dispatch(
                        missionsSetTimestamp(
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
    }, [missions.refreshTimestamp]);*/

    /*useEffect(() => {
        if (refreshTimer <= 0) {
            clearInterval(timer);
            setRefreshTimer(1);
            refreshMissions();
            dispatch(missionsSetTimestamp(new Date().toISOString()));
            setRefreshTimer(twoHour);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTimer]);*/

    function fetchShopDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'missions',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(missionsSet(unmarshall(data.Item).shopList));
            }
        });
    }

    function updateShopDB() {
        /*const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set missions = :val',
            ExpressionAttributeValues: marshall({
                ':val': shopList,
            }),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });*/
    }

    function refreshShop() {
        /*const missionsList =
            missions.missionsList.length > 0
                ? cloneDeep(missions.missionsList).filter(
                      mission => mission.isActive,
                  )
                : [];

        const activeCount = missionsList.length;
        for (let i = 0; i < MISSIONS_AMOUNT - activeCount; i++) {
            missionsList.push(generateMission(userInfo.level));
        }

        dispatch(missionsSetList(missionsList));*/
    }

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
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <Text
                style={styles.refreshTitle}
                adjustsFontSizeToFit={true}
                numberOfLines={1}>
                Shop refresh in: {formatTime(refreshTimer)}
            </Text>
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}
                fadeDuration={0}>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
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
                                <Text style={styles.shopItemCostText}>
                                    1999
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            {/* DEBUG */}
            <CustomButton
                type={ButtonType.Orange}
                title={'Refresh'}
                onPress={() => {}}
                style={styles.refreshButton}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    refreshTitle: {
        marginTop: 12,
        marginBottom: 12,
        alignSelf: 'center',
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        marginStart: 2,
        marginEnd: 2,
    },
    innerLayout: {
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
        fontFamily: 'Myriad',
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
        fontFamily: 'Myriad',
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
