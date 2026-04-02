import React, { useCallback, useEffect, useRef, useState } from 'react';
import { loadFeed } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import type { PostType } from '../../types/models';
import StoriesSection from './StoriesSection/StoriesSection';
import PostCreator from './PostCreator/PostCreator';
import PostItem from './PostItem/PostItem';

const PAGE_SIZE = 20;

const FeedMiddle: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const fetchPosts = useCallback(async (pageNum: number, replace = false) => {
        try {
            const data = await loadFeed(pageNum, PAGE_SIZE);
            setPosts(prev => replace ? data : [...prev, ...data]);
            setHasMore(data.length === PAGE_SIZE);
        } catch (err) {
            setError('Failed to load posts. Please refresh.');
            console.error('Feed load error:', err);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchPosts(1, true).finally(() => setLoading(false));
    }, [fetchPosts]);

    useEffect(() => {
        if (!sentinelRef.current || !hasMore || loadingMore) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    setLoadingMore(true);
                    fetchPosts(nextPage).finally(() => setLoadingMore(false));
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, page, fetchPosts]);

    const handlePostCreated = useCallback(() => {
        setPage(1);
        fetchPosts(1, true);
    }, [fetchPosts]);

    const handleLikeToggle = useCallback((postId: number, isLiked: boolean, newCount: number) => {
        setPosts(prev => prev.map(p =>
            p.id === postId
                ? { ...p, isLikedByMe: isLiked, likeCount: newCount }
                : p
        ));
    }, []);

    return (
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <div className="_layout_middle_wrap">
                <div className="_layout_middle_inner">
                    <StoriesSection />
                    <PostCreator onPostCreated={handlePostCreated} />

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 8,
                            color: '#dc2626',
                            marginBottom: 16,
                            fontSize: 14
                        }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                            <div style={{ fontSize: 14 }}>Loading posts...</div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '40px 0', color: '#999',
                            background: 'var(--bs-card-bg, #fff)',
                            borderRadius: 8, marginBottom: 16
                        }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>No posts yet</div>
                            <div style={{ fontSize: 13 }}>Be the first to share something!</div>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostItem
                                key={post.id}
                                post={post}
                                currentUserId={user?.id ?? 0}
                                onLikeToggle={handleLikeToggle}
                            />
                        ))
                    )}

                    {!loading && hasMore && (
                        <div ref={sentinelRef} style={{ height: 1 }} />
                    )}

                    {loadingMore && (
                        <div style={{ textAlign: 'center', padding: '16px 0', color: '#999', fontSize: 13 }}>
                            Loading more posts...
                        </div>
                    )}

                    {!loading && !hasMore && posts.length > 0 && (
                        <div style={{ textAlign: 'center', padding: '16px 0', color: '#bbb', fontSize: 13 }}>
                            You're all caught up ✓
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedMiddle;
