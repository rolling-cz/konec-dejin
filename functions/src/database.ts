import { DataSnapshot } from "firebase-functions/lib/providers/database";
import { Change } from "firebase-functions";
import admin = require("firebase-admin");

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
        if (snap.val()["type"] == "mission" || snap.val()["type"] == "other") {
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
            var actionType = (currentMainActions.length == 0 && index == 0) ? "mission" : "other"
            var title = (actionType == "mission") ? "Mise" : ""
            await admin.database().ref("actions/" + roundId).push({
                delegate: delegateId,
                delegation: delegationId,
                type: actionType,
                visibility: "private",
                title: title
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
        return;
    }
    const delegationId = change.after.val() as string;
    if (delegationId == null || delegationId == "") {
        return;
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