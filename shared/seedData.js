export const inventorySeed = [
  {
    id: '1',
    name: '소고기',
    icon: 'beef',
    quantity: '300g',
    location: 'refrigerated',
    processingState: '생재료',
    expiryDate: '2026-03-26',
    addedDate: '2026-03-18'
  },
  {
    id: '2',
    name: '김치',
    icon: 'salad',
    quantity: '500g',
    location: 'refrigerated',
    processingState: '반찬',
    expiryDate: '2026-03-29',
    addedDate: '2026-03-10'
  },
  {
    id: '3',
    name: '계란',
    icon: 'egg',
    quantity: '10개',
    location: 'refrigerated',
    processingState: '생재료',
    expiryDate: '2026-03-27',
    addedDate: '2026-03-15'
  },
  {
    id: '4',
    name: '냉동만두',
    icon: 'cookie',
    quantity: '1봉지',
    location: 'frozen',
    processingState: '가공식품',
    expiryDate: '2026-08-01',
    addedDate: '2026-02-20'
  },
  {
    id: '5',
    name: '당근',
    icon: 'carrot',
    quantity: '3개',
    location: 'refrigerated',
    processingState: '생재료',
    expiryDate: '2026-03-28',
    addedDate: '2026-03-16'
  },
  {
    id: '6',
    name: '양파',
    icon: 'apple',
    quantity: '5개',
    location: 'room',
    processingState: '생재료',
    expiryDate: '2026-04-05',
    addedDate: '2026-03-12'
  },
  {
    id: '7',
    name: '우유',
    icon: 'milk',
    quantity: '1L',
    location: 'refrigerated',
    processingState: '생재료',
    expiryDate: '2026-03-25',
    addedDate: '2026-03-17'
  },
  {
    id: '8',
    name: '참치캔',
    icon: 'fish',
    quantity: '3개',
    location: 'room',
    processingState: '가공식품',
    expiryDate: '2027-01-01',
    addedDate: '2026-01-15'
  },
  {
    id: '9',
    name: '두부',
    icon: 'square',
    quantity: '1모',
    location: 'refrigerated',
    processingState: '생재료',
    expiryDate: '2026-03-26',
    addedDate: '2026-03-18'
  },
  {
    id: '10',
    name: '냉동 소고기',
    icon: 'beef',
    quantity: '500g',
    location: 'frozen',
    processingState: '반가공',
    expiryDate: '2026-06-01',
    addedDate: '2026-02-18'
  }
];

