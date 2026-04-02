import React, { useEffect, useState } from 'react';
import { getLikers } from '../../../services/apiService';
import type { LikerType } from '../../../types/models';

interface LikersModalProps {
    entityId: number;
    entityType: number; // 0 = Post, 1 = Comment
    isOpen: boolean;
    onClose: () => void;
}

import { getInitials, getAvatarColor } from '../../../utils/avatar';

const LikersModal: React.FC<LikersModalProps> = ({ entityId, entityType, isOpen, onClose }) => {
    const [likers, setLikers] = useState<LikerType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        getLikers(entityId, entityType)
            .then(setLikers)
            .catch(() => setLikers([]))
            .finally(() => setLoading(false));
    }, [isOpen, entityId, entityType]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bs-body-bg, #fff)',
                    borderRadius: 12, padding: '24px', minWidth: 320, maxWidth: 400,
                    maxHeight: '70vh', overflow: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h5 style={{ margin: 0, fontWeight: 600 }}>
                        {likers.length} {likers.length === 1 ? 'Like' : 'Likes'}
                    </h5>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1, color: '#666' }}
                    >
                        ×
                    </button>
                </div>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#999' }}>Loading...</p>
                ) : likers.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999' }}>No likes yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {likers.map(l => (
                            <li key={l.userId} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: getAvatarColor(l.userId),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0
                                }}>
                                    {getInitials(l.fullName)}
                                </div>
                                <span style={{ fontWeight: 500 }}>{l.fullName}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LikersModal;
