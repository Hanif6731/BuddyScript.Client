import React, { useReducer } from 'react';
import { suggestedFollowReducer, initialState } from './SuggestedFollow.reducer';
import { followUser, ignoreUser } from './SuggestedFollow.actions';

const SuggestedFollow: React.FC = () => {
    const [state, dispatch] = useReducer(suggestedFollowReducer, initialState);

    const handleFollow = (id: number) => {
        dispatch(followUser(id));
    };

    const handleIgnore = (id: number) => {
        dispatch(ignoreUser(id));
    };

    const suggestions = [
        { id: 1, name: 'Radovan SkillArena', role: 'Founder & CEO at Trophy', img: '/assets/images/Avatar.png' }
    ];

    return (
        <div className="_layout_right_sidebar_inner">
            {suggestions.filter(s => !state.ignoredIds.includes(s.id)).map(suggestion => (
                <div key={suggestion.id} className="_right_inner_area_info _padd_t24  _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <div className="_right_inner_area_info_content _mar_b24">
                        <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                        <span className="_right_inner_area_info_content_txt">
                            <a className="_right_inner_area_info_content_txt_link" href="#0">See All</a>
                        </span>
                    </div>
                    <hr className="_underline" />
                    <div className="_right_inner_area_info_ppl">
                        <div className="_right_inner_area_info_box">
                            <div className="_right_inner_area_info_box_image">
                                <a href="profile.html">
                                    <img src={suggestion.img} alt="Image" className="_ppl_img" />
                                </a>
                            </div>
                            <div className="_right_inner_area_info_box_txt">
                                <a href="profile.html">
                                    <h4 className="_right_inner_area_info_box_title">{suggestion.name}</h4>
                                </a>
                                <p className="_right_inner_area_info_box_para">{suggestion.role}</p>
                            </div>
                        </div>
                        <div className="_right_info_btn_grp">
                            <button 
                                type="button" 
                                className="_right_info_btn_link"
                                onClick={() => handleIgnore(suggestion.id)}
                            >
                                Ignore
                            </button>
                            <button 
                                type="button" 
                                className={`_right_info_btn_link ${state.followedIds.includes(suggestion.id) ? '_right_info_btn_link_active' : ''}`}
                                onClick={() => handleFollow(suggestion.id)}
                            >
                                {state.followedIds.includes(suggestion.id) ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuggestedFollow;
