export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface PostType {
    id: number;
    content: string | null;
    imageUrl: string | null;
    isPublic: boolean;
    createdAt: string;
    userId: number;
    userFullName: string;
    likeCount: number;
    isLikedByMe: boolean;
    commentCount: number;
}

export interface CommentType {
    id: number;
    content: string;
    postId: number;
    userId: number;
    userFullName: string;
    createdAt: string;
    parentCommentId: number | null;
    likeCount: number;
    isLikedByMe: boolean;
    replyCount: number;
    replies: CommentType[];
}

export interface LikerType {
    userId: number;
    fullName: string;
}

