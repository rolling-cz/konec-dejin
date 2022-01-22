import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { doLogin, doSwissLogin } from './login';
import { doProcessDelegationChange, doProcessBvChange } from './database';

admin.initializeApp({
    databaseURL: "https://dune-new-dawn.firebaseio.com"
});

export let login = functions.https.onRequest(async (request, response) => {
    await doLogin(request.query["password"] as string, response)
})

export let swissLogin = functions.https.onRequest(async (request, response) => {
    await doSwissLogin(request.query["password"] as string, response)
})

export let processDelegationChange = functions.database.ref("delegateRounds/{delegateId}/{roundId}/delegation").onWrite(async (change, context) => {
    await doProcessDelegationChange(context.params.delegateId, context.params.roundId, change)
})

export let processBvChange = functions.database.ref("bvRounds/{roundId}/{delegateId}/{changeId}").onWrite(async (change, context) => {
    await doProcessBvChange(context.params.roundId, context.params.delegateId)
})