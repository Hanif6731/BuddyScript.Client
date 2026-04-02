import React, { useReducer } from 'react';
import { friendListReducer, initialState } from './FriendList.reducer';
import { searchFriends } from './FriendList.actions';

const FriendList: React.FC = () => {
    const [state, dispatch] = useReducer(friendListReducer, initialState);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(searchFriends(e.target.value));
    };

    const friends = [
        { id: 1, name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', lastSeen: '5 minute ago', online: false },
        { id: 2, name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png', online: true },
        { id: 3, name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', online: true },
        { id: 4, name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', lastSeen: '5 minute ago', online: false },
        { id: 5, name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png', online: true },
        { id: 6, name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', online: true },
        { id: 7, name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', online: true },
        { id: 8, name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', lastSeen: '5 minute ago', online: false }
    ];

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    return (
        <div className="_layout_right_sidebar_inner">
            <div className="_feed_right_inner_area_card  _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                <div className="_feed_top_fixed">
                    <div className="_feed_right_inner_area_card_content _mar_b24">
                        <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                        <span className="_feed_right_inner_area_card_content_txt">
                            <a className="_feed_right_inner_area_card_content_txt_link" href="find-friends.html">See All</a>
                        </span>
                    </div>
                    <form className="_feed_right_inner_area_card_form">
                        <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                            <circle cx="7" cy="7" r="6" stroke="#666"></circle>
                            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
                        </svg>
                        <input
                            className="form-control me-2 _feed_right_inner_area_card_form_inpt"
                            type="search"
                            placeholder="input search text"
                            aria-label="Search"
                            value={state.searchQuery}
                            onChange={handleSearch}
                        />
                    </form>
                </div>
                <div className="_feed_bottom_fixed">
                    {filteredFriends.map(friend => (
                        <div key={friend.id} className={`_feed_right_inner_area_card_ppl ${!friend.online ? '_feed_right_inner_area_card_ppl_inactive' : ''}`}>
                            <div className="_feed_right_inner_area_card_ppl_box">
                                <div className="_feed_right_inner_area_card_ppl_image">
                                    <a href="profile.html">
                                        <img src={friend.img} alt="" className="_box_ppl_img" />
                                    </a>
                                </div>
                                <div className="_feed_right_inner_area_card_ppl_txt">
                                    <a href="profile.html">
                                        <h4 className="_feed_right_inner_area_card_ppl_title">{friend.name}</h4>
                                    </a>
                                    <p className="_feed_right_inner_area_card_ppl_para">{friend.role}</p>
                                </div>
                            </div>
                            <div className="_feed_right_inner_area_card_ppl_side">
                                {friend.online ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                                        <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                                    </svg>
                                ) : (
                                    <span>{friend.lastSeen}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FriendList;
