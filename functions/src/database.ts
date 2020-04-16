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
    // Change main action count
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
        // Add missing main actions
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
        // Delete extra main actions
        const difference = currentMainActions.length - mainActions
        for (let index = 0; index < difference; index++) {
            const lastActionId = currentMainActions.pop()
            await admin.database().ref("actions/" + roundId + "/" + lastActionId).remove()
        }
    }
}

export async function doProcessDelegationChange(delegateId: string, roundId: string, change: Change<DataSnapshot>) {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
        const previousDelegationId = change.before.val() as string | null;
        let otherDelegateCount = 0;
        (await admin.database().ref("delegateRounds").once("value")).forEach(snap => {
            if (snap.val()[roundId]["delegation"] == previousDelegationId) {
                otherDelegateCount++;
            }
        });
        if (previousDelegationId != null) {
            await admin.database().ref("delegationRounds/" + previousDelegationId + "/" + roundId + "/delegateCount").set(otherDelegateCount);
        }
        return;
    }
    const delegationId = change.after.val() as string;
    if (delegationId == null || delegationId == "") {
        return;
    }
    const previousDelegationId = change.before.val() as string | null;
    // Change delegate count
    let delegateCount = 0;
    let otherDelegateCount = 0;
    (await admin.database().ref("delegateRounds").once("value")).forEach(snap => {
        if (snap.val()[roundId]["delegation"] == delegationId) {
            delegateCount++;
        }
        if (snap.val()[roundId]["delegation"] == previousDelegationId) {
            otherDelegateCount++;
        }
    });
    await admin.database().ref("delegationRounds/" + delegationId + "/" + roundId + "/delegateCount").set(delegateCount);
    if (previousDelegationId != null) {
        await admin.database().ref("delegationRounds/" + previousDelegationId + "/" + roundId + "/delegateCount").set(otherDelegateCount);
    }
    // Change delegations also for actions
    let actionIds: string[] = [];
    (await admin.database().ref("actions/" + roundId).orderByChild("delegate").equalTo(delegateId).once("value")).forEach(snap => {
        actionIds.push(snap.key as string);
    })
    actionIds.forEach(async actionId => {
        await admin.database().ref("actions/" + roundId + "/" + actionId + "/delegation").set(delegationId)
    })
}