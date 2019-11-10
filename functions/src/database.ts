import { DataSnapshot } from "firebase-functions/lib/providers/database";
import { Change } from "firebase-functions";
import admin = require("firebase-admin");

export async function doProcessLeaderChange(delegationId: string, roundId: string, change: Change<DataSnapshot>) {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
        return;
    }
    const leaderId = change.after.val() as string;
    if (leaderId == null || leaderId == "") {
        return;
    }
    await admin.database().ref("delegateRounds/" + leaderId + "/" + roundId + "/mainActions").set(3);
    let nonLeaderDelegateIds: string[] = [];
    (await admin.database().ref("delegateRounds").once("value")).forEach(snap => {
        if (snap.val()[roundId]["delegation"] == delegationId && snap.key != leaderId) {
            nonLeaderDelegateIds.push(snap.key as string)
        }
    });
    nonLeaderDelegateIds.forEach(async nonLeaderId => {
        await admin.database().ref("delegateRounds/" + nonLeaderId + "/" + roundId + "/mainActions").set(2);
    })
}

export async function doProcessMainActionsChange(delegateId: string, roundId: string, change: Change<DataSnapshot>) {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
        return;
    }
    const mainActions = change.after.val() as number;
    if (mainActions == null) {
        return;
    }
    let currentMainActions: string[] = [];
    (await admin.database().ref("actions/" + roundId).orderByChild("delegate").equalTo(delegateId).once("value")).forEach(snap => {
        if (snap.val()["type"] == "main") {
            currentMainActions.push(snap.key as string);
        }
    })
    if (mainActions == currentMainActions.length) {
        return;
    }
    if (mainActions > currentMainActions.length) {
        const delegationId = (await admin.database().ref("delegateRounds/" + delegateId + "/" + roundId + "/delegation").once("value")).val()
        for (let index = 0; index < mainActions - currentMainActions.length; index++) {
            await admin.database().ref("actions/" + roundId).push({
                delegate: delegateId,
                delegation: delegationId,
                type: "main",
                visibility: "public"
            })
        }
    } else {
        const difference = currentMainActions.length - mainActions
        for (let index = 0; index < difference; index++) {
            const lastActionId = currentMainActions.pop()
            await admin.database().ref("actions/" + roundId + "/" + lastActionId).remove()
        }
    }
}