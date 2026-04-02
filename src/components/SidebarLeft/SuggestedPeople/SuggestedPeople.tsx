import React, { useReducer } from 'react';
import { suggestedPeopleReducer, initialState } from './SuggestedPeople.reducer';
import { connectPerson } from './SuggestedPeople.actions';

const SuggestedPeople: React.FC = () => {
    const [state, dispatch] = useReducer(suggestedPeopleReducer, initialState);

    const handleConnect = (id: number) => {
        dispatch(connectPerson(id));
    };

    const people = [
        { id: 1, name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png' },
        { id: 2, name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png' },
        { id: 3, name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png' }
    ];

    return (
        <div className="_layout_left_sidebar_inner">
            <div className="_left_inner_area_suggest _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                <div className="_left_inner_area_suggest_content _mar_b24">
                    <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
                    <span className="_left_inner_area_suggest_content_txt">
                        <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
                    </span>
                </div>
                
                {people.map(person => (
                    <div className="_left_inner_area_suggest_info" key={person.id}>
                        <div className="_left_inner_area_suggest_info_box">
                            <div className="_left_inner_area_suggest_info_image">
                                <a href="profile.html">
                                    <img src={person.img} alt="Image" className={person.id === 1 ? "_info_img" : "_info_img1"} />
                                </a>
                            </div>
                            <div className="_left_inner_area_suggest_info_txt">
                                <a href="profile.html">
                                    <h4 className="_left_inner_area_suggest_info_title">{person.name}</h4>
                                </a>
                                <p className="_left_inner_area_suggest_info_para">{person.role}</p>
                            </div>
                        </div>
                        <div className="_left_inner_area_suggest_info_link"> 
                            <a 
                                href="#0" 
                                className="_info_link"
                                onClick={(e) => { e.preventDefault(); handleConnect(person.id); }}
                            >
                                {state.connectedIds.includes(person.id) ? 'Pending' : 'Connect'}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedPeople;
