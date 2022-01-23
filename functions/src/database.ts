import { DataSnapshot } from "firebase-functions/lib/providers/database";
import { Change } from "firebase-functions";
import admin = require("firebase-admin");

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
    let size = await (await admin.database().ref("rounds/"+roundId+"/size").once("value")).val()
    if (size == "small") {
        totalBv = Math.ceil(totalBv / 3)
    }
    await admin.database().ref("delegateRounds/" + delegateId + "/" + roundId + "/bv").set(totalBv)
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