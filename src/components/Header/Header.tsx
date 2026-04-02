import React, { useReducer } from 'react';
import { headerReducer, initialState } from './Header.reducer';
import { toggleMobileNav } from './Header.actions';
import HeaderLogo from './HeaderLogo/HeaderLogo';
import HeaderSearch from './HeaderSearch/HeaderSearch';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderProfile from './HeaderProfile/HeaderProfile';

import MobileHeader from './MobileHeader/MobileHeader';
import MobileBottomNav from './MobileBottomNav/MobileBottomNav';

const Header: React.FC = () => {
    const [state, dispatch] = useReducer(headerReducer, initialState);

    const handleToggleMobileNav = () => {
        dispatch(toggleMobileNav());
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
                <div className="container _custom_container">
                    <HeaderLogo />
                    
                    <button 
                        className="navbar-toggler bg-light" 
                        type="button" 
                        aria-label="Toggle navigation"
                        onClick={handleToggleMobileNav}
                    > 
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className={`collapse navbar-collapse ${state.isMobileNavOpen ? 'show' : ''}`} id="navbarSupportedContent">
                        <HeaderSearch />
                        <HeaderNav />
                        <HeaderProfile />
                    </div>
                </div>
            </nav>

            <MobileHeader />
            <MobileBottomNav />
        </>
    );
};

export default Header;
