import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toggleLike } from '../../../services/apiService';
import type { PostType } from '../../../types/models';
import CommentSection from '../CommentSection/CommentSection';
import LikersModal from '../LikersModal/LikersModal';

interface PostItemProps {
    post: PostType;
    currentUserId: number;
    onLikeToggle?: (postId: number, isLiked: boolean, newCount: number) => void;
}

const REACTIONS = [
    { emoji: '👍', label: 'Like',  color: '#1890ff' },
    { emoji: '❤️', label: 'Love',  color: '#e0245e' },
    { emoji: '😂', label: 'Haha',  color: '#FFCC4D' },
    { emoji: '😮', label: 'Wow',   color: '#FFAC33' },
    { emoji: '😢', label: 'Sad',   color: '#5c9ce6' },
];

import { getInitials, getAvatarColor } from '../../../utils/avatar';

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z')).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
    return `${Math.floor(h / 24)} day${Math.floor(h / 24) === 1 ? '' : 's'} ago`;
}

const PostItem: React.FC<PostItemProps> = ({ post, currentUserId, onLikeToggle }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(post.isLikedByMe);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [selectedReaction, setSelectedReaction] = useState<typeof REACTIONS[0] | null>(
        post.isLikedByMe ? (REACTIONS.find(r => r.label === post.myReaction) ?? REACTIONS[0]) : null
    );
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [likersModal, setLikersModal] = useState(false);
    const reactionHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const likeButtonRef = useRef<HTMLDivElement>(null);
    const [pickerPos, setPickerPos] = useState<{ top: number; left: number } | null>(null);

    const openPicker = () => {
        if (reactionHoverTimer.current) clearTimeout(reactionHoverTimer.current);
        if (likeButtonRef.current) {
            const rect = likeButtonRef.current.getBoundingClientRect();
            setPickerPos({ top: rect.top - 58, left: rect.left + rect.width / 2 });
        }
        setShowReactionPicker(true);
    };
    const closePicker = () => {
        reactionHoverTimer.current = setTimeout(() => setShowReactionPicker(false), 200);
    };
    const handleReactionPick = async (reaction: typeof REACTIONS[0]) => {
        setShowReactionPicker(false);
        const isSameReaction = isLiked && selectedReaction?.label === reaction.label;
        const prevIsLiked = isLiked;
        const prevReaction = selectedReaction;
        const prevCount = likeCount;

        // Optimistic update
        if (isSameReaction) {
            setIsLiked(false);
            setSelectedReaction(null);
            setLikeCount(prevCount - 1);
        } else {
            setIsLiked(true);
            setSelectedReaction(reaction);
            setLikeCount(prevIsLiked ? prevCount : prevCount + 1);
        }

        try {
            const resultReaction = await toggleLike(post.id, 0, reaction.label);
            const nowLiked = resultReaction !== null;
            setIsLiked(nowLiked);
            setSelectedReaction(nowLiked ? (REACTIONS.find(r => r.label === resultReaction) ?? reaction) : null);
            onLikeToggle?.(post.id, nowLiked, nowLiked ? (prevIsLiked ? prevCount : prevCount + 1) : prevCount - 1);
        } catch {
            setIsLiked(prevIsLiked);
            setSelectedReaction(prevReaction);
            setLikeCount(prevCount);
        }
    };

    const imageUrl = post.imageUrl ?? null;

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            <LikersModal
                entityId={post.id}
                entityType={0}
                isOpen={likersModal}
                onClose={() => setLikersModal(false)}
            />

            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: getAvatarColor(post.userId),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 700, fontSize: 16
                            }}>
                                {getInitials(post.userFullName)}
                            </div>
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">{post.userFullName}</h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {timeAgo(post.createdAt)} .{' '}
                                <a href="#0">{post.isPublic ? 'Public' : 'Private'}</a>
                            </p>
                        </div>
                    </div>
                    <div className="_feed_inner_timeline_post_box_dropdown">
                        <div className="_feed_timeline_post_dropdown">
                            <button
                                className="_feed_timeline_post_dropdown_link"
                                onClick={() => setIsDropdownOpen(o => !o)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                </svg>
                            </button>
                        </div>

                        <div className={`_feed_timeline_dropdown _timeline_dropdown ${isDropdownOpen ? 'show' : ''}`}>
                            <ul className="_feed_timeline_dropdown_list">
                                <li className="_feed_timeline_dropdown_item">
                                    <span className="_feed_timeline_dropdown_link" style={{ cursor: 'pointer' }}>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"/>
                                            </svg>
                                        </span>
                                        Save Post
                                    </span>
                                </li>
                                <li className="_feed_timeline_dropdown_item">
                                    <span className="_feed_timeline_dropdown_link" style={{ cursor: 'pointer' }}>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                                                <path fill="#377DFF" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd"/>
                                            </svg>
                                        </span>
                                        Turn On Notification
                                    </span>
                                </li>
                                <li className="_feed_timeline_dropdown_item">
                                    <span className="_feed_timeline_dropdown_link" style={{ cursor: 'pointer' }}>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"/>
                                            </svg>
                                        </span>
                                        Hide
                                    </span>
                                </li>
                                {post.userId === currentUserId && (
                                    <>
                                        <li className="_feed_timeline_dropdown_item">
                                            <span className="_feed_timeline_dropdown_link" style={{ cursor: 'pointer' }}>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"/>
                                                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"/>
                                                    </svg>
                                                </span>
                                                Edit Post
                                            </span>
                                        </li>
                                        <li className="_feed_timeline_dropdown_item">
                                            <span className="_feed_timeline_dropdown_link" style={{ cursor: 'pointer' }}>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"/>
                                                    </svg>
                                                </span>
                                                Delete Post
                                            </span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {post.content && <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>}

                {imageUrl && (
                    <div className="_feed_inner_timeline_image">
                        <img src={imageUrl} alt="Post" className="_time_img" />
                    </div>
                )}
            </div>

            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div className="_feed_inner_timeline_total_reacts_image" style={{ cursor: likeCount > 0 ? 'pointer' : 'default' }} onClick={() => likeCount > 0 && setLikersModal(true)}>
                    {likeCount > 0 && (
                        <>
                            <img src="/assets/images/react_img1.png" alt="React" className="_react_img1" />
                            <img src="/assets/images/react_img2.png" alt="React" className="_react_img" />
                            <p className="_feed_inner_timeline_total_reacts_para">{likeCount}</p>
                        </>
                    )}
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <a href="#0" onClick={e => { e.preventDefault(); setShowComments(s => !s); }}>
                            <span>{post.commentCount}</span> Comment
                        </a>
                    </p>
                    <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Share</p>
                </div>
            </div>

            <div className="_feed_inner_timeline_reaction">
                <div
                    ref={likeButtonRef}
                    style={{ position: 'relative', flex: 1, margin: '0 4px 0 0' }}
                    onMouseEnter={openPicker}
                    onMouseLeave={closePicker}
                >
                    {showReactionPicker && pickerPos && createPortal(
                        <div
                            onMouseEnter={openPicker}
                            onMouseLeave={closePicker}
                            style={{
                                position: 'fixed',
                                top: pickerPos.top,
                                left: pickerPos.left,
                                transform: 'translateX(-50%)',
                                background: '#fff',
                                borderRadius: 32,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                                padding: '8px 12px',
                                display: 'flex', gap: 6,
                                zIndex: 9999,
                                whiteSpace: 'nowrap',
                                border: '1px solid #f0f0f0',
                            }}
                        >
                            {REACTIONS.map(r => (
                                <button
                                    key={r.label}
                                    onClick={() => handleReactionPick(r)}
                                    title={r.label}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 26, lineHeight: 1, padding: '2px 4px',
                                        borderRadius: '50%', transition: 'transform 0.15s',
                                        transform: selectedReaction?.label === r.label ? 'scale(1.4)' : 'scale(1)',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.45)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = selectedReaction?.label === r.label ? 'scale(1.4)' : 'scale(1)')}
                                >
                                    {r.emoji}
                                </button>
                            ))}
                        </div>,
                        document.body
                    )}
                    <button
                        className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${isLiked ? '_feed_reaction_active' : ''}`}
                        onClick={() => {
                            if (isLiked) handleReactionPick(selectedReaction ?? REACTIONS[0]);
                            else handleReactionPick(REACTIONS[0]);
                        }}
                        style={{ width: '100%', margin: 0, color: isLiked ? (selectedReaction?.color ?? '#1890ff') : undefined }}
                    >
                        <span className="_feed_inner_timeline_reaction_link">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {isLiked && selectedReaction ? (
                                    <span style={{ fontSize: 18, lineHeight: 1 }}>{selectedReaction.emoji}</span>
                                ) : (
                                    <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3m7-10l-4 9H7v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H15V3a3 3 0 00-3-3z"/>
                                    </svg>
                                )}
                                <span style={{ color: isLiked ? (selectedReaction?.color ?? '#1890ff') : undefined, fontWeight: isLiked ? 600 : undefined }}>
                                    {isLiked && selectedReaction ? selectedReaction.label : 'Like'}
                                </span>
                            </span>
                        </span>
                    </button>
                </div>
                <button
                    className="_feed_inner_timeline_reaction_comment _feed_reaction"
                    onClick={() => setShowComments(s => !s)}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"/>
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563"/>
                            </svg>
                            Comment
                        </span>
                    </span>
                </button>
                <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                    <span className="_feed_inner_timeline_reaction_link">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"/>
                            </svg>
                            Share
                        </span>
                    </span>
                </button>
            </div>

            {showComments && (
                <CommentSection postId={post.id} currentUserId={currentUserId} />
            )}
        </div>
    );
};

export default PostItem;
