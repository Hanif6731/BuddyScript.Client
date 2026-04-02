import React, { useReducer } from 'react';
import { sidebarRightReducer, initialState } from './SidebarRight.reducer';
import SuggestedFollow from './SuggestedFollow/SuggestedFollow';
import FriendList from './FriendList/FriendList';

const SidebarRight: React.FC = () => {
    const [, ] = useReducer(sidebarRightReducer, initialState);

    return (
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
            <div className="_layout_right_sidebar_wrap">
                <SuggestedFollow />
                <FriendList />
            </div>
        </div>
    );
};

export default SidebarRight;
