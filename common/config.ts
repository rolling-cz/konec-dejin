// https://afeld.github.io/emoji-css/
export const COUNTRIES: ValueName[] = [
    { value: 'city_sunset', name: 'Arrakén' },
    { value: 'bila_stolova_hora', name: 'Bílá stolová hora' },
    { value: 'bleda_planina', name: 'Bledá planina' },
    { value: 'imperialni_panev', name: 'Imperiální pánev' },
    { value: 'jizni_nepravy_val', name: 'Jižní nepravý val' },
    { value: 'jizni_planina', name: 'Jižní planina' },
    { value: 'kamenna_brada', name: 'Kamenná brada' },
    { value: 'kartago', name: 'Kartágo' },
    { value: 'maly_erg', name: 'Malý erg' },
    { value: 'nerovna_zeme', name: 'Nerovná země' },
    { value: 'panev_hagga', name: 'Pánev Hagga' },
    { value: 'snowflake', name: 'Polární čepička' },
    { value: 'predel_habbanya', name: 'Předěl Habbanya' },
    { value: 'prolaklina_cielago', name: 'Proláklina Cielago' },
    { value: 'prusmyk_harg', name: 'Průsmyk Harg' },
    { value: 'red_circle', name: 'Rudý jícen' },
    { value: 'sadrova_panev', name: 'Sádrová pánev' },
    { value: 'skalni_vychozy', name: 'Skalní výchozy' },
    { value: 'stara_prurva', name: 'Stará průrva' },
    { value: 'mountain', name: 'Štítový val' },
    { value: 'utes_sihaja', name: 'Útes Sihája' },
    { value: 'velka_rovina', name: 'Velká rovina' },
    { value: 'vetrny_prusmyk', name: 'Větrný průsmyk' },
    { value: 'vychodni_neprava_stena', name: 'Východní nepravá stěna' },
    { value: 'vykrojeny_utes', name: 'Vykrojený útes' },
    { value: 'zapadni_neprava_stena', name: 'Západní nepravá stěna' },
    { value: 'question', name: 'Jiné' }
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