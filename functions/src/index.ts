import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { doLogin, doSwissLogin } from './login';
import { doProcessLeaderChange } from './database';

admin.initializeApp({
    databaseURL: "https://konec-dejin.firebaseio.com"
});

export let login = functions.https.onRequest(async (request, response) => {
    await doLogin(request.query["password"], response)
})

export let swissLogin = functions.https.onRequest(async (request, response) => {
    await doSwissLogin(request.query["password"], response)
})

export let processLeaderChange = functions.database.ref("delegationRounds/{delegationId}/{roundId}/leader").onWrite(async (change, context) => {
    await doProcessLeaderChange(context.params.delegationId, context.params.roundId, change)
})