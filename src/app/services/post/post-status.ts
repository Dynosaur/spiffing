export interface PostStatus {
    success: boolean;
    message: string;
}

export interface Post {
    title: string;
    content?: string;
    author: string;
    date: number;
    id: string;
}

export interface GetPostsResult {
    count: number;
    posts: Post[];
}
