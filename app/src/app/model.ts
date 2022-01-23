export interface SignInResponse {
    invalidPassword: boolean;
    token: string;
}

export interface Round {
    id: string, name: string, tense: string
}

export interface Action {
    description: string,
    df: number;
    visibility: string;
    type: string;
    delegate: string,
    delegation: string,
    keyword: string,
    result: string,
    targetCountry: string,
}

export interface DelegateRound {
    availableMainActions: number,
    delegationId: string
}

export interface RoundInfo {
    name: string,
    flag: string,
    deadline: string,
    smallSize: boolean,
    presentRound: boolean,
    availableDf: number,
    message: string,
    bvs: BvChange[]
}

export interface BvChange {
    bv: number
    description: string
}

export interface Delegate {
    name: string, spreadsheet: string
}

export interface Unit {
    name: string,
    state: string,
    type: string,
    visibility: string,
    description: string
}
