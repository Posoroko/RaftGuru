export type InventoryItem = {
    id: string
    name: string
    icon: string
    storedInBag: boolean
}

export const inventoryItems: InventoryItem[] = [
    {
        id: "couverture",
        name: "Couverture de survie",
        icon: "bath_bedrock",
        storedInBag: true
    },
    {
        id: "chimiolum",
        name: "Batons chimiolum",
        icon: "sunny",
        storedInBag: true
    },
    {
        id: "arceau",
        name: "Arceau fibre",
        icon: "line_curve",
        storedInBag: true
    },
    {
        id: 'bailer',
        name: 'Écope',
        icon: 'tire_repair',
        storedInBag: true
    },
    {
        id: 'sponge',
        name: 'Éponge',
        icon: 'water',
        storedInBag: true
    },
    {
        id: 'paddle',
        name: 'Pagaie',
        icon: 'rowing',
        storedInBag: true
    },
    {
        id: 'repair-kit',
        name: 'Kit de réparation',
        icon: 'handyman',
        storedInBag: true
    },
    {
        id: 'fishing-kit',
        name: 'Kit de pêche',
        icon: 'phishing',
        storedInBag: true
    },
    {
        id: 'survival-booklet',
        name: 'Livre de contrôle et d\'utilisation',
        icon: 'menu_book',
        storedInBag: true
    },
    {
        id: 'aids-to-survival',
        name: 'Livre de survie',
        icon: 'auto_stories',
        storedInBag: true
    },
    {
        id: 'bellows',
        name: 'Gonfleur',
        icon: 'air',
        storedInBag: true
    },
    {
        id: 'waterproof-torch',
        name: 'Lampe étanche',
        icon: 'flashlight_on',
        storedInBag: true
    },
    {
        id: 'spare-batteries',
        name: 'Piles de rechange',
        icon: 'battery_full',
        storedInBag: true
    },
    {
        id: 'spare-bulb',
        name: 'Ampoule de rechange',
        icon: 'lightbulb',
        storedInBag: true
    },
    {
        id: 'parachute-flares',
        name: 'Fusées parachute',
        icon: 'explosion',
        storedInBag: true
    },
    {
        id: 'handflares',
        name: 'Feux à main',
        icon: 'flare',
        storedInBag: true
    },
    {
        id: 'smoke-signal',
        name: 'Signal fumigène',
        icon: 'cloud',
        storedInBag: true
    },
    {
        id: 'light-sticks',
        name: 'Bâtons lumineux',
        icon: 'highlight',
        storedInBag: true
    },
    {
        id: 'rescue-signals-table',
        name: 'Table de signaux',
        icon: 'table_chart',
        storedInBag: true
    },
    {
        id: 'whistle',
        name: 'Sifflet',
        icon: 'sports',
        storedInBag: true
    },
    {
        id: 'signalling-mirror',
        name: 'Miroir de signalisation',
        icon: 'light_mode',
        storedInBag: true
    },
    {
        id: 'first-aid-kit',
        name: 'Trousse de secours',
        icon: 'medical_services',
        storedInBag: true
    },
    {
        id: 'seasickness-pills',
        name: 'Pastilles anti mal de mer',
        icon: 'medication',
        storedInBag: true
    },
    {
        id: 'seasickness-bag',
        name: 'Sac vomitoire',
        icon: 'shopping_bag',
        storedInBag: true
    },
    {
        id: 'water',
        name: 'Eau (par personne)',
        icon: 'water_drop',
        storedInBag: false
    },
    {
        id: 'measuring-cup',
        name: 'Verre gradué',
        icon: 'science',
        storedInBag: true
    },
    {
        id: 'food-ration',
        name: 'Rations alimentaires (par personne)',
        icon: 'restaurant',
        storedInBag: false
    },
]
