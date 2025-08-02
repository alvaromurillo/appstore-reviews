export interface Review {
    id: string;
    title: string;
    content: string;
    rating: number;
    author: string;
    version: string;
    date: string;
    country: string;
}
export interface AppStoreReviewsResponse {
    appId: string;
    country: string;
    sortBy: string;
    totalReviews: number;
    pagesChecked: number;
    reviews: Review[];
}
export type SortOption = 'mostrecent' | 'mosthelpful';
export declare function fetchAppStoreReviews(appId: string, country?: string, limit?: number, sortBy?: SortOption): Promise<AppStoreReviewsResponse>;
//# sourceMappingURL=appstore.d.ts.map