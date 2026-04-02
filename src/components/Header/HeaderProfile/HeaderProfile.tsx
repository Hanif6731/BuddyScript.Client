import React, { useReducer } from 'react';
import { headerProfileReducer, initialState } from './HeaderProfile.reducer';
import { toggleProfileMenu } from './HeaderProfile.actions';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import { useAuth } from '../../../context/AuthContext';
import { getInitials, getAvatarColor } from '../../../utils/avatar';

const HeaderProfile: React.FC = () => {
    const [state, dispatch] = useReducer(headerProfileReducer, initialState);
    const { user } = useAuth();

    const handleToggleProfile = () => {
        dispatch(toggleProfileMenu());
    };

    const fullName = user ? `${user.firstName} ${user.lastName}` : '';

    return (
        <div className="_header_nav_profile">
            <div className="_header_nav_profile_image">
                <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: user ? getAvatarColor(user.id) : '#ccc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: 10, flexShrink: 0,
                }}>
                    {fullName ? getInitials(fullName) : '?'}
                </div>
            </div>
            <div className="_header_nav_dropdown">
                <p className="_header_nav_para">{fullName || 'Loading...'}</p>
                <button
                    id="_profile_drop_show_btn"
                    className="_header_nav_dropdown_btn _dropdown_toggle"
                    type="button"
                    onClick={handleToggleProfile}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                        <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                    </svg>
                </button>
            </div>

            <ProfileDropdown show={state.isProfileOpen} />
        </div>
    );
};

export default HeaderProfile;
