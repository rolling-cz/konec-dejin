export interface SignInResponse {
    invalidPassword: boolean;
    token: string;
}

export class Round {
    constructor(public id: string, public name: string) { }
}