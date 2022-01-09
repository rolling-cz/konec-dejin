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
    // Change mainActions also for the next round of the same size
    let nextRoundId = await getNextRoundIdSameSize(roundId);
    if (nextRoundId != null) {
        await admin.database().ref("delegateRounds/" + delegateId + "/" + nextRoundId + "/mainActions").set(mainActions)
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
    // Change delegation also for the next round
    let nextRoundId = await getNextRoundId(roundId);
    if (nextRoundId != null) {
        await admin.database().ref("delegateRounds/" + delegateId + "/" + nextRoundId + "/delegation").set(delegationId)
    }
}

export async function doProcessBvChange(roundId: string, delegateId: string) {
    var totalBv = 0;
    (await admin.database().ref("bvRounds/" + roundId + "/" + delegateId).once("value")).forEach(snap => {
        totalBv += snap.val()["bv"]
    })
    await admin.database().ref("delegateRounds/" + delegateId + "/" + roundId + "/bv").set(totalBv)
}

export async function doProcessActionTitleChange(roundId: string, actionId: string, change: Change<DataSnapshot>) {
    // Exit when the data is deleted.
    if (!change.after.exists()) {
        return;
    }
    const title = change.after.val() as string;
    if (title == null || title == "") {
        return;
    }
    // Change title also for the next round of the same size
    let nextRoundId = await getNextRoundIdSameSize(roundId);
    if (nextRoundId != null) {
        let actionIdWithSameIndex = await getActionIdWithSameIndexAndDelegate(roundId, nextRoundId, actionId)
        if (actionIdWithSameIndex != null) {
            await admin.database().ref("actions/" + nextRoundId + "/" + actionIdWithSameIndex + "/title").set(title)
        }
    }
}

async function getNextRoundId(currentRoundId: string) {
    var currentFound = false;
    var nextRoundId = null;
    (await admin.database().ref("rounds").once("value")).forEach(snap => {
        if (snap.key == currentRoundId) {
            currentFound = true
        } else if (currentFound) {
            nextRoundId = snap.key
            currentFound = false
        }
    })
    return nextRoundId
}

async function getNextRoundIdSameSize(currentRoundId: string) {
    var currentSize = (await admin.database().ref("rounds/" + currentRoundId + "/size").once("value")).val();
    var currentFound = false;
    var nextRoundId = null;
    (await admin.database().ref("rounds").once("value")).forEach(snap => {
        if (snap.key == currentRoundId) {
            currentFound = true
        } else if (currentFound && snap.val()["size"] == currentSize) {
            nextRoundId = snap.key
            currentFound = false
        }
    })
    return nextRoundId
}

async function getActionIdWithSameIndexAndDelegate(currentRoundId: string, nextRoundId: string, actionId: string) {
    var delegateId = (await admin.database().ref("actions/" + currentRoundId + "/" + actionId + "/delegate").once("value")).val();
    var actionIndex = -1;
    var index = 0;
    (await admin.database().ref("actions/" + currentRoundId).orderByChild("delegate").equalTo(delegateId).once("value")).forEach(snap => {
        if (snap.key == actionId) {
            actionIndex = index;
        }
        index++;
    });
    index = 0;
    var actionIdWithSameIndex = null;
    (await admin.database().ref("actions/" + nextRoundId).orderByChild("delegate").equalTo(delegateId).once("value")).forEach(snap => {
        if (index == actionIndex) {
            actionIdWithSameIndex = snap.key
        }
        index++;
    })
    return actionIdWithSameIndex
}