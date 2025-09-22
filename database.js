import AWS from 'aws-sdk';
import {marshall} from '@aws-sdk/util-dynamodb';
import {initializeQuests} from './parsers/questParser';
import {CREATURE_COUNT_MAX, CREATURE_COUNT_MIN, getCreature} from './parsers/creatureParser';
import {rand} from './parsers/itemParser';
import {initializeSkills} from './parsers/skillParser';
//import "react-native-get-random-values";
//import 'react-native-url-polyfill/auto';
//import {ReadableStream} from 'web-streams-polyfill/ponyfill';

//globalThis.ReadableStream = ReadableStream;

export const USER_ID = '33b49812-d0f1-7019-44e6-3ad9b23c4e71';

const REGION = 'eu-central-1';
const ACCESS_KEY = 'AKIA5FTZAJQTUM5R4P6Y';
const SECRET_ACCESS_KEY = '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';
//const IDENTITY_POOL_ID = "eu-central-1:79f5853a-ecd6-4bfa-aca5-3ef58d9a32a4"
const USER_POOL_ID = 'eu-central-1_gr3bGMesN';
const CLIENT_ID = '4cdj9pi9adms4tm5udhsv3aoe9';

AWS.config.update({
    region: REGION,
    credentials: new AWS.Credentials({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
    }),
});

const cognito = new AWS.CognitoIdentityServiceProvider();
export const dynamoDb = new AWS.DynamoDB();

/* Creating Account */
export function createUser(username, password) {
    const params = {
        UserPoolId: USER_POOL_ID,
        MessageAction: 'SUPPRESS', //TODO: Email Verification
        Username: username,
        TemporaryPassword: password,
    };

    cognito.adminCreateUser(params, function (err, data) {
        /* Exception handling */
        if (err) {
            switch (err.name) {
                case 'UsernameExistsException':
                    //console.log("Username Already Exists")
                    break;
                default:
                    console.error(err);
            }
        } else {
            /* Create DB User Entry */
            createUserEntry(data.User.Username, username);

            /* Change Password to Permanent */
            const passParams = {
                Username: username,
                Password: password,
                Permanent: true,
                UserPoolId: USER_POOL_ID,
            };

            cognito.adminSetUserPassword(passParams, function (err2) {
                /* Exception handling */
                if (err2) {
                    console.error(err2);
                } else {
                    /* Login */
                    authUser(username, password);
                }
            });
        }
    });
}
/* User Login */
export function authUser(username, password) {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
        ClientId: CLIENT_ID,
    };

    cognito.initiateAuth(params, function (err, data) {
        /* Exception handling */
        if (err) {
            switch (err.name) {
                case 'NotAuthorizedException':
                    console.log('Incorrect username or password.'); //TODO:
                    break;
                case 'TooManyRequestsException':
                    console.log('Too many requests. Please try again later.'); //TODO:
                    break;
                default:
                    console.error(err);
            }
            return null;
        } else {
            if (data.AuthenticationResult) {
                return data.AuthenticationResult.AccessToken;
            } else if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                console.error('NEEDS PASSWORD CHANGE');
            }
        }
    });
}
/* Create Entry in Database on Registration */ //TODO:
function createUserEntry(userID, username) {
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
                inventoryList: new Array(36).fill({}),
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
}
