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
    keyword: string,
    result: string,
    targetDelegation: string,
}

export interface SelectRow {
    value: string;
    name: string;
}

export interface DelegateRound {
    availableMainActions: number,
    delegationId: string
}

export interface DelegationRoundInfo {
    name: string,
    country: string,
    deadline: string,
    leader: string,
    presentRound: boolean
}