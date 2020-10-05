export interface PostStatus {
    success: boolean;
    message: string;
}

export interface Post {
    title: string;
    content?: string;
    author: string;
    date: number;
}

export interface GetPostsResult {
    count: number;
    posts: Post[];
}