export const recipeSeed = [
  {
    id: 1,
    name: '김치볶음밥',
    title: '김치볶음밥',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=400&fit=crop',
    cookingTime: 15,
    cooking_time: 15,
    difficulty: 2,
    calories: 450,
    rating: 4.8,
    ratingCount: 234,
    description: '자취생이 빠르게 만들기 좋은 든든한 한 그릇 메뉴예요.',
    ingredients: [
      { name: '밥', amount: '2공기', required: true },
      { name: '김치', amount: '150g', required: true },
      { name: '식용유', amount: '2큰술', required: true },
      { name: '양파', amount: '1/2개', required: false },
      { name: '계란', amount: '1개', required: false }
    ],
    steps: [
      { text: '김치와 양파를 잘게 썰어 준비해요.', tip: '김치는 국물을 살짝 짜면 볶을 때 질척이지 않아요.' },
      { text: '팬에 기름을 두르고 양파와 김치를 먼저 볶아요.', tip: '김치가 살짝 눌어붙기 직전까지 볶아야 풍미가 깊어져요.' },
      { text: '밥을 넣고 고루 풀어가며 볶아요.', tip: '주걱으로 눌러가며 볶으면 고슬고슬해져요.' },
      { text: '원하면 계란 프라이를 올려 마무리해요.', tip: '참기름이나 김가루를 더하면 훨씬 맛있어요.' }
    ],
    tools: ['프라이팬'],
    xpReward: 15,
    coinReward: 30
  },
  {
    id: 2,
    name: '된장찌개',
    title: '된장찌개',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&h=400&fit=crop',
    cookingTime: 25,
    cooking_time: 25,
    difficulty: 3,
    calories: 280,
    rating: 4.9,
    ratingCount: 456,
    description: '집밥 느낌이 살아 있는 기본 한식 찌개예요.',
    ingredients: [
      { name: '된장', amount: '2큰술', required: true },
      { name: '두부', amount: '1/2모', required: true },
      { name: '양파', amount: '1/2개', required: true },
      { name: '감자', amount: '1개', required: false },
      { name: '애호박', amount: '1/4개', required: false }
    ],
    steps: [
      { text: '냄비에 물을 붓고 된장을 잘 풀어주세요.', tip: '멸치육수가 있으면 감칠맛이 훨씬 좋아져요.' },
      { text: '감자와 양파를 먼저 넣고 끓여요.', tip: '감자를 먼저 넣어야 익는 시간이 잘 맞아요.' },
      { text: '두부와 애호박을 넣고 한 번 더 끓여요.', tip: '두부는 너무 오래 끓이면 부서지기 쉬워요.' },
      { text: '간을 보고 필요하면 다진 마늘을 추가해요.', tip: '마지막에 청양고추를 넣으면 칼칼함이 살아나요.' }
    ],
    tools: ['냄비'],
    xpReward: 25,
    coinReward: 50
  },
  {
    id: 3,
    name: '계란간장밥',
    title: '계란간장밥',
    category: '간편식',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=400&fit=crop',
    cookingTime: 5,
    cooking_time: 5,
    difficulty: 1,
    calories: 390,
    rating: 4.7,
    ratingCount: 310,
    description: '밥과 계란만 있으면 바로 만들 수 있는 자취생 필수 메뉴예요.',
    ingredients: [
      { name: '밥', amount: '1공기', required: true },
      { name: '계란', amount: '1개', required: true },
      { name: '간장', amount: '1큰술', required: true },
      { name: '참기름', amount: '1작은술', required: false }
    ],
    steps: [
      { text: '따뜻한 밥을 그릇에 담아요.', tip: '밥이 따뜻해야 계란과 잘 어울려요.' },
      { text: '계란 프라이를 반숙으로 올려요.', tip: '노른자를 남겨두면 비빌 때 훨씬 부드러워요.' },
      { text: '간장과 참기름을 넣고 비벼 먹어요.', tip: '김가루를 넣으면 풍미가 더 좋아져요.' }
    ],
    tools: ['프라이팬'],
    xpReward: 8,
    coinReward: 18
  },
  {
    id: 4,
    name: '참치마요덮밥',
    title: '참치마요덮밥',
    category: '간편식',
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=500&h=400&fit=crop',
    cookingTime: 10,
    cooking_time: 10,
    difficulty: 1,
    calories: 520,
    rating: 4.8,
    ratingCount: 420,
    description: '참치캔과 마요네즈만 있으면 되는 초간단 덮밥이에요.',
    ingredients: [
      { name: '밥', amount: '1공기', required: true },
      { name: '참치캔', amount: '1개', required: true },
      { name: '마요네즈', amount: '2큰술', required: true },
      { name: '간장', amount: '1큰술', required: false },
      { name: '양파', amount: '1/4개', required: false }
    ],
    steps: [
      { text: '참치 기름을 빼고 그릇에 담아요.', tip: '기름을 너무 많이 남기면 느끼해질 수 있어요.' },
      { text: '마요네즈와 잘게 썬 양파를 섞어 소스를 만들어요.', tip: '후추를 약간 넣으면 느끼함이 줄어요.' },
      { text: '밥 위에 참치마요를 올리고 간장을 살짝 둘러요.', tip: '김가루나 쪽파를 곁들이면 더 맛있어요.' }
    ],
    tools: ['볼'],
    xpReward: 10,
    coinReward: 22
  },
  {
    id: 5,
    name: '스팸김치찌개',
    title: '스팸김치찌개',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&h=400&fit=crop',
    cookingTime: 20,
    cooking_time: 20,
    difficulty: 2,
    calories: 430,
    rating: 4.9,
    ratingCount: 287,
    description: '고기 대신 스팸으로 깊은 맛을 내는 자취생 버전 김치찌개예요.',
    ingredients: [
      { name: '김치', amount: '200g', required: true },
      { name: '스팸', amount: '1/2캔', required: true },
      { name: '두부', amount: '1/2모', required: false },
      { name: '대파', amount: '약간', required: false }
    ],
    steps: [
      { text: '김치와 스팸을 냄비에 넣고 먼저 볶아요.', tip: '김치를 먼저 볶아야 국물 맛이 훨씬 진해져요.' },
      { text: '물을 붓고 10분 정도 끓여요.', tip: '국물이 졸아들면 물을 조금 더 보충해도 괜찮아요.' },
      { text: '두부와 대파를 넣고 한 번 더 끓여 마무리해요.', tip: '라면 사리를 넣어도 잘 어울려요.' }
    ],
    tools: ['냄비'],
    xpReward: 18,
    coinReward: 34
  },
  {
    id: 6,
    name: '두부부침 양념장',
    title: '두부부침 양념장',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&h=400&fit=crop',
    cookingTime: 12,
    cooking_time: 12,
    difficulty: 1,
    calories: 250,
    rating: 4.6,
    ratingCount: 195,
    description: '반찬이 없을 때 두부 한 모로 해결하는 가성비 메뉴예요.',
    ingredients: [
      { name: '두부', amount: '1모', required: true },
      { name: '간장', amount: '1큰술', required: true },
      { name: '고춧가루', amount: '1작은술', required: false },
      { name: '대파', amount: '약간', required: false }
    ],
    steps: [
      { text: '두부의 물기를 제거하고 먹기 좋게 썰어요.', tip: '키친타월로 눌러 물기를 빼면 더 잘 구워져요.' },
      { text: '팬에 노릇하게 부쳐주세요.', tip: '중약불에서 천천히 부치면 겉이 더 바삭해져요.' },
      { text: '간장 양념장을 뿌려 마무리해요.', tip: '양념장은 먹기 직전에 올려야 눅눅해지지 않아요.' }
    ],
    tools: ['프라이팬'],
    xpReward: 9,
    coinReward: 18
  },
  {
    id: 7,
    name: '참치김치전',
    title: '참치김치전',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=400&fit=crop',
    cookingTime: 18,
    cooking_time: 18,
    difficulty: 2,
    calories: 410,
    rating: 4.7,
    ratingCount: 164,
    description: '비 오는 날 생각나는 김치전에 참치를 넣어 더 든든하게 만들어요.',
    ingredients: [
      { name: '김치', amount: '150g', required: true },
      { name: '참치캔', amount: '1/2캔', required: true },
      { name: '부침가루', amount: '1컵', required: true },
      { name: '물', amount: '3/4컵', required: true }
    ],
    steps: [
      { text: '김치를 잘게 자르고 반죽을 만들어요.', tip: '김치 국물을 조금 넣으면 더 맛있어요.' },
      { text: '참치를 넣고 반죽을 고루 섞어요.', tip: '참치 기름은 조금만 넣어야 반죽이 너무 묽지 않아요.' },
      { text: '팬에 얇게 펴서 앞뒤로 노릇하게 부쳐요.', tip: '너무 두껍지 않아야 바삭해져요.' }
    ],
    tools: ['프라이팬'],
    xpReward: 14,
    coinReward: 28
  },
  {
    id: 8,
    name: '만두국',
    title: '만두국',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&h=400&fit=crop',
    cookingTime: 15,
    cooking_time: 15,
    difficulty: 1,
    calories: 380,
    rating: 4.6,
    ratingCount: 210,
    description: '냉동만두만 있으면 든든하게 되는 따뜻한 국물 요리예요.',
    ingredients: [
      { name: '냉동만두', amount: '6개', required: true },
      { name: '국간장', amount: '1큰술', required: true },
      { name: '계란', amount: '1개', required: false },
      { name: '대파', amount: '약간', required: false }
    ],
    steps: [
      { text: '냄비에 물을 끓이고 국간장을 넣어요.', tip: '멸치육수가 있으면 더 맛있어요.' },
      { text: '만두를 넣고 떠오를 때까지 끓여요.', tip: '만두가 떠오른 뒤 2분 정도 더 끓이면 속까지 익어요.' },
      { text: '계란과 대파를 넣고 마무리해요.', tip: '후추를 조금 넣으면 국물 맛이 깔끔해져요.' }
    ],
    tools: ['냄비'],
    xpReward: 11,
    coinReward: 24
  },
  {
    id: 9,
    name: '비빔국수',
    title: '비빔국수',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=400&fit=crop',
    cookingTime: 15,
    cooking_time: 15,
    difficulty: 2,
    calories: 470,
    rating: 4.7,
    ratingCount: 203,
    description: '면만 삶으면 바로 먹을 수 있는 매콤한 자취생 별미예요.',
    ingredients: [
      { name: '소면', amount: '1인분', required: true },
      { name: '고추장', amount: '1큰술', required: true },
      { name: '식초', amount: '1작은술', required: true },
      { name: '설탕', amount: '1작은술', required: false },
      { name: '오이', amount: '약간', required: false }
    ],
    steps: [
      { text: '면을 삶아 찬물에 헹궈요.', tip: '찬물에 충분히 헹궈야 쫄깃해져요.' },
      { text: '양념장을 미리 섞어둬요.', tip: '참기름을 몇 방울 넣으면 더 고소해져요.' },
      { text: '면과 양념장을 비비고 오이를 올려요.', tip: '삶은 계란을 더하면 한층 든든해져요.' }
    ],
    tools: ['냄비', '볼'],
    xpReward: 13,
    coinReward: 26
  },
  {
    id: 10,
    name: '간장버터계란밥',
    title: '간장버터계란밥',
    category: '간편식',
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=500&h=400&fit=crop',
    cookingTime: 7,
    cooking_time: 7,
    difficulty: 1,
    calories: 430,
    rating: 4.8,
    ratingCount: 351,
    description: '귀찮은 날에도 금방 만들어 먹을 수 있는 초간단 메뉴예요.',
    ingredients: [
      { name: '밥', amount: '1공기', required: true },
      { name: '계란', amount: '1개', required: true },
      { name: '간장', amount: '1큰술', required: true },
      { name: '버터', amount: '1조각', required: true }
    ],
    steps: [
      { text: '밥 위에 버터를 올려 녹여요.', tip: '따뜻한 밥이면 버터가 더 잘 녹아요.' },
      { text: '계란 프라이를 만들어 올려요.', tip: '반숙으로 하면 더 부드럽게 비벼져요.' },
      { text: '간장을 둘러 비벼 먹어요.', tip: '후추를 살짝 뿌리면 풍미가 살아나요.' }
    ],
    tools: ['프라이팬'],
    xpReward: 8,
    coinReward: 16
  },
  {
    id: 11,
    name: '고추장참치비빔밥',
    title: '고추장참치비빔밥',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=400&fit=crop',
    cookingTime: 10,
    cooking_time: 10,
    difficulty: 1,
    calories: 510,
    rating: 4.6,
    ratingCount: 171,
    description: '반찬이 없을 때 참치와 고추장만으로도 만족스러운 비빔밥이에요.',
    ingredients: [
      { name: '밥', amount: '1공기', required: true },
      { name: '참치캔', amount: '1개', required: true },
      { name: '고추장', amount: '1큰술', required: true },
      { name: '참기름', amount: '1작은술', required: false }
    ],
    steps: [
      { text: '참치 기름을 가볍게 빼주세요.', tip: '완전히 빼지 않으면 더 촉촉해요.' },
      { text: '밥 위에 참치와 고추장을 올려요.', tip: '마요네즈를 조금 넣어도 잘 어울려요.' },
      { text: '참기름을 넣고 비벼 먹어요.', tip: '김가루가 있으면 함께 넣어보세요.' }
    ],
    tools: ['볼'],
    xpReward: 9,
    coinReward: 19
  },
  {
    id: 12,
    name: '치즈김치볶음밥',
    title: '치즈김치볶음밥',
    category: '퓨전',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&h=400&fit=crop',
    cookingTime: 15,
    cooking_time: 15,
    difficulty: 2,
    calories: 560,
    rating: 4.8,
    ratingCount: 244,
    description: '기본 김치볶음밥에 치즈를 더한 실패 없는 퓨전 메뉴예요.',
    ingredients: [
      { name: '밥', amount: '1공기', required: true },
      { name: '김치', amount: '150g', required: true },
      { name: '치즈', amount: '1장', required: true },
      { name: '식용유', amount: '1큰술', required: true }
    ],
    steps: [
      { text: '김치를 먼저 볶아요.', tip: '김치가 살짝 카라멜라이즈되면 더 맛있어요.' },
      { text: '밥을 넣고 볶다가 치즈를 올려 녹여요.', tip: '불을 약하게 줄이면 치즈가 타지 않아요.' },
      { text: '골고루 섞어 마무리해요.', tip: '모짜렐라가 있으면 더 쫀득해져요.' }
    ],
    tools: ['프라이팬'],
    xpReward: 14,
    coinReward: 28
  },
  {
    id: 13,
    name: '떡만두라면',
    title: '떡만두라면',
    category: '야식',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop',
    cookingTime: 12,
    cooking_time: 12,
    difficulty: 1,
    calories: 620,
    rating: 4.9,
    ratingCount: 380,
    description: '라면에 떡과 만두를 넣어 만족감을 높인 야식 메뉴예요.',
    ingredients: [
      { name: '라면', amount: '1봉지', required: true },
      { name: '냉동만두', amount: '3개', required: true },
      { name: '떡', amount: '한 줌', required: false },
      { name: '계란', amount: '1개', required: false }
    ],
    steps: [
      { text: '물을 끓이고 떡과 만두를 먼저 넣어요.', tip: '만두 속까지 익히려면 먼저 넣는 편이 좋아요.' },
      { text: '라면과 스프를 넣고 끓여요.', tip: '면이 너무 퍼지지 않게 중간중간 저어주세요.' },
      { text: '계란을 넣고 마무리해요.', tip: '치즈를 올리면 더 자극적인 맛이 나요.' }
    ],
    tools: ['냄비'],
    xpReward: 12,
    coinReward: 24
  },
  {
    id: 14,
    name: '김치말이국수',
    title: '김치말이국수',
    category: '한식',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=400&fit=crop',
    cookingTime: 12,
    cooking_time: 12,
    difficulty: 2,
    calories: 340,
    rating: 4.5,
    ratingCount: 126,
    description: '시원하게 먹기 좋은 여름 자취 메뉴예요.',
    ingredients: [
      { name: '소면', amount: '1인분', required: true },
      { name: '김치', amount: '100g', required: true },
      { name: '찬물', amount: '1컵', required: true },
      { name: '식초', amount: '1작은술', required: false }
    ],
    steps: [
      { text: '면을 삶아 차갑게 헹궈요.', tip: '얼음물에 헹구면 더 시원해져요.' },
      { text: '김치에 물을 섞어 국물을 만들어요.', tip: '김치 국물을 조금 넣으면 감칠맛이 좋아요.' },
      { text: '면 위에 국물을 붓고 김치를 올려요.', tip: '오이채를 올리면 더 상큼해요.' }
    ],
    tools: ['냄비', '볼'],
    xpReward: 11,
    coinReward: 21
  },
  {
    id: 15,
    name: '불닭마요주먹밥',
    title: '불닭마요주먹밥',
    category: '퓨전',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop',
    cookingTime: 10,
    cooking_time: 10,
    difficulty: 1,
    calories: 480,
    rating: 4.7,
    ratingCount: 188,
    description: '매운 소스와 마요 조합이 중독적인 자취 간식이에요.',
    ingredients: [
      { name: '밥', amount: '1공기', required: true },
      { name: '마요네즈', amount: '1큰술', required: true },
      { name: '고추장', amount: '1작은술', required: true },
      { name: '김가루', amount: '약간', required: false }
    ],
    steps: [
      { text: '밥에 마요네즈와 고추장을 넣고 섞어요.', tip: '너무 많이 넣으면 질어질 수 있어요.' },
      { text: '먹기 좋게 둥글게 주먹밥 모양을 만들어요.', tip: '랩을 사용하면 더 쉽게 뭉칠 수 있어요.' },
      { text: '김가루를 묻혀 마무리해요.', tip: '치즈를 넣으면 매운맛이 부드러워져요.' }
    ],
    tools: ['볼'],
    xpReward: 10,
    coinReward: 20
  },
  {
    id: 16,
    name: '라면볶이',
    title: '라면볶이',
    category: '야식',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&h=400&fit=crop',
    cookingTime: 15,
    cooking_time: 15,
    difficulty: 2,
    calories: 590,
    rating: 4.8,
    ratingCount: 296,
    description: '떡볶이 소스에 라면을 넣은 자취생 최애 분식 메뉴예요.',
    ingredients: [
      { name: '라면', amount: '1봉지', required: true },
      { name: '고추장', amount: '1큰술', required: true },
      { name: '설탕', amount: '1작은술', required: true },
      { name: '떡', amount: '한 줌', required: false }
    ],
    steps: [
      { text: '물에 고추장과 설탕을 넣어 소스를 만들어요.', tip: '간장을 약간 넣어도 맛있어요.' },
      { text: '떡이 있으면 먼저 넣고 끓여요.', tip: '떡이 말랑해질 때까지 먼저 익혀주세요.' },
      { text: '라면을 넣고 국물이 자작해질 때까지 졸여요.', tip: '치즈를 올리면 더 맛있어요.' }
    ],
    tools: ['냄비'],
    xpReward: 13,
    coinReward: 25
  },
  {
    id: 17,
    name: '김치치즈만두그라탕',
    title: '김치치즈만두그라탕',
    category: '퓨전',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=400&fit=crop',
    cookingTime: 18,
    cooking_time: 18,
    difficulty: 2,
    calories: 540,
    rating: 4.6,
    ratingCount: 132,
    description: '냉동만두를 색다르게 먹고 싶을 때 좋은 이색 메뉴예요.',
    ingredients: [
      { name: '냉동만두', amount: '6개', required: true },
      { name: '김치', amount: '80g', required: true },
      { name: '치즈', amount: '2장', required: true },
      { name: '케첩', amount: '1큰술', required: false }
    ],
    steps: [
      { text: '만두를 먼저 노릇하게 익혀주세요.', tip: '전자레인지보다 팬에 익히면 식감이 더 좋아져요.' },
      { text: '김치와 케첩을 섞어 위에 올려요.', tip: '케첩은 너무 많이 넣지 않아도 충분해요.' },
      { text: '치즈를 덮어 녹이면 완성이에요.', tip: '에어프라이어나 전자레인지로 치즈만 녹여도 좋아요.' }
    ],
    tools: ['프라이팬', '전자레인지'],
    xpReward: 15,
    coinReward: 30
  },
  {
    id: 18,
    name: '마늘간장우유파스타',
    title: '마늘간장우유파스타',
    category: '퓨전',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
    cookingTime: 20,
    cooking_time: 20,
    difficulty: 2,
    calories: 530,
    rating: 4.4,
    ratingCount: 98,
    description: '크림 파스타와 간장 파스타 사이 느낌의 이색 자취 메뉴예요.',
    ingredients: [
      { name: '스파게티면', amount: '1인분', required: true },
      { name: '우유', amount: '1컵', required: true },
      { name: '간장', amount: '1작은술', required: true },
      { name: '마늘', amount: '3쪽', required: true }
    ],
    steps: [
      { text: '면을 먼저 삶아요.', tip: '너무 퍼지지 않게 1분 덜 삶아도 좋아요.' },
      { text: '마늘을 볶고 우유와 간장을 넣어요.', tip: '우유가 끓어 넘치지 않게 중약불을 유지해요.' },
      { text: '면을 넣고 살짝 졸여 마무리해요.', tip: '후추를 뿌리면 훨씬 맛있어요.' }
    ],
    tools: ['냄비', '프라이팬'],
    xpReward: 16,
    coinReward: 31
  },
  {
    id: 19,
    name: '두부김치 또띠아쌈',
    title: '두부김치 또띠아쌈',
    category: '퓨전',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500&h=400&fit=crop',
    cookingTime: 15,
    cooking_time: 15,
    difficulty: 1,
    calories: 410,
    rating: 4.5,
    ratingCount: 107,
    description: '한식 재료를 또띠아에 싸 먹는 가볍고 색다른 메뉴예요.',
    ingredients: [
      { name: '두부', amount: '1/2모', required: true },
      { name: '김치', amount: '80g', required: true },
      { name: '또띠아', amount: '2장', required: true },
      { name: '마요네즈', amount: '1큰술', required: false }
    ],
    steps: [
      { text: '두부를 구워 물기를 날려요.', tip: '노릇하게 구우면 식감이 더 좋아져요.' },
      { text: '김치를 가볍게 볶아요.', tip: '신김치일수록 더 잘 어울려요.' },
      { text: '또띠아에 두부와 김치를 올려 말아주세요.', tip: '마요네즈를 조금 넣으면 더 부드러워져요.' }
    ],
    tools: ['프라이팬'],
    xpReward: 12,
    coinReward: 23
  },
  {
    id: 20,
    name: '고구마김치피자토스트',
    title: '고구마김치피자토스트',
    category: '이색',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=400&fit=crop',
    cookingTime: 12,
    cooking_time: 12,
    difficulty: 1,
    calories: 460,
    rating: 4.3,
    ratingCount: 86,
    description: '달콤한 고구마와 김치가 의외로 잘 어울리는 토스트예요.',
    ingredients: [
      { name: '식빵', amount: '2장', required: true },
      { name: '고구마', amount: '1/2개', required: true },
      { name: '김치', amount: '50g', required: true },
      { name: '치즈', amount: '1장', required: true }
    ],
    steps: [
      { text: '고구마를 으깨고 김치는 잘게 썰어요.', tip: '전자레인지로 익힌 고구마를 쓰면 편해요.' },
      { text: '식빵 위에 고구마, 김치, 치즈를 올려요.', tip: '케첩을 살짝 바르면 피자 느낌이 더 나요.' },
      { text: '전자레인지나 에어프라이어로 치즈를 녹여요.', tip: '너무 오래 돌리면 빵이 딱딱해질 수 있어요.' }
    ],
    tools: ['전자레인지', '에어프라이어'],
    xpReward: 12,
    coinReward: 24
  }
];

