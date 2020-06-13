// https://afeld.github.io/emoji-css/
export const COUNTRIES: ValueName[] = [
    { value: 'city_sunset', name: 'Arrakén' },
    { value: 'mountain', name: 'Bílá stolová hora' },
    { value: 'sunrise_over_mountains', name: 'Bledá planina' },
    { value: 'sunrise_over_mountains', name: 'Imperiální pánev' },
    { value: 'sunrise_over_mountains', name: 'Jižní nepravý val' },
    { value: 'sunrise_over_mountains', name: 'Jižní planina' },
    { value: 'sunrise_over_mountains', name: 'Kamenná brada' },
    { value: 'city_sunset', name: 'Kartágo' },
    { value: 'sunrise_over_mountains', name: 'Malý erg' },
    { value: 'sunrise_over_mountains', name: 'Nerovná země' },
    { value: 'sunrise_over_mountains', name: 'Pánev Hagga' },
    { value: 'snowflake', name: 'Polární čepička' },
    { value: 'sunrise_over_mountains', name: 'Předěl Habbanya' },
    { value: 'sunrise_over_mountains', name: 'Proláklina Cielago' },
    { value: 'sunrise_over_mountains', name: 'Průsmyk Harg' },
    { value: 'red_circle', name: 'Rudý jícen' },
    { value: 'sunrise_over_mountains', name: 'Sádrová pánev' },
    { value: 'sunrise_over_mountains', name: 'Skalní výchozy' },
    { value: 'sunrise_over_mountains', name: 'Stará průrva' },
    { value: 'mountain', name: 'Štítový val' },
    { value: 'sunrise_over_mountains', name: 'Útes Sihája' },
    { value: 'sunrise_over_mountains', name: 'Velká rovina' },
    { value: 'sunrise_over_mountains', name: 'Větrný průsmyk' },
    { value: 'sunrise_over_mountains', name: 'Východní nepravá stěna' },
    { value: 'sunrise_over_mountains', name: 'Vykrojený útes' },
    { value: 'sunrise_over_mountains', name: 'Západní nepravá stěna' }
]

export const ACTION_TYPES: ValueName[] = [
    { value: 'mission', name: "Mise" },
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
    { value: 'processing', name: "Vyhodnocování" },
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
    let dfToLeader = Math.floor(delegationDf * 0.2)
    let remainingDf = delegationDf - dfToLeader
    let dfPerDelegate = remainingDf / numberOfDelegates
    let dfForCurrentDelegate = Math.floor((leader) ? dfPerDelegate + dfToLeader : dfPerDelegate)
    if (leader) {
        // remainder goes to leader
        dfForCurrentDelegate += delegationDf - dfForCurrentDelegate - Math.floor(dfPerDelegate) * (numberOfDelegates - 1)
    }
    return dfForCurrentDelegate
}