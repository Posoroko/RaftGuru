export type RaftTypeName = 'Transocean' | 'Coastal' | 'Cruiser' | 'Ibiza'
export type RaftTypeId = 'type1' | 'type2' | 'cruiser' | 'ibiza'

export type RaftType = {
    id: RaftTypeId
    name: RaftTypeName
    iso: '9650-1' | '9650-2' | ''
}

export type ChecklistId =
    | 'type1:leger'
    | 'type1:lourd'
    | 'type2'
    | 'cruiser:STD'
    | 'cruiser:ORC'
    | 'cruiser:ORC+'
    | 'cruiser:GR'
    | 'cruiser:TR'
    | 'cruiser:AUS'

export const raftTypes: RaftType[] = [
    {
        id: 'type1',
        name: 'Transocean',
        iso: '9650-1'
    },
    {
        id: 'type2',
        name: 'Coastal',
        iso: '9650-2'
    },
    {
        id: 'cruiser',
        name: 'Cruiser',
        iso: ''
    },
    {
        id: 'ibiza',
        name: 'Ibiza',
        iso: ''
    },
]

export const checklistOptions: { id: ChecklistId; label: string; typeId: RaftTypeId }[] = [
    {
        id: 'type1:leger',
        label: 'Transocean Léger',
        typeId: 'type1'
    },
    {
        id: 'type1:lourd',
        label: 'Transocean Lourd',
        typeId: 'type1'
    },
    {
        id: 'type2',
        label: 'Coastal',
        typeId: 'type2'
    },
    {
        id: 'cruiser:STD',
        label: 'Cruiser STD',
        typeId: 'cruiser'
    },
    {
        id: 'cruiser:ORC',
        label: 'Cruiser ORC',
        typeId: 'cruiser'
    },
    {
        id: 'cruiser:ORC+',
        label: 'Cruiser ORC+',
        typeId: 'cruiser'
    },
    {
        id: 'cruiser:GR',
        label: 'Cruiser GR',
        typeId: 'cruiser'
    },
    {
        id: 'cruiser:TR',
        label: 'Cruiser TR',
        typeId: 'cruiser'
    },
    {
        id: 'cruiser:AUS',
        label: 'Cruiser AUS',
        typeId: 'cruiser'
    },
]
