// Enhanced recipe data with images, ratings, and detailed information
export const enhancedRecipes = [
    {
        id: 1,
        name: '김치볶음밥',
        category: '한식',
        image: 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=500&h=400&fit=crop',
        cookingTime: 15,
        difficulty: 2,
        calories: 450,
        rating: 4.8,
        ratingCount: 234,
        description: '간단하고 맛있는 김치볶음밥, 반찬 없을 때 최고!',
        ingredients: [
            { name: '밥', amount: '2공기', required: true },
            { name: '김치', amount: '150g', required: true },
            { name: '식용유', amount: '2스푼', required: true },
            { name: '대파', amount: '1/2대', required: false },
            { name: '참기름', amount: '1스푼', required: false },
            { name: '김', amount: '적당량', required: false },
            { name: '달걀', amount: '1개', required: false }
        ],
        steps: [
            { text: '김치는 가위나 칼로 잘게 썰어주세요.', tip: '신김치를 사용하면 더 깊은 맛이 납니다. 너무 크면 밥과 잘 안 섞이니 작게 썰어주세요.' },
            { text: '팬에 식용유를 두르고 중불에서 파를 먼저 볶아 파기름을 내주세요.', tip: '파 향이 올라올 때까지 볶아주면 풍미가 훨씬 좋아집니다.' },
            { text: '김치를 넣고 달달 볶아주세요.', tip: '김치가 투명해질 때까지 충분히 볶아야 신맛이 줄고 고소해집니다. 설탕을 조금 넣으면 감칠맛 UP!' },
            { text: '밥을 넣고 국자로 눌러가며 고루 섞어 볶아주세요.', tip: '찬밥을 사용하면 밥알이 꼬들꼬들하게 잘 볶아집니다.' },
            { text: '참기름을 두르고 김가루나 달걀 후라이를 곁들여 완성하세요.', tip: '마지막에 팬 바닥에 밥을 얇게 펴서 누룽지를 만들어먹으면 별미!' }
        ],
        tools: ['프라이팬', '조리용 가위'],
        xpReward: 15,
        coinReward: 30
    },
    {
        id: 2,
        name: '된장찌개',
        category: '한식',
        image: 'https://images.unsplash.com/photo-1568096889942-6eecom630728?w=500&h=400&fit=crop',
        cookingTime: 25,
        difficulty: 3,
        calories: 280,
        rating: 4.9,
        ratingCount: 456,
        description: '한국인의 소울푸드, 구수한 된장찌개',
        ingredients: [
            { name: '된장', amount: '2스푼', required: true },
            { name: '두부', amount: '1/2모', required: true },
            { name: '양파', amount: '1/2개', required: true },
            { name: '감자', amount: '1개', required: false },
            { name: '호박', amount: '1/4개', required: false },
            { name: '대파', amount: '1/2대', required: false },
            { name: '청양고추', amount: '1개', required: false }
        ],
        steps: [
            { text: '냄비에 물(또는 멸치육수)을 붓고 끓여주세요.', tip: '쌀뜨물을 사용하면 국물이 더 걸쭉하고 구수해집니다.' },
            { text: '된장을 체에 걸러 풀고 감자, 양파를 넣어 끓여주세요.', tip: '된장의 콩 건더기를 좋아하면 그냥 넣어도 됩니다. 단단한 채소부터 넣어야 익는 속도가 맞아요.' },
            { text: '채소가 익으면 두부와 호박을 넣어주세요.', tip: '두부는 너무 오래 끓이면 단단해지니 중간에 넣어주세요.' },
            { text: '마지막으로 대파와 청양고추를 넣고 한소끔 더 끓여 완성하세요.', tip: '칼칼한 맛을 원하면 고춧가루를 반 스푼 추가해보세요.' }
        ],
        tools: ['냄비'],
        xpReward: 25,
        coinReward: 50
    },
    {
        id: 3,
        name: '파스타 알리오올리오',
        category: '양식',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
        cookingTime: 20,
        difficulty: 2,
        calories: 520,
        rating: 4.7,
        ratingCount: 189,
        description: '마늘과 오일의 풍미가 가득한 이탈리안 클래식',
        ingredients: [
            { name: '스파게티면', amount: '200g', required: true },
            { name: '마늘', amount: '5쪽', required: true },
            { name: '올리브오일', amount: '5스푼', required: true },
            { name: '페페론치노', amount: '3-4개', required: false },
            { name: '파슬리', amount: '약간', required: false },
            { name: '소금', amount: '1큰술', required: true }
        ],
        steps: [
            { text: '끓는 물에 소금을 넉넉히 넣고 면을 삶아주세요.', tip: '물 1L당 소금 10g이 정석! 짭짤한 바닷물 농도를 맞춰주세요. 알덴테 식감을 원하면 포장지 시간보다 1-2분 덜 삶으세요 (약 7-8분).' },
            { text: '팬에 올리브오일을 두르고 편 썬 마늘을 약불에서 천천히 볶아주세요.', tip: '마늘이 타지 않게 주의하세요. 노릇한 갈색이 될 때까지 기름에 마늘향을 입히는 과정입니다.' },
            { text: '마늘향이 올라오면 페페론치노를 부셔서 넣고 살짝 볶습니다.', tip: '매운맛을 좋아하면 일찍 넣고, 향만 내려면 나중에 넣으세요.' },
            { text: '삶은 면을 팬에 옮기고 면수(면 삶은 물)를 2국자 넣어 센불에서 볶아주세요.', tip: '기름과 물이 섞이면서 소스가 걸쭉해지는 "에멀전(유화)" 과정이 핵심입니다! 팬을 계속 흔들어주세요.' },
            { text: '불을 끄고 파슬리나 후추를 뿌려 완성하세요.', tip: '치즈가루를 뿌려도 맛있지만, 정통 방식은 깔끔하게 오일 맛으로 즐기는 거예요.' }
        ],
        tools: ['냄비', '프라이팬'],
        xpReward: 20,
        coinReward: 40
    },
    {
        id: 4,
        name: '토마토 달걀볶음',
        category: '중식',
        image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=400&fit=crop',
        cookingTime: 10,
        difficulty: 1,
        calories: 180,
        rating: 4.6,
        ratingCount: 312,
        description: '부드러운 식감과 새콤달콤한 맛의 조화',
        ingredients: [
            { name: '토마토', amount: '2개', required: true },
            { name: '달걀', amount: '3개', required: true },
            { name: '대파', amount: '1/2대', required: false },
            { name: '설탕', amount: '1스푼', required: true },
            { name: '소금', amount: '약간', required: true },
            { name: '식용유', amount: '2스푼', required: true },
            { name: '굴소스', amount: '0.5스푼', required: false }
        ],
        steps: [
            { text: '달걀을 풀어 소금 간을 하고, 팬에서 스크램블을 만들어 덜어두세요.', tip: '달걀을 너무 많이 익히지 말고 80% 정도만 익혀야 부드러워요.' },
            { text: '토마토는 먹기 좋은 크기로 썰어주세요.', tip: '껍질 식감이 싫다면 끓는 물에 살짝 데쳐 껍질을 벗겨도 좋습니다.' },
            { text: '팬에 다시 기름을 두르고 대파를 볶다가 토마토를 넣고 볶아주세요.', tip: '토마토에서 즙이 나올 때까지 충분히 볶아야 감칠맛이 살아납니다.' },
            { text: '설탕과 굴소스로 간을 맞추고, 만들어둔 달걀을 섞어 완성하세요.', tip: '마지막에 참기름 한 방울이면 고소함 폭발!' }
        ],
        tools: ['프라이팬'],
        xpReward: 10,
        coinReward: 20
    },
    {
        id: 5,
        name: '치킨 샐러드',
        category: '샐러드',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
        cookingTime: 15,
        difficulty: 1,
        calories: 320,
        rating: 4.5,
        ratingCount: 278,
        description: '다이어트에 좋은 든든한 한 끼 샐러드',
        ingredients: [
            { name: '닭가슴살', amount: '150g', required: true },
            { name: '양상추', amount: '적당량', required: true },
            { name: '방울토마토', amount: '5개', required: false },
            { name: '오이', amount: '1/2개', required: false },
            { name: '삶은 달걀', amount: '1개', required: false },
            { name: '드레싱', amount: '적당량', required: true }
        ],
        steps: [
            { text: '닭가슴살을 삶거나 구워서 결대로 찢어주세요.', tip: '시판 훈제 닭가슴살을 사용하면 조리 시간이 훨씬 단축됩니다.' },
            { text: '양상추와 채소들은 깨끗이 씻어 물기를 제거하고 한입 크기로 썰어주세요.', tip: '채소 탈수기를 쓰면 드레싱이 더 잘 묻어나요.' },
            { text: '접시에 채소와 닭가슴살을 예쁘게 담아주세요.', tip: '색감을 위해 빨간 토마토, 노란 파프리카 등을 섞으면 더 먹음직스러워 보여요.' },
            { text: '먹기 직전에 드레싱을 뿌려 완성하세요.', tip: '다이어트 중이라면 오리엔탈 드레싱이나 발사믹 식초를 추천합니다.' }
        ],
        tools: ['냄비', '볼'],
        xpReward: 15,
        coinReward: 30
    },
    {
        id: 6,
        name: '라면',
        category: '간편식',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop',
        cookingTime: 5,
        difficulty: 1,
        calories: 510,
        rating: 4.9,
        ratingCount: 892,
        description: '언제 먹어도 맛있는 국민 간식',
        ingredients: [
            { name: '라면', amount: '1봉지', required: true },
            { name: '달걀', amount: '1개', required: false },
            { name: '대파', amount: '약간', required: false },
            { name: '물', amount: '550ml', required: true },
            { name: '김치', amount: '반찬', required: false }
        ],
        steps: [
            { text: '냄비에 물 550ml를 넣고 끓여주세요.', tip: '정확한 물 양이 라면 맛의 생명! 계량컵이 없다면 종이컵 3컵 정도입니다.' },
            { text: '물이 끓으면 스프와 면을 넣어주세요.', tip: '면을 들었다 놨다 해주면 공기와 접촉해 더 쫄깃해져요.' },
            { text: '3분 정도 끓이다가 달걀과 대파를 넣어주세요.', tip: '달걀을 풀지 않고 그대로 익히면 국물이 탁해지지 않아 깔끔합니다.' },
            { text: '원하는 익힘 정도에 맞춰 불을 끄고 그릇에 담아주세요.', tip: '꼬들면 3분 30초, 보통 4분, 퍼진면 4분 30초 추천!' }
        ],
        tools: ['냄비'],
        xpReward: 5,
        coinReward: 10
    }
];

// Keep original categories and tools
export const recipeCategories = ['한식', '양식', '중식', '샐러드', '간편식'];
export const cookingTools = ['냄비', '프라이팬', '전자레인지', '에어프라이어'];
