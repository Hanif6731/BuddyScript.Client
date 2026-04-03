import api from '../api';
import type { User, PostType, CommentType, LikerType } from '../types/models';

export const loginUser = async (credentials: any): Promise<User> => {
    const res = await api.post('/Auth/login', credentials);
    return res.data;
};

export const registerUser = async (data: any): Promise<void> => {
    await api.post('/Auth/register', data);
};

export const googleLogin = async (code: string) => {
  const response = await api.post('/Auth/google-login', { code });
  return response.data;
};

export const getSettings = async () => {
    const response = await api.get('/Settings');
    return response.data;
};

export const updateTheme = async (theme: string) => {
    const response = await api.patch('/Settings/theme', { theme });
    return response.data;
};

export const logoutUser = async (): Promise<void> => {
    await api.post('/Auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/Auth/getcurrentuser');
    return response.data;
};

export const createPost = async (formData: FormData): Promise<{ id: number }> => {
    const res = await api.post('/Feed/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const loadFeed = async (page: number = 1, pageSize: number = 20): Promise<PostType[]> => {
    const res = await api.get('/Feed/posts', { params: { page, pageSize } });
    return res.data;
};

export const createComment = async (postId: number, content: string, parentCommentId?: number): Promise<{ id: number }> => {
    const res = await api.post('/Interactions/comment', { postId, content, parentCommentId });
    return res.data;
};

export const getComments = async (postId: number): Promise<CommentType[]> => {
    const res = await api.get(`/Interactions/comments/${postId}`);
    return res.data;
};

export const getReplies = async (commentId: number): Promise<CommentType[]> => {
    const res = await api.get(`/Interactions/replies/${commentId}`);
    return res.data;
};

export const toggleLike = async (entityId: number, entityType: number): Promise<boolean> => {
    const res = await api.post('/Interactions/like', { entityId, entityType });
    return res.data.liked;
};

export const getLikers = async (entityId: number, entityType: number): Promise<LikerType[]> => {
    const res = await api.get(`/Interactions/likers/${entityId}/${entityType}`);
    return res.data;
};

export const getBaseUrl = (): string => {
    return '';
};
