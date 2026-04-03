import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getComments, getReplies, createComment, toggleLike } from '../../../services/apiService';
import type { CommentType } from '../../../types/models';
import LikersModal from '../LikersModal/LikersModal';

const REACTIONS = [
    { emoji: '👍', label: 'Like',  color: '#1890ff' },
    { emoji: '❤️', label: 'Love',  color: '#e0245e' },
    { emoji: '😂', label: 'Haha',  color: '#FFCC4D' },
    { emoji: '😮', label: 'Wow',   color: '#FFAC33' },
    { emoji: '😢', label: 'Sad',   color: '#5c9ce6' },
];

interface CommentSectionProps {
    postId: number;
    currentUserId: number;
}

import { getInitials, getAvatarColor } from '../../../utils/avatar';

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
}

interface CommentItemProps {
    comment: CommentType;
    currentUserId: number;
    postId: number;
    depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUserId, postId, depth = 0 }) => {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [localComment, setLocalComment] = useState<CommentType>(comment);
    const [likersModal, setLikersModal] = useState(false);
    const [loadedReplies, setLoadedReplies] = useState<CommentType[]>([]);
    const [repliesExpanded, setRepliesExpanded] = useState(false);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<typeof REACTIONS[0] | null>(
        comment.isLikedByMe ? (REACTIONS.find(r => r.label === comment.myReaction) ?? REACTIONS[0]) : null
    );
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const reactionHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const likeSpanRef = useRef<HTMLLIElement>(null);
    const [pickerPos, setPickerPos] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => { setLocalComment(comment); }, [comment]);

    const openPicker = () => {
        if (reactionHoverTimer.current) clearTimeout(reactionHoverTimer.current);
        if (likeSpanRef.current) {
            const rect = likeSpanRef.current.getBoundingClientRect();
            setPickerPos({ top: rect.top - 52, left: rect.left + rect.width / 2 });
        }
        setShowReactionPicker(true);
    };
    const closePicker = () => {
        reactionHoverTimer.current = setTimeout(() => setShowReactionPicker(false), 200);
    };

    const handleReactionPick = async (reaction: typeof REACTIONS[0]) => {
        setShowReactionPicker(false);
        const isSameReaction = localComment.isLikedByMe && selectedReaction?.label === reaction.label;
        const prevLiked = localComment.isLikedByMe;
        const prevReaction = selectedReaction;
        const prevCount = localComment.likeCount;

        if (isSameReaction) {
            setLocalComment(c => ({ ...c, isLikedByMe: false, likeCount: prevCount - 1 }));
            setSelectedReaction(null);
        } else {
            setLocalComment(c => ({ ...c, isLikedByMe: true, likeCount: prevLiked ? prevCount : prevCount + 1 }));
            setSelectedReaction(reaction);
        }

        try {
            const resultReaction = await toggleLike(localComment.id, 1, reaction.label);
            const nowLiked = resultReaction !== null;
            setLocalComment(c => ({
                ...c,
                isLikedByMe: nowLiked,
                likeCount: nowLiked ? (prevLiked ? prevCount : prevCount + 1) : prevCount - 1,
            }));
            setSelectedReaction(nowLiked ? (REACTIONS.find(r => r.label === resultReaction) ?? reaction) : null);
        } catch {
            setLocalComment(c => ({ ...c, isLikedByMe: prevLiked, likeCount: prevCount }));
            setSelectedReaction(prevReaction);
        }
    };

    const loadReplies = async () => {
        setRepliesLoading(true);
        try {
            const replies = await getReplies(localComment.id);
            setLoadedReplies(replies);
            setRepliesExpanded(true);
        } catch (err) {
            console.error('Failed to load replies', err);
        } finally {
            setRepliesLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        setSubmitting(true);
        try {
            await createComment(postId, replyText.trim(), localComment.id);
            const replies = await getReplies(localComment.id);
            setLoadedReplies(replies);
            setLocalComment(c => ({ ...c, replyCount: replies.length }));
            setRepliesExpanded(true);
            setReplyText('');
            setShowReply(false);
        } catch (err) {
            console.error('Failed to post reply', err);
        } finally {
            setSubmitting(false);
        }
    };

    const indent = Math.min(depth * 28, 112);

    return (
        <div style={{ marginLeft: indent }}>
            <LikersModal
                entityId={localComment.id}
                entityType={1}
                isOpen={likersModal}
                onClose={() => setLikersModal(false)}
            />
            <div className="_comment_main" style={{ marginBottom: 8 }}>
                <div className="_comment_image">
                    <a href="#0" className="_comment_image_link" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <div style={{
                            width: '100%', height: '100%',
                            background: getAvatarColor(localComment.userId),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700,
                            fontSize: depth === 0 ? 13 : 11,
                        }}>
                            {getInitials(localComment.userFullName)}
                        </div>
                    </a>
                </div>

                <div className="_comment_area">
                    <div className="_comment_details">
                        <div className="_comment_details_top">
                            <div className="_comment_name">
                                <a href="#0">
                                    <h4 className="_comment_name_title">{localComment.userFullName}</h4>
                                </a>
                            </div>
                        </div>
                        <div className="_comment_status">
                            <p className="_comment_status_text">
                                <span>{localComment.content}</span>
                            </p>
                        </div>

                        {localComment.likeCount > 0 && (
                            <div className="_total_reactions" onClick={() => setLikersModal(true)}>
                                <div className="_total_react">
                                    <span className="_reaction_like">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                                        </svg>
                                    </span>
                                    <span className="_reaction_heart">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                                        </svg>
                                    </span>
                                </div>
                                <span className="_total">{localComment.likeCount}</span>
                            </div>
                        )}

                        <div className="_comment_reply">
                            <div className="_comment_reply_num">
                                <ul className="_comment_reply_list">
                                    <li ref={likeSpanRef} style={{ position: 'relative' }}
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
                                                    padding: '6px 10px',
                                                    display: 'flex', gap: 4,
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
                                                            fontSize: 22, lineHeight: 1, padding: '2px 3px',
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
                                        <span
                                            onClick={() => handleReactionPick(selectedReaction ?? REACTIONS[0])}
                                            style={{
                                                cursor: 'pointer',
                                                display: 'inline-flex', alignItems: 'center', gap: 3,
                                                whiteSpace: 'nowrap',
                                                ...(localComment.isLikedByMe
                                                    ? { color: selectedReaction?.color ?? '#1890ff', fontWeight: 700 }
                                                    : {}),
                                            }}
                                        >
                                            {localComment.isLikedByMe && selectedReaction
                                                ? <>{selectedReaction.emoji} {selectedReaction.label}.</>
                                                : 'Like.'}
                                        </span>
                                    </li>
                                    <li>
                                        <span onClick={() => setShowReply(r => !r)}>Reply.</span>
                                    </li>
                                    <li>
                                        <span>Share</span>
                                    </li>
                                    <li>
                                        <span className="_time_link">.{timeAgo(localComment.createdAt)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {showReply && (
                        <div className="_feed_inner_comment_box">
                            <form className="_feed_inner_comment_box_form" onSubmit={e => { e.preventDefault(); handleReply(); }}>
                                <div className="_feed_inner_comment_box_content">
                                    <div className="_feed_inner_comment_box_content_image">
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: '#1890ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontWeight: 700, fontSize: 13
                                        }}>
                                            Me
                                        </div>
                                    </div>
                                    <div className="_feed_inner_comment_box_content_txt">
                                        <textarea
                                            className="form-control _comment_textarea"
                                            placeholder={`Reply to ${localComment.userFullName}...`}
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="_feed_inner_comment_box_icon">
                                    <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={submitting || !replyText.trim()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                            <path fill={submitting || !replyText.trim() ? '#ccc' : '#000'} fillOpacity={submitting || !replyText.trim() ? 1 : .46} fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button type="button" className="_feed_inner_comment_box_icon_btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                            <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {localComment.replyCount > 0 && !repliesExpanded && (
                <div style={{ marginLeft: 60, marginTop: 4, marginBottom: 4 }}>
                    <button
                        type="button"
                        className="_previous_comment_txt"
                        onClick={loadReplies}
                        disabled={repliesLoading}
                    >
                        {repliesLoading
                            ? 'Loading...'
                            : `View ${localComment.replyCount} repl${localComment.replyCount === 1 ? 'y' : 'ies'}`}
                    </button>
                </div>
            )}

            {repliesExpanded && loadedReplies.length > 0 && (
                <div>
                    {loadedReplies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            postId={postId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const INITIAL_VISIBLE = 4;

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUserId }) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [visibleFrom, setVisibleFrom] = useState(INITIAL_VISIBLE);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const loadComments = async () => {
        try {
            const data = await getComments(postId);
            setComments(data);
        } catch {
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadComments(); }, [postId]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newComment.trim() || submitting) return;
        setSubmitting(true);
        try {
            await createComment(postId, newComment.trim());
            setNewComment('');
            await loadComments();
        } catch (err) {
            console.error('Failed to post comment', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="_feed_inner_timeline_cooment_area">
            <div className="_feed_inner_comment_box">
                <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
                    <div className="_feed_inner_comment_box_content">
                        <div className="_feed_inner_comment_box_content_image">
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: '#1890ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 700, fontSize: 13
                            }}>
                                Me
                            </div>
                        </div>
                        <div className="_feed_inner_comment_box_content_txt">
                            <textarea
                                ref={textareaRef}
                                className="form-control _comment_textarea"
                                placeholder="Write a comment"
                                id={`comment-textarea-${postId}`}
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                            />
                        </div>
                    </div>
                    <div className="_feed_inner_comment_box_icon">
                        <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={submitting || !newComment.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                <path fill={submitting || !newComment.trim() ? '#ccc' : '#000'} fillOpacity={submitting || !newComment.trim() ? 1 : .46} fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button type="button" className="_feed_inner_comment_box_icon_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div className="_timline_comment_main">
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '8px 0' }}>Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '8px 0', fontSize: 13 }}>No comments yet. Be the first!</p>
                ) : (
                    <>
                        {comments.length > visibleFrom && (
                            <div className="_previous_comment">
                                <button
                                    type="button"
                                    className="_previous_comment_txt"
                                    onClick={() => setVisibleFrom(v => Math.min(v + INITIAL_VISIBLE, comments.length))}
                                >
                                    View {Math.min(comments.length - visibleFrom, INITIAL_VISIBLE)} previous comment{comments.length - visibleFrom !== 1 ? 's' : ''}
                                </button>
                            </div>
                        )}
                        {comments.slice(-visibleFrom).map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                currentUserId={currentUserId}
                                postId={postId}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
