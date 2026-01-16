// Mock data for community features
export const mockShortsData = [
    {
        id: 1,
        userId: 'user001',
        username: '요리왕김씨',
        userAvatar: '👨‍🍳',
        thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=700&fit=crop',
        title: '5분만에 완성하는 김치볶음밥',
        likes: 1234,
        comments: 89,
        shares: 45,
        ingredients: [
            { name: '밥', amount: '2공기' },
            { name: '김치', amount: '150g' },
            { name: '식용유', amount: '2스푼' },
            { name: '대파', amount: '1/2대' }
        ],
        isLiked: false
    },
    {
        id: 2,
        userId: 'user002',
        username: '집밥요정',
        userAvatar: '🧚‍♀️',
        thumbnail: 'https://images.unsplash.com/photo-1568096889942-6eecom630728?w=400&h=700&fit=crop',
        title: '엄마 손맛 된장찌개',
        likes: 2156,
        comments: 134,
        shares: 78,
        ingredients: [
            { name: '된장', amount: '2스푼' },
            { name: '두부', amount: '1/2모' },
            { name: '양파', amount: '1/2개' },
            { name: '호박', amount: '1/4개' }
        ],
        isLiked: false
    },
    {
        id: 3,
        userId: 'user003',
        username: '파스타마스터',
        userAvatar: '🍝',
        thumbnail: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=700&fit=crop',
        title: '레스토랑급 알리오올리오',
        likes: 3421,
        comments: 267,
        shares: 156,
        ingredients: [
            { name: '스파게티면', amount: '200g' },
            { name: '마늘', amount: '5쪽' },
            { name: '올리브오일', amount: '5스푼' },
            { name: '페페론치노', amount: '적당량' }
        ],
        isLiked: false
    },
    {
        id: 4,
        userId: 'user004',
        username: '다이어트쿡',
        userAvatar: '🥗',
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=700&fit=crop',
        title: '저칼로리 닭가슴살 샐러드',
        likes: 987,
        comments: 56,
        shares: 34,
        ingredients: [
            { name: '닭가슴살', amount: '150g' },
            { name: '양상추', amount: '적당량' },
            { name: '방울토마토', amount: '5개' },
            { name: '드레싱', amount: '적당량' }
        ],
        isLiked: false
    }
];

export const mockPopularPosts = [
    {
        id: 101,
        userId: 'user005',
        username: '베이킹러버',
        userAvatar: '🧁',
        thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        title: '초간단 마들렌 레시피',
        likes: 4521,
        comments: 312,
        category: '베이킹',
        timeAgo: '1시간 전'
    },
    {
        id: 102,
        userId: 'user006',
        username: '아침밥천사',
        userAvatar: '☀️',
        thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
        title: '영양 만점 아침 샌드위치',
        likes: 3214,
        comments: 189,
        category: '아침',
        timeAgo: '3시간 전'
    },
    {
        id: 103,
        userId: 'user007',
        username: '야식킬러',
        userAvatar: '🌙',
        thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        title: '최고의 치킨 레시피',
        likes: 5678,
        comments: 421,
        category: '야식',
        timeAgo: '5시간 전'
    },
    {
        id: 104,
        userId: 'user008',
        username: '디저트맛집',
        userAvatar: '🍰',
        thumbnail: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
        title: '티라미수 만들기',
        likes: 2987,
        comments: 234,
        category: '디저트',
        timeAgo: '1일 전'
    },
    {
        id: 105,
        userId: 'user009',
        username: '국물요리왕',
        userAvatar: '🍲',
        thumbnail: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
        title: '얼큰한 김치찌개',
        likes: 4123,
        comments: 298,
        category: '한식',
        timeAgo: '1일 전'
    },
    {
        id: 106,
        userId: 'user010',
        username: '브런치메이커',
        userAvatar: '🥞',
        thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
        title: '폭신폭신 팬케이크',
        likes: 3456,
        comments: 267,
        category: '브런치',
        timeAgo: '2일 전'
    }
];

// Combine popular posts with some low-like posts for "All Posts"
export const mockBoardPosts = [
    ...mockPopularPosts,
    {
        id: 201,
        userId: 'newbie001',
        username: '요리초보',
        userAvatar: '🐣',
        thumbnail: null,
        title: '계란후라이 처음 해봤어요!',
        likes: 5,
        comments: 2,
        category: '한식',
        description: '반숙으로 하려다가 완숙이 되어버렸네요 ㅠㅠ',
        timeAgo: '방금 전'
    },
    {
        id: 202,
        userId: 'student123',
        username: '자취생',
        userAvatar: '🎓',
        thumbnail: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
        title: '편의점 꿀조합 추천',
        likes: 45,
        comments: 12,
        category: '간편식',
        description: '마크정식 만들어봤는데 진짜 맛있네요 bb',
        timeAgo: '10분 전'
    },
    {
        id: 203,
        userId: 'momcook',
        username: '주부9단',
        userAvatar: '👵',
        thumbnail: null,
        title: '오늘 저녁 메뉴 고민되시나요?',
        likes: 12,
        comments: 8,
        category: '질문',
        description: '김치찌개랑 된장찌개 중 뭐 먹을까요?',
        timeAgo: '30분 전'
    }
];

export const communityCategories = ['전체', '한식', '양식', '중식', '일식', '베이킹', '디저트', '야식'];
