import { communityShortsSeed, communityPostsSeed } from '../../shared/seedData';

export const mockShortsData = communityShortsSeed;
export const mockPopularPosts = communityPostsSeed.filter((post) => post.likes >= 100);
export const mockBoardPosts = communityPostsSeed;
export const communityCategories = ['전체', '한식', '양식', '중식', '샐러드', '간편식', '베이킹', '일식'];
