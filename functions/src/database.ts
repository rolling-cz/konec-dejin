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