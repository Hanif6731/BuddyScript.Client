import React, { useReducer } from 'react';
import { headerLogoReducer, initialState } from './HeaderLogo.reducer';
import { logoClick } from './HeaderLogo.actions';

const HeaderLogo: React.FC = () => {
    const [, dispatch] = useReducer(headerLogoReducer, initialState);

    const handleClick = () => {
        dispatch(logoClick());
    };

    return (
        <div className="_logo_wrap">
            <a className="navbar-brand" href="feed.html" onClick={handleClick}>
                <img src="/assets/images/logo.svg" alt="Image" className="_nav_logo" />
            </a>
        </div>
    );
};

export default HeaderLogo;
