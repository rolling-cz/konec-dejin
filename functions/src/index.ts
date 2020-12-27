import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { doLogin, doSwissLogin } from './login';
import { doProcessMainActionsChange, doProcessDelegationChange } from './database';

admin.initializeApp({
    databaseURL: "https://dune-new-dawn.firebaseio.com"
});

export let login = functions.https.onRequest(async (request, response) => {
    await doLogin(request.query["password"], response)
})

export let swissLogin = functions.https.onRequest(async (request, response) => {
    await doSwissLogin(request.query["password"], response)
})

export let processMainActionsChange = functions.database.ref("delegateRounds/{delegateId}/{roundId}/mainActions").onWrite(async (change, context) => {
    await doProcessMainActionsChange(context.params.delegateId, context.params.roundId, change)
})

export let processDelegationChange = functions.database.ref("delegateRounds/{delegateId}/{roundId}/delegation").onWrite(async (change, context) => {
    await doProcessDelegationChange(context.params.delegateId, context.params.roundId, change)
})