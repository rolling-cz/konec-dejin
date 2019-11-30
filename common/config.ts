// https://afeld.github.io/emoji-css/
export const COUNTRIES: ValueName[] = [
    { value: 'flag-af', name: 'Afgánistán' },
    { value: 'flag-am', name: 'Arménie' },
    { value: 'flag-az', name: 'Ázerbajdžán' },
    { value: 'flag-cn', name: 'Čína' },
    { value: 'flag-eg', name: 'Egypt' },
    { value: 'flag-fr', name: 'Francie' },
    { value: 'flag-ge', name: 'Gruzie' },
    { value: 'flag-in', name: 'Indie' },
    { value: 'flag-iq', name: 'Irák' },
    { value: 'flag-ir', name: 'Írán' },
    { value: 'flag-it', name: 'Itálie' },
    { value: 'flag-il', name: 'Izrael' },
    { value: 'flag-ye', name: 'Jemen' },
    { value: 'flag-jo', name: 'Jordánsko' },
    { value: 'flag-kp', name: 'KLDR' },
    { value: 'flag-cy', name: 'Kypr' },
    { value: 'flag-lb', name: 'Libanon' },
    { value: 'flag-ly', name: 'Libye' },
    { value: 'flag-de', name: 'Německo' },
    { value: 'flag-pk', name: 'Pákistán' },
    { value: 'flag-ps', name: 'Palestina' },
    { value: 'flag-gr', name: 'Řecko' },
    { value: 'flag-ru', name: 'Rusko' },
    { value: 'flag-sa', name: 'Saudská Arábie' },
    { value: 'flag-so', name: 'Somálsko' },
    { value: 'flag-sd', name: 'Súdán'},
    { value: 'flag-sy', name: 'Sýrie' },
    { value: 'flag-tr', name: 'Turecko' },
    { value: 'flag-us', name: 'USA' },
    { value: 'flag-ua', name: 'Ukrajina' },
    { value: 'gb', name: 'Velká Británie' },
    { value: 'question', name: 'Jiné' }
]

export const ACTION_TYPES: ValueName[] = [
    { value: 'support', name: "Podpora" },
    { value: 'economic', name: "Ekonomika" },
    { value: 'elections', name: "Volby" },
    { value: 'other', name: "Jiné" }
]
export const VISIBILITIES: ValueName[] = [
    { value: 'public', name: "Veřejná" },
    { value: 'covert', name: "Tajná vůči delegacím" },
    { value: 'private', name: "Tajná uvnitř delegace" }
]
export const VISIBILITIES_PRIMARY: ValueName[] = [
    { value: 'public', name: "Veřejná" },
    { value: 'covert', name: "Tajná vůči delegacím" }
]

export const TENSES: ValueName[] = [
    { value: 'past', name: "Proběhlo" },
    { value: 'present', name: "Aktuální" },
    { value: 'future', name: "Budoucí" }
]
export const PROJECT_TYPES: ValueName[] = [
    { value: 'general', name: "Pro všechny" },
    { value: 'delegation', name: "Pro delegaci" },
    { value: 'delegate', name: "Pro delegáta" }
]

export interface ValueName {
    value: string;
    name: string;
}

export function findValueName(rows: ValueName[], value: string) {
    if (value == undefined) return "N/A"
    let row = rows.find((row) => row.value == value)
    if (row == undefined) return "N/A"
    return row.name
}

export function calculateDelegateDf(delegationDf: number, numberOfDelegates: number, leader: boolean): number {
    let dfToLeader = delegationDf * 0.2
    let remainingDf = delegationDf - dfToLeader
    let dfPerDelegate = remainingDf / numberOfDelegates
    let dfForCurrentDelegate = (leader) ? dfPerDelegate + dfToLeader : dfPerDelegate
    return Math.ceil(dfForCurrentDelegate)
}