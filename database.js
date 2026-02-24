// noinspection SpellCheckingInspection

import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {jwtDecode} from 'jwt-decode';

const CLIENT_ID = '4cdj9pi9adms4tm5udhsv3aoe9';
const REGION = 'eu-central-1';
const USER_POOL_ID = 'eu-central-1_gr3bGMesN';
const IDENTITY_POOL_ID = 'eu-central-1:79f5853a-ecd6-4bfa-aca5-3ef58d9a32a4';

const email = 'vlad.megaboy@gmail.com';
const password = '12345678';

export let dynamoDB = null;
export let USER_ID = null;
export async function initializeApp() {
    const credentials = await login();

    dynamoDB = new DynamoDBClient({
        region: REGION,
        credentials: credentials,
    });

    await dynamoDB.config.credentials();
}

async function login() {
    const loginCommand = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    });

    try {
        const client = new CognitoIdentityProviderClient({region: REGION});
        const loginResponse = await client.send(loginCommand);
        // TODO: Manage Success/Fail Login
        try {
            const idToken = loginResponse.AuthenticationResult.IdToken;
            USER_ID = jwtDecode(idToken).sub;
            return await getAwsCredentials(idToken);
        } catch (error) {
            console.error('Get Credentials Error:', error);
        }
    } catch (error) {
        console.error('Login Command Error:', error);
        /*if (error.name === 'NotAuthorizedException') {
            console.error('Invalid username or password.');
        } else if (error.name === 'UserNotConfirmedException') {
            console.error('User is not confirmed.');
        }*/
    }
}

async function getAwsCredentials(idToken) {
    const identity = new CognitoIdentityClient({
        region: REGION,
        credentials: fromCognitoIdentityPool({
            clientConfig: {region: REGION},
            identityPoolId: IDENTITY_POOL_ID,
            logins: {
                [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]:
                    idToken,
            },
        }),
    });
    return await identity.config.credentials();
}

/* Create Entry in Database on Registration */ //TODO:
/*function createUserEntry(userID, username) {
    const params = {
        Item: marshall({
            id: userID,
            email: username,
            userInfo: {
                username: 'Username', //TODO:
                level: 1,
                exp: 0,
                stamina: 300,
                staminaMax: 300, //TODO: Removed and calculate in json + maxstamslots
                shards: 500,
                diamonds: 50,
                skillPoints: 5,
                staminaTimestamp: new Date().toISOString(),
            },
            equipment: {
                boots: {},
                chest: {},
                gloves: {},
                helmet: {},
                offhand: {},
                pants: {},
                weapon: {},
            },
            gathering: {
                level: 1,
                experience: 0,
                isGathering: false,
                nodeIndex: -1,
                timestamp: null,
                //TODO:
                nodes: [],
            },
            hunting: {
                depth: 0,
                killCount: 0,
                creatureList: [
                    ...Array(
                        rand(CREATURE_COUNT_MIN, CREATURE_COUNT_MAX),
                    ).keys(),
                ].map(_ => getCreature(1, 0)),
            },
            inventory: {
                //TODO:
                inventoryList: new Array(42).fill({}),
            },
            quests: {
                questsList: initializeQuests(1),
                refreshTimestamp: new Date().toISOString(),
            },
            skills: {
                skillsList: initializeSkills(),
                spell_1: null,
                spell_2: null,
                spell_3: null,
            },
        }),
        TableName: 'users',
    };
    dynamoDb.putItem(params, function (err) {
        if (err) {
            console.log(err);
        }
    });
}*/

export function convertForDB(value) {
    if (value === null || value === undefined) return {NULL: true};
    if (typeof value === 'boolean') return {BOOL: value};
    if (typeof value === 'string') return {S: value};
    if (typeof value === 'number') return {N: value.toString()};
    if (Array.isArray(value)) return {L: value.map(convertForDB)};
    if (typeof value === 'object') {
        const M = {};
        for (const k in value) M[k] = convertForDB(value[k]);
        return {M};
    }
    throw new Error('Unsupported type');
}
