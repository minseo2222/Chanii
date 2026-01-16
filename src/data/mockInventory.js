export const mockInventory = [
    {
        id: '1',
        name: '삼겹살',
        icon: 'beef',
        quantity: '300g',
        location: 'refrigerated',
        processingState: '원물',
        expiryDate: '2026-01-15',
        addedDate: '2026-01-10'
    },
    {
        id: '2',
        name: '김치',
        icon: 'salad',
        quantity: '500g',
        location: 'refrigerated',
        processingState: '소분',
        expiryDate: '2026-02-10',
        addedDate: '2026-01-05'
    },
    {
        id: '3',
        name: '달걀',
        icon: 'egg',
        quantity: '10개',
        location: 'refrigerated',
        processingState: '원물',
        expiryDate: '2026-01-20',
        addedDate: '2026-01-08'
    },
    {
        id: '4',
        name: '냉동만두',
        icon: 'cookie',
        quantity: '1봉지',
        location: 'frozen',
        processingState: '완제품',
        expiryDate: '2026-06-01',
        addedDate: '2025-12-20'
    },
    {
        id: '5',
        name: '당근',
        icon: 'carrot',
        quantity: '3개',
        location: 'refrigerated',
        processingState: '원물',
        expiryDate: '2026-01-18',
        addedDate: '2026-01-09'
    },
    {
        id: '6',
        name: '양파',
        icon: 'apple',
        quantity: '5개',
        location: 'room',
        processingState: '원물',
        expiryDate: '2026-02-01',
        addedDate: '2026-01-07'
    },
    {
        id: '7',
        name: '우유',
        icon: 'milk',
        quantity: '1L',
        location: 'refrigerated',
        processingState: '원물',
        expiryDate: '2026-01-14',
        addedDate: '2026-01-10'
    },
    {
        id: '8',
        name: '참치캔',
        icon: 'fish',
        quantity: '3개',
        location: 'room',
        processingState: '완제품',
        expiryDate: '2027-01-01',
        addedDate: '2025-11-15'
    },
    {
        id: '9',
        name: '두부',
        icon: 'square',
        quantity: '1모',
        location: 'refrigerated',
        processingState: '원물',
        expiryDate: '2026-01-13',
        addedDate: '2026-01-11'
    },
    {
        id: '10',
        name: '냉동 삼겹살',
        icon: 'beef',
        quantity: '500g',
        location: 'frozen',
        processingState: '소분',
        expiryDate: '2026-04-01',
        addedDate: '2025-12-15'
    }
];

export const calculateFreshness = (expiryDate) => {
    const today = new Date('2026-01-12'); // Current date from metadata
    const expiry = new Date(expiryDate);
    const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) return { status: 'expired', color: 'freshness-danger', days: daysRemaining };
    if (daysRemaining <= 3) return { status: 'danger', color: 'freshness-danger', days: daysRemaining };
    if (daysRemaining <= 7) return { status: 'warning', color: 'freshness-warning', days: daysRemaining };
    return { status: 'good', color: 'freshness-good', days: daysRemaining };
};
