// https://afeld.github.io/emoji-css/
export const COUNTRIES: ValueName[] = [
    { value: 'city_sunset', name: 'Arrakén' },
    { value: 'city_sunset', name: 'Kartágo' },
    { value: 'eight_pointed_black_star', name: 'Severní pól' },
    { value: 'rice_cracker', name: 'Síč Habbanya' },
    { value: 'rice_cracker', name: 'Síč Tabr' },
    { value: 'sunrise_over_mountains', name: 'Štítový val' },
    { value: 'rice_cracker', name: 'Tuekův síč' },
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
    { value: 'processing', name: "Vyhodnocování"},
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