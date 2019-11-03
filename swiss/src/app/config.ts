// https://afeld.github.io/emoji-css/
export const COUNTRIES: SelectRow[] = [
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

export const ACTION_TYPES: SelectRow[] = [
    { value: 'support', name: "Podpora" },
    { value: 'economic', name: "Ekonomika" },
    { value: 'elections', name: "Volby" },
    { value: 'other', name: "Jiné" }
]
export const VISIBILITIES: SelectRow[] = [
    { value: 'public', name: "Veřejná" },
    { value: 'covert', name: "Tajná vůči delegacím" },
    { value: 'private', name: "Tajná uvnitř delegace" }
]

export interface SelectRow {
    value: string;
    name: string;
}