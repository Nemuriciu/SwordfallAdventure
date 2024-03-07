import {
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React from 'react';
import {getImage} from '../../../assets/images/_index';
import {colors} from '../../../utils/colors.ts';
import {CreatureCard} from '../../../components/creatureCard.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {Creature} from '../../../types/creature.ts';
import {getCreature} from '../../../parsers/creatureParser.tsx';
import {huntingUpdate} from '../../../redux/slices/huntingSlice.tsx';
import {OrangeButton} from '../../../components/orangeButton.tsx';

export function Hunting() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const hunting = useSelector((state: RootState) => state.hunting);
    const dispatch = useDispatch();

    function refreshCreatures() {
        let creatureList: Creature[] = [];

        for (let i = 0; i < 6; i++) {
            creatureList.push(getCreature(userInfo.level, 1));
        }

        dispatch(huntingUpdate(creatureList));
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <View style={styles.topContainer}>
                <Text style={styles.depthText}>Depth 0</Text>
                <Image
                    style={styles.infoIcon}
                    source={getImage('icon_info')}
                    resizeMode={'stretch'}
                />
            </View>
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}>
                <FlatList
                    style={styles.creatureList}
                    data={hunting.creatureList} //hunting.creatureList
                    keyExtractor={(_item, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <CreatureCard creature={item} index={index} />
                    )}
                    overScrollMode={'never'}
                />
            </ImageBackground>
            <OrangeButton
                style={styles.button}
                title={'Refresh'}
                onPress={refreshCreatures}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 6,
    },
    depthText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    infoIcon: {
        position: 'absolute',
        right: 16,
        aspectRatio: 1,
        width: '7.5%',
        height: undefined,
    },
    innerContainer: {
        flex: 1,
        marginTop: 6,
        marginBottom: 8,
        marginStart: 8,
        marginEnd: 8,
    },
    creatureList: {
        marginTop: 8,
        marginBottom: 8,
        marginStart: 2,
        marginEnd: 2,
    },
    button: {
        aspectRatio: 3.5,
        width: '25%',
        marginStart: 8,
        marginEnd: 8,
    },
});
