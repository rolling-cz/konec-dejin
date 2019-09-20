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

// https://afeld.github.io/emoji-css/
export function COUNTRIES(): SelectRow[] {
    return [
        { value: 'flag-af', name: 'Afgánistán' },
        { value: 'flag-in', name: 'Indie' },
        { value: 'flag-iq', name: 'Irák' },
        { value: 'flag-ir', name: 'Írán' },
        { value: 'flag-il', name: 'Izrael' },
        { value: 'flag-ps', name: 'Palestina' },
        { value: 'flag-sa', name: 'Saudská Arábie' },
        { value: 'flag-sy', name: 'Sýrie' },
        { value: 'gb', name: 'Velká Británie' }
    ]
}
export function ACTION_TYPES(): SelectRow[] {
    return [
        { value: 'support', name: "Podpora" },
        { value: 'economic', name: "Ekonomika" },
        { value: 'elections', name: "Volby" },
        { value: 'other', name: "Jiné" }
    ]
}
export function VISIBILITIES(): SelectRow[] {
    return [
        { value: 'public', name: "Veřejná" },
        { value: 'covert', name: "Tajná vůči delegacím" },
        { value: 'private', name: "Tajná uvnitř delegace" }
    ]
}