import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp({
    databaseURL: "https://konec-dejin.firebaseio.com"
  });

export let login = functions.https.onRequest(async (request, response) => {
    await doLogin(request.query["password"], response)
})

export let swissLogin = functions.https.onRequest(async (request, response) => {
    await doSwissLogin(request.query["password"], response)
})

async function doLogin(password: string, response: functions.Response) {
    let delegates = (await admin.database().ref("delegates").orderByChild("password").equalTo(password).once("value")).val()
    if (delegates == null) {
        await delay(2000)
        sendResponse(new LoginResponse("", true), response)
    } else {
        let uid = Object.keys(delegates)[0]
        let token = await admin.auth().createCustomToken(uid)
        sendResponse(new LoginResponse(token, false), response)
    }
}

async function doSwissLogin(password: string, response: functions.Response) {
    let swissPassword = (await admin.database().ref("config/swissPassword").once("value")).val()
    if (password != swissPassword) {
        await delay(2000)
        sendResponse(new LoginResponse("", true), response)
    } else {
        let token = await admin.auth().createCustomToken("swiss")
        sendResponse(new LoginResponse(token, false), response)
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function sendResponse(loginResponse: LoginResponse, http: functions.Response) {
    http.setHeader('Access-Control-Allow-Origin', '*');
    http.setHeader('Access-Control-Request-Method', '*');
    http.setHeader('Access-Control-Allow-Headers', '*');
    http.writeHead(200)
    http.write(JSON.stringify(loginResponse))
    http.end()
}

class LoginResponse {
    constructor(public token: string, public invalidPassword: boolean) { }
}