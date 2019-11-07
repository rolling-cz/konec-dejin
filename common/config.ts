// https://afeld.github.io/emoji-css/
export const COUNTRIES: ValueName[] = [
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

export const TENSES: ValueName[] = [
    { value: 'past', name: "Proběhlo" },
    { value: 'present', name: "Aktuální" },
    { value: 'future', name: "Budoucí" }
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