export const communityShortsSeed = [
  {
    id: 1,
    userId: 'user001',
    username: '요리정석',
    userAvatar: '요',
    thumbnail: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=700&fit=crop',
    title: '5분 만에 만드는 김치볶음밥',
    likes: 1234,
    comments: 89,
    shares: 45,
    ingredients: [
      { name: '밥', amount: '2공기' },
      { name: '김치', amount: '150g' },
      { name: '식용유', amount: '2큰술' },
      { name: '양파', amount: '1/2개' }
    ],
    isLiked: false
  },
  {
    id: 2,
    userId: 'user002',
    username: '집밥요정',
    userAvatar: '집',
    thumbnail: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=700&fit=crop',
    title: '집에 있는 재료로 된장찌개 끓이기',
    likes: 2156,
    comments: 134,
    shares: 78,
    ingredients: [
      { name: '된장', amount: '2큰술' },
      { name: '두부', amount: '1/2모' },
      { name: '양파', amount: '1/2개' },
      { name: '감자', amount: '1개' }
    ],
    isLiked: false
  },
  {
    id: 3,
    userId: 'user003',
    username: '자취실험실',
    userAvatar: '자',
    thumbnail: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=700&fit=crop',
    title: '냉동만두로 만드는 김치치즈만두그라탕',
    likes: 3421,
    comments: 267,
    shares: 156,
    ingredients: [
      { name: '냉동만두', amount: '6개' },
      { name: '김치', amount: '80g' },
      { name: '치즈', amount: '2장' }
    ],
    isLiked: false
  }
];

