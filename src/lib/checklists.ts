import type { ChecklistId } from './raftModels'

export type ChecklistItem = {
    itemId: string
    qty: number | string
    inRaft?: boolean
}

export const checklists: Record<ChecklistId, ChecklistItem[]> = {

    // ──────────────────────────────────────────
    // TRANSOCEAN (ISO 9650-1)
    // ──────────────────────────────────────────

    'type1:leger': [
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 2,
        },
        {
            itemId: "paddle",
            qty: 2,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "spare-batteries",
            qty: 1,
        },
        {
            itemId: "spare-bulb",
            qty: 1,
        },
        {
            itemId: "parachute-flares",
            qty: 2,
        },
        {
            itemId: "handflares",
            qty: 3,
        },
        {
            itemId: "whistle",
            qty: 1,
        },
        {
            itemId: "signalling-mirror",
            qty: 1,
        },
        {
            itemId: "seasickness-pills",
            qty: "6/pers",
        },
        {
            itemId: "seasickness-bag",
            qty: "1/pers",
        }
    ],

    'type1:lourd': [
        {

            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 2,
        },
        {
            itemId: "paddle",
            qty: 2,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "spare-batteries",
            qty: 1,
        },
        {
            itemId: "spare-bulb",
            qty: 1,
        },
        {
            itemId: "parachute-flares",
            qty: 2,
        },
        {
            itemId: "handflares",
            qty: 6,
        },
        {
            itemId: "whistle",
            qty: 1,
        },
        {
            itemId: "signalling-mirror",
            qty: 1,
        },
        {
            itemId: "first-aid-kit",
            qty: 1,
        },
        {
            itemId: "couverture",
            qty: 2,
        },
        {
            itemId: "seasickness-pills",
            qty: "6/pers",
        },
        {
            itemId: "seasickness-bag",
            qty: "1/pers",
        },
        {
            itemId: "water",
            qty: "1.5L/pers",
            inRaft: true,
        },
        {
            itemId: "food-ration",
            qty: "125g/pers",
            inRaft: true,
        },
    ],

    // ──────────────────────────────────────────
    // COASTAL (ISO 9650-2)
    // ──────────────────────────────────────────

    'type2': [
        {
            itemId: "arceau",
            qty: 2,
        },
        {
            itemId: "chimiolum",
            qty: 2,
        },
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 2,
        },
        {
            itemId: "paddle",
            qty: 1,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "spare-batteries",
            qty: 1,
        },
        {
            itemId: "spare-bulb",
            qty: 1,
        },
        {
            itemId: "handflares",
            qty: 3,
        },
        {
            itemId: "whistle",
            qty: 1,
        },
        {
            itemId: "seasickness-pills",
            qty: "6/pers",
        },
        {
            itemId: "seasickness-bag",
            qty: "1/pers",
        }
    ],

    // ──────────────────────────────────────────
    // CRUISER
    // ──────────────────────────────────────────

    'cruiser:STD': [
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "paddle",
            qty: 1,
        },
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "survival-booklet",
            qty: 1,
        },
        {
            itemId: "aids-to-survival",
            qty: 1,
        },
        {
            itemId: "rescue-signals-table",
            qty: 1,
        },
        {
            itemId: "water",
            qty: "0.2L/pers",
            inRaft: true,
        }
        
    ],

    'cruiser:ORC': [
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 2,
        },
        {
            itemId: "paddle",
            qty: 2,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "survival-booklet",
            qty: 1,
        },
        {
            itemId: "aids-to-survival",
            qty: 1,
        },
        {
            itemId: "rescue-signals-table",
            qty: 1,
        },
        
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "handflares",
            qty: 3,
        },
        {
            itemId: "seasickness-pills",
            qty: "6/pers",
        }
    ],

    'cruiser:ORC+': [
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 2,
        },
        {
            itemId: "paddle",
            qty: 2,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "fishing-kit",
            qty: 1,
        },
        {
            itemId: "first-aid-kit",
            qty: 1,
        },
        {
            itemId: "survival-booklet",
            qty: 1,
        },
        {
            itemId: "aids-to-survival",
            qty: 1,
        },
        {
            itemId: "rescue-signals-table",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "spare-batteries",
            qty: 2,
        },
        {
            itemId: "spare-bulb",
            qty: 1,
        },
        {
            itemId: "handflares",
            qty: 3,
        },
        {
            itemId: "parachute-flares",
            qty: 2,
        },
        {
            itemId: "chimiolum",
            qty: 2,
        },
        {
            itemId: "whistle",
            qty: 1,
        },
        {
            itemId: "signalling-mirror",
            qty: 1,
        },
        {
            itemId: "seasickness-pills",
            qty: "6/pers",
        },
        {
            itemId: "water",
            qty: "0.5L/pers",
            inRaft: true,
        },
        {
            itemId: "food-ration",
            qty: "125gr/pers",
            inRaft: true,
        },
        {
            itemId: "measuring-cup",
            qty: "1",
            inRaft: true,
        }
    ],

    'cruiser:GR': [
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 2,
        },
        {
            itemId: "paddle",
            qty: 2,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "first-aid-kit",
            qty: 1,
        },
        {
            itemId: "survival-booklet",
            qty: 1,
        },
        {
            itemId: "aids-to-survival",
            qty: 1,
        },
        {
            itemId: "rescue-signals-table",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "spare-batteries",
            qty: 2,
        },
        {
            itemId: "spare-bulb",
            qty: 1,
        },
        {
            itemId: "handflares",
            qty: 4,
        },
        {
            itemId: "parachute-flares",
            qty: 2,
        },
        {
            itemId: "water",
            qty: "0.3L/pers",
            inRaft: true,
        }
    ],

    'cruiser:TR': [
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: 2,
        },
        {
            itemId: "paddle",
            qty: 1,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "first-aid-kit",
            qty: 1,
        },
        {
            itemId: "survival-booklet",
            qty: 1,
        },
        {
            itemId: "aids-to-survival",
            qty: 1,
        },
        {
            itemId: "rescue-signals-table",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "handflares",
            qty: 3,
        },
        {
            itemId: "parachute-flares",
            qty: 2,
        },
        {
            itemId: "smoke-signal",
            qty: 1,
        },
        {
            itemId: "whistle",
            qty: 1,
        },
        {
            itemId: "signalling-mirror",
            qty: 1,
        },
        {
            itemId: "seasickness-pills",
            qty: "6/pers",
        },
        {
            itemId: "water",
            qty: "1L/pers",
            inRaft: true,
        },
        {
            itemId: "food-ration",
            qty: "125gr/pers",
            inRaft: true,
        }
    ],

    'cruiser:AUS': [
        {
            itemId: "bellows",
            qty: 1,
        },
        {
            itemId: "bailer",
            qty: 1,
        },
        {
            itemId: "sponge",
            qty: "1/pers",
        },
        {
            itemId: "paddle",
            qty: 1,
        },
        {
            itemId: "repair-kit",
            qty: 1,
        },
        {
            itemId: "survival-booklet",
            qty: 1,
        },
        {
            itemId: "aids-to-survival",
            qty: 1,
        },
        {
            itemId: "rescue-signals-table",
            qty: 1,
        },
        {
            itemId: "waterproof-torch",
            qty: 1,
        },
        {
            itemId: "spare-batteries",
            qty: 2,
        },
        {
            itemId: "spare-bulb",
            qty: 1,
        },
        {
            itemId: "handflares",
            qty: 1,
        },
        {
            itemId: "parachute-flares",
            qty: 1,
        },
        {
            itemId: "smoke-signal",
            qty: 1,
        },
        {
            itemId: "whistle",
            qty: 1,
        },
        {
            itemId: "seasickness-pills",
            qty: "6/pers",
        },
        {
            itemId: "seasickness-bag",
            qty: "1/pers",
        },
        {
            itemId: "water",
            qty: "0.5L/pers",
            inRaft: true,
        }
    ],
}
