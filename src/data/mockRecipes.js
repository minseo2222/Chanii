export const mockRecipes = [
    {
        id: '1',
        name: '김치찌개',
        category: '자취생 요리',
        difficulty: 'easy',
        cookingTime: 20,
        tools: ['가스레인지'],
        xpReward: 10,
        coinReward: 50,
        ingredients: [
            { name: '김치', required: true, alternatives: ['묵은지'] },
            { name: '돼지고기', required: false, alternatives: ['참치캔', '스팸'] },
            { name: '두부', required: false, alternatives: [] },
            { name: '양파', required: false, alternatives: [] }
        ],
        instructions: {
            base: '1. 김치와 돼지고기를 넣고 볶습니다.\n2. 물을 붓고 끓입니다.\n3. 두부와 양파를 넣고 5분간 더 끓입니다.',
            substitutions: {
                '참치캔': '1. 김치와 참치캔을 넣고 볶습니다.\n2. 물을 붓고 끓입니다.\n3. 두부와 양파를 넣고 5분간 더 끓입니다.',
                '스팸': '1. 김치와 스팸을 넣고 볶습니다.\n2. 물을 붓고 끓입니다.\n3. 두부와 양파를 넣고 5분간 더 끓입니다.',
                '묵은지': '1. 묵은지와 돼지고기를 넣고 볶습니다.\n2. 물을 붓고 끓입니다.\n3. 두부와 양파를 넣고 5분간 더 끓입니다.'
            }
        }
    },
    {
        id: '2',
        name: '계란볶음밥',
        category: '자취생 요리',
        difficulty: 'easy',
        cookingTime: 10,
        tools: ['가스레인지'],
        xpReward: 10,
        coinReward: 30,
        ingredients: [
            { name: '달걀', required: true, alternatives: [] },
            { name: '밥', required: true, alternatives: [] },
            { name: '김치', required: false, alternatives: ['채소'] }
        ],
        instructions: {
            base: '1. 달걀을 풀어 스크램블을 만듭니다.\n2. 밥과 김치를 넣고 볶습니다.\n3. 간장으로 간을 맞춥니다.',
            substitutions: {
                '채소': '1. 달걀을 풀어 스크램블을 만듭니다.\n2. 밥과 채소를 넣고 볶습니다.\n3. 간장으로 간을 맞춥니다.'
            }
        }
    },
    {
        id: '3',
        name: '에어프라이어 삼겹살',
        category: '만찬',
        difficulty: 'easy',
        cookingTime: 25,
        tools: ['에어프라이어'],
        xpReward: 15,
        coinReward: 80,
        ingredients: [
            { name: '삼겹살', required: true, alternatives: [] },
            { name: '상추', required: false, alternatives: ['깻잎'] }
        ],
        instructions: {
            base: '1. 삼겹살을 에어프라이어에 넣습니다.\n2. 180도에서 20분간 조리합니다.\n3. 상추에 싸서 먹습니다.',
            substitutions: {
                '깻잎': '1. 삼겹살을 에어프라이어에 넣습니다.\n2. 180도에서 20분간 조리합니다.\n3. 깻잎에 싸서 먹습니다.'
            }
        }
    },
    {
        id: '4',
        name: '냉동만두 찜',
        category: '냉동실 파먹기',
        difficulty: 'easy',
        cookingTime: 15,
        tools: ['전자레인지'],
        xpReward: 8,
        coinReward: 25,
        ingredients: [
            { name: '냉동만두', required: true, alternatives: [] }
        ],
        instructions: {
            base: '1. 냉동만두를 그릇에 담습니다.\n2. 물을 약간 뿌립니다.\n3. 전자레인지에 5분간 돌립니다.',
            substitutions: {}
        }
    },
    {
        id: '5',
        name: '참치김치볶음',
        category: '밑반찬',
        difficulty: 'easy',
        cookingTime: 10,
        tools: ['가스레인지'],
        xpReward: 10,
        coinReward: 40,
        ingredients: [
            { name: '참치캔', required: true, alternatives: [] },
            { name: '김치', required: true, alternatives: [] },
            { name: '양파', required: false, alternatives: [] }
        ],
        instructions: {
            base: '1. 참치캔과 김치를 팬에 넣습니다.\n2. 양파를 추가하고 볶습니다.\n3. 약한 불에서 5분간 조리합니다.',
            substitutions: {}
        }
    },
    {
        id: '6',
        name: '당근 간장조림',
        category: '밑반찬',
        difficulty: 'easy',
        cookingTime: 20,
        tools: ['가스레인지'],
        xpReward: 12,
        coinReward: 45,
        ingredients: [
            { name: '당근', required: true, alternatives: [] }
        ],
        instructions: {
            base: '1. 당근을 먹기 좋게 자릅니다.\n2. 간장, 설탕, 물을 넣고 조립니다.\n3. 중간 불에서 15분간 조리합니다.',
            substitutions: {}
        }
    }
];

export const recipeCategories = [
    '자취생 요리',
    '밑반찬',
    '만찬',
    '냉동실 파먹기'
];

export const cookingTools = [
    '가스레인지',
    '전자레인지',
    '에어프라이어',
    '인덕션'
];
