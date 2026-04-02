import React, { useReducer } from 'react';
import { sidebarLeftReducer, initialState } from './SidebarLeft.reducer';
import ExploreMenu from './ExploreMenu/ExploreMenu';
import SuggestedPeople from './SuggestedPeople/SuggestedPeople';
import SidebarEvents from './SidebarEvents/SidebarEvents';

const SidebarLeft: React.FC = () => {
    const [, ] = useReducer(sidebarLeftReducer, initialState);

    return (
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
            <div className="_layout_left_sidebar_wrap">
                <ExploreMenu />
                <SuggestedPeople />
                <SidebarEvents />
            </div>
        </div>
    );
};

export default SidebarLeft;
