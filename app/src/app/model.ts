export interface SignInResponse {
    invalidPassword: boolean;
    token: string;
}

export class Round {
    constructor(public id: string, public name: string, public tense: string) { }
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