export const communityPostsSeed = [
  {
    id: 101,
    userId: 'user005',
    username: '베이글러버',
    userAvatar: '베',
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    title: '초간단 머핀 만들기',
    likes: 4521,
    comments: 312,
    category: '베이킹',
    timeAgo: '1시간 전',
    description: '오븐 없이도 가능한 쉬운 머핀 레시피를 정리했어요.'
  },
  {
    id: 102,
    userId: 'user006',
    username: '건강밥친구',
    userAvatar: '건',
    thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    title: '영양 만점 아침 샌드위치',
    likes: 3214,
    comments: 189,
    category: '브런치',
    timeAgo: '3시간 전',
    description: '냉장고 속 재료로 만드는 든든한 샌드위치예요.'
  },
  {
    id: 103,
    userId: 'user007',
    username: '분식러버',
    userAvatar: '분',
    thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    title: '집에서 만드는 참치마요덮밥',
    likes: 5678,
    comments: 421,
    category: '간편식',
    timeAgo: '5시간 전',
    description: '참치캔만 있으면 가능한 간단한 덮밥 레시피예요.'
  },
  {
    id: 201,
    userId: 'newbie001',
    username: '요리초보',
    userAvatar: '초',
    thumbnail: null,
    title: '계란 프라이 처음 성공했어요!',
    likes: 5,
    comments: 2,
    category: '한식',
    description: '반숙으로 하려다가 완숙이 됐지만 그래도 맛있었어요.',
    timeAgo: '방금 전'
  },
  {
    id: 202,
    userId: 'student123',
    username: '자취밥상',
    userAvatar: '자',
    thumbnail: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    title: '의외의 재료 조합 추천',
    likes: 45,
    comments: 12,
    category: '간편식',
    description: '마트 재료와 집에 남은 재료를 섞어 먹었는데 생각보다 괜찮았어요.',
    timeAgo: '10분 전'
  }
];

export const shoppingListSeed = [
  {
    id: '1',
    name: '밥',
    amount: '2공기',
    source: '김치볶음밥',
    checked: false,
    createdAt: '2026-03-22T09:00:00.000Z'
  },
  {
    id: '2',
    name: '된장',
    amount: '2큰술',
    source: '된장찌개',
    checked: false,
    createdAt: '2026-03-22T09:10:00.000Z'
  }
];

export const recipeCategories = ['한식', '간편식', '퓨전', '야식', '이색'];
export const cookingTools = ['냄비', '프라이팬', '전자레인지', '에어프라이어', '볼'];

export const calculateFreshness = (expiryDate, now = new Date()) => {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { status: 'expired', color: 'freshness-danger', days: daysRemaining, percentage: 100 };
  }
  if (daysRemaining <= 3) {
    return { status: 'danger', color: 'freshness-danger', days: daysRemaining, percentage: 20 };
  }
  if (daysRemaining <= 7) {
    return { status: 'warning', color: 'freshness-warning', days: daysRemaining, percentage: 55 };
  }
  return {
    status: 'good',
    color: 'freshness-good',
    days: daysRemaining,
    percentage: Math.min((daysRemaining / 30) * 100, 100)
  };
};
